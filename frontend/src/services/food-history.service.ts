import axios from '../config/axios.config';
import { API_CONFIG } from '../config/api.config';

export interface FoodHistoryDTO {
  id: number;
  userId: number;
  date: string;
  foodIds: number[];
}

const getUserFoodHistory = () =>
  axios.get<FoodHistoryDTO[]>(`${API_CONFIG.BASE_URL}/food-history`).then(r => r.data);

const getFoodHistoryById = (id: number) =>
  axios.get<FoodHistoryDTO>(`${API_CONFIG.BASE_URL}/food-history/${id}`).then(r => r.data);

const saveFoodHistory = (data: FoodHistoryDTO) =>
  axios.post<FoodHistoryDTO>(`${API_CONFIG.BASE_URL}/food-history`, data).then(r => r.data);

const deleteFoodHistory = (id: number) =>
  axios.delete(`${API_CONFIG.BASE_URL}/food-history/${id}`).then(r => r.data);

const foodHistoryService = {
  getUserFoodHistory,
  getFoodHistoryById,
  saveFoodHistory,
  deleteFoodHistory,
};

export default foodHistoryService; 