import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/auth.context';
import recipeService from '../services/recipe.service';
import { RecipeDTO, CreateRecipeFormData, CreateRecipeRequestDTO, UpdateRecipeRequestDTO, UpdateRecipeIngredientDTO } from '../types/nutrition.types';

function mapCreateRecipeFormToRecipeDTO(data: CreateRecipeFormData, userId: number): CreateRecipeRequestDTO {
  if (!data.name?.trim()) {
    throw new Error('Recipe name is required');
  }
  if (!data.description?.trim()) {
    throw new Error('Recipe description is required');
  }
  if (!data.instructions?.trim()) {
    throw new Error('Recipe instructions are required');
  }

  // Filter out empty ingredients and validate foodId
  const validIngredients = data.ingredients.filter(ingredient => 
    ingredient.foodId > 0 && ingredient.foodName.trim() !== '' && ingredient.amount > 0
  );
  
  if (validIngredients.length === 0) {
    throw new Error('At least one ingredient is required');
  }

  // Validate that all ingredients have valid foodId
  const invalidIngredients = validIngredients.filter(ingredient => ingredient.foodId <= 0);
  if (invalidIngredients.length > 0) {
    const invalidIndexes = invalidIngredients.map((_, index) => 
      data.ingredients.indexOf(invalidIngredients[index])
    );
    throw new Error(`Invalid food ID for ingredient at index ${invalidIndexes.join(', ')}`);
  }

  // Ensure all numeric fields are numbers
  const servings = Number(data.servings) || 1;
  const preparationTime = Number(data.preparationTime) || 0;
  const caloriesPerServing = Number(data.caloriesPerServing) || 0;
  const proteinPerServing = Number(data.proteinPerServing) || 0;
  const fatPerServing = Number(data.fatPerServing) || 0;
  const carbsPerServing = Number(data.carbsPerServing) || 0;

  const mapped: CreateRecipeRequestDTO = {
    name: data.name.trim(),
    description: data.description.trim(),
    instructions: data.instructions.trim(),
    ingredients: validIngredients.map(ingredient => ({
      id: 0,
      recipeId: 0,
      foodId: ingredient.foodId,
      foodName: ingredient.foodName.trim(),
      amount: ingredient.amount
    })),
    servings,
    preparationTime,
    creatorId: userId,
    recommendedFor: data.recommendedFor || "MAINTAIN_WEIGHT",
    caloriesPerServing,
    proteinPerServing,
    fatPerServing,
    carbsPerServing,
  };

  return mapped;
}

function mapCreateRecipeFormToUpdateRecipeDTO(data: CreateRecipeFormData): UpdateRecipeRequestDTO {
  if (!data.name?.trim()) {
    throw new Error('Recipe name is required');
  }
  if (!data.description?.trim()) {
    throw new Error('Recipe description is required');
  }
  if (!data.instructions?.trim()) {
    throw new Error('Recipe instructions are required');
  }

  // Filter out empty ingredients and validate foodId
  const validIngredients = data.ingredients.filter(ingredient => 
    ingredient.foodId > 0 && ingredient.foodName.trim() !== '' && ingredient.amount > 0
  );
  
  if (validIngredients.length === 0) {
    throw new Error('At least one ingredient is required');
  }

  // Validate that all ingredients have valid foodId
  const invalidIngredients = validIngredients.filter(ingredient => ingredient.foodId <= 0);
  if (invalidIngredients.length > 0) {
    const invalidIndexes = invalidIngredients.map((_, index) => 
      data.ingredients.indexOf(invalidIngredients[index])
    );
    throw new Error(`Invalid food ID for ingredient at index ${invalidIndexes.join(', ')}`);
  }

  // Ensure all numeric fields are numbers
  const servings = Number(data.servings) || 1;
  const preparationTime = Number(data.preparationTime) || 0;
  const caloriesPerServing = Number(data.caloriesPerServing) || 0;
  const proteinPerServing = Number(data.proteinPerServing) || 0;
  const fatPerServing = Number(data.fatPerServing) || 0;
  const carbsPerServing = Number(data.carbsPerServing) || 0;

  const mapped: UpdateRecipeRequestDTO = {
    name: data.name.trim(),
    description: data.description.trim(),
    instructions: data.instructions.trim(),
    ingredients: validIngredients.map(ingredient => ({
      id: 0, // Let backend assign
      recipeId: 0, // Let backend assign
      foodId: ingredient.foodId,
      foodName: ingredient.foodName.trim(),
      amount: ingredient.amount
    })),
    servings,
    preparationTime,
    recommendedFor: data.recommendedFor || "MAINTAIN_WEIGHT",
    caloriesPerServing,
    proteinPerServing,
    fatPerServing,
    carbsPerServing,
  };

  return mapped;
}

export const useRecipes = () => {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<RecipeDTO[]>([]);
  const [userRecipes, setUserRecipes] = useState<RecipeDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllRecipes = useCallback(async () => {
    try {
      setLoading(true);
      const recipesData = await recipeService.getAllRecipes();
      setRecipes(recipesData);
      setError(null);
    } catch (err: any) {
      setError('Грешка при зареждане на рецептите');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserRecipes = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const userRecipesData = await recipeService.getUserRecipes(user.id);
      setUserRecipes(userRecipesData);
      setError(null);
    } catch (err: any) {
      setError('Грешка при зареждане на вашите рецепти');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const createRecipe = useCallback(async (recipeData: CreateRecipeFormData) => {
    try {
      setLoading(true);
      if (!user?.id) throw new Error('No user');
      const mapped = mapCreateRecipeFormToRecipeDTO(recipeData, user.id);
      const newRecipe = await recipeService.createRecipe(mapped);
      setUserRecipes(prev => [...prev, newRecipe]);
      setError(null);
      return newRecipe;
    } catch (err: any) {
      // Handle specific error messages
      let errorMessage = 'Грешка при създаване на рецепта';
      
      if (err.message?.includes('Invalid food ID for ingredient at index')) {
        errorMessage = 'Моля, изберете валидна храна за всички съставки';
      } else if (err.response?.data?.message?.includes('Food not found with ID')) {
        errorMessage = 'Една или повече храни не са намерени. Моля, изберете от списъка.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data) {
        errorMessage = typeof err.response.data === 'string' ? err.response.data : 'Грешка при създаване на рецепта';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const updateRecipe = useCallback(async (id: number, recipeData: CreateRecipeFormData) => {
    try {
      setLoading(true);
      const mapped = mapCreateRecipeFormToUpdateRecipeDTO(recipeData);
      const updatedRecipe = await recipeService.updateRecipe(id, mapped);
      setUserRecipes(prev => prev.map(recipe => recipe.id === id ? updatedRecipe : recipe));
      setRecipes(prev => prev.map(recipe => recipe.id === id ? updatedRecipe : recipe));
      setError(null);
      return updatedRecipe;
    } catch (err: any) {
      // Handle specific error messages
      let errorMessage = 'Грешка при обновяване на рецепта';
      
      if (err.message?.includes('Invalid food ID for ingredient at index')) {
        errorMessage = 'Моля, изберете валидна храна за всички съставки';
      } else if (err.response?.data?.message?.includes('Food not found with ID')) {
        errorMessage = 'Една или повече храни не са намерени. Моля, изберете от списъка.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data) {
        errorMessage = typeof err.response.data === 'string' ? err.response.data : 'Грешка при обновяване на рецепта';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteRecipe = useCallback(async (id: number) => {
    try {
      setLoading(true);
      await recipeService.deleteRecipe(id);
      setUserRecipes(prev => prev.filter(recipe => recipe.id !== id));
      setRecipes(prev => prev.filter(recipe => recipe.id !== id));
      setError(null);
    } catch (err: any) {
      setError('Грешка при изтриване на рецепта');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const searchRecipes = useCallback(async (query: string) => {
    try {
      setLoading(true);
      const searchResults = await recipeService.searchRecipes(query);
      setError(null);
      return searchResults;
    } catch (err: any) {
      setError('Грешка при търсене на рецепти');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const findRecipesByNutrition = useCallback(async (minCalories: number, maxCalories: number, minProtein: number) => {
    try {
      setLoading(true);
      const nutritionRecipes = await recipeService.findRecipesByNutrition(minCalories, maxCalories, minProtein);
      setError(null);
      return nutritionRecipes;
    } catch (err: any) {
      setError('Грешка при зареждане на рецепти по хранителни стойности');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getRecipesByGoal = useCallback(async (goal: "LOSE_WEIGHT" | "MAINTAIN_WEIGHT" | "GAIN_WEIGHT") => {
    try {
      setLoading(true);
      const goalRecipes = await recipeService.getRecipesByGoal(goal);
      setError(null);
      return goalRecipes;
    } catch (err: any) {
      setError('Грешка при зареждане на рецепти по цел');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getRecipeById = useCallback(async (id: number) => {
    try {
      setLoading(true);
      const recipe = await recipeService.getRecipeById(id);
      setError(null);
      return recipe;
    } catch (err: any) {
      setError('Грешка при зареждане на рецепта');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const testRecipe = useCallback(async (id: number) => {
    try {
      setLoading(true);
      const result = await recipeService.testRecipe(id);
      setError(null);
      return result;
    } catch (err: any) {
      setError('Грешка при тестване на рецепта');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllRecipes();
    fetchUserRecipes();
  }, [fetchAllRecipes, fetchUserRecipes]);

  return {
    recipes,
    userRecipes,
    loading,
    error,
    fetchAllRecipes,
    fetchUserRecipes,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    searchRecipes,
    findRecipesByNutrition,
    getRecipesByGoal,
    getRecipeById,
    testRecipe,
  };
}; 