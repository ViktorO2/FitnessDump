import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  FitnessCenter as ExerciseIcon,
  Star as StarIcon,
} from "@mui/icons-material";
import { useTrainingPrograms } from "../hooks/useTrainingPrograms";
import { useExercises } from "../hooks/useExercises";
import { TrainingProgramDTO } from "../types/program.types";
import { ExerciseDTO } from "../types/exercise.types";
import ProgramFormDialog from "../components/Programs/ProgramFormDialog";
import { useNavigate } from "react-router-dom";

const ProgramsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    programs,
    loading: programsLoading,
    error: programsError,
    createProgram,
    updateProgram,
    deleteProgram,
  } = useTrainingPrograms();

  const {
    exercises,
    loading: exercisesLoading,
    error: exercisesError,
  } = useExercises();

  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] =
    useState<TrainingProgramDTO | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [programToDelete, setProgramToDelete] =
    useState<TrainingProgramDTO | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [programToView, setProgramToView] = useState<TrainingProgramDTO | null>(
    null
  );
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleCreateProgram = () => {
    setSelectedProgram(null);
    setFormError(null);
    setFormDialogOpen(true);
  };

  const handleEditProgram = (program: TrainingProgramDTO) => {
    setSelectedProgram(program);
    setFormError(null);
    setFormDialogOpen(true);
  };

  const handleDeleteProgram = (program: TrainingProgramDTO) => {
    setProgramToDelete(program);
    setDeleteDialogOpen(true);
  };

  const handleViewProgram = (program: TrainingProgramDTO) => {
    setProgramToView(program);
    setViewDialogOpen(true);
  };

  const handleSubmitProgram = async (programData: TrainingProgramDTO) => {
    try {
      setFormLoading(true);
      setFormError(null);

      if (selectedProgram) {
        await updateProgram(selectedProgram.id, programData);
      } else {
        await createProgram(programData);
      }

      setFormDialogOpen(false);
    } catch (err: any) {
      setFormError(err.message || "Грешка при запазване на програмата");
    } finally {
      setFormLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!programToDelete) return;

    try {
      await deleteProgram(programToDelete.id);
      setDeleteDialogOpen(false);
      setProgramToDelete(null);
    } catch (err: any) {
      console.error("Error deleting program:", err);
    }
  };

  const getExerciseName = (exerciseId: number) => {
    return (
      exercises.find((ex) => ex.id === exerciseId)?.name ||
      "Неизвестно упражнение"
    );
  };

  const getDayName = (dayOfWeek: number) => {
    const days = [
      "",
      "Понеделник",
      "Вторник",
      "Сряда",
      "Четвъртък",
      "Петък",
      "Събота",
      "Неделя",
    ];
    return days[dayOfWeek] || "Неизвестен ден";
  };

  const groupExercisesByDay = (program: TrainingProgramDTO) => {
    const grouped: { [key: number]: any[] } = {};
    program.exercises.forEach((exercise) => {
      if (!grouped[exercise.dayOfWeek]) {
        grouped[exercise.dayOfWeek] = [];
      }
      grouped[exercise.dayOfWeek].push(exercise);
    });
    return grouped;
  };

  if (programsLoading || exercisesLoading) {
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

  if (programsError || exercisesError) {
    return (
      <Box p={3}>
        <Alert severity="error">{programsError || exercisesError}</Alert>
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
        }}
      >
        <Typography variant="h4">Тренировъчни програми</Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<StarIcon />}
            onClick={() => navigate("/predefined-programs")}
          >
            Готови програми
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateProgram}
          >
            Добави програма
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {programs.map((program) => (
          <Grid key={program.id}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              {/* Картинка на програмата */}
              <CardMedia
                component="img"
                height="180"
                image="/images/progress.jpg"
                alt={program.name}
                sx={{
                  objectFit: "cover",
                  backgroundColor: "#f5f5f5",
                }}
              />

              <CardContent
                sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" component="h3" sx={{ flex: 1 }}>
                    {program.name}
                  </Typography>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleViewProgram(program)}
                      color="primary"
                    >
                      <ViewIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleEditProgram(program)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteProgram(program)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  paragraph
                  sx={{ flexGrow: 1 }}
                >
                  {program.description}
                </Typography>

                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                  <Chip
                    label={`${program.exercises.length} упражнения`}
                    size="small"
                    color="primary"
                    icon={<ExerciseIcon />}
                  />
                </Box>

                <Typography variant="body2" color="text.secondary">
                  Създадена от потребител ID: {program.userId}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Program Form Dialog */}
      <ProgramFormDialog
        open={formDialogOpen}
        onClose={() => setFormDialogOpen(false)}
        onSubmit={handleSubmitProgram}
        program={selectedProgram}
        exercises={exercises}
        loading={formLoading}
        error={formError}
      />

      {/* View Program Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{programToView?.name}</DialogTitle>
        <DialogContent>
          {programToView && (
            <Box>
              <Typography variant="body1" paragraph>
                {programToView.description}
              </Typography>

              <Typography variant="h6" gutterBottom>
                Упражнения по дни:
              </Typography>

              {Object.entries(groupExercisesByDay(programToView))
                .sort(([a], [b]) => parseInt(a) - parseInt(b))
                .map(([day, dayExercises]) => (
                  <Box key={day} sx={{ mb: 3 }}>
                    <Typography
                      variant="subtitle1"
                      color="primary"
                      gutterBottom
                    >
                      {getDayName(parseInt(day))}
                    </Typography>
                    <List dense>
                      {dayExercises
                        .sort((a, b) => a.orderInDay - b.orderInDay)
                        .map((exercise, index) => (
                          <ListItem key={index}>
                            <ListItemText
                              primary={getExerciseName(exercise.exerciseId)}
                              secondary={`${exercise.sets} серии x ${
                                exercise.reps
                              } повторения${
                                exercise.weight > 0
                                  ? ` @ ${exercise.weight}kg`
                                  : ""
                              }`}
                            />
                          </ListItem>
                        ))}
                    </List>
                    <Divider />
                  </Box>
                ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Затвори</Button>
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
            Сигурни ли сте, че искате да изтриете програмата "
            {programToDelete?.name}"?
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

export default ProgramsPage;
