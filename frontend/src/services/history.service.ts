import axios from '../config/axios.config';
import { API_CONFIG } from '../config/api.config';
import { HistoryFilters, WorkoutHistory, NutritionHistory } from '../types/history.types';
import { WorkoutProgressDTO } from './workout-progress.service';
import { FoodHistoryDTO } from './food-history.service';

// Food History
const getUserFoodHistory = () =>
  axios.get<FoodHistoryDTO[]>(`${API_CONFIG.BASE_URL}/food-history`).then(r => r.data);

const getFoodHistoryById = (id: number) =>
  axios.get<FoodHistoryDTO>(`${API_CONFIG.BASE_URL}/food-history/${id}`).then(r => r.data);

const saveFoodHistory = (data: FoodHistoryDTO) =>
  axios.post<FoodHistoryDTO>(`${API_CONFIG.BASE_URL}/food-history`, data).then(r => r.data);

const deleteFoodHistory = (id: number) =>
  axios.delete(`${API_CONFIG.BASE_URL}/food-history/${id}`).then(r => r.data);

// Meal Plans
const getUserMealPlans = (userId: number) =>
  axios.get(`${API_CONFIG.BASE_URL}/meal-plans/user/${userId}`).then(r => r.data);

const getMealPlan = (id: number) =>
  axios.get(`${API_CONFIG.BASE_URL}/meal-plans/${id}`).then(r => r.data);

const createMealPlan = (data: any) =>
  axios.post(`${API_CONFIG.BASE_URL}/meal-plans`, data).then(r => r.data);

const updateMealPlan = (id: number, data: any) =>
  axios.put(`${API_CONFIG.BASE_URL}/meal-plans/${id}`, data).then(r => r.data);

const deleteMealPlan = (id: number) =>
  axios.delete(`${API_CONFIG.BASE_URL}/meal-plans/${id}`).then(r => r.data);

const getUserMealPlansByGoal = (userId: number, goal: string) =>
  axios.get(`${API_CONFIG.BASE_URL}/meal-plans/user/${userId}/goal/${goal}`).then(r => r.data);

const getMealPlanNutrition = (id: number) =>
  axios.get(`${API_CONFIG.BASE_URL}/meal-plans/${id}/nutrition-summary`).then(r => r.data);

const getDayTotalCalories = (id: number, dayOfWeek: number) =>
  axios.get(`${API_CONFIG.BASE_URL}/meal-plans/${id}/days/${dayOfWeek}/calories`).then(r => r.data);

// Workout History (using workout progress endpoints)
const getWorkoutHistory = (filters: any) =>
  axios.get<WorkoutProgressDTO[]>(`${API_CONFIG.BASE_URL}/workout-progress/user/${filters.userId}`, { params: filters }).then(r => r.data);

const getWorkoutHistoryByDateRange = (userId: number, start: string, end: string) =>
  axios.get<WorkoutProgressDTO[]>(`${API_CONFIG.BASE_URL}/workout-progress/user/${userId}/range`, {
    params: { start, end }
  }).then(r => r.data);

const getWorkoutHistoryByProgram = (userId: number, programId: number) =>
  axios.get<WorkoutProgressDTO[]>(`${API_CONFIG.BASE_URL}/workout-progress/user/${userId}/program/${programId}`).then(r => r.data);

const getWorkoutHistoryByExercise = (userId: number, exerciseId: number) =>
  axios.get<WorkoutProgressDTO[]>(`${API_CONFIG.BASE_URL}/workout-progress/user/${userId}/exercise/${exerciseId}`).then(r => r.data);

const historyService = {
  // Food History
  getUserFoodHistory,
  getFoodHistoryById,
  saveFoodHistory,
  deleteFoodHistory,
  
  // Meal Plans
  getUserMealPlans,
  getMealPlan,
  createMealPlan,
  updateMealPlan,
  deleteMealPlan,
  getUserMealPlansByGoal,
  getMealPlanNutrition,
  getDayTotalCalories,
  
  // Workout History
  getWorkoutHistory,
  getWorkoutHistoryByDateRange,
  getWorkoutHistoryByProgram,
  getWorkoutHistoryByExercise,
};

export default historyService; 