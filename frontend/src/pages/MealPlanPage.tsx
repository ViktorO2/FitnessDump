import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useMealPlans } from "../hooks/useMealPlans";
import {
  CreateMealPlanDTO,
  MealPlanDTO,
  DietType,
} from "../types/nutrition.types";

const MealPlanPage: React.FC = () => {
  const {
    mealPlans,
    loading,
    error,
    createMealPlan,
    updateMealPlan,
    deleteMealPlan,
    fetchMealPlans,
  } = useMealPlans();
  const [formOpen, setFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MealPlanDTO | undefined>(
    undefined
  );
  const [formData, setFormData] = useState<CreateMealPlanDTO>({
    name: "",
    description: "",
    goal: "",
    targetCalories: 2000,
    targetMacronutrients: {
      protein: 100,
      fats: 60,
      carbohydrates: 250,
      fiber: 20,
      sugar: 30,
    },
    dietType: DietType.BALANCED,
    duration: 7,
  });

  const handleEdit = (plan: MealPlanDTO) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description,
      goal: plan.goal,
      targetCalories: plan.targetCalories,
      targetMacronutrients: plan.targetMacronutrients,
      dietType: plan.dietType,
      duration: plan.duration,
    });
    setFormOpen(true);
  };

  const handleDelete = async (plan: MealPlanDTO) => {
    if (
      window.confirm(
        `Сигурни ли сте, че искате да изтриете план "${plan.name}"?`
      )
    ) {
      await deleteMealPlan(plan.id);
      fetchMealPlans();
    }
  };

  const handleFormSubmit = async () => {
    if (editingPlan) {
      await updateMealPlan(editingPlan.id, formData);
    } else {
      await createMealPlan(formData);
    }
    setFormOpen(false);
    setEditingPlan(undefined);
    fetchMealPlans();
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
        <Typography variant="h4">Хранителни планове</Typography>
        <Button
          variant="contained"
          onClick={() => {
            setFormOpen(true);
            setEditingPlan(undefined);
          }}
        >
          Добави план
        </Button>
      </Box>
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
          {mealPlans.map((plan) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={plan.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{plan.name}</Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {plan.description}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Цел:</strong> {plan.goal}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Калории:</strong> {plan.targetCalories}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Диета:</strong> {plan.dietType}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Продължителност:</strong> {plan.duration} дни
                  </Typography>
                  <Button
                    size="small"
                    onClick={() => handleEdit(plan)}
                    sx={{ mt: 1 }}
                  >
                    Редактирай
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDelete(plan)}
                    sx={{ mt: 1, ml: 1 }}
                  >
                    Изтрий
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      <Dialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingPlan ? "Редактиране на план" : "Нов хранителен план"}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Име"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Описание"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            sx={{ mb: 2 }}
            multiline
            rows={2}
          />
          <TextField
            fullWidth
            label="Цел"
            value={formData.goal}
            onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Калории"
            type="number"
            value={formData.targetCalories}
            onChange={(e) =>
              setFormData({
                ...formData,
                targetCalories: Number(e.target.value),
              })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Продължителност (дни)"
            type="number"
            value={formData.duration}
            onChange={(e) =>
              setFormData({ ...formData, duration: Number(e.target.value) })
            }
            sx={{ mb: 2 }}
          />
          {/* Може да се добавят още полета за макронутриенти и диета */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormOpen(false)}>Отказ</Button>
          <Button onClick={handleFormSubmit} variant="contained">
            Запази
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MealPlanPage;
