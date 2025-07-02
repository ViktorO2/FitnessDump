// Категория упражнение
export interface ExerciseCategory {
  id: number;
  name: string;
}

// Упражнение
export interface Exercise {
  id: number;
  name: string;
  categoryId: number;
  description?: string;
}

// Тренировъчна програма
export interface TrainingProgram {
  id: number;
  name: string;
  description?: string;
  sessions: TrainingSession[];
}

// Тренировъчна сесия
export interface TrainingSession {
  id?: number;
  userId: number;
  name: string;
  description?: string;
  date: string; // ISO date string
  durationMinutes: number;
}

// Упражнение в сесия
export interface SessionExercise {
  exerciseId: number;
  sets: number;
  reps: number;
  weight: number;
}

// Прогрес на тренировка
export interface WorkoutProgress {
  id?: number;
  userId: number;
  programId: number;
  exerciseId: number;
  completedAt: string; // ISO date-time string
  completedSets: number;
  completedReps: number;
  weightUsed: number;
  notes?: string;
  difficultyRating: number; // 1-10
  completed: boolean;
}

// Predefined Program
export interface PredefinedProgram {
  id: number;
  name: string;
  description: string;
  goal: string;
  durationWeeks: number;
  difficultyLevel: string;
  exercises: PredefinedProgramExercise[];
}

// Predefined Program Exercise
export interface PredefinedProgramExercise {
  id: number;
  exerciseId: number;
  dayOfWeek: number;
  sets: number;
  reps: number;
  suggestedWeight: number;
  restSeconds: number;
  orderInDay: number;
}

// Missing types from OpenAPI spec
export interface WorkoutProgressDTO {
  id: number;
  userId: number;
  programId: number;
  exerciseId: number;
  completedAt: string;
  completedSets: number;
  completedReps: number;
  weightUsed: number;
  notes: string;
  difficultyRating: number;
  completed: boolean;
}

export interface ProgramExerciseDTO {
  id: number;
  exerciseId: number;
  dayOfWeek: number;
  sets: number;
  reps: number;
  weight: number;
  orderInDay: number;
}

export interface TrainingProgramDTO {
  id: number;
  name: string;
  description: string;
  userId: number;
  exercises: ProgramExerciseDTO[];
}

export interface TrainingSessionDTO {
  userId: number;
  name: string;
  description: string;
  date: string;
  durationMinutes: number;
}

export interface PredefinedProgramDTO {
  id: number;
  name: string;
  description: string;
  goal: string;
  durationWeeks: number;
  difficultyLevel: string;
  exercises: PredefinedProgramExerciseDTO[];
}

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
