// Enum за тип програма
export enum DietType {
  HIGH_PROTEIN = "HIGH_PROTEIN",
  KETO = "KETO",
  VEGAN = "VEGAN",
  VEGETARIAN = "VEGETARIAN",
  LOW_CARB = "LOW_CARB",
  MEDITERRANEAN = "MEDITERRANEAN",
  BALANCED = "BALANCED",
}

// Enum за категория на рецепта
export enum RecipeCategory {
  BREAKFAST = "BREAKFAST",
  LUNCH = "LUNCH",
  DINNER = "DINNER",
  SNACK = "SNACK",
  DESSERT = "DESSERT",
  SMOOTHIE = "SMOOTHIE",
  SALAD = "SALAD",
  SOUP = "SOUP",
  MAIN_COURSE = "MAIN_COURSE",
  SIDE_DISH = "SIDE_DISH",
}

// Интерфейс за макронутриенти
export interface Macronutrients {
  protein: number; // грамове
  fats: number; // грамове
  carbohydrates: number; // грамове
  fiber: number; // грамове
  sugar: number; // грамове
}

// Интерфейс за рецепта според бекенда
export interface RecipeDTO {
  id: number;
  name: string;
  description: string;
  instructions: string;
  ingredients: RecipeIngredientDTO[];
  servings: number;
  preparationTime: number;
  creatorId: number;
  recommendedFor: "LOSE_WEIGHT" | "MAINTAIN_WEIGHT" | "GAIN_WEIGHT";
  caloriesPerServing: number;
  proteinPerServing: number;
  fatPerServing: number;
  carbsPerServing: number;
}

// Интерфейс за съставка на рецепта
export interface RecipeIngredientDTO {
  id: number;
  recipeId: number;
  foodId: number;
  foodName: string;
  amount: number;
  note?: string;
}

// Интерфейс за обновяване на съставка на рецепта (без id и recipeId)
export interface UpdateRecipeIngredientDTO {
  foodId: number;
  foodName: string;
  amount: number;
  note?: string;
}

// Интерфейс за създаване на рецепта (за frontend форма)
export interface CreateRecipeFormData {
  name: string;
  description: string;
  instructions: string;
  ingredients: RecipeIngredientFormData[];
  servings: number;
  preparationTime: number;
  recommendedFor: "LOSE_WEIGHT" | "MAINTAIN_WEIGHT" | "GAIN_WEIGHT";
  caloriesPerServing: number;
  proteinPerServing: number;
  fatPerServing: number;
  carbsPerServing: number;
}

// Интерфейс за съставка в формата за рецепта
export interface RecipeIngredientFormData {
  foodId: number;
  foodName: string;
  amount: number;
}

// Интерфейс за създаване на рецепта (за backend API)
export interface CreateRecipeRequestDTO {
  name: string;
  description: string;
  instructions: string;
  ingredients: RecipeIngredientDTO[];
  servings: number;
  preparationTime: number;
  creatorId: number;
  recommendedFor: "LOSE_WEIGHT" | "MAINTAIN_WEIGHT" | "GAIN_WEIGHT";
  caloriesPerServing: number;
  proteinPerServing: number;
  fatPerServing: number;
  carbsPerServing: number;
}

// Интерфейс за хранителен план според бекенда
export interface MealPlanDTO {
  id: number;
  userId: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  goal: "LOSE_WEIGHT" | "MAINTAIN_WEIGHT" | "GAIN_WEIGHT";
  targetCalories: number;
  targetProtein: number;
  targetFats: number;
  targetCarbs: number;
  days: MealPlanDayDTO[];
}

// Интерфейс за ден от хранителен план
export interface MealPlanDayDTO {
  id: number;
  dayOfWeek: number;
  meals: MealDTO[];
}

// Интерфейс за хранене
export interface MealDTO {
  id: number;
  type: "BREAKFAST" | "MORNING_SNACK" | "LUNCH" | "AFTERNOON_SNACK" | "DINNER" | "EVENING_SNACK";
  items: MealItemDTO[];
  totalCalories: number;
  totalProtein: number;
  totalFats: number;
  totalCarbs: number;
}

// Интерфейс за елемент от хранене
export interface MealItemDTO {
  id: number;
  foodId: number;
  foodName: string;
  recipeId?: number;
  recipeName?: string;
  amount: number;
  calories: number;
  protein: number;
  fats: number;
  carbs: number;
}

// Интерфейс за създаване на хранителен план
export interface CreateMealPlanDTO {
  name: string;
  description: string;
  goal: string;
  targetCalories: number;
  targetMacronutrients: Macronutrients;
  dietType: DietType;
  duration: number;
}

// Интерфейс за дневник на храненето
export interface FoodDiaryEntryDTO {
  id: number;
  userId: number;
  date: string;
  mealType: RecipeCategory;
  recipeId: number;
  recipe?: RecipeDTO;
  quantity: number;
  calories: number;
  macronutrients: Macronutrients;
  notes?: string;
  createdAt: string;
}

// Интерфейс за създаване на запис в дневника
export interface CreateFoodDiaryEntryDTO {
  mealType: RecipeCategory;
  recipeId: number;
  quantity: number;
  notes?: string;
}

// Интерфейс за дневна статистика
export interface DailyNutritionStats {
  date: string;
  totalCalories: number;
  totalMacronutrients: Macronutrients;
  meals: FoodDiaryEntryDTO[];
  goalCalories: number;
  goalMacronutrients: Macronutrients;
  caloriesRemaining: number;
  macronutrientsRemaining: Macronutrients;
}

// Интерфейс за хранителна обобщена информация
export interface NutritionSummaryDTO {
  totalCalories: number;
  totalProtein: number;
  totalFats: number;
  totalCarbs: number;
}

// Интерфейс за заявка за калкулатор на калории
export interface CalorieCalculatorRequestDTO {
  weight: number;
  height: number;
  age: number;
  gender: "MALE" | "FEMALE";
  activityLevel: "SEDENTARY" | "LIGHTLY_ACTIVE" | "MODERATELY_ACTIVE" | "VERY_ACTIVE" | "EXTRA_ACTIVE";
  goal: "LOSE_WEIGHT" | "MAINTAIN_WEIGHT" | "GAIN_WEIGHT";
}

// Интерфейс за отговор от калкулатора на калории
export interface CalorieCalculatorResponseDTO {
  bmr: number;
  tdee: number;
  dailyCalories: number;
  macroDistribution: MacroDistributionDTO;
  calculationDate: string;
}

// Интерфейс за разпределение на макронутриенти
export interface MacroDistributionDTO {
  totalCalories: number;
  proteinGrams: number;
  fatsGrams: number;
  carbsGrams: number;
  proteinPercentage: number;
  fatsPercentage: number;
  carbsPercentage: number;
  proteinCalories: number;
  fatsCalories: number;
  carbsCalories: number;
}

// Интерфейс за обновяване на рецепта (за backend API)
export interface UpdateRecipeRequestDTO {
  name: string;
  description: string;
  instructions: string;
  ingredients: RecipeIngredientDTO[];
  servings: number;
  preparationTime: number;
  recommendedFor: "LOSE_WEIGHT" | "MAINTAIN_WEIGHT" | "GAIN_WEIGHT";
  caloriesPerServing: number;
  proteinPerServing: number;
  fatPerServing: number;
  carbsPerServing: number;
}

// Missing types from OpenAPI spec
export interface FoodDTO {
  id: number;
  name: string;
  description: string;
  kcal: number;
  protein: number;
  fat: number;
  carbs: number;
  category: "FRUITS" | "VEGETABLES" | "GRAINS" | "PROTEIN" | "DAIRY" | "FATS" | "SWEETS" | "BEVERAGES" | "NUTS_SEEDS" | "LEGUMES" | "OTHER";
}

export interface FoodHistoryDTO {
  id: number;
  userId: number;
  date: string;
  foodIds: number[];
}

export interface DailyPlanGenerationConfigDTO {
  planName: string;
  planDescription: string;
  startDate: string;
  durationWeeks: number;
  includeMealPlan: boolean;
  includeTrainingProgram: boolean;
  activatePlan: boolean;
  mealPlanConfig: MealPlanGenerationConfigDTO;
  usePersonalSettingsForMacros: boolean;
  deactivateExistingPlans: boolean;
}

export interface MealPlanGenerationConfigDTO {
  planName: string;
  planDescription: string;
  startDate: string;
  endDate: string;
  goal: "LOSE_WEIGHT" | "MAINTAIN_WEIGHT" | "GAIN_WEIGHT";
  durationWeeks: number;
  includeWorkoutDays: boolean;
  workoutDayCalorieMultiplier: number;
  mealDistribution: Record<string, number>;
  workoutDayMealDistribution: Record<string, number>;
  useSmartGeneration: boolean;
  includeSnacks: boolean;
  mealsPerDay: number;
  proteinPercentage: number;
  carbsPercentage: number;
  fatsPercentage: number;
} 