import { useState, useEffect, useCallback } from 'react';
import foodService, { FoodDTO, CreateFoodDTO } from '../services/food.service';

export const useFoods = () => {
  const [foods, setFoods] = useState<FoodDTO[]>([]);
  const [filteredFoods, setFilteredFoods] = useState<FoodDTO[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const fetchFoods = useCallback(async () => {
    try {
      setLoading(true);
      const data = await foodService.getAllFoods();
      setFoods(data);
      setFilteredFoods(data);
      setError(null);
    } catch (err: any) {
      setError('Грешка при зареждане на храните');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await foodService.getCategories();
      setCategories(data);
      setError(null);
    } catch (err: any) {
      setError('Грешка при зареждане на категориите');
    }
  }, []);

  const createFood = useCallback(async (foodData: CreateFoodDTO) => {
    try {
      setLoading(true);
      const newFood = await foodService.createFood(foodData);
      setFoods(prev => [...prev, newFood]);
      setFilteredFoods(prev => [...prev, newFood]);
      setError(null);
      return newFood;
    } catch (err: any) {
      setError('Грешка при създаване на храна');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createFoodAlternative = useCallback(async (foodData: CreateFoodDTO) => {
    try {
      setLoading(true);
      const newFood = await foodService.createFoodAlternative(foodData);
      setFoods(prev => [...prev, newFood]);
      setFilteredFoods(prev => [...prev, newFood]);
      setError(null);
      return newFood;
    } catch (err: any) {
      setError('Грешка при създаване на храна');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateFood = useCallback(async (id: number, foodData: CreateFoodDTO) => {
    try {
      setLoading(true);
      const updatedFood = await foodService.updateFood(id, foodData);
      setFoods(prev => prev.map(food => food.id === id ? updatedFood : food));
      setFilteredFoods(prev => prev.map(food => food.id === id ? updatedFood : food));
      setError(null);
      return updatedFood;
    } catch (err: any) {
      setError('Грешка при обновяване на храна');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateFoodAlternative = useCallback(async (id: number, foodData: CreateFoodDTO) => {
    try {
      setLoading(true);
      const updatedFood = await foodService.updateFoodAlternative(id, foodData);
      setFoods(prev => prev.map(food => food.id === id ? updatedFood : food));
      setFilteredFoods(prev => prev.map(food => food.id === id ? updatedFood : food));
      setError(null);
      return updatedFood;
    } catch (err: any) {
      setError('Грешка при обновяване на храна');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteFood = useCallback(async (id: number) => {
    try {
      setLoading(true);
      await foodService.deleteFood(id);
      setFoods(prev => prev.filter(food => food.id !== id));
      setFilteredFoods(prev => prev.filter(food => food.id !== id));
      setError(null);
    } catch (err: any) {
      setError('Грешка при изтриване на храна');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const searchFoods = useCallback(async (query: string) => {
    if (!query.trim()) {
      setFilteredFoods(foods);
      return;
    }

    try {
      setLoading(true);
      const results = await foodService.searchFoods(query);
      setFilteredFoods(results);
      setError(null);
    } catch (err: any) {
      setError('Грешка при търсене на храни');
    } finally {
      setLoading(false);
    }
  }, [foods]);

  const getFoodsByCategory = useCallback(async (category: string) => {
    try {
      setLoading(true);
      const results = await foodService.getFoodsByCategory(category);
      setFilteredFoods(results);
      setSelectedCategory(category);
      setError(null);
    } catch (err: any) {
      setError('Грешка при зареждане на храни по категория');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      searchFoods(query);
    } else {
      setFilteredFoods(foods);
    }
  }, [searchFoods, foods]);

  const handleCategoryFilter = useCallback((category: string) => {
    if (category === '') {
      setFilteredFoods(foods);
      setSelectedCategory('');
    } else {
      getFoodsByCategory(category);
    }
  }, [getFoodsByCategory, foods]);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('');
    setFilteredFoods(foods);
  }, [foods]);

  const hasActiveFilters = searchQuery.trim() !== '' || selectedCategory !== '';

  useEffect(() => {
    fetchFoods();
    fetchCategories();
  }, [fetchFoods, fetchCategories]);

  return {
    foods,
    filteredFoods,
    categories,
    loading,
    error,
    searchQuery,
    selectedCategory,
    hasActiveFilters,
    createFood,
    createFoodAlternative,
    updateFood,
    updateFoodAlternative,
    deleteFood,
    handleSearch,
    handleCategoryFilter,
    clearFilters,
    fetchFoods,
  };
}; 