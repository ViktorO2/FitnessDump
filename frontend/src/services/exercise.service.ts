import axios from "axios";
import { API_CONFIG } from "../config/api.config";
import { ExerciseDTO, ExerciseCategoryDTO } from "../types/exercise.types";

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

const exerciseService = {
  getAllExercises,
  getExerciseById,
  createExercise,
  updateExercise,
  deleteExercise,
  searchExercises,
  getExercisesByCategory,
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};

export default exerciseService; 