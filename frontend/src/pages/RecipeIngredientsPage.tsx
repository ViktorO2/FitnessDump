import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Restaurant as FoodIcon,
  Scale as WeightIcon,
} from "@mui/icons-material";
import { useRecipeIngredients } from "../hooks/useRecipeIngredients";
import { RecipeIngredientDTO } from "../types/nutrition.types";

const RecipeIngredientsPage: React.FC = () => {
  const {
    getRecipeIngredientById,
    getIngredientsByRecipeId,
    createRecipeIngredient,
    updateRecipeIngredient,
    deleteRecipeIngredient,
    loading,
    error,
    clearError,
  } = useRecipeIngredients();

  const [recipeIngredients, setRecipeIngredients] = useState<
    RecipeIngredientDTO[]
  >([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingIngredient, setEditingIngredient] =
    useState<RecipeIngredientDTO | null>(null);
  const [searchRecipeId, setSearchRecipeId] = useState("");
  const [formData, setFormData] = useState({
    recipeId: "",
    foodId: "",
    amount: 0,
    foodName: "",
    note: "",
  });

  const handleOpenDialog = (ingredient?: RecipeIngredientDTO) => {
    if (ingredient) {
      setEditingIngredient(ingredient);
      setFormData({
        recipeId: ingredient.recipeId.toString(),
        foodId: ingredient.foodId.toString(),
        amount: ingredient.amount,
        foodName: ingredient.foodName,
        note: ingredient.note || "",
      });
    } else {
      setEditingIngredient(null);
      setFormData({
        recipeId: "",
        foodId: "",
        amount: 0,
        foodName: "",
        note: "",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingIngredient(null);
  };

  const handleSubmit = async () => {
    if (editingIngredient) {
      const result = await updateRecipeIngredient(editingIngredient.id, {
        id: 0,
        recipeId: parseInt(formData.recipeId),
        foodId: parseInt(formData.foodId),
        foodName: formData.foodName,
        amount: formData.amount,
        note: formData.note || undefined,
      });
      if (result) {
        // Refresh the list
        await handleSearchByRecipe();
      }
    } else {
      const result = await createRecipeIngredient({
        id: 0,
        recipeId: parseInt(formData.recipeId),
        foodId: parseInt(formData.foodId),
        foodName: formData.foodName,
        amount: formData.amount,
        note: formData.note || undefined,
      });
      if (result) {
        // Refresh the list
        await handleSearchByRecipe();
      }
    }
    handleCloseDialog();
  };

  const handleDelete = async (ingredient: RecipeIngredientDTO) => {
    if (
      window.confirm("Сигурни ли сте, че искате да изтриете този съставка?")
    ) {
      const success = await deleteRecipeIngredient(ingredient.id);
      if (success) {
        // Refresh the list
        await handleSearchByRecipe();
      }
    }
  };

  const handleSearchByRecipe = async () => {
    if (searchRecipeId) {
      const ingredients = await getIngredientsByRecipeId(
        parseInt(searchRecipeId)
      );
      setRecipeIngredients(ingredients);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", my: 4, px: 2 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
        <FoodIcon sx={{ mr: 1, verticalAlign: "middle" }} />
        Съставки на рецепти
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
          {error}
        </Alert>
      )}

      {/* Header Actions */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Добави съставка
        </Button>

        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <TextField
            label="ID на рецепта"
            type="number"
            value={searchRecipeId}
            onChange={(e) => setSearchRecipeId(e.target.value)}
            size="small"
            sx={{ width: 150 }}
          />
          <Button
            variant="outlined"
            startIcon={<SearchIcon />}
            onClick={handleSearchByRecipe}
            disabled={!searchRecipeId || loading}
          >
            Търси
          </Button>
        </Box>
      </Box>

      {/* Ingredients Table */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : recipeIngredients.length === 0 ? (
        <Card>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                py: 4,
              }}
            >
              <FoodIcon sx={{ fontSize: 60, color: "gray", mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Няма съставки
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
              >
                Добавете първата съставка или търсете по ID на рецепта
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>ID на рецепта</TableCell>
                <TableCell>ID на храна</TableCell>
                <TableCell>Име на храна</TableCell>
                <TableCell>Количество</TableCell>
                <TableCell>Бележка</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recipeIngredients.map((ingredient: RecipeIngredientDTO) => (
                <TableRow key={ingredient.id}>
                  <TableCell>{ingredient.id}</TableCell>
                  <TableCell>{ingredient.recipeId}</TableCell>
                  <TableCell>{ingredient.foodId}</TableCell>
                  <TableCell>{ingredient.foodName}</TableCell>
                  <TableCell>{ingredient.amount}</TableCell>
                  <TableCell>{ingredient.note || "-"}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(ingredient)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(ingredient)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Create/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingIngredient ? "Редактирай съставка" : "Добави съставка"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="ID на рецепта"
              type="number"
              value={formData.recipeId}
              onChange={(e) =>
                setFormData({ ...formData, recipeId: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="ID на храна"
              type="number"
              value={formData.foodId}
              onChange={(e) =>
                setFormData({ ...formData, foodId: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Име на храна"
              value={formData.foodName}
              onChange={(e) =>
                setFormData({ ...formData, foodName: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Количество"
              type="number"
              value={formData.amount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  amount: parseFloat(e.target.value),
                })
              }
              fullWidth
            />
            <TextField
              label="Бележка"
              value={formData.note}
              onChange={(e) =>
                setFormData({ ...formData, note: e.target.value })
              }
              fullWidth
              placeholder="Опционална бележка..."
              multiline
              rows={2}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отказ</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingIngredient ? "Запази" : "Добави"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RecipeIngredientsPage;
