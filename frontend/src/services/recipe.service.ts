import axios from '../config/axios.config';
import { API_CONFIG } from '../config/api.config';
import { RecipeDTO, CreateRecipeRequestDTO, UpdateRecipeRequestDTO } from '../types/nutrition.types';

const getAllRecipes = () =>
  axios.get<RecipeDTO[]>(`${API_CONFIG.BASE_URL}/recipes`).then(r => r.data);

const getRecipeById = (id: number) =>
  axios.get<RecipeDTO>(`${API_CONFIG.BASE_URL}/recipes/${id}`).then(r => r.data);

const getUserRecipes = (userId: number) =>
  axios.get<RecipeDTO[]>(`${API_CONFIG.BASE_URL}/recipes/user/${userId}`).then(r => r.data);

const createRecipe = (data: CreateRecipeRequestDTO) =>
  axios.post<RecipeDTO>(`${API_CONFIG.BASE_URL}/recipes`, data).then(r => r.data);

const updateRecipe = (id: number, data: UpdateRecipeRequestDTO) =>
  axios.put<RecipeDTO>(`${API_CONFIG.BASE_URL}/recipes/${id}`, data).then(r => r.data);

const deleteRecipe = (id: number) =>
  axios.delete(`${API_CONFIG.BASE_URL}/recipes/${id}`).then(r => r.data);

const searchRecipes = (query: string) =>
  axios.get<RecipeDTO[]>(`${API_CONFIG.BASE_URL}/recipes/search`, { params: { query } }).then(r => r.data);

const findRecipesByNutrition = (minCalories?: number, maxCalories?: number, minProtein?: number) =>
  axios.get<RecipeDTO[]>(`${API_CONFIG.BASE_URL}/recipes/nutrition`, {
    params: { minCalories, maxCalories, minProtein }
  }).then(r => r.data);

const getRecipesByGoal = (goal: "LOSE_WEIGHT" | "MAINTAIN_WEIGHT" | "GAIN_WEIGHT") =>
  axios.get<RecipeDTO[]>(`${API_CONFIG.BASE_URL}/recipes/goal/${goal}`).then(r => r.data);

const testRecipe = (id: number) =>
  axios.get(`${API_CONFIG.BASE_URL}/recipes/test/${id}`).then(r => r.data);

const recipeService = {
  getAllRecipes,
  getRecipeById,
  getUserRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  searchRecipes,
  findRecipesByNutrition,
  getRecipesByGoal,
  testRecipe,
};

export default recipeService; 