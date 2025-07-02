import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Divider,
  Chip,
  CircularProgress,
  Paper,
  Slider,
  Stack,
  Avatar,
  LinearProgress,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  Calculate as CalculateIcon,
  LocalFireDepartment as CaloriesIcon,
  FitnessCenter as ProteinIcon,
  Opacity as FatsIcon,
  Grain as CarbsIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
  Person as PersonIcon,
  Height as HeightIcon,
  Cake as CakeIcon,
  Wc as GenderIcon,
  DirectionsRun as ActivityIcon,
  Flag as GoalIcon,
  Settings as ConfigIcon,
} from "@mui/icons-material";
import {
  GoalType,
  Gender,
  ActivityLevel,
  CalorieCalculatorRequestDTO,
  CalorieCalculatorResponseDTO,
} from "../../types/personal-settings.types";
import { MealPlanGenerationConfigDTO } from "../../types/program.types";
import { useCalorieCalculator } from "../../hooks/useCalorieCalculator";

// Configuration objects - can be moved to a separate config file
const ACTIVITY_LEVELS = {
  SEDENTARY: {
    label: "Седящ начин на живот",
    description: "Малко или никакво движение, седяща работа",
    multiplier: 1.2,
    icon: "🛋️",
  },
  LIGHTLY_ACTIVE: {
    label: "Леко активен",
    description: "1-3 дни леки упражнения на седмица",
    multiplier: 1.375,
    icon: "🚶",
  },
  MODERATELY_ACTIVE: {
    label: "Умерено активен",
    description: "3-5 дни умерени упражнения на седмица",
    multiplier: 1.55,
    icon: "🏃",
  },
  VERY_ACTIVE: {
    label: "Много активен",
    description: "6-7 дни тежки упражнения на седмица",
    multiplier: 1.725,
    icon: "💪",
  },
  EXTRA_ACTIVE: {
    label: "Екстра активен",
    description: "Тежки упражнения + физическа работа",
    multiplier: 1.9,
    icon: "🔥",
  },
};

const GOALS = {
  LOSE_WEIGHT: {
    label: "Загуба на тегло",
    description: "Дефицит от 500 ккал/ден",
    adjustment: -500,
    proteinMultiplier: 2.2,
    icon: <TrendingDownIcon color="error" />,
    color: "error",
  },
  MAINTAIN_WEIGHT: {
    label: "Поддържане на тегло",
    description: "Поддържане на текущото тегло",
    adjustment: 0,
    proteinMultiplier: 2.0,
    icon: <TrendingFlatIcon color="info" />,
    color: "info",
  },
  GAIN_WEIGHT: {
    label: "Качване на мускулна маса",
    description: "Излишък от 300 ккал/ден",
    adjustment: 300,
    proteinMultiplier: 2.4,
    icon: <TrendingUpIcon color="success" />,
    color: "success",
  },
};

const GENDERS = {
  MALE: { label: "Мъж", icon: "👨" },
  FEMALE: { label: "Жена", icon: "👩" },
};

const CalorieCalculator: React.FC = () => {
  const [formData, setFormData] = useState<CalorieCalculatorRequestDTO>({
    weight: 70,
    height: 170,
    age: 25,
    gender: "MALE",
    activityLevel: "MODERATELY_ACTIVE",
    goal: "MAINTAIN_WEIGHT",
  });

  const [result, setResult] = useState<CalorieCalculatorResponseDTO | null>(
    null
  );
  const [showDetails, setShowDetails] = useState(false);
  const [openConfigDialog, setOpenConfigDialog] = useState(false);
  const [configData, setConfigData] = useState<MealPlanGenerationConfigDTO>({
    planName: "Хранителен план",
    planDescription: "Автоматично генериран хранителен план",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    goal: "MAINTAIN_WEIGHT",
    durationWeeks: 4,
    includeWorkoutDays: true,
    workoutDayCalorieMultiplier: 1.1,
    mealDistribution: {
      BREAKFAST: 0.25,
      LUNCH: 0.35,
      DINNER: 0.3,
      SNACKS: 0.1,
    },
    workoutDayMealDistribution: {
      BREAKFAST: 0.25,
      LUNCH: 0.3,
      DINNER: 0.25,
      SNACKS: 0.2,
    },
    useSmartGeneration: true,
    includeSnacks: true,
    mealsPerDay: 4,
    proteinPercentage: 30,
    carbsPercentage: 40,
    fatsPercentage: 30,
    usePersonalSettingsForMacros: true,
  });

  const {
    calculateNutrition,
    calculateAndSaveToPersonalSettings,
    generateTrainingProgram,
    generateMealPlan,
    generateSmartMealPlan,
    generateSmartMealPlanWithConfig,
    generateMealPlanWithConfig,
    generateDailyPlan,
    loading,
    error,
    clearError,
  } = useCalorieCalculator();

  const handleCalculate = async () => {
    const response = await calculateNutrition(formData);
    if (response) {
      setResult(response);
      setShowDetails(true);
    }
  };

  const handleSaveToProfile = async () => {
    if (result) {
      const response = await calculateAndSaveToPersonalSettings(formData);
      if (response) {
        // Show success message
        console.log("Настройките са запазени успешно!");
      }
    }
  };

  const handleGenerateTrainingProgram = async () => {
    const response = await generateTrainingProgram(formData);
    if (response) {
      console.log("Тренировъчната програма е генерирана успешно!");
    }
  };

  const handleGenerateMealPlan = async () => {
    const response = await generateMealPlan(formData);
    if (response) {
      console.log("Хранителният план е генериран успешно!");
    }
  };

  const handleGenerateSmartMealPlan = async () => {
    const response = await generateSmartMealPlan(formData, true);
    if (response) {
      console.log("Умният хранителен план е генериран успешно!");
    }
  };

  const handleGenerateMealPlanWithConfig = async () => {
    const response = await generateMealPlanWithConfig(formData, configData);
    if (response) {
      console.log("Хранителният план с конфигурация е генериран успешно!");
    }
    setOpenConfigDialog(false);
  };

  const handleGenerateSmartMealPlanWithConfig = async () => {
    const response = await generateSmartMealPlanWithConfig(
      formData,
      configData
    );
    if (response) {
      console.log("Умният хранителен план с конфигурация е генериран успешно!");
    }
    setOpenConfigDialog(false);
  };

  const handleGenerateDailyPlan = async () => {
    const response = await generateDailyPlan(formData);
    if (response) {
      console.log("Дневният план е генериран успешно!");
    }
  };

  const handleOpenConfigDialog = () => {
    setOpenConfigDialog(true);
  };

  const handleCloseConfigDialog = () => {
    setOpenConfigDialog(false);
  };

  const handleInputChange = (
    field: keyof CalorieCalculatorRequestDTO,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      weight: 70,
      height: 170,
      age: 25,
      gender: "MALE",
      activityLevel: "MODERATELY_ACTIVE",
      goal: "MAINTAIN_WEIGHT",
    });
    setResult(null);
    setShowDetails(false);
    clearError();
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
        <CalculateIcon sx={{ mr: 1, verticalAlign: "middle" }} />
        Калкулатор за калории
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Input Form */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Въведете вашите данни
              </Typography>

              <Grid container spacing={2}>
                {/* Weight */}
                <Grid size={{ xs: 6 }}>
                  <TextField
                    fullWidth
                    label="Тегло (кг)"
                    type="number"
                    value={formData.weight}
                    onChange={(e) =>
                      handleInputChange("weight", Number(e.target.value))
                    }
                    InputProps={{
                      startAdornment: (
                        <PersonIcon sx={{ mr: 1, color: "gray" }} />
                      ),
                    }}
                  />
                </Grid>

                {/* Height */}
                <Grid size={{ xs: 6 }}>
                  <TextField
                    fullWidth
                    label="Височина (см)"
                    type="number"
                    value={formData.height}
                    onChange={(e) =>
                      handleInputChange("height", Number(e.target.value))
                    }
                    InputProps={{
                      startAdornment: (
                        <HeightIcon sx={{ mr: 1, color: "gray" }} />
                      ),
                    }}
                  />
                </Grid>

                {/* Age */}
                <Grid size={{ xs: 6 }}>
                  <TextField
                    fullWidth
                    label="Възраст"
                    type="number"
                    value={formData.age}
                    onChange={(e) =>
                      handleInputChange("age", Number(e.target.value))
                    }
                    InputProps={{
                      startAdornment: (
                        <CakeIcon sx={{ mr: 1, color: "gray" }} />
                      ),
                    }}
                  />
                </Grid>

                {/* Gender */}
                <Grid size={{ xs: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Пол</InputLabel>
                    <Select
                      value={formData.gender}
                      label="Пол"
                      onChange={(e) =>
                        handleInputChange("gender", e.target.value)
                      }
                    >
                      {Object.entries(GENDERS).map(([key, value]) => (
                        <MenuItem key={key} value={key}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <span style={{ marginRight: 8 }}>{value.icon}</span>
                            {value.label}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Activity Level */}
                <Grid size={{ xs: 12 }}>
                  <FormControl fullWidth>
                    <InputLabel>Ниво на активност</InputLabel>
                    <Select
                      value={formData.activityLevel}
                      label="Ниво на активност"
                      onChange={(e) =>
                        handleInputChange("activityLevel", e.target.value)
                      }
                    >
                      {Object.entries(ACTIVITY_LEVELS).map(([key, value]) => (
                        <MenuItem key={key} value={key}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <span style={{ marginRight: 8 }}>{value.icon}</span>
                            <Box>
                              <Typography variant="body2">
                                {value.label}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {value.description}
                              </Typography>
                            </Box>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Goal */}
                <Grid size={{ xs: 12 }}>
                  <FormControl fullWidth>
                    <InputLabel>Цел</InputLabel>
                    <Select
                      value={formData.goal}
                      label="Цел"
                      onChange={(e) =>
                        handleInputChange("goal", e.target.value)
                      }
                    >
                      {Object.entries(GOALS).map(([key, value]) => (
                        <MenuItem key={key} value={key}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            {value.icon}
                            <Box sx={{ ml: 1 }}>
                              <Typography variant="body2">
                                {value.label}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {value.description}
                              </Typography>
                            </Box>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleCalculate}
                  disabled={loading}
                  startIcon={
                    loading ? <CircularProgress size={20} /> : <CalculateIcon />
                  }
                  fullWidth
                >
                  {loading ? "Изчисляване..." : "Изчисли"}
                </Button>
                <Button
                  variant="outlined"
                  onClick={resetForm}
                  startIcon={<RefreshIcon />}
                >
                  Нулирай
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Results */}
        <Grid size={{ xs: 12, md: 6 }}>
          {result ? (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Резултати
                </Typography>

                {/* Daily Calories */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h4" color="primary" gutterBottom>
                    {Math.round(result.dailyCalories)} ккал/ден
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Препоръчителни дневни калории
                  </Typography>
                </Box>

                {/* Macronutrients */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid size={{ xs: 4 }}>
                    <Box textAlign="center">
                      <ProteinIcon color="primary" sx={{ fontSize: 40 }} />
                      <Typography variant="h6">
                        {Math.round(result.macroDistribution.proteinGrams)}g
                      </Typography>
                      <Typography variant="caption">Протеини</Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 4 }}>
                    <Box textAlign="center">
                      <FatsIcon color="primary" sx={{ fontSize: 40 }} />
                      <Typography variant="h6">
                        {Math.round(result.macroDistribution.fatsGrams)}g
                      </Typography>
                      <Typography variant="caption">Мазнини</Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 4 }}>
                    <Box textAlign="center">
                      <CarbsIcon color="primary" sx={{ fontSize: 40 }} />
                      <Typography variant="h6">
                        {Math.round(result.macroDistribution.carbsGrams)}g
                      </Typography>
                      <Typography variant="caption">Въглехидрати</Typography>
                    </Box>
                  </Grid>
                </Grid>

                {/* Action Buttons */}
                <Stack spacing={2}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleSaveToProfile}
                    startIcon={<SaveIcon />}
                    fullWidth
                  >
                    Запази в профила
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={handleGenerateTrainingProgram}
                    fullWidth
                  >
                    Генерирай тренировъчна програма
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={handleGenerateMealPlan}
                    fullWidth
                  >
                    Генерирай хранителен план
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={handleGenerateSmartMealPlan}
                    fullWidth
                  >
                    Генерирай умен хранителен план
                  </Button>

                  <Button
                    variant="outlined"
                    startIcon={<ConfigIcon />}
                    onClick={handleOpenConfigDialog}
                    fullWidth
                  >
                    Генерирай с настройки
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={handleGenerateDailyPlan}
                    fullWidth
                  >
                    Генерирай дневен план
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          ) : (
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
                  <CalculateIcon sx={{ fontSize: 60, color: "gray", mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Въведете данните
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="center"
                  >
                    Попълнете формата отляво и натиснете "Изчисли" за да
                    получите вашите препоръки
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Configuration Dialog */}
      <Dialog
        open={openConfigDialog}
        onClose={handleCloseConfigDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Настройки за генериране на хранителен план</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Typography variant="h6">Основни настройки</Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="Име на плана"
                  value={configData.planName}
                  onChange={(e) =>
                    setConfigData({ ...configData, planName: e.target.value })
                  }
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="Продължителност (седмици)"
                  type="number"
                  value={configData.durationWeeks}
                  onChange={(e) =>
                    setConfigData({
                      ...configData,
                      durationWeeks: parseInt(e.target.value),
                    })
                  }
                  fullWidth
                />
              </Grid>
            </Grid>
            <TextField
              label="Описание"
              value={configData.planDescription}
              onChange={(e) =>
                setConfigData({
                  ...configData,
                  planDescription: e.target.value,
                })
              }
              multiline
              rows={2}
              fullWidth
            />
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="Начална дата"
                  type="date"
                  value={configData.startDate}
                  onChange={(e) =>
                    setConfigData({ ...configData, startDate: e.target.value })
                  }
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="Крайна дата"
                  type="date"
                  value={configData.endDate}
                  onChange={(e) =>
                    setConfigData({ ...configData, endDate: e.target.value })
                  }
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>

            <Divider />

            <Typography variant="h6">Настройки за генериране</Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={configData.includeWorkoutDays}
                  onChange={(e) =>
                    setConfigData({
                      ...configData,
                      includeWorkoutDays: e.target.checked,
                    })
                  }
                />
              }
              label="Включи дни за тренировки"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={configData.useSmartGeneration}
                  onChange={(e) =>
                    setConfigData({
                      ...configData,
                      useSmartGeneration: e.target.checked,
                    })
                  }
                />
              }
              label="Използвай умен алгоритъм"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={configData.includeSnacks}
                  onChange={(e) =>
                    setConfigData({
                      ...configData,
                      includeSnacks: e.target.checked,
                    })
                  }
                />
              }
              label="Включи закуски"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={configData.usePersonalSettingsForMacros}
                  onChange={(e) =>
                    setConfigData({
                      ...configData,
                      usePersonalSettingsForMacros: e.target.checked,
                    })
                  }
                />
              }
              label="Използвай лични настройки за макронутриенти"
            />

            <Divider />

            <Typography variant="h6">
              Разпределение на макронутриенти
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 4 }}>
                <TextField
                  label="Протеини (%)"
                  type="number"
                  value={configData.proteinPercentage}
                  onChange={(e) =>
                    setConfigData({
                      ...configData,
                      proteinPercentage: parseInt(e.target.value),
                    })
                  }
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 4 }}>
                <TextField
                  label="Въглехидрати (%)"
                  type="number"
                  value={configData.carbsPercentage}
                  onChange={(e) =>
                    setConfigData({
                      ...configData,
                      carbsPercentage: parseInt(e.target.value),
                    })
                  }
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 4 }}>
                <TextField
                  label="Мазнини (%)"
                  type="number"
                  value={configData.fatsPercentage}
                  onChange={(e) =>
                    setConfigData({
                      ...configData,
                      fatsPercentage: parseInt(e.target.value),
                    })
                  }
                  fullWidth
                />
              </Grid>
            </Grid>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfigDialog}>Отказ</Button>
          <Button
            onClick={handleGenerateMealPlanWithConfig}
            variant="contained"
          >
            Генерирай хранителен план
          </Button>
          <Button
            onClick={handleGenerateSmartMealPlanWithConfig}
            variant="contained"
            color="secondary"
          >
            Генерирай умен план
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CalorieCalculator;
