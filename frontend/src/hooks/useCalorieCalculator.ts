import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/auth.context';
import calorieCalculatorService from '../services/calorie-calculator.service';
import { CalorieCalculatorRequestDTO, CalorieCalculatorResponseDTO } from '../types/personal-settings.types';
import { MealPlanGenerationConfigDTO } from '../types/program.types';

export const useCalorieCalculator = () => {
  const { user, token, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateNutrition = useCallback(async (data: CalorieCalculatorRequestDTO): Promise<CalorieCalculatorResponseDTO | null> => {
    if (!isAuthenticated || !user?.id) {
      setError('Трябва да сте влезли в профила си');
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await calorieCalculatorService.calculateNutrition(data);
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Грешка при изчисляване на калориите';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.id]);

  const calculateAndSaveToPersonalSettings = useCallback(async (data: CalorieCalculatorRequestDTO): Promise<CalorieCalculatorResponseDTO | null> => {
    if (!isAuthenticated || !user?.id) {
      setError('Трябва да сте влезли в профила си');
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await calorieCalculatorService.calculateAndSaveToPersonalSettings(user.id, data);
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Грешка при запазване на настройките';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.id]);

  const generateTrainingProgram = useCallback(async (data: CalorieCalculatorRequestDTO) => {
    if (!isAuthenticated || !user?.id) {
      setError('Трябва да сте влезли в профила си');
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await calorieCalculatorService.generateTrainingProgram(user.id, data);
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Грешка при генериране на тренировъчна програма';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.id]);

  const generateMealPlan = useCallback(async (data: CalorieCalculatorRequestDTO) => {
    if (!isAuthenticated || !user?.id) {
      setError('Трябва да сте влезли в профила си');
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await calorieCalculatorService.generateMealPlan(user.id, data);
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Грешка при генериране на хранителен план';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.id]);

  const generateSmartMealPlan = useCallback(async (data: CalorieCalculatorRequestDTO, includeWorkoutDays: boolean = true) => {
    if (!isAuthenticated || !user?.id) {
      setError('Трябва да сте влезли в профила си');
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await calorieCalculatorService.generateSmartMealPlan(user.id, data, includeWorkoutDays);
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Грешка при генериране на умен хранителен план';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.id]);

  const generateSmartMealPlanWithConfig = useCallback(async (data: CalorieCalculatorRequestDTO, config: MealPlanGenerationConfigDTO) => {
    if (!isAuthenticated || !user?.id) {
      setError('Трябва да сте влезли в профила си');
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await calorieCalculatorService.generateSmartMealPlanWithConfig(user.id, data, config);
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Грешка при генериране на умен хранителен план с конфигурация';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.id]);

  const generateMealPlanWithConfig = useCallback(async (data: CalorieCalculatorRequestDTO, config: MealPlanGenerationConfigDTO) => {
    if (!isAuthenticated || !user?.id) {
      setError('Трябва да сте влезли в профила си');
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await calorieCalculatorService.generateMealPlanWithConfig(user.id, data, config);
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Грешка при генериране на хранителен план с конфигурация';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.id]);

  const generateDailyPlan = useCallback(async (data: CalorieCalculatorRequestDTO) => {
    if (!isAuthenticated || !user?.id) {
      setError('Трябва да сте влезли в профила си');
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await calorieCalculatorService.generateDailyPlan(user.id, data);
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Грешка при генериране на дневен план';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.id]);

  return {
    calculateNutrition,
    calculateAndSaveToPersonalSettings,
    generateTrainingProgram,
    generateMealPlan,
    generateSmartMealPlan,
    generateSmartMealPlanWithConfig,
    generateMealPlanWithConfig,
    generateDailyPlan,
    loading,
    error,
    clearError: () => setError(null)
  };
}; 