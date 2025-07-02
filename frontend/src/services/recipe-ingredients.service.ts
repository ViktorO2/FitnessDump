import axios from '../config/axios.config';
import { API_CONFIG } from '../config/api.config';
import { RecipeIngredientDTO } from '../types/nutrition.types';

const getRecipeIngredientById = (id: number) =>
  axios.get<RecipeIngredientDTO>(`${API_CONFIG.BASE_URL}/recipe-ingredients/${id}`).then(r => r.data);

const getIngredientsByRecipeId = (recipeId: number) =>
  axios.get<RecipeIngredientDTO[]>(`${API_CONFIG.BASE_URL}/recipe-ingredients/recipe/${recipeId}`).then(r => r.data);

const createRecipeIngredient = (data: RecipeIngredientDTO) =>
  axios.post<RecipeIngredientDTO>(`${API_CONFIG.BASE_URL}/recipe-ingredients`, data).then(r => r.data);

const updateRecipeIngredient = (id: number, data: RecipeIngredientDTO) =>
  axios.put<RecipeIngredientDTO>(`${API_CONFIG.BASE_URL}/recipe-ingredients/${id}`, data).then(r => r.data);

const deleteRecipeIngredient = (id: number) =>
  axios.delete(`${API_CONFIG.BASE_URL}/recipe-ingredients/${id}`).then(r => r.data);

const recipeIngredientsService = {
  getRecipeIngredientById,
  getIngredientsByRecipeId,
  createRecipeIngredient,
  updateRecipeIngredient,
  deleteRecipeIngredient
};

export default recipeIngredientsService; 