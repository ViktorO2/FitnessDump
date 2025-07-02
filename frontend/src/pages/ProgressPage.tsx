import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
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
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useWorkoutProgress } from "../hooks/useWorkoutProgress";
import { useTrainingPrograms } from "../hooks/useTrainingPrograms";
import { useExercises } from "../hooks/useExercises";
import { WorkoutProgress } from "../types/training.types";
import { TrainingProgramDTO } from "../types/program.types";
import { ExerciseDTO } from "../types/exercise.types";
import { useAuth } from "../contexts/auth.context";

const ProgressPage: React.FC = () => {
  const {
    progress,
    loading,
    error,
    fetchProgress,
    fetchProgressByDateRange,
    fetchProgressByProgram,
    fetchProgressByExercise,
    saveProgress,
    updateProgress,
    deleteProgress,
  } = useWorkoutProgress();

  const { programs } = useTrainingPrograms();
  const { exercises } = useExercises();
  const { user } = useAuth();

  const [selectedProgram, setSelectedProgram] = useState<number | "">("");
  const [selectedExercise, setSelectedExercise] = useState<number | "">("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProgress, setEditingProgress] =
    useState<WorkoutProgress | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [progressToDelete, setProgressToDelete] =
    useState<WorkoutProgress | null>(null);

  const handleFilterByProgram = (programId: number | "") => {
    setSelectedProgram(programId);
    if (programId === "") {
      fetchProgress();
    } else {
      fetchProgressByProgram(programId);
    }
  };

  const handleFilterByExercise = (exerciseId: number | "") => {
    setSelectedExercise(exerciseId);
    if (exerciseId === "") {
      fetchProgress();
    } else {
      fetchProgressByExercise(exerciseId);
    }
  };

  const handleFilterByDateRange = () => {
    if (startDate && endDate) {
      const start = startDate.toISOString();
      const end = endDate.toISOString();
      fetchProgressByDateRange(start, end);
    }
  };

  const handleCreateProgress = () => {
    setEditingProgress(null);
    setDialogOpen(true);
  };

  const handleEditProgress = (progressItem: WorkoutProgress) => {
    setEditingProgress(progressItem);
    setDialogOpen(true);
  };

  const handleDeleteProgress = (progressItem: WorkoutProgress) => {
    setProgressToDelete(progressItem);
    setDeleteDialogOpen(true);
  };

  const handleSaveProgress = async (progressData: Partial<WorkoutProgress>) => {
    try {
      if (editingProgress) {
        await updateProgress(editingProgress.id!, {
          ...editingProgress,
          ...progressData,
          id: editingProgress.id,
        } as any);
      } else {
        const { id, userId, ...rest } = progressData as any;
        await saveProgress({ ...rest, userId: user?.id });
      }
      setDialogOpen(false);
      setEditingProgress(null);
      await fetchProgress();
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  const handleConfirmDelete = async () => {
    if (progressToDelete && progressToDelete.id) {
      try {
        await deleteProgress(progressToDelete.id);
        setDeleteDialogOpen(false);
        setProgressToDelete(null);
        await fetchProgress();
      } catch (error) {
        console.error("Error deleting progress:", error);
      }
    }
  };

  const getExerciseName = (exerciseId: number) => {
    return (
      exercises.find((ex) => ex.id === exerciseId)?.name || "Unknown Exercise"
    );
  };

  const getProgramName = (programId: number) => {
    return (
      programs.find((prog) => prog.id === programId)?.name || "Unknown Program"
    );
  };

  const calculateTotalWeight = (progressItem: WorkoutProgress) => {
    return (
      progressItem.weightUsed *
      progressItem.completedSets *
      progressItem.completedReps
    );
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
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h4">Прогрес в тренировките</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateProgress}
          >
            Добави прогрес
          </Button>
        </Box>

        {/* Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Филтри
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Програма</InputLabel>
                  <Select
                    value={selectedProgram}
                    label="Програма"
                    onChange={(e) =>
                      handleFilterByProgram(e.target.value as number | "")
                    }
                  >
                    <MenuItem value="">Всички програми</MenuItem>
                    {programs.map((program) => (
                      <MenuItem key={program.id} value={program.id}>
                        {program.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Упражнение</InputLabel>
                  <Select
                    value={selectedExercise}
                    label="Упражнение"
                    onChange={(e) =>
                      handleFilterByExercise(e.target.value as number | "")
                    }
                  >
                    <MenuItem value="">Всички упражнения</MenuItem>
                    {exercises.map((exercise) => (
                      <MenuItem key={exercise.id} value={exercise.id}>
                        {exercise.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 2 }}>
                <DatePicker
                  label="От дата"
                  value={startDate}
                  onChange={setStartDate}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 2 }}>
                <DatePicker
                  label="До дата"
                  value={endDate}
                  onChange={setEndDate}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 2 }}>
                <Button
                  variant="outlined"
                  onClick={handleFilterByDateRange}
                  disabled={!startDate || !endDate}
                  fullWidth
                  sx={{ height: "56px" }}
                >
                  Филтрирай
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Progress Summary */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, md: 3 }}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Общо тренировки
                </Typography>
                <Typography variant="h4">{progress.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Общо тегло (kg)
                </Typography>
                <Typography variant="h4">
                  {progress
                    .reduce(
                      (total, item) => total + calculateTotalWeight(item),
                      0
                    )
                    .toFixed(1)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Общо серии
                </Typography>
                <Typography variant="h4">
                  {progress.reduce(
                    (total, item) => total + item.completedSets,
                    0
                  )}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Общо повторения
                </Typography>
                <Typography variant="h4">
                  {progress.reduce(
                    (total, item) => total + item.completedReps,
                    0
                  )}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Progress Table */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Детайлен прогрес
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Дата</TableCell>
                    <TableCell>Програма</TableCell>
                    <TableCell>Упражнение</TableCell>
                    <TableCell>Серии</TableCell>
                    <TableCell>Повторения</TableCell>
                    <TableCell>Тегло (kg)</TableCell>
                    <TableCell>Общо тегло</TableCell>
                    <TableCell>Трудност</TableCell>
                    <TableCell>Завършено</TableCell>
                    <TableCell>Действия</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {progress.map((progressItem) => (
                    <TableRow key={progressItem.id}>
                      <TableCell>
                        {new Date(
                          progressItem.completedAt
                        ).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getProgramName(progressItem.programId)}
                          size="small"
                          color="primary"
                        />
                      </TableCell>
                      <TableCell>
                        {getExerciseName(progressItem.exerciseId)}
                      </TableCell>
                      <TableCell>{progressItem.completedSets}</TableCell>
                      <TableCell>{progressItem.completedReps}</TableCell>
                      <TableCell>{progressItem.weightUsed}</TableCell>
                      <TableCell>
                        {calculateTotalWeight(progressItem).toFixed(1)} kg
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`${progressItem.difficultyRating}/10`}
                          size="small"
                          color={
                            progressItem.difficultyRating >= 8
                              ? "error"
                              : progressItem.difficultyRating >= 6
                              ? "warning"
                              : "success"
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={progressItem.completed ? "Да" : "Не"}
                          size="small"
                          color={progressItem.completed ? "success" : "error"}
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleEditProgress(progressItem)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteProgress(progressItem)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Progress Form Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {editingProgress ? "Редактирай прогрес" : "Нов прогрес"}
          </DialogTitle>
          <DialogContent>
            <ProgressForm
              progress={editingProgress}
              programs={programs}
              exercises={exercises}
              onSave={handleSaveProgress}
              onCancel={() => setDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Потвърди изтриване</DialogTitle>
          <DialogContent>
            <Typography>
              Сигурни ли сте, че искате да изтриете този прогрес?
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
    </LocalizationProvider>
  );
};

// Progress Form Component
interface ProgressFormProps {
  progress?: WorkoutProgress | null;
  programs: TrainingProgramDTO[];
  exercises: ExerciseDTO[];
  onSave: (data: Partial<WorkoutProgress>) => void;
  onCancel: () => void;
}

const ProgressForm: React.FC<ProgressFormProps> = ({
  progress,
  programs,
  exercises,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    programId: progress?.programId || programs[0]?.id || 0,
    exerciseId: progress?.exerciseId || exercises[0]?.id || 0,
    completedSets: progress?.completedSets || 3,
    completedReps: progress?.completedReps || 10,
    weightUsed: progress?.weightUsed || 0,
    difficultyRating: progress?.difficultyRating || 5,
    completed: progress?.completed || true,
    notes: progress?.notes || "",
    completedAt: progress?.completedAt
      ? new Date(progress.completedAt)
      : new Date(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      completedAt: formData.completedAt.toISOString(),
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <FormControl fullWidth margin="normal">
        <InputLabel>Програма</InputLabel>
        <Select
          value={formData.programId}
          label="Програма"
          onChange={(e) =>
            setFormData({ ...formData, programId: Number(e.target.value) })
          }
          required
        >
          {programs.map((program) => (
            <MenuItem key={program.id} value={program.id}>
              {program.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Упражнение</InputLabel>
        <Select
          value={formData.exerciseId}
          label="Упражнение"
          onChange={(e) =>
            setFormData({ ...formData, exerciseId: Number(e.target.value) })
          }
          required
        >
          {exercises.map((exercise) => (
            <MenuItem key={exercise.id} value={exercise.id}>
              {exercise.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Grid container spacing={3}>
        <Grid size={{ xs: 6 }}>
          <TextField
            fullWidth
            label="Серии"
            type="number"
            value={formData.completedSets}
            onChange={(e) =>
              setFormData({
                ...formData,
                completedSets: parseInt(e.target.value),
              })
            }
            margin="normal"
            required
          />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <TextField
            fullWidth
            label="Повторения"
            type="number"
            value={formData.completedReps}
            onChange={(e) =>
              setFormData({
                ...formData,
                completedReps: parseInt(e.target.value),
              })
            }
            margin="normal"
            required
          />
        </Grid>
      </Grid>

      <TextField
        fullWidth
        label="Тегло (kg)"
        type="number"
        value={formData.weightUsed}
        onChange={(e) =>
          setFormData({ ...formData, weightUsed: parseFloat(e.target.value) })
        }
        margin="normal"
        required
      />

      <TextField
        fullWidth
        label="Трудност (1-10)"
        type="number"
        value={formData.difficultyRating}
        onChange={(e) =>
          setFormData({
            ...formData,
            difficultyRating: parseInt(e.target.value),
          })
        }
        margin="normal"
        inputProps={{ min: 1, max: 10 }}
        required
      />

      <TextField
        fullWidth
        label="Бележки"
        value={formData.notes}
        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        margin="normal"
        multiline
        rows={3}
      />

      <DatePicker
        label="Дата на тренировката"
        value={formData.completedAt}
        onChange={(date) =>
          setFormData({ ...formData, completedAt: date || new Date() })
        }
        slotProps={{ textField: { fullWidth: true, margin: "normal" } }}
      />

      <Box sx={{ mt: 3, display: "flex", gap: 2, justifyContent: "flex-end" }}>
        <Button onClick={onCancel}>Отказ</Button>
        <Button type="submit" variant="contained">
          {progress ? "Запази" : "Създай"}
        </Button>
      </Box>
    </Box>
  );
};

export default ProgressPage;
