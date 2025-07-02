export type GoalType = "LOSE_WEIGHT" | "GAIN_WEIGHT" | "MAINTAIN_WEIGHT";
export type Gender = "MALE" | "FEMALE";
export type ActivityLevel = "SEDENTARY" |  "LIGHTLY_ACTIVE"| "MODERATELY_ACTIVE" | "VERY_ACTIVE" | "EXTRA_ACTIVE";

export interface PersonalSettings{
id?:number;
userId: number;
currentWeight: number;
targetWeight: number;
height: number;
dailyCalories: number;
protein: number;
fats: number;
carbs: number;
goal: GoalType;
gender: Gender;
age: number;
activityLevel: ActivityLevel;
bmr?: number;
tdee?: number;
lastCalculation?: string;

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

// Интерфейс за отговор от калкулатор на калории
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

// Missing types from OpenAPI spec
export interface PersonalSettingsDTO {
  id: number;
  userId: number;
  currentWeight: number;
  targetWeight: number;
  height: number;
  dailyCalories: number;
  protein: number;
  fats: number;
  carbs: number;
  goal: "LOSE_WEIGHT" | "MAINTAIN_WEIGHT" | "GAIN_WEIGHT";
  gender: "MALE" | "FEMALE";
  age: number;
  activityLevel: "SEDENTARY" | "LIGHTLY_ACTIVE" | "MODERATELY_ACTIVE" | "VERY_ACTIVE" | "EXTRA_ACTIVE";
  bmr: number;
  tdee: number;
  lastCalculation: string;
}

export interface User {
  id: number;
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "USER" | "ADMIN";
}