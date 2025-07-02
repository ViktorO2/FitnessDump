import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Chip,
  Avatar,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Add as AddIcon,
  FitnessCenter,
  Search,
  FilterList,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import { useExercisesWithFilters } from "../hooks/useExercisesWithFilters";
import { useExercises } from "../hooks/useExercises";
import { ExerciseDTO } from "../types/exercise.types";
import ExerciseCard from "../components/Exercises/ExerciseCard";
import ExerciseFilters from "../components/Exercises/ExerciseFilters";
import ExerciseEmptyState from "../components/Exercises/ExerciseEmptyState";
import ExerciseFormDialog from "../components/Exercises/ExerciseFormDialog";
import ExerciseDetailDialog from "../components/Exercises/ExerciseDetailDialog";

const ExercisesPage: React.FC = () => {
  const {
    filteredExercises,
    categories,
    loading,
    error,
    searchQuery,
    selectedCategory,
    hasActiveFilters,
    handleSearch,
    handleCategoryFilter,
    clearFilters,
    getCategoryName,
  } = useExercisesWithFilters();

  const {
    createExercise,
    updateExercise,
    deleteExercise,
    getExerciseById,
    getExercisesByCategory,
  } = useExercises();

  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseDTO | null>(
    null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [exerciseToDelete, setExerciseToDelete] = useState<ExerciseDTO | null>(
    null
  );
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [exerciseToView, setExerciseToView] = useState<ExerciseDTO | null>(
    null
  );
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [searchByIdDialogOpen, setSearchByIdDialogOpen] = useState(false);
  const [exerciseId, setExerciseId] = useState("");
  const [searchByIdLoading, setSearchByIdLoading] = useState(false);
  const [searchByIdError, setSearchByIdError] = useState<string | null>(null);
  const [foundExercise, setFoundExercise] = useState<ExerciseDTO | null>(null);

  const handleCreateExercise = () => {
    setSelectedExercise(null);
    setFormError(null);
    setFormDialogOpen(true);
  };

  const handleEditExercise = (exercise: ExerciseDTO) => {
    setSelectedExercise(exercise);
    setFormError(null);
    setFormDialogOpen(true);
  };

  const handleDeleteExercise = (exercise: ExerciseDTO) => {
    setExerciseToDelete(exercise);
    setDeleteDialogOpen(true);
  };

  const handleViewExercise = (exercise: ExerciseDTO) => {
    setExerciseToView(exercise);
    setDetailDialogOpen(true);
  };

  const handleSearchById = async () => {
    if (!exerciseId.trim()) return;

    setSearchByIdLoading(true);
    setSearchByIdError(null);
    setFoundExercise(null);

    try {
      const exercise = await getExerciseById(parseInt(exerciseId));
      setFoundExercise(exercise);
    } catch (err: any) {
      setSearchByIdError(err.message || "Упражнението не е намерено");
    } finally {
      setSearchByIdLoading(false);
    }
  };

  const handleSubmitExercise = async (exerciseData: ExerciseDTO) => {
    try {
      setFormLoading(true);
      setFormError(null);

      if (selectedExercise) {
        await updateExercise(selectedExercise.id, exerciseData);
      } else {
        await createExercise(exerciseData);
      }

      setFormDialogOpen(false);
    } catch (err: any) {
      setFormError(err.message || "Грешка при запазване на упражнението");
    } finally {
      setFormLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!exerciseToDelete) return;

    try {
      await deleteExercise(exerciseToDelete.id);
      setDeleteDialogOpen(false);
      setExerciseToDelete(null);
    } catch (err: any) {
      // Error handling without console.log
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
    <Box sx={{ maxWidth: "xl", mx: "auto" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 4,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: 3,
          p: 3,
          color: "white",
        }}
      >
        <Avatar
          sx={{
            width: 64,
            height: 64,
            mr: 3,
            bgcolor: "rgba(255,255,255,0.2)",
            border: "3px solid rgba(255,255,255,0.3)",
          }}
        >
          <FitnessCenter sx={{ fontSize: 32 }} />
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: 700, mb: 1 }}
          >
            Упражнения
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
            Управлявайте вашите упражнения и създавайте нови тренировки
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ViewIcon />}
            onClick={() => setSearchByIdDialogOpen(true)}
            sx={{
              color: "white",
              borderColor: "rgba(255,255,255,0.5)",
              "&:hover": {
                borderColor: "white",
                bgcolor: "rgba(255,255,255,0.1)",
              },
            }}
          >
            Търси по ID
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateExercise}
            sx={{
              bgcolor: "rgba(255,255,255,0.2)",
              color: "white",
              px: 4,
              py: 1.5,
              borderRadius: 3,
              textTransform: "none",
              fontSize: "1.1rem",
              fontWeight: 600,
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.3)",
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.3)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Добави упражнение
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Card
        sx={{
          mb: 4,
          background: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(10px)",
          borderRadius: 3,
          border: "1px solid rgba(255,255,255,0.3)",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <FilterList sx={{ mr: 1, color: "#667eea" }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Филтри
            </Typography>
          </Box>
          <ExerciseFilters
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            categories={categories}
            onSearchChange={handleSearch}
            onCategoryChange={handleCategoryFilter}
            onClearFilters={clearFilters}
          />
        </CardContent>
      </Card>

      {/* Results Summary */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 3,
          p: 2,
          background: "rgba(255,255,255,0.5)",
          borderRadius: 2,
          border: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <Search sx={{ mr: 1, color: "#667eea" }} />
        <Typography variant="body1" color="text.secondary">
          Показани упражнения: <strong>{filteredExercises.length}</strong>
          {hasActiveFilters && (
            <Chip
              label="Филтри активни"
              size="small"
              sx={{ ml: 1, bgcolor: "#667eea", color: "white" }}
            />
          )}
        </Typography>
      </Box>

      {/* Exercises Grid */}
      <Grid container spacing={3}>
        {filteredExercises.map((exercise) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={exercise.id}>
            <ExerciseCard
              exercise={exercise}
              categoryName={getCategoryName(exercise.categoryId)}
              onEdit={handleEditExercise}
              onDelete={handleDeleteExercise}
              onView={handleViewExercise}
            />
          </Grid>
        ))}
      </Grid>

      {filteredExercises.length === 0 && !loading && (
        <ExerciseEmptyState
          hasFilters={hasActiveFilters}
          onCreateExercise={handleCreateExercise}
        />
      )}

      <ExerciseDetailDialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        exercise={exerciseToView}
        categories={categories}
      />

      <ExerciseFormDialog
        open={formDialogOpen}
        onClose={() => setFormDialogOpen(false)}
        exercise={selectedExercise}
        categories={categories}
        onSubmit={handleSubmitExercise}
        loading={formLoading}
        error={formError}
      />

      {/* Search by ID Dialog */}
      <Dialog
        open={searchByIdDialogOpen}
        onClose={() => setSearchByIdDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Търсене на упражнение по ID</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="ID на упражнението"
              type="number"
              value={exerciseId}
              onChange={(e) => setExerciseId(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              onClick={handleSearchById}
              disabled={searchByIdLoading || !exerciseId.trim()}
              fullWidth
            >
              {searchByIdLoading ? "Търсене..." : "Търси"}
            </Button>

            {searchByIdError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {searchByIdError}
              </Alert>
            )}

            {foundExercise && (
              <Box sx={{ mt: 2 }}>
                <Alert severity="success" sx={{ mb: 2 }}>
                  Упражнението е намерено!
                </Alert>
                <ExerciseCard
                  exercise={foundExercise}
                  categoryName={getCategoryName(foundExercise.categoryId)}
                  onEdit={handleEditExercise}
                  onDelete={handleDeleteExercise}
                  onView={handleViewExercise}
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSearchByIdDialogOpen(false)}>
            Затвори
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Потвърждение за изтриване</DialogTitle>
        <DialogContent>
          <Typography>
            Сигурни ли сте, че искате да изтриете упражнението "
            {exerciseToDelete?.name}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Отказ</Button>
          <Button onClick={handleConfirmDelete} color="error">
            Изтрий
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ExercisesPage;
