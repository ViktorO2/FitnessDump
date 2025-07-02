import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/auth.context';
import recipeIngredientsService from '../services/recipe-ingredients.service';
import { RecipeIngredientDTO } from '../types/nutrition.types';

export const useRecipeIngredients = () => {
  const { user, token, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRecipeIngredientById = useCallback(async (id: number): Promise<RecipeIngredientDTO | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await recipeIngredientsService.getRecipeIngredientById(id);
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Грешка при зареждане на съставката';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getIngredientsByRecipeId = useCallback(async (recipeId: number): Promise<RecipeIngredientDTO[]> => {
    try {
      setLoading(true);
      setError(null);
      const result = await recipeIngredientsService.getIngredientsByRecipeId(recipeId);
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Грешка при зареждане на съставките';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createRecipeIngredient = useCallback(async (data: RecipeIngredientDTO): Promise<RecipeIngredientDTO | null> => {
    if (!isAuthenticated) {
      setError('Трябва да сте влезли в профила си');
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await recipeIngredientsService.createRecipeIngredient(data);
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Грешка при създаване на съставка';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const updateRecipeIngredient = useCallback(async (id: number, data: RecipeIngredientDTO): Promise<RecipeIngredientDTO | null> => {
    if (!isAuthenticated) {
      setError('Трябва да сте влезли в профила си');
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await recipeIngredientsService.updateRecipeIngredient(id, data);
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Грешка при обновяване на съставка';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const deleteRecipeIngredient = useCallback(async (id: number): Promise<boolean> => {
    if (!isAuthenticated) {
      setError('Трябва да сте влезли в профила си');
      return false;
    }

    try {
      setLoading(true);
      setError(null);
      await recipeIngredientsService.deleteRecipeIngredient(id);
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Грешка при изтриване на съставка';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  return {
    getRecipeIngredientById,
    getIngredientsByRecipeId,
    createRecipeIngredient,
    updateRecipeIngredient,
    deleteRecipeIngredient,
    loading,
    error,
    clearError: () => setError(null)
  };
}; 