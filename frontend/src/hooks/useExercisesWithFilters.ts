import { useState, useEffect, useCallback } from 'react';
import { ExerciseDTO } from '../types/exercise.types';
import { useExercises } from './useExercises';

export const useExercisesWithFilters = () => {
  const { exercises, categories, loading, error } = useExercises();
  const [filteredExercises, setFilteredExercises] = useState<ExerciseDTO[]>([]);

  // Филтри
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | "">("");

  // Прилагане на филтри
  useEffect(() => {
    let filtered = exercises;

    // Филтър по категория
    if (selectedCategory !== "") {
      filtered = filtered.filter(ex => ex.categoryId === selectedCategory);
    }

    // Филтър по търсене
    if (searchQuery.trim()) {
      filtered = filtered.filter(ex => 
        ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredExercises(filtered);
  }, [exercises, selectedCategory, searchQuery]);

  // Търсене с debounce
  const handleSearch = useCallback(
    (() => {
      let timeoutId: number;
      return (query: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setSearchQuery(query);
        }, 300);
      };
    })(),
    []
  );

  const handleCategoryFilter = useCallback((categoryId: number | "") => {
    setSelectedCategory(categoryId);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory("");
  }, []);

  const hasActiveFilters = Boolean(searchQuery || selectedCategory !== "");

  const getCategoryName = useCallback((categoryId: number) => {
    return categories.find((cat) => cat.id === categoryId)?.name || "Неизвестна категория";
  }, [categories]);

  return {
    exercises,
    filteredExercises,
    categories,
    loading,
    error,
    searchQuery,
    selectedCategory,
    hasActiveFilters,
    handleSearch,
    handleCategoryFilter,
    clearFilters,
    getCategoryName,
  };
}; 