import axios from '../config/axios.config';
import { API_CONFIG } from '../config/api.config';

export interface WorkoutProgressDTO {
  id: number;
  userId: number;
  programId: number;
  exerciseId: number;
  completedAt: string;
  completedSets: number;
  completedReps: number;
  weightUsed: number;
  notes?: string;
  difficultyRating: number;
  completed: boolean;
}

const getUserProgress = (userId: number) =>
  axios.get<WorkoutProgressDTO[]>(`${API_CONFIG.BASE_URL}/workout-progress/user/${userId}`).then(r => r.data);

const getUserProgressByDateRange = (userId: number, start: string, end: string) =>
  axios.get<WorkoutProgressDTO[]>(`${API_CONFIG.BASE_URL}/workout-progress/user/${userId}/range`, {
    params: { start, end }
  }).then(r => r.data);

const getUserProgressByProgram = (userId: number, programId: number) =>
  axios.get<WorkoutProgressDTO[]>(`${API_CONFIG.BASE_URL}/workout-progress/user/${userId}/program/${programId}`).then(r => r.data);

const getUserExerciseProgress = (userId: number, exerciseId: number) =>
  axios.get<WorkoutProgressDTO[]>(`${API_CONFIG.BASE_URL}/workout-progress/user/${userId}/exercise/${exerciseId}`).then(r => r.data);

const saveProgress = (data: WorkoutProgressDTO) =>
  axios.post<WorkoutProgressDTO>(`${API_CONFIG.BASE_URL}/workout-progress`, data).then(r => r.data);

const updateProgress = (id: number, data: WorkoutProgressDTO) =>
  axios.put<WorkoutProgressDTO>(`${API_CONFIG.BASE_URL}/workout-progress/${id}`, data).then(r => r.data);

const deleteProgress = (id: number) =>
  axios.delete(`${API_CONFIG.BASE_URL}/workout-progress/${id}`).then(r => r.data);

const workoutProgressService = {
  getUserProgress,
  getUserProgressByDateRange,
  getUserProgressByProgram,
  getUserExerciseProgress,
  saveProgress,
  updateProgress,
  deleteProgress,
};

export default workoutProgressService; 