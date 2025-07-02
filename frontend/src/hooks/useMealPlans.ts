import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/auth.context';
import mealPlanService from '../services/meal-plan.service';
import { MealPlanDTO, MealDTO } from '../types/nutrition.types';

export const useMealPlans = () => {
  const { user } = useAuth();
  const [mealPlans, setMealPlans] = useState<MealPlanDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMealPlans = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const mealPlansData = await mealPlanService.getUserMealPlans(user.id);
      setMealPlans(mealPlansData);
      setError(null);
    } catch (err: any) {
      setError('Грешка при зареждане на хранителните планове');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const createMealPlan = useCallback(async (data: MealPlanDTO) => {
    try {
      setLoading(true);
      const newMealPlan = await mealPlanService.createMealPlan(data);
      setMealPlans(prev => [...prev, newMealPlan]);
      setError(null);
      return newMealPlan;
    } catch (err: any) {
      setError('Грешка при създаване на хранителен план');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateMealPlan = useCallback(async (id: number, data: MealPlanDTO) => {
    try {
      setLoading(true);
      const updatedMealPlan = await mealPlanService.updateMealPlan(id, data);
      setMealPlans(prev => prev.map(plan => plan.id === id ? updatedMealPlan : plan));
      setError(null);
      return updatedMealPlan;
    } catch (err: any) {
      setError('Грешка при обновяване на хранителен план');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteMealPlan = useCallback(async (id: number) => {
    try {
      setLoading(true);
      await mealPlanService.deleteMealPlan(id);
      setMealPlans(prev => prev.filter(plan => plan.id !== id));
      setError(null);
    } catch (err: any) {
      setError('Грешка при изтриване на хранителен план');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getMealPlanById = useCallback(async (id: number) => {
    try {
      setLoading(true);
      const mealPlan = await mealPlanService.getMealPlanById(id);
      setError(null);
      return mealPlan;
    } catch (err: any) {
      setError('Грешка при зареждане на хранителен план');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserMealPlansByGoal = useCallback(async (goal: "LOSE_WEIGHT" | "MAINTAIN_WEIGHT" | "GAIN_WEIGHT") => {
    if (!user?.id) return [];
    
    try {
      setLoading(true);
      const mealPlansData = await mealPlanService.getUserMealPlansByGoal(user.id, goal);
      setError(null);
      return mealPlansData;
    } catch (err: any) {
      setError('Грешка при зареждане на хранителни планове по цел');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const getMealPlanNutrition = useCallback(async (id: number) => {
    try {
      setLoading(true);
      const nutritionData = await mealPlanService.getMealPlanNutrition(id);
      setError(null);
      return nutritionData;
    } catch (err: any) {
      setError('Грешка при зареждане на хранителна информация');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getDayTotalCalories = useCallback(async (id: number, dayOfWeek: number) => {
    try {
      setLoading(true);
      const calories = await mealPlanService.getDayTotalCalories(id, dayOfWeek);
      setError(null);
      return calories;
    } catch (err: any) {
      setError('Грешка при зареждане на дневни калории');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Meal operations
  const addMealToDay = useCallback(async (mealPlanId: number, dayOfWeek: number, meal: MealDTO) => {
    try {
      setLoading(true);
      const result = await mealPlanService.addMealToDay(mealPlanId, dayOfWeek, meal);
      setError(null);
      return result;
    } catch (err: any) {
      setError('Грешка при добавяне на хранене към деня');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateMealInDay = useCallback(async (mealPlanId: number, dayOfWeek: number, mealId: number, meal: MealDTO) => {
    try {
      setLoading(true);
      const result = await mealPlanService.updateMealInDay(mealPlanId, dayOfWeek, mealId, meal);
      setError(null);
      return result;
    } catch (err: any) {
      setError('Грешка при обновяване на хранене в деня');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeMealFromDay = useCallback(async (mealPlanId: number, dayOfWeek: number, mealId: number) => {
    try {
      setLoading(true);
      const result = await mealPlanService.removeMealFromDay(mealPlanId, dayOfWeek, mealId);
      setError(null);
      return result;
    } catch (err: any) {
      setError('Грешка при премахване на хранене от деня');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMealPlans();
  }, [fetchMealPlans]);

  return {
    mealPlans,
    loading,
    error,
    fetchMealPlans,
    createMealPlan,
    updateMealPlan,
    deleteMealPlan,
    getMealPlanById,
    getUserMealPlansByGoal,
    getMealPlanNutrition,
    getDayTotalCalories,
    addMealToDay,
    updateMealInDay,
    removeMealFromDay,
  };
}; 