import React, { useState } from "react";
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
  Divider,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayArrow as ActivateIcon,
  Stop as DeactivateIcon,
  AutoAwesome as GenerateIcon,
  CalendarToday as CalendarIcon,
  FitnessCenter as WorkoutIcon,
  Restaurant as MealIcon,
  Settings as ConfigIcon,
} from "@mui/icons-material";
import { useDailyPlans } from "../hooks/useDailyPlans";
import {
  DailyPlanDTO,
  DailyPlanGenerationConfigDTO,
} from "../types/program.types";

const DailyPlansPage: React.FC = () => {
  const {
    dailyPlans,
    activeDailyPlan,
    loading,
    error,
    createDailyPlan,
    updateDailyPlan,
    deleteDailyPlan,
    generateAutomaticDailyPlan,
    generateAutomaticDailyPlanWithConfig,
    deactivateAllUserPlans,
    clearError,
  } = useDailyPlans();

  const [openDialog, setOpenDialog] = useState(false);
  const [openConfigDialog, setOpenConfigDialog] = useState(false);
  const [editingPlan, setEditingPlan] = useState<DailyPlanDTO | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    active: false,
  });

  const [configData, setConfigData] = useState<DailyPlanGenerationConfigDTO>({
    planName: "",
    planDescription: "",
    startDate: "",
    durationWeeks: 4,
    includeMealPlan: true,
    includeTrainingProgram: true,
    activatePlan: true,
    mealPlanConfig: {
      planName: "",
      planDescription: "",
      startDate: "",
      endDate: "",
      goal: "MAINTAIN_WEIGHT",
      durationWeeks: 4,
      includeWorkoutDays: true,
      workoutDayCalorieMultiplier: 1.1,
      mealDistribution: {},
      workoutDayMealDistribution: {},
      useSmartGeneration: true,
      includeSnacks: true,
      mealsPerDay: 4,
      proteinPercentage: 30,
      carbsPercentage: 40,
      fatsPercentage: 30,
      usePersonalSettingsForMacros: true,
    },
    usePersonalSettingsForMacros: true,
    deactivateExistingPlans: false,
  });

  const handleOpenDialog = (plan?: DailyPlanDTO) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        name: plan.name,
        description: plan.description,
        startDate: plan.startDate,
        endDate: plan.endDate,
        active: plan.active,
      });
    } else {
      setEditingPlan(null);
      setFormData({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        active: false,
      });
    }
    setOpenDialog(true);
  };

  const handleOpenConfigDialog = () => {
    const today = new Date().toISOString().split("T")[0];
    setConfigData({
      planName: "",
      planDescription: "",
      startDate: today,
      durationWeeks: 4,
      includeMealPlan: true,
      includeTrainingProgram: true,
      activatePlan: true,
      mealPlanConfig: {
        planName: "",
        planDescription: "",
        startDate: today,
        endDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        goal: "MAINTAIN_WEIGHT",
        durationWeeks: 4,
        includeWorkoutDays: true,
        workoutDayCalorieMultiplier: 1.1,
        mealDistribution: {},
        workoutDayMealDistribution: {},
        useSmartGeneration: true,
        includeSnacks: true,
        mealsPerDay: 4,
        proteinPercentage: 30,
        carbsPercentage: 40,
        fatsPercentage: 30,
        usePersonalSettingsForMacros: true,
      },
      usePersonalSettingsForMacros: true,
      deactivateExistingPlans: false,
    });
    setOpenConfigDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPlan(null);
  };

  const handleCloseConfigDialog = () => {
    setOpenConfigDialog(false);
  };

  const handleSubmit = async () => {
    if (editingPlan) {
      await updateDailyPlan(editingPlan.id, formData);
    } else {
      await createDailyPlan(formData);
    }
    handleCloseDialog();
  };

  const handleGenerateWithConfig = async () => {
    await generateAutomaticDailyPlanWithConfig(configData);
    handleCloseConfigDialog();
  };

  const handleDelete = async (plan: DailyPlanDTO) => {
    if (window.confirm("Сигурни ли сте, че искате да изтриете този план?")) {
      await deleteDailyPlan(plan.id);
    }
  };

  const handleGenerateAutomatic = async () => {
    await generateAutomaticDailyPlan();
  };

  const handleDeactivateAll = async () => {
    if (
      window.confirm(
        "Сигурни ли сте, че искате да деактивирате всички планове?"
      )
    ) {
      await deactivateAllUserPlans();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("bg-BG");
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", my: 4, px: 2 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
        <CalendarIcon sx={{ mr: 1, verticalAlign: "middle" }} />
        Дневни планове
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
          {error}
        </Alert>
      )}

      {/* Header Actions */}
      <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Създай нов план
        </Button>
        <Button
          variant="outlined"
          startIcon={<GenerateIcon />}
          onClick={handleGenerateAutomatic}
          disabled={loading}
        >
          Генерирай автоматичен план
        </Button>
        <Button
          variant="outlined"
          startIcon={<ConfigIcon />}
          onClick={handleOpenConfigDialog}
          disabled={loading}
        >
          Генерирай с настройки
        </Button>
        <Button
          variant="outlined"
          color="warning"
          startIcon={<DeactivateIcon />}
          onClick={handleDeactivateAll}
          disabled={loading}
        >
          Деактивирай всички
        </Button>
      </Box>

      {/* Active Plan */}
      {activeDailyPlan && (
        <Card sx={{ mb: 3, border: "2px solid", borderColor: "success.main" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Chip
                label="Активен план"
                color="success"
                size="small"
                sx={{ mr: 2 }}
              />
              <Typography variant="h6">{activeDailyPlan.name}</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {activeDailyPlan.description}
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Chip
                icon={<CalendarIcon />}
                label={`${formatDate(activeDailyPlan.startDate)} - ${formatDate(
                  activeDailyPlan.endDate
                )}`}
                variant="outlined"
                size="small"
              />
              {activeDailyPlan.mealPlan && (
                <Chip
                  icon={<MealIcon />}
                  label="Хранителен план"
                  variant="outlined"
                  size="small"
                />
              )}
              {activeDailyPlan.trainingProgram && (
                <Chip
                  icon={<WorkoutIcon />}
                  label="Тренировъчна програма"
                  variant="outlined"
                  size="small"
                />
              )}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Plans Grid */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : dailyPlans.length === 0 ? (
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
              <CalendarIcon sx={{ fontSize: 60, color: "gray", mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Няма дневни планове
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
              >
                Създайте първия си дневен план или генерирайте автоматичен
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {dailyPlans.map((plan) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={plan.id}>
              <Card
                sx={{
                  height: "100%",
                  border: plan.active ? "2px solid" : "1px solid",
                  borderColor: plan.active ? "success.main" : "divider",
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                      {plan.name}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(plan)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(plan)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {plan.description}
                  </Typography>

                  <Stack spacing={1} sx={{ mb: 2 }}>
                    <Chip
                      icon={<CalendarIcon />}
                      label={`${formatDate(plan.startDate)} - ${formatDate(
                        plan.endDate
                      )}`}
                      variant="outlined"
                      size="small"
                    />
                    {plan.mealPlan && (
                      <Chip
                        icon={<MealIcon />}
                        label="Хранителен план"
                        variant="outlined"
                        size="small"
                      />
                    )}
                    {plan.trainingProgram && (
                      <Chip
                        icon={<WorkoutIcon />}
                        label="Тренировъчна програма"
                        variant="outlined"
                        size="small"
                      />
                    )}
                  </Stack>

                  <Box sx={{ display: "flex", gap: 1 }}>
                    {plan.active ? (
                      <Chip
                        label="Активен"
                        color="success"
                        size="small"
                        icon={<ActivateIcon />}
                      />
                    ) : (
                      <Chip
                        label="Неактивен"
                        color="default"
                        size="small"
                        icon={<DeactivateIcon />}
                      />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingPlan ? "Редактирай план" : "Създай нов план"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Име на плана"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Описание"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              multiline
              rows={3}
              fullWidth
            />
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="Начална дата"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="Крайна дата"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
            <FormControl fullWidth>
              <InputLabel>Статус</InputLabel>
              <Select
                value={formData.active.toString()}
                label="Статус"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    active: e.target.value === "true",
                  })
                }
              >
                <MenuItem value="true">Активен</MenuItem>
                <MenuItem value="false">Неактивен</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отказ</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingPlan ? "Запази" : "Създай"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Configuration Dialog */}
      <Dialog
        open={openConfigDialog}
        onClose={handleCloseConfigDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Конфигурация за автоматично генериране</DialogTitle>
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

            <Divider />

            <Typography variant="h6">Компоненти</Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={configData.includeMealPlan}
                  onChange={(e) =>
                    setConfigData({
                      ...configData,
                      includeMealPlan: e.target.checked,
                    })
                  }
                />
              }
              label="Включи хранителен план"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={configData.includeTrainingProgram}
                  onChange={(e) =>
                    setConfigData({
                      ...configData,
                      includeTrainingProgram: e.target.checked,
                    })
                  }
                />
              }
              label="Включи тренировъчна програма"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={configData.activatePlan}
                  onChange={(e) =>
                    setConfigData({
                      ...configData,
                      activatePlan: e.target.checked,
                    })
                  }
                />
              }
              label="Активирай плана автоматично"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={configData.deactivateExistingPlans}
                  onChange={(e) =>
                    setConfigData({
                      ...configData,
                      deactivateExistingPlans: e.target.checked,
                    })
                  }
                />
              }
              label="Деактивирай съществуващи планове"
            />

            {configData.includeMealPlan && (
              <>
                <Divider />
                <Typography variant="h6">
                  Настройки за хранителен план
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <TextField
                      label="Име на хранителния план"
                      value={configData.mealPlanConfig.planName}
                      onChange={(e) =>
                        setConfigData({
                          ...configData,
                          mealPlanConfig: {
                            ...configData.mealPlanConfig,
                            planName: e.target.value,
                          },
                        })
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <TextField
                      label="Крайна дата"
                      type="date"
                      value={configData.mealPlanConfig.endDate}
                      onChange={(e) =>
                        setConfigData({
                          ...configData,
                          mealPlanConfig: {
                            ...configData.mealPlanConfig,
                            endDate: e.target.value,
                          },
                        })
                      }
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                </Grid>
                <TextField
                  label="Описание на хранителния план"
                  value={configData.mealPlanConfig.planDescription}
                  onChange={(e) =>
                    setConfigData({
                      ...configData,
                      mealPlanConfig: {
                        ...configData.mealPlanConfig,
                        planDescription: e.target.value,
                      },
                    })
                  }
                  multiline
                  rows={2}
                  fullWidth
                />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <FormControl fullWidth>
                      <InputLabel>Цел</InputLabel>
                      <Select
                        value={configData.mealPlanConfig.goal}
                        label="Цел"
                        onChange={(e) =>
                          setConfigData({
                            ...configData,
                            mealPlanConfig: {
                              ...configData.mealPlanConfig,
                              goal: e.target.value as
                                | "LOSE_WEIGHT"
                                | "MAINTAIN_WEIGHT"
                                | "GAIN_WEIGHT",
                            },
                          })
                        }
                      >
                        <MenuItem value="LOSE_WEIGHT">Загуба на тегло</MenuItem>
                        <MenuItem value="MAINTAIN_WEIGHT">
                          Поддържане на тегло
                        </MenuItem>
                        <MenuItem value="GAIN_WEIGHT">
                          Качване на тегло
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <TextField
                      label="Продължителност (седмици)"
                      type="number"
                      value={configData.mealPlanConfig.durationWeeks}
                      onChange={(e) =>
                        setConfigData({
                          ...configData,
                          mealPlanConfig: {
                            ...configData.mealPlanConfig,
                            durationWeeks: parseInt(e.target.value),
                          },
                        })
                      }
                      fullWidth
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <TextField
                      label="Множител за калории в дни на тренировки"
                      type="number"
                      value={
                        configData.mealPlanConfig.workoutDayCalorieMultiplier
                      }
                      onChange={(e) =>
                        setConfigData({
                          ...configData,
                          mealPlanConfig: {
                            ...configData.mealPlanConfig,
                            workoutDayCalorieMultiplier: parseFloat(
                              e.target.value
                            ),
                          },
                        })
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <TextField
                      label="Брой ястия на ден"
                      type="number"
                      value={configData.mealPlanConfig.mealsPerDay}
                      onChange={(e) =>
                        setConfigData({
                          ...configData,
                          mealPlanConfig: {
                            ...configData.mealPlanConfig,
                            mealsPerDay: parseInt(e.target.value),
                          },
                        })
                      }
                      fullWidth
                    />
                  </Grid>
                </Grid>
                <Typography variant="subtitle2" gutterBottom>
                  Разпределение на макронутриенти (%)
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 4 }}>
                    <TextField
                      label="Протеини"
                      type="number"
                      value={configData.mealPlanConfig.proteinPercentage}
                      onChange={(e) =>
                        setConfigData({
                          ...configData,
                          mealPlanConfig: {
                            ...configData.mealPlanConfig,
                            proteinPercentage: parseInt(e.target.value),
                          },
                        })
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 4 }}>
                    <TextField
                      label="Въглехидрати"
                      type="number"
                      value={configData.mealPlanConfig.carbsPercentage}
                      onChange={(e) =>
                        setConfigData({
                          ...configData,
                          mealPlanConfig: {
                            ...configData.mealPlanConfig,
                            carbsPercentage: parseInt(e.target.value),
                          },
                        })
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 4 }}>
                    <TextField
                      label="Мазнини"
                      type="number"
                      value={configData.mealPlanConfig.fatsPercentage}
                      onChange={(e) =>
                        setConfigData({
                          ...configData,
                          mealPlanConfig: {
                            ...configData.mealPlanConfig,
                            fatsPercentage: parseInt(e.target.value),
                          },
                        })
                      }
                      fullWidth
                    />
                  </Grid>
                </Grid>
                <FormControlLabel
                  control={
                    <Switch
                      checked={configData.mealPlanConfig.includeWorkoutDays}
                      onChange={(e) =>
                        setConfigData({
                          ...configData,
                          mealPlanConfig: {
                            ...configData.mealPlanConfig,
                            includeWorkoutDays: e.target.checked,
                          },
                        })
                      }
                    />
                  }
                  label="Включи дни за тренировки"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={configData.mealPlanConfig.useSmartGeneration}
                      onChange={(e) =>
                        setConfigData({
                          ...configData,
                          mealPlanConfig: {
                            ...configData.mealPlanConfig,
                            useSmartGeneration: e.target.checked,
                          },
                        })
                      }
                    />
                  }
                  label="Използвай умен алгоритъм"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={configData.mealPlanConfig.includeSnacks}
                      onChange={(e) =>
                        setConfigData({
                          ...configData,
                          mealPlanConfig: {
                            ...configData.mealPlanConfig,
                            includeSnacks: e.target.checked,
                          },
                        })
                      }
                    />
                  }
                  label="Включи закуски"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={
                        configData.mealPlanConfig.usePersonalSettingsForMacros
                      }
                      onChange={(e) =>
                        setConfigData({
                          ...configData,
                          mealPlanConfig: {
                            ...configData.mealPlanConfig,
                            usePersonalSettingsForMacros: e.target.checked,
                          },
                        })
                      }
                    />
                  }
                  label="Използвай лични настройки за макронутриенти"
                />
                <Typography variant="subtitle2" gutterBottom>
                  Разпределение на ястията (десетични числа, общо = 1.0)
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <TextField
                      label="Закуска"
                      type="number"
                      value={
                        configData.mealPlanConfig.mealDistribution.BREAKFAST ||
                        0
                      }
                      onChange={(e) =>
                        setConfigData({
                          ...configData,
                          mealPlanConfig: {
                            ...configData.mealPlanConfig,
                            mealDistribution: {
                              ...configData.mealPlanConfig.mealDistribution,
                              BREAKFAST: parseFloat(e.target.value) || 0,
                            },
                          },
                        })
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <TextField
                      label="Обяд"
                      type="number"
                      value={
                        configData.mealPlanConfig.mealDistribution.LUNCH || 0
                      }
                      onChange={(e) =>
                        setConfigData({
                          ...configData,
                          mealPlanConfig: {
                            ...configData.mealPlanConfig,
                            mealDistribution: {
                              ...configData.mealPlanConfig.mealDistribution,
                              LUNCH: parseFloat(e.target.value) || 0,
                            },
                          },
                        })
                      }
                      fullWidth
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <TextField
                      label="Вечеря"
                      type="number"
                      value={
                        configData.mealPlanConfig.mealDistribution.DINNER || 0
                      }
                      onChange={(e) =>
                        setConfigData({
                          ...configData,
                          mealPlanConfig: {
                            ...configData.mealPlanConfig,
                            mealDistribution: {
                              ...configData.mealPlanConfig.mealDistribution,
                              DINNER: parseFloat(e.target.value) || 0,
                            },
                          },
                        })
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <TextField
                      label="Закуски"
                      type="number"
                      value={
                        configData.mealPlanConfig.mealDistribution.SNACKS || 0
                      }
                      onChange={(e) =>
                        setConfigData({
                          ...configData,
                          mealPlanConfig: {
                            ...configData.mealPlanConfig,
                            mealDistribution: {
                              ...configData.mealPlanConfig.mealDistribution,
                              SNACKS: parseFloat(e.target.value) || 0,
                            },
                          },
                        })
                      }
                      fullWidth
                    />
                  </Grid>
                </Grid>
                {configData.mealPlanConfig.includeWorkoutDays && (
                  <>
                    <Typography variant="subtitle2" gutterBottom>
                      Разпределение на ястията в дни на тренировки
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 6 }}>
                        <TextField
                          label="Закуска (тренировки)"
                          type="number"
                          value={
                            configData.mealPlanConfig.workoutDayMealDistribution
                              .BREAKFAST || 0
                          }
                          onChange={(e) =>
                            setConfigData({
                              ...configData,
                              mealPlanConfig: {
                                ...configData.mealPlanConfig,
                                workoutDayMealDistribution: {
                                  ...configData.mealPlanConfig
                                    .workoutDayMealDistribution,
                                  BREAKFAST: parseFloat(e.target.value) || 0,
                                },
                              },
                            })
                          }
                          fullWidth
                        />
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <TextField
                          label="Обяд (тренировки)"
                          type="number"
                          value={
                            configData.mealPlanConfig.workoutDayMealDistribution
                              .LUNCH || 0
                          }
                          onChange={(e) =>
                            setConfigData({
                              ...configData,
                              mealPlanConfig: {
                                ...configData.mealPlanConfig,
                                workoutDayMealDistribution: {
                                  ...configData.mealPlanConfig
                                    .workoutDayMealDistribution,
                                  LUNCH: parseFloat(e.target.value) || 0,
                                },
                              },
                            })
                          }
                          fullWidth
                        />
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 6 }}>
                        <TextField
                          label="Вечеря (тренировки)"
                          type="number"
                          value={
                            configData.mealPlanConfig.workoutDayMealDistribution
                              .DINNER || 0
                          }
                          onChange={(e) =>
                            setConfigData({
                              ...configData,
                              mealPlanConfig: {
                                ...configData.mealPlanConfig,
                                workoutDayMealDistribution: {
                                  ...configData.mealPlanConfig
                                    .workoutDayMealDistribution,
                                  DINNER: parseFloat(e.target.value) || 0,
                                },
                              },
                            })
                          }
                          fullWidth
                        />
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <TextField
                          label="Закуски (тренировки)"
                          type="number"
                          value={
                            configData.mealPlanConfig.workoutDayMealDistribution
                              .SNACKS || 0
                          }
                          onChange={(e) =>
                            setConfigData({
                              ...configData,
                              mealPlanConfig: {
                                ...configData.mealPlanConfig,
                                workoutDayMealDistribution: {
                                  ...configData.mealPlanConfig
                                    .workoutDayMealDistribution,
                                  SNACKS: parseFloat(e.target.value) || 0,
                                },
                              },
                            })
                          }
                          fullWidth
                        />
                      </Grid>
                    </Grid>
                  </>
                )}
              </>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfigDialog}>Отказ</Button>
          <Button onClick={handleGenerateWithConfig} variant="contained">
            Генерирай
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DailyPlansPage;
