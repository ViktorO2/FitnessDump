import axios from '../config/axios.config';
import { API_CONFIG } from '../config/api.config';
import { MealPlanDTO, CreateMealPlanDTO, MealDTO, NutritionSummaryDTO } from '../types/nutrition.types';

const getUserMealPlans = (userId: number) =>
  axios.get<MealPlanDTO[]>(`${API_CONFIG.BASE_URL}/meal-plans/user/${userId}`).then(r => r.data);

const getMealPlanById = (id: number) =>
  axios.get<MealPlanDTO>(`${API_CONFIG.BASE_URL}/meal-plans/${id}`).then(r => r.data);

const createMealPlan = (data: MealPlanDTO) =>
  axios.post<MealPlanDTO>(`${API_CONFIG.BASE_URL}/meal-plans`, data).then(r => r.data);

const updateMealPlan = (id: number, data: MealPlanDTO) =>
  axios.put<MealPlanDTO>(`${API_CONFIG.BASE_URL}/meal-plans/${id}`, data).then(r => r.data);

const deleteMealPlan = (id: number) =>
  axios.delete(`${API_CONFIG.BASE_URL}/meal-plans/${id}`).then(r => r.data);

const getUserMealPlansByGoal = (userId: number, goal: "LOSE_WEIGHT" | "MAINTAIN_WEIGHT" | "GAIN_WEIGHT") =>
  axios.get<MealPlanDTO[]>(`${API_CONFIG.BASE_URL}/meal-plans/user/${userId}/goal/${goal}`).then(r => r.data);

const getMealPlanNutrition = (id: number) =>
  axios.get<NutritionSummaryDTO>(`${API_CONFIG.BASE_URL}/meal-plans/${id}/nutrition-summary`).then(r => r.data);

const getDayTotalCalories = (id: number, dayOfWeek: number) =>
  axios.get<number>(`${API_CONFIG.BASE_URL}/meal-plans/${id}/days/${dayOfWeek}/calories`).then(r => r.data);

// Meal operations
const addMealToDay = (id: number, dayOfWeek: number, data: MealDTO) =>
  axios.post(`${API_CONFIG.BASE_URL}/meal-plans/${id}/days/${dayOfWeek}/meals`, data).then(r => r.data);

const updateMealInDay = (id: number, dayOfWeek: number, mealId: number, data: MealDTO) =>
  axios.put(`${API_CONFIG.BASE_URL}/meal-plans/${id}/days/${dayOfWeek}/meals/${mealId}`, data).then(r => r.data);

const removeMealFromDay = (id: number, dayOfWeek: number, mealId: number) =>
  axios.delete(`${API_CONFIG.BASE_URL}/meal-plans/${id}/days/${dayOfWeek}/meals/${mealId}`).then(r => r.data);

const mealPlanService = {
  getUserMealPlans,
  getMealPlanById,
  createMealPlan,
  updateMealPlan,
  deleteMealPlan,
  getUserMealPlansByGoal,
  getMealPlanNutrition,
  getDayTotalCalories,
  addMealToDay,
  updateMealInDay,
  removeMealFromDay,
};

export default mealPlanService; 