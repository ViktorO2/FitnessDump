export interface Exercise {
  id: number;
  name: string;
  sets: number;
  reps: number;
  weight: string;
}

export interface WorkoutHistory {
  id: number;
  userId: number;
  programId: number;
  programName: string;
  exerciseId: number;
  completedAt: string;
  completedSets: number;
  completedReps: number;
  weightUsed: number;
  notes: string;
  difficultyRating: number;
  completed: boolean;
}

export interface Food {
  id: number;
  name: string;
  amount: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fats?: number;
}

export interface Meal {
  id: number;
  name: string;
  foods: Food[];
}

export interface NutritionHistory {
  id: number;
  date: Date;
  meals: Meal[];
  totalCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
}

export interface HistoryFilters {
  startDate?: Date;
  endDate?: Date;
  type?: string;
}

export interface HistoryState {
  workouts: WorkoutHistory[];
  nutrition: NutritionHistory[];
  loading: boolean;
  error: string | null;
  filters: HistoryFilters;
}
