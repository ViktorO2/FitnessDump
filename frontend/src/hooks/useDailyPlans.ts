import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/auth.context';
import dailyPlansService from '../services/daily-plans.service';
import { DailyPlanDTO, DailyPlanGenerationConfigDTO } from '../types/program.types';

export const useDailyPlans = () => {
  const { user, token, isAuthenticated } = useAuth();
  const [dailyPlans, setDailyPlans] = useState<DailyPlanDTO[]>([]);
  const [activeDailyPlan, setActiveDailyPlan] = useState<DailyPlanDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDailyPlans = useCallback(async () => {
    if (!isAuthenticated || !user?.id) {
      setError('Трябва да сте влезли в профила си');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const [plansData, activePlanData] = await Promise.all([
        dailyPlansService.getUserDailyPlans(user.id),
        dailyPlansService.getActiveDailyPlan(user.id).catch(() => null)
      ]);
      setDailyPlans(plansData);
      setActiveDailyPlan(activePlanData);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Грешка при зареждане на дневните планове';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.id]);

  const createDailyPlan = useCallback(async (data: Partial<DailyPlanDTO>) => {
    if (!isAuthenticated || !user?.id) {
      setError('Трябва да сте влезли в профила си');
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      const newPlan = await dailyPlansService.createDailyPlan({ 
        ...data, 
        userId: user.id,
        id: 0, // Will be set by backend
        active: data.active ?? false
      } as DailyPlanDTO);
      setDailyPlans(prev => [...prev, newPlan]);
      return newPlan;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Грешка при създаване на дневен план';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.id]);

  const updateDailyPlan = useCallback(async (id: number, data: Partial<DailyPlanDTO>) => {
    try {
      setLoading(true);
      setError(null);
      const updatedPlan = await dailyPlansService.updateDailyPlan(id, data as DailyPlanDTO);
      setDailyPlans(prev => prev.map(plan => plan.id === id ? updatedPlan : plan));
      if (activeDailyPlan?.id === id) {
        setActiveDailyPlan(updatedPlan);
      }
      return updatedPlan;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Грешка при обновяване на дневен план';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [activeDailyPlan?.id]);

  const deleteDailyPlan = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await dailyPlansService.deleteDailyPlan(id);
      setDailyPlans(prev => prev.filter(plan => plan.id !== id));
      if (activeDailyPlan?.id === id) {
        setActiveDailyPlan(null);
      }
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Грешка при изтриване на дневен план';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [activeDailyPlan?.id]);

  const generateAutomaticDailyPlan = useCallback(async () => {
    if (!isAuthenticated || !user?.id) {
      setError('Трябва да сте влезли в профила си');
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      const newPlan = await dailyPlansService.generateAutomaticDailyPlan(user.id);
      setDailyPlans(prev => [...prev, newPlan]);
      return newPlan;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Грешка при генериране на автоматичен дневен план';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.id]);

  const generateAutomaticDailyPlanWithConfig = useCallback(async (config: DailyPlanGenerationConfigDTO) => {
    if (!isAuthenticated || !user?.id) {
      setError('Трябва да сте влезли в профила си');
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      const newPlan = await dailyPlansService.generateAutomaticDailyPlanWithConfig(user.id, config);
      setDailyPlans(prev => [...prev, newPlan]);
      return newPlan;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Грешка при генериране на автоматичен дневен план с конфигурация';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.id]);

  const deactivateAllUserPlans = useCallback(async () => {
    if (!isAuthenticated || !user?.id) {
      setError('Трябва да сте влезли в профила си');
      return false;
    }

    try {
      setLoading(true);
      setError(null);
      await dailyPlansService.deactivateAllUserPlans(user.id);
      setDailyPlans(prev => prev.map(plan => ({ ...plan, active: false })));
      setActiveDailyPlan(null);
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Грешка при деактивиране на плановете';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchDailyPlans();
    }
  }, [fetchDailyPlans, isAuthenticated, user?.id]);

  return {
    dailyPlans,
    activeDailyPlan,
    loading,
    error,
    createDailyPlan,
    updateDailyPlan,
    deleteDailyPlan,
    generateAutomaticDailyPlan,
    generateAutomaticDailyPlanWithConfig,
    deactivateAllUserPlans,
    refetch: fetchDailyPlans,
    clearError: () => setError(null)
  };
}; 