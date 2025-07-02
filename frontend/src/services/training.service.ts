import axios from '../config/axios.config';
import { API_CONFIG } from '../config/api.config';
import { TrainingProgramDTO, ProgramExerciseDTO } from '../types/program.types';
import { ExerciseDTO, ExerciseCategoryDTO } from '../types/exercise.types';
import { WorkoutProgress } from '../types/training.types';

// Training Programs
const getUserPrograms = (userId: number) =>
  axios.get<TrainingProgramDTO[]>(`${API_CONFIG.BASE_URL}/training-programs/user/${userId}`).then(r => r.data);

const getProgramById = (id: number) =>
  axios.get<TrainingProgramDTO>(`${API_CONFIG.BASE_URL}/training-programs/${id}`).then(r => r.data);

const createProgram = (userId: number, data: TrainingProgramDTO) =>
  axios.post<TrainingProgramDTO>(`${API_CONFIG.BASE_URL}/training-programs/${userId}`, data).then(r => r.data);

const updateProgram = (id: number, data: TrainingProgramDTO) =>
  axios.put<TrainingProgramDTO>(`${API_CONFIG.BASE_URL}/training-programs/${id}`, data).then(r => r.data);

const deleteProgram = (id: number) =>
  axios.delete(`${API_CONFIG.BASE_URL}/training-programs/${id}`).then(r => r.data);

// Training Sessions
const getUserTrainingSessions = (userId: number) =>
  axios.get(`${API_CONFIG.BASE_URL}/training-sessions/user/${userId}`).then(r => r.data);

const getTrainingSessionById = (id: number) =>
  axios.get(`${API_CONFIG.BASE_URL}/training-sessions/${id}`).then(r => r.data);

const saveTrainingSession = (userId: number, data: any) =>
  axios.post(`${API_CONFIG.BASE_URL}/training-sessions/${userId}`, data).then(r => r.data);

const deleteTrainingSession = (id: number) =>
  axios.delete(`${API_CONFIG.BASE_URL}/training-sessions/${id}`).then(r => r.data);

// Exercises
const getAllExercises = () =>
  axios.get<ExerciseDTO[]>(`${API_CONFIG.BASE_URL}/exercise`).then(r => r.data);

const getExerciseById = (id: number) =>
  axios.get<ExerciseDTO>(`${API_CONFIG.BASE_URL}/exercise/${id}`).then(r => r.data);

const createExercise = (data: ExerciseDTO) =>
  axios.post<ExerciseDTO>(`${API_CONFIG.BASE_URL}/exercise/add`, data).then(r => r.data);

const updateExercise = (id: number, data: ExerciseDTO) =>
  axios.put<ExerciseDTO>(`${API_CONFIG.BASE_URL}/exercise/${id}`, data).then(r => r.data);

const deleteExercise = (id: number) =>
  axios.delete(`${API_CONFIG.BASE_URL}/exercise/${id}`).then(r => r.data);

const searchExercises = (query: string) =>
  axios.get<ExerciseDTO[]>(`${API_CONFIG.BASE_URL}/exercise/search`, { params: { query } }).then(r => r.data);

const getExercisesByCategory = (categoryId: number) =>
  axios.get<ExerciseDTO[]>(`${API_CONFIG.BASE_URL}/exercise/category/${categoryId}`).then(r => r.data);

// Exercise Categories
const getAllCategories = () =>
  axios.get<ExerciseCategoryDTO[]>(`${API_CONFIG.BASE_URL}/exercise-categories`).then(r => r.data);

const getCategoryById = (id: number) =>
  axios.get<ExerciseCategoryDTO>(`${API_CONFIG.BASE_URL}/exercise-categories/${id}`).then(r => r.data);

const createCategory = (data: ExerciseCategoryDTO) =>
  axios.post<ExerciseCategoryDTO>(`${API_CONFIG.BASE_URL}/exercise-categories`, data).then(r => r.data);

const updateCategory = (id: number, data: ExerciseCategoryDTO) =>
  axios.put<ExerciseCategoryDTO>(`${API_CONFIG.BASE_URL}/exercise-categories/${id}`, data).then(r => r.data);

const deleteCategory = (id: number) =>
  axios.delete(`${API_CONFIG.BASE_URL}/exercise-categories/${id}`).then(r => r.data);

// Workout Progress
const getUserProgress = (userId: number) =>
  axios.get<WorkoutProgress[]>(`${API_CONFIG.BASE_URL}/workout-progress/user/${userId}`).then(r => r.data);

const getUserProgressByDateRange = (userId: number, start: string, end: string) =>
  axios.get<WorkoutProgress[]>(`${API_CONFIG.BASE_URL}/workout-progress/user/${userId}/range`, {
    params: { start, end }
  }).then(r => r.data);

const getUserProgressByProgram = (userId: number, programId: number) =>
  axios.get<WorkoutProgress[]>(`${API_CONFIG.BASE_URL}/workout-progress/user/${userId}/program/${programId}`).then(r => r.data);

const getUserExerciseProgress = (userId: number, exerciseId: number) =>
  axios.get<WorkoutProgress[]>(`${API_CONFIG.BASE_URL}/workout-progress/user/${userId}/exercise/${exerciseId}`).then(r => r.data);

const saveProgress = (data: WorkoutProgress) =>
  axios.post<WorkoutProgress>(`${API_CONFIG.BASE_URL}/workout-progress`, data).then(r => r.data);

const updateProgress = (id: number, data: WorkoutProgress) =>
  axios.put<WorkoutProgress>(`${API_CONFIG.BASE_URL}/workout-progress/${id}`, data).then(r => r.data);

const deleteProgress = (id: number) =>
  axios.delete(`${API_CONFIG.BASE_URL}/workout-progress/${id}`).then(r => r.data);

// Predefined Programs
const getAllPredefinedPrograms = () =>
  axios.get(`${API_CONFIG.BASE_URL}/predefined-programs`).then(r => r.data);

const getPredefinedProgramById = (id: number) =>
  axios.get(`${API_CONFIG.BASE_URL}/predefined-programs/${id}`).then(r => r.data);

const getPredefinedProgramsByGoal = (goal: string) =>
  axios.get(`${API_CONFIG.BASE_URL}/predefined-programs/by-goal/${goal}`).then(r => r.data);

const getPredefinedProgramsByDifficulty = (difficultyLevel: string) =>
  axios.get(`${API_CONFIG.BASE_URL}/predefined-programs/by-difficulty/${difficultyLevel}`).then(r => r.data);

const copyProgramToUser = (userId: number, programId: number) =>
  axios.post(`${API_CONFIG.BASE_URL}/predefined-programs/copy/${programId}/to-user/${userId}`).then(r => r.data);

const trainingService = {
  // Training Programs
  getUserPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram,
  
  // Training Sessions
  getUserTrainingSessions,
  getTrainingSessionById,
  saveTrainingSession,
  deleteTrainingSession,
  
  // Exercises
  getAllExercises,
  getExerciseById,
  createExercise,
  updateExercise,
  deleteExercise,
  searchExercises,
  getExercisesByCategory,
  
  // Exercise Categories
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  
  // Workout Progress
  getUserProgress,
  getUserProgressByDateRange,
  getUserProgressByProgram,
  getUserExerciseProgress,
  saveProgress,
  updateProgress,
  deleteProgress,
  
  // Predefined Programs
  getAllPredefinedPrograms,
  getPredefinedProgramById,
  getPredefinedProgramsByGoal,
  getPredefinedProgramsByDifficulty,
  copyProgramToUser,
};

export default trainingService; 