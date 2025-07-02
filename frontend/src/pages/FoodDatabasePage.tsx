import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Alert,
  InputAdornment,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Restaurant as FoodIcon,
  Clear as ClearIcon,
  Category as CategoryIcon,
} from "@mui/icons-material";
import { useFoods } from "../hooks/useFoods";
import FoodCard from "../components/Foods/FoodCard";
import FoodFormDialog from "../components/Foods/FoodFormDialog";
import { FoodDTO, CreateFoodDTO } from "../services/food.service";

const FOOD_CATEGORIES = {
  FRUITS: "Плодове",
  VEGETABLES: "Зеленчуци",
  GRAINS: "Зърнени храни",
  PROTEIN: "Протеини",
  DAIRY: "Млечни продукти",
  FATS: "Мазнини",
  SWEETS: "Сладкиши",
  BEVERAGES: "Напитки",
  NUTS_SEEDS: "Ядки и семена",
  LEGUMES: "Бобови култури",
  OTHER: "Други",
};

const FoodDatabasePage: React.FC = () => {
  const {
    foods,
    filteredFoods,
    categories,
    loading,
    error,
    searchQuery,
    selectedCategory,
    hasActiveFilters,
    createFood,
    createFoodAlternative,
    updateFood,
    updateFoodAlternative,
    deleteFood,
    handleSearch,
    handleCategoryFilter,
    clearFilters,
    fetchFoods,
  } = useFoods();

  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodDTO | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [foodToDelete, setFoodToDelete] = useState<FoodDTO | null>(null);

  const handleCreateFood = () => {
    setSelectedFood(null);
    setFormError(null);
    setFormDialogOpen(true);
  };

  const handleEditFood = (food: FoodDTO) => {
    setSelectedFood(food);
    setFormError(null);
    setFormDialogOpen(true);
  };

  const handleDeleteFood = (food: FoodDTO) => {
    setFoodToDelete(food);
    setDeleteDialogOpen(true);
  };

  const handleViewFood = (food: FoodDTO) => {
    setSelectedFood(food);
    setFormDialogOpen(true);
  };

  const handleSubmitFood = async (foodData: CreateFoodDTO) => {
    try {
      setFormLoading(true);
      setFormError(null);
      if (selectedFood) {
        await updateFood(selectedFood.id, foodData);
      } else {
        await createFood(foodData);
      }
      setFormDialogOpen(false);
    } catch (err: any) {
      setFormError(err.message || "Грешка при запазване на храната");
    } finally {
      setFormLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!foodToDelete) return;
    try {
      await deleteFood(foodToDelete.id);
      setDeleteDialogOpen(false);
      setFoodToDelete(null);
    } catch (err: any) {
      // Error handling
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section */}
      <Paper
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 3,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -30,
            left: -30,
            width: 150,
            height: 150,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
          }}
        />
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <FoodIcon sx={{ fontSize: 40 }} />
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              Хранителна база
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>
            Управлявайте вашата колекция от храни и проследявайте хранителните
            им стойности
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateFood}
            sx={{
              minWidth: "200px",
              py: 1.5,
              px: 3,
              borderRadius: 2,
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.3)",
              "&:hover": {
                background: "rgba(255,255,255,0.3)",
              },
            }}
          >
            Добави храна
          </Button>
        </Box>
      </Paper>

      {/* Search and Filters Section */}
      <Paper
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              placeholder="Търси храни по име..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Категория</InputLabel>
              <Select
                value={selectedCategory}
                label="Категория"
                onChange={(e) => handleCategoryFilter(e.target.value)}
                sx={{
                  borderRadius: 2,
                }}
              >
                <MenuItem value="">Всички категории</MenuItem>
                {Object.entries(FOOD_CATEGORIES).map(([key, label]) => (
                  <MenuItem key={key} value={key}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Box
          sx={{
            mt: 2,
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {hasActiveFilters && (
            <Button
              onClick={clearFilters}
              variant="outlined"
              startIcon={<ClearIcon />}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1.5,
              }}
            >
              Изчисти филтрите
            </Button>
          )}
        </Box>

        {hasActiveFilters && (
          <Box
            sx={{
              mt: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Активни филтри:
            </Typography>
            {searchQuery && (
              <Chip
                label={`Търсене: "${searchQuery}"`}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            {selectedCategory && (
              <Chip
                label={`Категория: ${
                  FOOD_CATEGORIES[
                    selectedCategory as keyof typeof FOOD_CATEGORIES
                  ]
                }`}
                size="small"
                color="secondary"
                variant="outlined"
                icon={<CategoryIcon />}
              />
            )}
          </Box>
        )}
      </Paper>

      {/* Content Section */}
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="400px"
          flexDirection="column"
          gap={2}
        >
          <CircularProgress size={60} />
          <Typography variant="h6" color="text.secondary">
            Зареждане на храните...
          </Typography>
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      ) : (
        <>
          {/* Results Summary */}
          <Box
            sx={{
              mb: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#2c3e50" }}>
              {filteredFoods.length === 0
                ? "Няма намерени храни"
                : `Намерени ${filteredFoods.length} храни`}
            </Typography>
            {filteredFoods.length > 0 && (
              <Typography variant="body2" color="text.secondary">
                Общо калории:{" "}
                {filteredFoods.reduce((sum, food) => sum + food.kcal, 0)} ккал
              </Typography>
            )}
          </Box>

          {/* Food Grid */}
          {filteredFoods.length === 0 ? (
            <Paper
              sx={{
                p: 8,
                textAlign: "center",
                borderRadius: 3,
                bgcolor: "#f8f9fa",
                border: "2px dashed #dee2e6",
              }}
            >
              <FoodIcon sx={{ fontSize: 80, color: "#adb5bd", mb: 2 }} />
              <Typography variant="h5" color="text.secondary" sx={{ mb: 1 }}>
                Няма намерени храни
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {searchQuery || selectedCategory
                  ? `Няма храни, съответстващи на избраните филтри`
                  : "Все още няма добавени храни в базата данни"}
              </Typography>
              {!searchQuery && !selectedCategory && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleCreateFood}
                  sx={{
                    borderRadius: 2,
                    px: 3,
                    py: 1.5,
                  }}
                >
                  Добави първата храна
                </Button>
              )}
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {filteredFoods.map((food) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={food.id}>
                  <FoodCard
                    food={food}
                    onEdit={handleEditFood}
                    onDelete={handleDeleteFood}
                    onView={handleViewFood}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}

      {/* Dialogs */}
      <FoodFormDialog
        open={formDialogOpen}
        onClose={() => setFormDialogOpen(false)}
        onSubmit={handleSubmitFood}
        food={selectedFood}
        loading={formLoading}
        error={formError}
      />

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: 400,
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
            color: "white",
            borderRadius: "12px 12px 0 0",
          }}
        >
          Изтриване на храна
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography>
            Сигурни ли сте, че искате да изтриете храната{" "}
            <strong>"{foodToDelete?.name}"</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Това действие не може да бъде отменено.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Отказ
          </Button>
          <Button
            color="error"
            onClick={handleConfirmDelete}
            variant="contained"
            sx={{
              borderRadius: 2,
              background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #ff5252 0%, #e64a19 100%)",
              },
            }}
          >
            Изтрий
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default FoodDatabasePage;
