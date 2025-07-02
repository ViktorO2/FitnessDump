import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FitnessCenter as FitnessIcon,
} from "@mui/icons-material";
import { useExercises } from "../hooks/useExercises";
import { ExerciseCategoryDTO } from "../types/exercise.types";
import CategoryFormDialog from "../components/Exercises/CategoryFormDialog";

const CategoriesPage: React.FC = () => {
  const {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useExercises();

  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<ExerciseCategoryDTO | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] =
    useState<ExerciseCategoryDTO | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleCreateCategory = () => {
    setSelectedCategory(null);
    setFormError(null);
    setFormDialogOpen(true);
  };

  const handleEditCategory = (category: ExerciseCategoryDTO) => {
    setSelectedCategory(category);
    setFormError(null);
    setFormDialogOpen(true);
  };

  const handleDeleteCategory = (category: ExerciseCategoryDTO) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleSubmitCategory = async (categoryData: ExerciseCategoryDTO) => {
    try {
      setFormLoading(true);
      setFormError(null);

      if (selectedCategory) {
        await updateCategory(selectedCategory.id, categoryData);
      } else {
        await createCategory(categoryData);
      }

      setFormDialogOpen(false);
    } catch (err: any) {
      setFormError(err.message || "Грешка при запазване на категорията");
    } finally {
      setFormLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      await deleteCategory(categoryToDelete.id);
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    } catch (err: any) {
      // Error handling
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          p: 2,
          border: "1px solid #ddd",
          borderRadius: 1,
        }}
      >
        <Typography variant="h4">Категории упражнения</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateCategory}
          sx={{ minWidth: "200px" }}
        >
          Добави категория
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" color="text.secondary">
          Общо категории: {categories.length}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {categories.map((category) => (
          <Grid key={category.id}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      flex: 1,
                    }}
                  >
                    <FitnessIcon color="primary" />
                    <Typography variant="h6" component="h3">
                      {category.name}
                    </Typography>
                  </Box>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleEditCategory(category)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteCategory(category)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" paragraph>
                  {category.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {categories.length === 0 && !loading && (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            border: "2px dashed #ddd",
            borderRadius: 2,
            mt: 3,
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Няма категории
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Създайте първата категория, за да започнете
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateCategory}
          >
            Добави първа категория
          </Button>
        </Box>
      )}

      <CategoryFormDialog
        open={formDialogOpen}
        onClose={() => setFormDialogOpen(false)}
        onSubmit={handleSubmitCategory}
        category={selectedCategory}
        loading={formLoading}
        error={formError}
      />

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Потвърждение за изтриване</DialogTitle>
        <DialogContent>
          <Typography>
            Сигурни ли сте, че искате да изтриете категорията "
            {categoryToDelete?.name}"?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Внимание: Това ще изтрие всички упражнения в тази категория!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Отказ</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Изтрий
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CategoriesPage;
