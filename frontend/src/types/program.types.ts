export interface ProgramExerciseDTO {
  id: number;
  exerciseId: number;
  dayOfWeek: number; // 1-7
  sets: number;
  reps: number;
  weight: number;
  orderInDay: number;
  progressiveLoad?: ProgressiveLoadStep[];
}

export interface ProgressiveLoadStep {
  week: number;
  sets: number;
  reps: number;
  weight: number;
  restTime: number; // в секунди
  intensity: number; // процент от 1RM
}

export interface TrainingProgramDTO {
  id: number;
  name: string;
  description: string;
  userId: number;
  exercises: ProgramExerciseDTO[];
}

// Daily Plan Types
export interface DailyPlanDTO {
  id: number;
  userId: number;
  name: string;
  description: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  active: boolean;
  mealPlan?: MealPlanDTO;
  trainingProgram?: TrainingProgramDTO;
}

export interface MealPlanDTO {
  id: number;
  userId: number;
  name: string;
  description: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  goal: "LOSE_WEIGHT" | "MAINTAIN_WEIGHT" | "GAIN_WEIGHT";
  targetCalories: number;
  targetProtein: number;
  targetFats: number;
  targetCarbs: number;
  days: MealPlanDayDTO[];
}

export interface MealPlanDayDTO {
  id: number;
  dayOfWeek: number; // 1-7
  meals: MealDTO[];
}

export interface MealDTO {
  id: number;
  type: "BREAKFAST" | "MORNING_SNACK" | "LUNCH" | "AFTERNOON_SNACK" | "DINNER" | "EVENING_SNACK";
  items: MealItemDTO[];
  totalCalories: number;
  totalProtein: number;
  totalFats: number;
  totalCarbs: number;
}

export interface MealItemDTO {
  id: number;
  foodId?: number;
  foodName?: string;
  recipeId?: number;
  recipeName?: string;
  amount: number;
  calories: number;
  protein: number;
  fats: number;
  carbs: number;
}

// Enum за цели
export enum GoalType {
  LOSE_WEIGHT = "LOSE_WEIGHT",
  GAIN_WEIGHT = "GAIN_WEIGHT",
  MAINTAIN_WEIGHT = "MAINTAIN_WEIGHT",
  BUILD_MUSCLE = "BUILD_MUSCLE",
}

// Enum за ниво на трудност
export enum DifficultyLevel {
  BEGINNER = "BEGINNER",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED",
}

// Интерфейс за готова програма според бекенда
export interface PredefinedProgramDTO {
  id: number;
  name: string;
  description: string;
  goal: string;
  durationWeeks: number;
  difficultyLevel: string;
  exercises: PredefinedProgramExerciseDTO[];
}

// Интерфейс за упражнение в готова програма според бекенда
export interface PredefinedProgramExerciseDTO {
  id: number;
  exerciseId: number;
  dayOfWeek: number;
  sets: number;
  reps: number;
  suggestedWeight: number;
  restSeconds: number;
  orderInDay: number;
}

// Интерфейс за готова програма
export interface PredefinedProgram extends TrainingProgramDTO {
  goal: GoalType;
  difficultyLevel: DifficultyLevel;
  isPredefined: boolean;
  estimatedDuration: number; // в седмици
  targetAudience: string;
  tags: string[];
}

// Missing types from OpenAPI spec
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
  usePersonalSettingsForMacros: boolean;
}
