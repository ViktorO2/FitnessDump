import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Chip,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  FitnessCenter,
  Restaurant,
  CalendarToday,
  TrendingUp,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useWorkoutProgress } from "../hooks/useWorkoutProgress";
import { useNutritionHistory } from "../hooks/useNutritionHistory";
import { useTrainingPrograms } from "../hooks/useTrainingPrograms";
import { useExercises } from "../hooks/useExercises";
import { useMealPlans } from "../hooks/useMealPlans";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`history-tabpanel-${index}`}
      aria-labelledby={`history-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const HistoryPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<number | "">("");
  const [selectedExercise, setSelectedExercise] = useState<number | "">("");
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const {
    progress,
    loading: progressLoading,
    error: progressError,
    fetchProgressByDateRange,
    fetchProgressByProgram,
    fetchProgressByExercise,
  } = useWorkoutProgress();

  const {
    foodHistory,
    loading: nutritionLoading,
    error: nutritionError,
    deleteFoodHistory,
  } = useNutritionHistory();

  const {
    mealPlans,
    loading: mealPlansLoading,
    error: mealPlansError,
  } = useMealPlans();

  const { programs } = useTrainingPrograms();
  const { exercises } = useExercises();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleFilterByDateRange = () => {
    if (startDate && endDate) {
      const start = startDate.toISOString();
      const end = endDate.toISOString();
      fetchProgressByDateRange(start, end);
    }
  };

  const handleFilterByProgram = (programId: number | "") => {
    setSelectedProgram(programId);
    if (programId === "") {
      // Reset to all progress
    } else {
      fetchProgressByProgram(programId);
    }
  };

  const handleFilterByExercise = (exerciseId: number | "") => {
    setSelectedExercise(exerciseId);
    if (exerciseId === "") {
      // Reset to all progress
    } else {
      fetchProgressByExercise(exerciseId);
    }
  };

  const handleViewItem = (item: any) => {
    setSelectedItem(item);
    setViewDialogOpen(true);
  };

  const handleDeleteFoodHistory = async (id: number) => {
    try {
      await deleteFoodHistory(id);
    } catch (error) {
      console.error("Error deleting food history:", error);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return "Няма дата";
      return new Date(dateString).toLocaleDateString("bg-BG");
    } catch (error) {
      console.error("Error formatting date:", dateString, error);
      return "Невалидна дата";
    }
  };

  const getExerciseName = (exerciseId: number) => {
    try {
      const exercise = exercises.find((ex) => ex.id === exerciseId);
      return exercise?.name || "Неизвестно упражнение";
    } catch (error) {
      console.error("Error getting exercise name:", exerciseId, error);
      return "Неизвестно упражнение";
    }
  };

  const getProgramName = (programId: number) => {
    try {
      const program = programs.find((prog) => prog.id === programId);
      return program?.name || "Неизвестна програма";
    } catch (error) {
      console.error("Error getting program name:", programId, error);
      return "Неизвестна програма";
    }
  };

  const calculateTotalWeight = (progressItem: any) => {
    try {
      if (
        !progressItem ||
        typeof progressItem.weightUsed !== "number" ||
        typeof progressItem.completedSets !== "number" ||
        typeof progressItem.completedReps !== "number"
      ) {
        return 0;
      }
      return (
        progressItem.weightUsed *
        progressItem.completedSets *
        progressItem.completedReps
      );
    } catch (error) {
      console.error("Error calculating total weight:", progressItem, error);
      return 0;
    }
  };

  if (progressLoading || nutritionLoading || mealPlansLoading) {
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

  if (progressError || nutritionError || mealPlansError) {
    return (
      <Box p={3}>
        <Alert severity="error">
          {progressError || nutritionError || mealPlansError}
        </Alert>
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        <Typography variant="h4" gutterBottom>
          История на тренировките и храненията
        </Typography>

        {/* Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Филтри
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <DatePicker
                  label="От дата"
                  value={startDate}
                  onChange={setStartDate}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <DatePicker
                  label="До дата"
                  value={endDate}
                  onChange={setEndDate}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 2 }}>
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
              <Grid size={{ xs: 12, sm: 6, md: 2 }}>
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
              <Grid size={{ xs: 12, sm: 12, md: 2 }}>
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

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={selectedTab} onChange={handleTabChange}>
            <Tab label="Тренировки" icon={<FitnessCenter />} />
            <Tab label="Хранене" icon={<Restaurant />} />
            <Tab label="Хранителни планове" icon={<CalendarToday />} />
          </Tabs>
        </Box>

        {/* Workout History Tab */}
        <TabPanel value={selectedTab} index={0}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                История на тренировките
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
                    {progress.map((progressItem) => {
                      // Validate progressItem data
                      if (!progressItem || typeof progressItem !== "object") {
                        console.error("Invalid progress item:", progressItem);
                        return null;
                      }

                      return (
                        <TableRow key={progressItem.id || Math.random()}>
                          <TableCell>
                            {formatDate(progressItem.completedAt)}
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
                          <TableCell>
                            {typeof progressItem.completedSets === "number"
                              ? progressItem.completedSets
                              : 0}
                          </TableCell>
                          <TableCell>
                            {typeof progressItem.completedReps === "number"
                              ? progressItem.completedReps
                              : 0}
                          </TableCell>
                          <TableCell>
                            {typeof progressItem.weightUsed === "number"
                              ? progressItem.weightUsed
                              : 0}
                          </TableCell>
                          <TableCell>
                            {calculateTotalWeight(progressItem).toFixed(1)} kg
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={`${
                                typeof progressItem.difficultyRating ===
                                "number"
                                  ? progressItem.difficultyRating
                                  : 0
                              }/10`}
                              size="small"
                              color={
                                (progressItem.difficultyRating || 0) >= 8
                                  ? "error"
                                  : (progressItem.difficultyRating || 0) >= 6
                                  ? "warning"
                                  : "success"
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={progressItem.completed ? "Да" : "Не"}
                              size="small"
                              color={
                                progressItem.completed ? "success" : "error"
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={() => handleViewItem(progressItem)}
                              color="primary"
                            >
                              <ViewIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Nutrition History Tab */}
        <TabPanel value={selectedTab} index={1}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                История на храненията
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Дата</TableCell>
                      <TableCell>Брой храни</TableCell>
                      <TableCell>Действия</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {foodHistory.map((item) => {
                      // Validate item data
                      if (!item || typeof item !== "object") {
                        console.error("Invalid food history item:", item);
                        return null;
                      }

                      return (
                        <TableRow key={item.id || Math.random()}>
                          <TableCell>{formatDate(item.date)}</TableCell>
                          <TableCell>
                            {Array.isArray(item.foodIds)
                              ? item.foodIds.length
                              : 0}
                          </TableCell>
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={() => handleViewItem(item)}
                              color="primary"
                            >
                              <ViewIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteFoodHistory(item.id)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Meal Plans Tab */}
        <TabPanel value={selectedTab} index={2}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Хранителни планове
              </Typography>
              <Grid container spacing={3}>
                {mealPlans.map((plan) => {
                  // Validate plan data
                  if (!plan || typeof plan !== "object") {
                    console.error("Invalid meal plan:", plan);
                    return null;
                  }

                  return (
                    <Grid key={plan.id || Math.random()}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            {plan.name || "Без име"}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            paragraph
                          >
                            {plan.description || "Без описание"}
                          </Typography>
                          <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                            <Chip
                              label={plan.goal || "Неизвестна цел"}
                              size="small"
                              color="primary"
                            />
                            <Chip
                              label={`${
                                typeof plan.targetCalories === "number"
                                  ? plan.targetCalories
                                  : 0
                              } kcal`}
                              size="small"
                            />
                          </Box>
                          <Typography variant="body2">
                            <strong>Период:</strong>{" "}
                            {formatDate(plan.startDate)} -{" "}
                            {formatDate(plan.endDate)}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Протеини:</strong>{" "}
                            {typeof plan.targetProtein === "number"
                              ? plan.targetProtein
                              : 0}
                            g
                          </Typography>
                          <Typography variant="body2">
                            <strong>Мазнини:</strong>{" "}
                            {typeof plan.targetFats === "number"
                              ? plan.targetFats
                              : 0}
                            g
                          </Typography>
                          <Typography variant="body2">
                            <strong>Въглехидрати:</strong>{" "}
                            {typeof plan.targetCarbs === "number"
                              ? plan.targetCarbs
                              : 0}
                            g
                          </Typography>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleViewItem(plan)}
                            sx={{ mt: 2 }}
                          >
                            Преглед
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </CardContent>
          </Card>
        </TabPanel>

        {/* View Details Dialog */}
        <Dialog
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Детайли</DialogTitle>
          <DialogContent>
            {selectedItem && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  {selectedItem.name || "Детайли"}
                </Typography>

                {selectedItem.programId && (
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      Информация за тренировката
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="body2">
                          <strong>Дата:</strong>{" "}
                          {formatDate(selectedItem.completedAt)}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="body2">
                          <strong>Програма:</strong>{" "}
                          {getProgramName(selectedItem.programId)}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="body2">
                          <strong>Упражнение:</strong>{" "}
                          {getExerciseName(selectedItem.exerciseId)}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="body2">
                          <strong>Серии:</strong> {selectedItem.completedSets}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="body2">
                          <strong>Повторения:</strong>{" "}
                          {selectedItem.completedReps}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="body2">
                          <strong>Тегло:</strong> {selectedItem.weightUsed} кг
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="body2">
                          <strong>Общо тегло:</strong>{" "}
                          {calculateTotalWeight(selectedItem).toFixed(1)} кг
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="body2">
                          <strong>Трудност:</strong>{" "}
                          {selectedItem.difficultyRating}/10
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="body2">
                          <strong>Завършено:</strong>{" "}
                          {selectedItem.completed ? "Да" : "Не"}
                        </Typography>
                      </Grid>
                      {selectedItem.notes && (
                        <Grid size={{ xs: 12 }}>
                          <Typography variant="body2">
                            <strong>Бележки:</strong> {selectedItem.notes}
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                )}

                {selectedItem.foodIds && (
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      Информация за храненето
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="body2">
                          <strong>Дата:</strong> {formatDate(selectedItem.date)}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="body2">
                          <strong>Брой храни:</strong>{" "}
                          {selectedItem.foodIds.length}
                        </Typography>
                      </Grid>
                      {selectedItem.foodIds &&
                        selectedItem.foodIds.length > 0 && (
                          <Grid size={{ xs: 12 }}>
                            <Typography variant="body2" gutterBottom>
                              <strong>Храни:</strong>
                            </Typography>
                            <Box sx={{ ml: 2 }}>
                              {selectedItem.foodIds.map(
                                (foodId: number, index: number) => (
                                  <Typography key={index} variant="body2">
                                    • Храна ID: {foodId}
                                  </Typography>
                                )
                              )}
                            </Box>
                          </Grid>
                        )}
                    </Grid>
                  </Box>
                )}

                {/* Meal Plan Details */}
                {selectedItem.targetCalories && (
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      Информация за хранителен план
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="body2">
                          <strong>Име:</strong> {selectedItem.name}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="body2">
                          <strong>Цел:</strong> {selectedItem.goal}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="body2">
                          <strong>Целеви калории:</strong>{" "}
                          {selectedItem.targetCalories} ккал
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Typography variant="body2">
                          <strong>Период:</strong>{" "}
                          {formatDate(selectedItem.startDate)} -{" "}
                          {formatDate(selectedItem.endDate)}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 4 }}>
                        <Typography variant="body2">
                          <strong>Протеини:</strong>{" "}
                          {selectedItem.targetProtein}г
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 4 }}>
                        <Typography variant="body2">
                          <strong>Мазнини:</strong> {selectedItem.targetFats}г
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 4 }}>
                        <Typography variant="body2">
                          <strong>Въглехидрати:</strong>{" "}
                          {selectedItem.targetCarbs}g
                        </Typography>
                      </Grid>
                      {selectedItem.description && (
                        <Grid size={{ xs: 12 }}>
                          <Typography variant="body2">
                            <strong>Описание:</strong>{" "}
                            {selectedItem.description}
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewDialogOpen(false)}>Затвори</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default HistoryPage;
