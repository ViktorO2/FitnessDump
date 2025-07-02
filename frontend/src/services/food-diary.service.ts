import axios from '../config/axios.config';
import { API_CONFIG } from '../config/api.config';
import { FoodDiaryEntryDTO, CreateFoodDiaryEntryDTO, DailyNutritionStats } from '../types/nutrition.types';

const getUserFoodDiary = (userId: number, date?: string) =>
  axios.get<FoodDiaryEntryDTO[]>(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FOOD_DIARY.GET_USER_DIARY(userId)}`, {
    params: { date }
  }).then(r => r.data);

const addFoodToDiary = (entryData: CreateFoodDiaryEntryDTO) =>
  axios.post<FoodDiaryEntryDTO>(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FOOD_DIARY.ADD_FOOD}`, entryData).then(r => r.data);

const updateFoodDiaryEntry = (id: number, entryData: Partial<CreateFoodDiaryEntryDTO>) =>
  axios.put<FoodDiaryEntryDTO>(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FOOD_DIARY.UPDATE_ENTRY(id)}`, entryData).then(r => r.data);

const deleteFoodDiaryEntry = (id: number) =>
  axios.delete(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FOOD_DIARY.DELETE_ENTRY(id)}`).then(r => r.data);

const getDailyNutritionSummary = (userId: number, date: string) =>
  axios.get<DailyNutritionStats>(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FOOD_DIARY.GET_NUTRITION_SUMMARY}`, {
    params: { userId, date }
  }).then(r => r.data);

const foodDiaryService = {
  getUserFoodDiary,
  addFoodToDiary,
  updateFoodDiaryEntry,
  deleteFoodDiaryEntry,
  getDailyNutritionSummary,
};

export default foodDiaryService; 