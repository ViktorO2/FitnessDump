import React, { useState, useMemo } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
} from "@mui/material";
import { Science as TestIcon } from "@mui/icons-material";
import RecipeCard from "../components/Recipes/RecipeCard";
import RecipeFilters from "../components/Recipes/RecipeFilters";
import RecipeFormDialog from "../components/Recipes/RecipeFormDialog";
import { useRecipes } from "../hooks/useRecipes";
import { RecipeDTO, CreateRecipeFormData } from "../types/nutrition.types";

const RecipePage: React.FC = () => {
  const {
    recipes,
    loading,
    error,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    getRecipeById,
    testRecipe,
    fetchAllRecipes,
  } = useRecipes();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [maxCalories, setMaxCalories] = useState(2000);
  const [formOpen, setFormOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<RecipeDTO | undefined>(
    undefined
  );
  const [viewRecipe, setViewRecipe] = useState<RecipeDTO | undefined>(
    undefined
  );
  const [testDialogOpen, setTestDialogOpen] = useState(false);
  const [testingRecipe, setTestingRecipe] = useState<RecipeDTO | undefined>(
    undefined
  );
  const [testResult, setTestResult] = useState<string>("");
  const [testLoading, setTestLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGoal =
        selectedGoals.length === 0 ||
        selectedGoals.includes(recipe.recommendedFor);
      const matchesCalories = recipe.caloriesPerServing <= maxCalories;
      return matchesSearch && matchesGoal && matchesCalories;
    });
  }, [recipes, searchQuery, selectedGoals, maxCalories]);

  const handleEdit = (recipe: RecipeDTO) => {
    setEditingRecipe(recipe);
    setFormOpen(true);
  };

  const handleDelete = async (recipe: RecipeDTO) => {
    if (
      window.confirm(
        `Сигурни ли сте, че искате да изтриете рецептата "${recipe.name}"?`
      )
    ) {
      await deleteRecipe(recipe.id);
      fetchAllRecipes();
    }
  };

  const handleView = (recipe: RecipeDTO) => {
    setViewRecipe(recipe);
  };

  const handleTest = async (recipe: RecipeDTO) => {
    setTestingRecipe(recipe);
    setTestDialogOpen(true);
    setTestResult("");
    setTestLoading(true);

    try {
      const result = await testRecipe(recipe.id);
      setTestResult(result || "Тестът е завършен успешно!");
      setSnackbarMessage("Рецептата е тествана успешно!");
      setSnackbarOpen(true);
    } catch (err: any) {
      setTestResult(err.message || "Грешка при тестване на рецептата");
      setSnackbarMessage("Грешка при тестване на рецептата");
      setSnackbarOpen(true);
    } finally {
      setTestLoading(false);
    }
  };

  const handleFormSubmit = async (data: CreateRecipeFormData) => {
    if (editingRecipe) {
      // For editing, we need to convert back to RecipeDTO format
      const updatedRecipe: RecipeDTO = {
        ...editingRecipe,
        name: data.name,
        description: data.description,
        instructions: data.instructions,
        servings: data.servings,
        preparationTime: data.preparationTime,
        recommendedFor: data.recommendedFor,
        caloriesPerServing: data.caloriesPerServing,
        proteinPerServing: data.proteinPerServing,
        fatPerServing: data.fatPerServing,
        carbsPerServing: data.carbsPerServing,
        // Keep existing ingredients structure for now
        ingredients: editingRecipe.ingredients,
      };
      await updateRecipe(editingRecipe.id, updatedRecipe);
    } else {
      await createRecipe(data);
    }
    setFormOpen(false);
    setEditingRecipe(undefined);
    fetchAllRecipes();
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedGoals([]);
    setMaxCalories(2000);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          Рецепти
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            setFormOpen(true);
            setEditingRecipe(undefined);
          }}
        >
          Добави рецепта
        </Button>
      </Box>
      <RecipeFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedGoals={selectedGoals}
        onGoalsChange={setSelectedGoals}
        maxCalories={maxCalories}
        onMaxCaloriesChange={setMaxCalories}
        onClearFilters={handleClearFilters}
      />
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
        >
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredRecipes.map((recipe) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={recipe.id}>
              <RecipeCard
                recipe={recipe}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
                onTest={handleTest}
              />
            </Grid>
          ))}
        </Grid>
      )}
      <RecipeFormDialog
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingRecipe(undefined);
        }}
        onSubmit={handleFormSubmit}
        recipe={editingRecipe}
        loading={loading}
      />
      <Dialog
        open={!!viewRecipe}
        onClose={() => setViewRecipe(undefined)}
        maxWidth="md"
        fullWidth
      >
        <Box p={3}>
          {viewRecipe && (
            <>
              <Typography variant="h5" gutterBottom>
                {viewRecipe.name}
              </Typography>
              <img
                src="/images/nutrition.jpg"
                alt={viewRecipe.name}
                style={{
                  width: "100%",
                  maxHeight: 300,
                  objectFit: "cover",
                  marginBottom: 16,
                }}
              />
              <Typography variant="subtitle1" gutterBottom>
                Описание
              </Typography>
              <Typography paragraph>{viewRecipe.description}</Typography>
              <Typography variant="subtitle1" gutterBottom>
                Съставки
              </Typography>
              <ul>
                {viewRecipe.ingredients.map((ing, i) => (
                  <li key={i}>
                    {ing.foodName} - {ing.amount}g {ing.note && `(${ing.note})`}
                  </li>
                ))}
              </ul>
              <Typography variant="subtitle1" gutterBottom>
                Инструкции
              </Typography>
              <Typography paragraph>{viewRecipe.instructions}</Typography>
              <Typography variant="subtitle1" gutterBottom>
                Хранителна стойност (на порция)
              </Typography>
              <Typography paragraph>
                Калории: {viewRecipe.caloriesPerServing} | Протеини:{" "}
                {viewRecipe.proteinPerServing}g | Мазнини:{" "}
                {viewRecipe.fatPerServing}g | Въглехидрати:{" "}
                {viewRecipe.carbsPerServing}g
              </Typography>
              <Button onClick={() => setViewRecipe(undefined)} sx={{ mt: 2 }}>
                Затвори
              </Button>
            </>
          )}
        </Box>
      </Dialog>

      {/* Test Recipe Dialog */}
      <Dialog
        open={testDialogOpen}
        onClose={() => setTestDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TestIcon />
            Тестване на рецепта
          </Box>
        </DialogTitle>
        <DialogContent>
          {testingRecipe && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                {testingRecipe.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Тестване на рецептата за валидност и съвместимост...
              </Typography>
              {testLoading ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <CircularProgress size={20} />
                  <Typography>Тестване...</Typography>
                </Box>
              ) : testResult ? (
                <Alert
                  severity={
                    testResult.includes("успешно") ? "success" : "error"
                  }
                >
                  {testResult}
                </Alert>
              ) : null}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTestDialogOpen(false)}>Затвори</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default RecipePage;
