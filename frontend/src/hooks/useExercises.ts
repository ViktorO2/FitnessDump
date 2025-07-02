import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/auth.context';
import exerciseService from '../services/exercise.service';
import { ExerciseDTO, ExerciseCategoryDTO } from '../types/exercise.types';

export const useExercises = () => {
  const { user, token, isAuthenticated } = useAuth();
  const [exercises, setExercises] = useState<ExerciseDTO[]>([]);
  const [categories, setCategories] = useState<ExerciseCategoryDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExercises = useCallback(async () => {
    try {
      setLoading(true);
      
      const [exercisesData, categoriesData] = await Promise.all([
        exerciseService.getAllExercises(),
        exerciseService.getAllCategories()
      ]);
      setExercises(exercisesData);
      setCategories(categoriesData);
      setError(null);
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError('Нямате права за достъп до упражненията. Моля, проверете вашите права.');
      } else {
        setError('Грешка при зареждане на упражненията');
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token, user?.id]);

  const searchExercises = useCallback(async (query: string) => {
    try {
      setLoading(true);
      const results = await exerciseService.searchExercises(query);
      setExercises(results);
      setError(null);
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError('Нямате права за търсене на упражнения');
      } else {
        setError('Грешка при търсене на упражнения');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const getExercisesByCategory = useCallback(async (categoryId: number) => {
    try {
      setLoading(true);
      const results = await exerciseService.getExercisesByCategory(categoryId);
      setExercises(results);
      setError(null);
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError('Нямате права за достъп до упражненията по категория');
      } else {
        setError('Грешка при зареждане на упражненията по категория');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const createExercise = useCallback(async (exerciseData: ExerciseDTO) => {
    try {
      setLoading(true);
      const newExercise = await exerciseService.createExercise(exerciseData);
      setExercises(prev => [...prev, newExercise]);
      setError(null);
      return newExercise;
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError('Нямате права за създаване на упражнения');
      } else {
        setError('Грешка при създаване на упражнение');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateExercise = useCallback(async (id: number, exerciseData: ExerciseDTO) => {
    try {
      setLoading(true);
      const updatedExercise = await exerciseService.updateExercise(id, exerciseData);
      setExercises(prev => prev.map(ex => ex.id === id ? updatedExercise : ex));
      setError(null);
      return updatedExercise;
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError('Нямате права за обновяване на упражнения');
      } else {
        setError('Грешка при обновяване на упражнение');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteExercise = useCallback(async (id: number) => {
    try {
      setLoading(true);
      await exerciseService.deleteExercise(id);
      setExercises(prev => prev.filter(ex => ex.id !== id));
      setError(null);
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError('Нямате права за изтриване на упражнения');
      } else {
        setError('Грешка при изтриване на упражнение');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = useCallback(async (categoryData: ExerciseCategoryDTO) => {
    try {
      setLoading(true);
      const newCategory = await exerciseService.createCategory(categoryData);
      setCategories(prev => [...prev, newCategory]);
      setError(null);
      return newCategory;
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError('Нямате права за създаване на категории');
      } else {
        setError('Грешка при създаване на категория');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCategory = useCallback(async (id: number, categoryData: ExerciseCategoryDTO) => {
    try {
      setLoading(true);
      const updatedCategory = await exerciseService.updateCategory(id, categoryData);
      setCategories(prev => prev.map(cat => cat.id === id ? updatedCategory : cat));
      setError(null);
      return updatedCategory;
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError('Нямате права за обновяване на категории');
      } else {
        setError('Грешка при обновяване на категория');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCategory = useCallback(async (id: number) => {
    try {
      setLoading(true);
      await exerciseService.deleteCategory(id);
      setCategories(prev => prev.filter(cat => cat.id !== id));
      setError(null);
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError('Нямате права за изтриване на категории');
      } else {
        setError('Грешка при изтриване на категория');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getExerciseById = useCallback(async (id: number) => {
    try {
      setLoading(true);
      const exercise = await exerciseService.getExerciseById(id);
      setError(null);
      return exercise;
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError('Нямате права за достъп до упражнението');
      } else {
        setError('Грешка при зареждане на упражнението');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getCategoryById = useCallback(async (id: number) => {
    try {
      setLoading(true);
      const category = await exerciseService.getCategoryById(id);
      setError(null);
      return category;
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError('Нямате права за достъп до категорията');
      } else {
        setError('Грешка при зареждане на категорията');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  return {
    exercises,
    categories,
    loading,
    error,
    fetchExercises,
    searchExercises,
    getExercisesByCategory,
    createExercise,
    updateExercise,
    deleteExercise,
    getExerciseById,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryById
  };
}; 