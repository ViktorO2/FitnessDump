import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Grid,
  IconButton,
  Alert,
  Autocomplete,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import {
  RecipeDTO,
  CreateRecipeFormData,
  RecipeIngredientFormData,
} from "../../types/nutrition.types";
import { useFoods } from "../../hooks/useFoods";
import { FoodDTO } from "../../services/food.service";

interface RecipeFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (recipe: CreateRecipeFormData) => Promise<void>;
  recipe?: RecipeDTO;
  loading?: boolean;
}

const RecipeFormDialog: React.FC<RecipeFormDialogProps> = ({
  open,
  onClose,
  onSubmit,
  recipe,
  loading = false,
}) => {
  const { foods, loading: foodsLoading } = useFoods();
  const hasCalculatedRef = useRef(false);
  const calculationTimeoutRef = useRef<number | null>(null);

  const [formData, setFormData] = useState<CreateRecipeFormData>({
    name: "",
    description: "",
    instructions: "",
    ingredients: [{ foodId: 0, foodName: "", amount: 1 }],
    servings: 1,
    preparationTime: 0,
    recommendedFor: "MAINTAIN_WEIGHT",
    caloriesPerServing: 0,
    proteinPerServing: 0,
    fatPerServing: 0,
    carbsPerServing: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (recipe) {
      // Convert RecipeDTO to CreateRecipeFormData for editing
      const formDataFromRecipe = {
        name: recipe.name,
        description: recipe.description,
        instructions: recipe.instructions,
        ingredients: recipe.ingredients.map((ing) => ({
          foodId: ing.foodId,
          foodName: ing.foodName,
          amount: ing.amount,
        })),
        servings: recipe.servings,
        preparationTime: recipe.preparationTime,
        recommendedFor: recipe.recommendedFor,
        caloriesPerServing: recipe.caloriesPerServing,
        proteinPerServing: recipe.proteinPerServing,
        fatPerServing: recipe.fatPerServing,
        carbsPerServing: recipe.carbsPerServing,
      };

      setFormData(formDataFromRecipe);
      hasCalculatedRef.current = false; // Reset calculation flag
    } else {
      setFormData({
        name: "",
        description: "",
        instructions: "",
        ingredients: [{ foodId: 0, foodName: "", amount: 1 }],
        servings: 1,
        preparationTime: 0,
        recommendedFor: "MAINTAIN_WEIGHT",
        caloriesPerServing: 0,
        proteinPerServing: 0,
        fatPerServing: 0,
        carbsPerServing: 0,
      });
      hasCalculatedRef.current = false; // Reset calculation flag
    }
    setErrors({});
  }, [recipe, open]);

  // Calculate macronutrients when foods are loaded and we have a recipe to edit
  useEffect(() => {
    if (
      foods.length > 0 &&
      recipe &&
      formData.ingredients.some((i) => i.foodId > 0) &&
      !hasCalculatedRef.current
    ) {
      // Only calculate once when foods are loaded
      calculateMacronutrients(formData.ingredients, formData.servings);
      hasCalculatedRef.current = true;
    }
  }, [foods, recipe]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (calculationTimeoutRef.current) {
        clearTimeout(calculationTimeoutRef.current);
      }
    };
  }, []);

  const goalLabels = {
    LOSE_WEIGHT: "Загуба на тегло",
    MAINTAIN_WEIGHT: "Поддържане на тегло",
    GAIN_WEIGHT: "Качване на тегло",
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Името е задължително";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Описанието е задължително";
    }

    if (!formData.instructions.trim()) {
      newErrors.instructions = "Инструкциите са задължителни";
    }

    if (
      formData.ingredients.length === 0 ||
      formData.ingredients.every((i) => !i.foodName.trim() || i.foodId <= 0)
    ) {
      newErrors.ingredients = "Поне един състав е задължителен";
    }

    if (formData.preparationTime < 0) {
      newErrors.preparationTime =
        "Времето за подготовка не може да е отрицателно";
    }

    if (formData.servings <= 0) {
      newErrors.servings = "Броят порции трябва да е по-голям от 0";
    }

    if (formData.caloriesPerServing < 0) {
      newErrors.caloriesPerServing = "Калориите не могат да са отрицателни";
    }

    if (formData.proteinPerServing < 0) {
      newErrors.proteinPerServing = "Протеините не могат да са отрицателни";
    }

    if (formData.fatPerServing < 0) {
      newErrors.fatPerServing = "Мазнините не могат да са отрицателни";
    }

    if (formData.carbsPerServing < 0) {
      newErrors.carbsPerServing = "Въглехидратите не могат да са отрицателни";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      // Error submitting recipe
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const addIngredient = () => {
    if (formData.ingredients.length < 10) {
      setFormData((prev) => ({
        ...prev,
        ingredients: [
          ...prev.ingredients,
          { foodId: 0, foodName: "", amount: 1 },
        ],
      }));
    }
  };

  const removeIngredient = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  // Function to calculate macronutrients based on ingredients
  const calculateMacronutrients = (
    ingredients: RecipeIngredientFormData[],
    servings: number
  ) => {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalFat = 0;
    let totalCarbs = 0;

    ingredients.forEach((ingredient) => {
      if (ingredient.foodId > 0) {
        const food = foods.find((f) => f.id === ingredient.foodId);
        if (food) {
          // Calculate based on amount (assuming amount is in grams)
          const multiplier = ingredient.amount / 100; // Convert to per 100g basis
          totalCalories += food.kcal * multiplier;
          totalProtein += food.protein * multiplier;
          totalFat += food.fat * multiplier;
          totalCarbs += food.carbs * multiplier;
        }
      }
    });

    // Calculate per serving
    const caloriesPerServing =
      servings > 0 ? Math.round(totalCalories / servings) : 0;
    const proteinPerServing =
      servings > 0 ? Math.round(totalProtein / servings) : 0;
    const fatPerServing = servings > 0 ? Math.round(totalFat / servings) : 0;
    const carbsPerServing =
      servings > 0 ? Math.round(totalCarbs / servings) : 0;

    // Update form data with calculated values
    setFormData((prev) => ({
      ...prev,
      caloriesPerServing,
      proteinPerServing,
      fatPerServing,
      carbsPerServing,
    }));
  };

  // Debounced calculation function
  const debouncedCalculate = useCallback(
    (ingredients: RecipeIngredientFormData[], servings: number) => {
      // Clear existing timeout
      if (calculationTimeoutRef.current) {
        clearTimeout(calculationTimeoutRef.current);
      }

      // Set new timeout
      calculationTimeoutRef.current = window.setTimeout(() => {
        calculateMacronutrients(ingredients, servings);
      }, 500); // 500ms delay
    },
    [foods]
  );

  const handleIngredientChange = (index: number, food: FoodDTO | null) => {
    const newIngredients = [...formData.ingredients];
    if (food) {
      newIngredients[index] = {
        foodId: food.id,
        foodName: food.name,
        amount: 1,
      };
    } else {
      newIngredients[index] = { foodId: 0, foodName: "", amount: 1 };
    }
    handleInputChange("ingredients", newIngredients);

    // Debounced calculation
    debouncedCalculate(newIngredients, formData.servings);
  };

  const handleAmountChange = (index: number, amount: number) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = { ...newIngredients[index], amount };
    handleInputChange("ingredients", newIngredients);

    // Debounced calculation
    debouncedCalculate(newIngredients, formData.servings);
  };

  // Recalculate when servings change
  const handleServingsChange = (servings: number) => {
    handleInputChange("servings", servings);
    debouncedCalculate(formData.ingredients, servings);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {recipe ? "Редактиране на рецепта" : "Създаване на нова рецепта"}
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3}>
          {/* Основна информация */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" gutterBottom>
              Основна информация
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Име на рецептата"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Препоръчано за</InputLabel>
              <Select
                value={formData.recommendedFor}
                onChange={(e) =>
                  handleInputChange("recommendedFor", e.target.value)
                }
                label="Препоръчано за"
              >
                {Object.entries(goalLabels).map(([value, label]) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Описание"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              multiline
              rows={3}
              error={!!errors.description}
              helperText={errors.description}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Инструкции за приготвяне"
              value={formData.instructions}
              onChange={(e) =>
                handleInputChange("instructions", e.target.value)
              }
              multiline
              rows={6}
              error={!!errors.instructions}
              helperText={errors.instructions}
            />
          </Grid>

          {/* Съставки */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" gutterBottom>
              Съставки
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              <Button
                variant="contained"
                onClick={addIngredient}
                startIcon={<AddIcon />}
                disabled={formData.ingredients.length >= 10}
              >
                Добави съставка
              </Button>
            </Box>
            {formData.ingredients.map((ingredient, index) => (
              <Box
                key={index}
                sx={{ display: "flex", gap: 1, mb: 1, alignItems: "center" }}
              >
                <Autocomplete
                  sx={{ flexGrow: 1 }}
                  options={foods}
                  getOptionLabel={(option) => option.name}
                  value={
                    foods.find((food) => food.id === ingredient.foodId) || null
                  }
                  onChange={(event, newValue) => {
                    handleIngredientChange(index, newValue);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Избери храна" />
                  )}
                  loading={foodsLoading}
                />
                <TextField
                  sx={{ width: 120 }}
                  label="Количество"
                  type="number"
                  value={ingredient.amount}
                  onChange={(e) =>
                    handleAmountChange(index, Number(e.target.value))
                  }
                  inputProps={{ min: 0.1, step: 0.1 }}
                />
                <IconButton
                  onClick={() => removeIngredient(index)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            {errors.ingredients && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {errors.ingredients}
              </Alert>
            )}
          </Grid>

          {/* Време и порции */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" gutterBottom>
              Време и порции
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Време за подготовка (мин)"
              type="number"
              value={formData.preparationTime}
              onChange={(e) =>
                handleInputChange("preparationTime", Number(e.target.value))
              }
              error={!!errors.preparationTime}
              helperText={errors.preparationTime}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Брой порции"
              type="number"
              value={formData.servings}
              onChange={(e) => handleServingsChange(Number(e.target.value))}
              error={!!errors.servings}
              helperText={errors.servings}
            />
          </Grid>

          {/* Хранителна стойност */}
          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Typography variant="h6">
                Хранителна стойност (на порция)
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() =>
                  calculateMacronutrients(
                    formData.ingredients,
                    formData.servings
                  )
                }
                disabled={formData.ingredients.every((i) => i.foodId === 0)}
              >
                Изчисли автоматично
              </Button>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Калории"
              type="number"
              value={formData.caloriesPerServing}
              onChange={(e) =>
                handleInputChange("caloriesPerServing", Number(e.target.value))
              }
              error={!!errors.caloriesPerServing}
              helperText={errors.caloriesPerServing || "Автоматично изчислено"}
              InputProps={{
                readOnly: true,
                style: { backgroundColor: "#f5f5f5" },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Протеини (g)"
              type="number"
              value={formData.proteinPerServing}
              onChange={(e) =>
                handleInputChange("proteinPerServing", Number(e.target.value))
              }
              error={!!errors.proteinPerServing}
              helperText={errors.proteinPerServing || "Автоматично изчислено"}
              InputProps={{
                readOnly: true,
                style: { backgroundColor: "#f5f5f5" },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Мазнини (g)"
              type="number"
              value={formData.fatPerServing}
              onChange={(e) =>
                handleInputChange("fatPerServing", Number(e.target.value))
              }
              error={!!errors.fatPerServing}
              helperText={errors.fatPerServing || "Автоматично изчислено"}
              InputProps={{
                readOnly: true,
                style: { backgroundColor: "#f5f5f5" },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Въглехидрати (g)"
              type="number"
              value={formData.carbsPerServing}
              onChange={(e) =>
                handleInputChange("carbsPerServing", Number(e.target.value))
              }
              error={!!errors.carbsPerServing}
              helperText={errors.carbsPerServing || "Автоматично изчислено"}
              InputProps={{
                readOnly: true,
                style: { backgroundColor: "#f5f5f5" },
              }}
            />
          </Grid>

          {/* Обща хранителна стойност */}
          {formData.servings > 0 && (
            <Grid size={{ xs: 12 }}>
              <Box sx={{ mt: 2, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Обща хранителна стойност за {formData.servings} порции:
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Калории
                    </Typography>
                    <Typography variant="h6">
                      {formData.caloriesPerServing * formData.servings} ккал
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Протеини
                    </Typography>
                    <Typography variant="h6">
                      {formData.proteinPerServing * formData.servings}g
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Мазнини
                    </Typography>
                    <Typography variant="h6">
                      {formData.fatPerServing * formData.servings}g
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Въглехидрати
                    </Typography>
                    <Typography variant="h6">
                      {formData.carbsPerServing * formData.servings}g
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Отказ
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? "Запазване..." : recipe ? "Обнови" : "Създай"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RecipeFormDialog;
