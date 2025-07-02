import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/auth.context';
import foodHistoryService from '../services/food-history.service';
import { FoodHistoryDTO } from '../services/food-history.service';

export const useNutritionHistory = () => {
  const { user } = useAuth();
  const [foodHistory, setFoodHistory] = useState<FoodHistoryDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFoodHistory = useCallback(async () => {
    try {
      setLoading(true);
      const historyData = await foodHistoryService.getUserFoodHistory();
      setFoodHistory(historyData);
      setError(null);
    } catch (err) {
      setError('Грешка при зареждане на историята на храненията');
    } finally {
      setLoading(false);
    }
  }, []);

  const saveFoodHistory = useCallback(async (foodHistoryData: FoodHistoryDTO) => {
    try {
      setLoading(true);
      const newHistory = await foodHistoryService.saveFoodHistory(foodHistoryData);
      setFoodHistory(prev => [...prev, newHistory]);
      setError(null);
      return newHistory;
    } catch (err) {
      setError('Грешка при запазване на историята');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteFoodHistory = useCallback(async (id: number) => {
    try {
      setLoading(true);
      await foodHistoryService.deleteFoodHistory(id);
      setFoodHistory(prev => prev.filter(item => item.id !== id));
      setError(null);
    } catch (err) {
      setError('Грешка при изтриване на историята');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getFoodHistoryById = useCallback(async (id: number) => {
    try {
      setLoading(true);
      const historyItem = await foodHistoryService.getFoodHistoryById(id);
      setError(null);
      return historyItem;
    } catch (err) {
      setError('Грешка при зареждане на историята');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFoodHistory();
  }, [fetchFoodHistory]);

  return {
    foodHistory,
    loading,
    error,
    fetchFoodHistory,
    saveFoodHistory,
    deleteFoodHistory,
    getFoodHistoryById
  };
}; 