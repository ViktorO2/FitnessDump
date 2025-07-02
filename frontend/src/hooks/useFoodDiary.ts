import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/auth.context';
import foodDiaryService from '../services/food-diary.service';
import { FoodDiaryEntryDTO, CreateFoodDiaryEntryDTO, DailyNutritionStats } from '../types/nutrition.types';

export const useFoodDiary = () => {
  const { user } = useAuth();
  const [diaryEntries, setDiaryEntries] = useState<FoodDiaryEntryDTO[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyNutritionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDiaryEntries = useCallback(async (date: string) => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const entries = await foodDiaryService.getUserFoodDiary(user.id, date);
      setDiaryEntries(entries);
      setError(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Грешка при зареждане на дневника';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const fetchDailyStats = useCallback(async (date: string) => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const stats = await foodDiaryService.getDailyNutritionSummary(user.id, date);
      setDailyStats(stats);
      setError(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Грешка при зареждане на дневната статистика';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const addDiaryEntry = useCallback(async (entryData: CreateFoodDiaryEntryDTO) => {
    if (!user?.id) throw new Error('Потребителят не е автентикиран');
    
    try {
      setLoading(true);
      const newEntry = await foodDiaryService.addFoodToDiary(entryData);
      setDiaryEntries(prev => [...prev, newEntry]);
      setError(null);
      return newEntry;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Грешка при добавяне на храна';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const updateDiaryEntry = useCallback(async (id: number, entryData: Partial<CreateFoodDiaryEntryDTO>) => {
    try {
      setLoading(true);
      const updatedEntry = await foodDiaryService.updateFoodDiaryEntry(id, entryData);
      setDiaryEntries(prev => prev.map(entry => entry.id === id ? updatedEntry : entry));
      setError(null);
      return updatedEntry;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Грешка при обновяване на запис';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteDiaryEntry = useCallback(async (id: number) => {
    try {
      setLoading(true);
      await foodDiaryService.deleteFoodDiaryEntry(id);
      setDiaryEntries(prev => prev.filter(entry => entry.id !== id));
      setError(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Грешка при изтриване на запис';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadDayData = useCallback(async (date: string) => {
    await Promise.all([
      fetchDiaryEntries(date),
      fetchDailyStats(date)
    ]);
  }, [fetchDiaryEntries, fetchDailyStats]);

  return {
    diaryEntries,
    dailyStats,
    loading,
    error,
    fetchDiaryEntries,
    fetchDailyStats,
    addDiaryEntry,
    updateDiaryEntry,
    deleteDiaryEntry,
    loadDayData,
  };
}; 