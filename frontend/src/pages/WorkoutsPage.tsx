import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  LinearProgress,
  MenuItem,
} from "@mui/material";
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  Timer as TimerIcon,
  FitnessCenter as ExerciseIcon,
  CheckCircle as CheckIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { useTrainingPrograms } from "../hooks/useTrainingPrograms";
import { useExercises } from "../hooks/useExercises";
import { useWorkoutProgress } from "../hooks/useWorkoutProgress";
import { useTrainingSessions } from "../hooks/useTrainingSessions";
import { useAuth } from "../contexts/auth.context";
import { TrainingProgramDTO } from "../types/program.types";
import { ExerciseDTO } from "../types/exercise.types";
import { WorkoutProgress } from "../types/training.types";
import { TrainingSession } from "../types/training.types";
import WorkoutProgressDialog from "../components/Programs/WorkoutProgressDialog";

interface WorkoutSession {
  id: string;
  programId: number;
  programName: string;
  startTime: Date;
  exercises: WorkoutExercise[];
  isActive: boolean;
  currentExerciseIndex: number;
  totalTime: number;
}

interface WorkoutExercise {
  id: number;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  completed: boolean;
  completedSets: number;
  notes: string;
}

const WorkoutsPage: React.FC = () => {
  const { programs } = useTrainingPrograms();
  const { exercises } = useExercises();
  const { saveProgress } = useWorkoutProgress();
  const { createSession } = useTrainingSessions();
  const { user } = useAuth();
  const [activeSession, setActiveSession] = useState<WorkoutSession | null>(
    null
  );
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [sessionDialogOpen, setSessionDialogOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<number | "">("");
  const [progressDialogOpen, setProgressDialogOpen] = useState(false);
  const [currentExercise, setCurrentExercise] =
    useState<WorkoutExercise | null>(null);
  const [saving, setSaving] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startSession = (programId: number) => {
    const program = programs.find((p) => p.id === programId);
    if (!program) {
      console.error("Program not found:", programId);
      return;
    }

    if (!program.exercises || program.exercises.length === 0) {
      console.error("Program has no exercises:", program);
      return;
    }

    const sessionExercises: WorkoutExercise[] = program.exercises.map((ex) => {
      const exercise = exercises.find((e) => e.id === ex.exerciseId);
      return {
        id: ex.exerciseId,
        name: exercise?.name || "Неизвестно упражнение",
        sets: ex.sets || 0,
        reps: ex.reps || 0,
        weight: ex.weight || 0,
        completed: false,
        completedSets: 0,
        notes: "",
      };
    });

    const newSession: WorkoutSession = {
      id: Date.now().toString(),
      programId: program.id,
      programName: program.name,
      startTime: new Date(),
      exercises: sessionExercises,
      isActive: true,
      currentExerciseIndex: 0,
      totalTime: 0,
    };

    setActiveSession(newSession);
    setTimer(0);
    setIsTimerRunning(true);
    setSessionDialogOpen(false);
    setSelectedProgram("");
  };

  const pauseSession = () => {
    setIsTimerRunning(false);
  };

  const resumeSession = () => {
    setIsTimerRunning(true);
  };

  const endSession = async () => {
    if (!activeSession || !user?.id) return;

    try {
      setSaving(true);

      // 1. Save training session
      const trainingSessionData: TrainingSession = {
        userId: user.id,
        name: `${
          activeSession.programName
        } - ${new Date().toLocaleDateString()}`,
        description: `Completed workout from ${activeSession.programName}`,
        date: new Date().toISOString(),
        durationMinutes: Math.floor(timer / 60),
      };

      await createSession(trainingSessionData);

      // 2. Save workout progress for each completed exercise
      for (const exercise of activeSession.exercises) {
        if (exercise.completedSets > 0) {
          const progressData = {
            id: 0,
            userId: user.id,
            programId: activeSession.programId,
            exerciseId: exercise.id,
            completedAt: new Date().toISOString(),
            completedSets: exercise.completedSets,
            completedReps: exercise.reps,
            weightUsed: exercise.weight,
            notes: exercise.notes,
            difficultyRating: 3,
            completed: exercise.completed,
          };

          await saveProgress(progressData);
        }
      }

      // Workout session saved successfully
    } catch (error) {
      console.error("Error saving workout session:", error);
    } finally {
      setSaving(false);
      setActiveSession(null);
      setIsTimerRunning(false);
      setTimer(0);
    }
  };

  const handleExerciseProgress = (progressData: Partial<WorkoutProgress>) => {
    if (!activeSession || !currentExercise) return;

    const updatedExercises = activeSession.exercises.map((ex) =>
      ex.id === currentExercise.id
        ? {
            ...ex,
            completedSets: progressData.completedSets || 0,
            notes: progressData.notes || "",
            completed: progressData.completed || false,
          }
        : ex
    );

    setActiveSession({
      ...activeSession,
      exercises: updatedExercises,
    });

    setProgressDialogOpen(false);
    setCurrentExercise(null);
  };

  const getProgressPercentage = () => {
    if (!activeSession) return 0;
    const completed = activeSession.exercises.filter(
      (ex) => ex.completed
    ).length;
    return (completed / activeSession.exercises.length) * 100;
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
          Активни тренировки
        </Typography>
        {!activeSession && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setSessionDialogOpen(true)}
          >
            Започни тренировка
          </Button>
        )}
      </Box>

      {activeSession ? (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {activeSession.programName}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <TimerIcon sx={{ mr: 1 }} />
                  <Typography variant="h4" color="primary">
                    {formatTime(timer)}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={getProgressPercentage()}
                  sx={{ mb: 2 }}
                />
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Прогрес: {Math.round(getProgressPercentage())}%
                </Typography>
                <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                  {isTimerRunning ? (
                    <Button
                      variant="outlined"
                      startIcon={<PauseIcon />}
                      onClick={pauseSession}
                      fullWidth
                    >
                      Пауза
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      startIcon={<PlayIcon />}
                      onClick={resumeSession}
                      fullWidth
                    >
                      Продължи
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={
                      saving ? <CircularProgress size={20} /> : <StopIcon />
                    }
                    onClick={endSession}
                    disabled={saving}
                    fullWidth
                  >
                    {saving ? "Запазване..." : "Край"}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Упражнения
                </Typography>
                <List>
                  {activeSession.exercises.map((exercise, index) => (
                    <React.Fragment key={exercise.id}>
                      <ListItem
                        sx={{
                          backgroundColor: exercise.completed
                            ? "success.light"
                            : "transparent",
                          borderRadius: 1,
                          mb: 1,
                        }}
                      >
                        <ListItemIcon>
                          <ExerciseIcon
                            color={exercise.completed ? "success" : "primary"}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={exercise.name}
                          secondary={`${exercise.sets} серии x ${
                            exercise.reps
                          } повторения${
                            exercise.weight > 0 ? ` @ ${exercise.weight}kg` : ""
                          }`}
                        />
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Chip
                            label={`${exercise.completedSets}/${exercise.sets}`}
                            color={
                              exercise.completedSets === exercise.sets
                                ? "success"
                                : exercise.completedSets > 0
                                ? "warning"
                                : "default"
                            }
                            size="small"
                          />
                          {exercise.completed ? (
                            <CheckIcon color="success" />
                          ) : (
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => {
                                setCurrentExercise(exercise);
                                setProgressDialogOpen(true);
                              }}
                            >
                              Обнови
                            </Button>
                          )}
                        </Box>
                      </ListItem>
                      {index < activeSession.exercises.length - 1 && (
                        <Divider />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Няма активна тренировка
            </Typography>
            <Typography color="text.secondary" paragraph>
              Започнете нова тренировка, за да проследите своя прогрес.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setSessionDialogOpen(true)}
            >
              Започни тренировка
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Start Session Dialog */}
      <Dialog
        open={sessionDialogOpen}
        onClose={() => {
          setSessionDialogOpen(false);
          setSelectedProgram("");
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Избери тренировъчна програма</DialogTitle>
        <DialogContent>
          {programs.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 3 }}>
              <Typography color="text.secondary" gutterBottom>
                Няма налични тренировъчни програми
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Моля, създайте програма преди да започнете тренировка.
              </Typography>
            </Box>
          ) : (
            <TextField
              select
              fullWidth
              label="Програма"
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(Number(e.target.value))}
              sx={{ mt: 2 }}
              error={selectedProgram === "" && sessionDialogOpen}
              helperText={
                selectedProgram === "" && sessionDialogOpen
                  ? "Моля, изберете програма"
                  : ""
              }
            >
              {programs.map((program) => (
                <MenuItem key={program.id} value={program.id}>
                  <Box>
                    <Typography variant="body1">{program.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {program.exercises?.length || 0} упражнения
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </TextField>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setSessionDialogOpen(false);
              setSelectedProgram("");
            }}
          >
            Отказ
          </Button>
          <Button
            onClick={() => startSession(selectedProgram as number)}
            variant="contained"
            disabled={!selectedProgram || programs.length === 0}
          >
            Започни
          </Button>
        </DialogActions>
      </Dialog>

      {/* Exercise Progress Dialog */}
      {currentExercise && (
        <WorkoutProgressDialog
          open={progressDialogOpen}
          onClose={() => {
            setProgressDialogOpen(false);
            setCurrentExercise(null);
          }}
          onSubmit={handleExerciseProgress}
          exerciseName={currentExercise.name}
          initialData={{
            completedSets: currentExercise.completedSets,
            completedReps: currentExercise.reps,
            weightUsed: currentExercise.weight,
            notes: currentExercise.notes,
          }}
        />
      )}
    </Box>
  );
};

export default WorkoutsPage;
