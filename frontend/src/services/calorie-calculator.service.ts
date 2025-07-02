import axios from '../config/axios.config';
import { API_CONFIG } from '../config/api.config';
import { CalorieCalculatorRequestDTO, CalorieCalculatorResponseDTO } from '../types/personal-settings.types';
import { MealPlanGenerationConfigDTO } from '../types/program.types';

const calculateNutrition = (data: CalorieCalculatorRequestDTO) =>
  axios.post<CalorieCalculatorResponseDTO>(`${API_CONFIG.BASE_URL}/calorie-calculator/calculate`, data).then(r => r.data);

const calculateAndSaveToPersonalSettings = (userId: number, data: CalorieCalculatorRequestDTO) =>
  axios.post<CalorieCalculatorResponseDTO>(`${API_CONFIG.BASE_URL}/calorie-calculator/calculate-and-save/${userId}`, data).then(r => r.data);

const generateTrainingProgram = (userId: number, data: CalorieCalculatorRequestDTO) =>
  axios.post(`${API_CONFIG.BASE_URL}/calorie-calculator/generate-training-program/${userId}`, data).then(r => r.data);

const generateMealPlan = (userId: number, data: CalorieCalculatorRequestDTO) =>
  axios.post(`${API_CONFIG.BASE_URL}/calorie-calculator/generate-meal-plan/${userId}`, data).then(r => r.data);

const generateSmartMealPlan = (userId: number, data: CalorieCalculatorRequestDTO, includeWorkoutDays: boolean = true) =>
  axios.post(`${API_CONFIG.BASE_URL}/calorie-calculator/generate-smart-meal-plan/${userId}`, data, {
    params: { includeWorkoutDays }
  }).then(r => r.data);

const generateSmartMealPlanWithConfig = (userId: number, request: CalorieCalculatorRequestDTO, config: MealPlanGenerationConfigDTO) =>
  axios.post(`${API_CONFIG.BASE_URL}/calorie-calculator/generate-smart-meal-plan-with-config/${userId}`, {
    request,
    config
  }).then(r => r.data);

const generateMealPlanWithConfig = (userId: number, request: CalorieCalculatorRequestDTO, config: MealPlanGenerationConfigDTO) =>
  axios.post(`${API_CONFIG.BASE_URL}/calorie-calculator/generate-meal-plan-with-config/${userId}`, {
    request,
    config
  }).then(r => r.data);

const generateDailyPlan = (userId: number, data: CalorieCalculatorRequestDTO) =>
  axios.post(`${API_CONFIG.BASE_URL}/calorie-calculator/generate-daily-plan/${userId}`, data).then(r => r.data);

const calorieCalculatorService = {
  calculateNutrition,
  calculateAndSaveToPersonalSettings,
  generateTrainingProgram,
  generateMealPlan,
  generateSmartMealPlan,
  generateSmartMealPlanWithConfig,
  generateMealPlanWithConfig,
  generateDailyPlan
};

export default calorieCalculatorService; 