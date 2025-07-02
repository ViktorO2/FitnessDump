import axios from '../config/axios.config';
import { API_CONFIG } from '../config/api.config';

export interface FoodDTO {
  id: number;
  name: string;
  description?: string;
  kcal: number;
  protein: number;
  fat: number;
  carbs: number;
  category?: string;
}

export interface CreateFoodDTO {
  name: string;
  description?: string;
  kcal: number;
  protein: number;
  fat: number;
  carbs: number;
  category?: string;
}

// Food CRUD operations
const getAllFoods = () =>
  axios.get<FoodDTO[]>(`${API_CONFIG.BASE_URL}/foods`).then(r => r.data);

const getFoodById = (id: number) =>
  axios.get<FoodDTO>(`${API_CONFIG.BASE_URL}/foods/${id}`).then(r => r.data);

const createFood = (data: CreateFoodDTO) =>
  axios.post<FoodDTO>(`${API_CONFIG.BASE_URL}/foods`, data).then(r => r.data);

const createFoodAlternative = (data: CreateFoodDTO) =>
  axios.post<FoodDTO>(`${API_CONFIG.BASE_URL}/foods/add`, data).then(r => r.data);

const updateFood = (id: number, data: CreateFoodDTO) =>
  axios.put<FoodDTO>(`${API_CONFIG.BASE_URL}/foods/${id}`, data).then(r => r.data);

const updateFoodAlternative = (id: number, data: CreateFoodDTO) =>
  axios.put<FoodDTO>(`${API_CONFIG.BASE_URL}/foods/edit/${id}`, data).then(r => r.data);

const deleteFood = (id: number) =>
  axios.delete(`${API_CONFIG.BASE_URL}/foods/${id}`).then(r => r.data);

const searchFoods = (query: string) =>
  axios.get<FoodDTO[]>(`${API_CONFIG.BASE_URL}/foods/search`, {
    params: { query }
  }).then(r => r.data);

const getFoodsByCategory = (category: string) =>
  axios.get<FoodDTO[]>(`${API_CONFIG.BASE_URL}/foods/category/${category}`).then(r => r.data);

const getCategories = () =>
  axios.get<string[]>(`${API_CONFIG.BASE_URL}/foods/categories`).then(r => r.data);

const foodService = {
  getAllFoods,
  getFoodById,
  createFood,
  createFoodAlternative,
  updateFood,
  updateFoodAlternative,
  deleteFood,
  searchFoods,
  getFoodsByCategory,
  getCategories,
};

export default foodService; 