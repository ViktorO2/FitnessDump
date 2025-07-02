export interface UserProfile {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
  lastLogin: string;
}

export interface UserStats {
  currentWeight: number;
  targetWeight: number;
  dailyCalories: number;
  totalWorkouts: number;
  totalNutritionEntries: number;
  streakDays: number;
  lastWorkoutDate?: string;
  lastNutritionDate?: string;
}

export interface ProgressData {
  weightHistory: {
    date: string;
    weight: number;
  }[];
  caloriesHistory: {
    date: string;
    calories: number;
  }[];
  workoutsHistory: {
    date: string;
    count: number;
  }[];
}

export interface DashboardState {
  profile: UserProfile | null;
  stats: UserStats | null;
  progress: ProgressData | null;
  loading: boolean;
  error: string | null;
}
