import { useState, useEffect, useCallback } from 'react';
import { PredefinedProgramDTO } from '../types/program.types';
import predefinedProgramsService from '../services/predefined-programs.service';
import { useAuth } from '../contexts/auth.context';

export const usePredefinedPrograms = () => {
  const { user } = useAuth();
  const [predefinedPrograms, setPredefinedPrograms] = useState<PredefinedProgramDTO[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<PredefinedProgramDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Филтри
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGoal, setSelectedGoal] = useState<string>("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");

  const fetchPredefinedPrograms = useCallback(async () => {
    try {
      setLoading(true);
      const data = await predefinedProgramsService.getAllPrograms();
      setPredefinedPrograms(data);
      setError(null);
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError('Нямате права за достъп до готовите програми');
      } else {
        setError('Грешка при зареждане на готовите програми');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const getProgramsByGoal = useCallback(async (goal: "MUSCLE_GAIN" | "WEIGHT_LOSS" | "ENDURANCE" | "STRENGTH" | "FLEXIBILITY") => {
    try {
      setLoading(true);
      const data = await predefinedProgramsService.getProgramsByGoal(goal);
      setPredefinedPrograms(data);
      setError(null);
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError('Нямате права за достъп до готовите програми');
      } else {
        setError('Грешка при зареждане на готовите програми по цел');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const getProgramsByDifficulty = useCallback(async (difficultyLevel: "BEGINNER" | "INTERMEDIATE" | "ADVANCED") => {
    try {
      setLoading(true);
      const data = await predefinedProgramsService.getProgramsByDifficulty(difficultyLevel);
      setPredefinedPrograms(data);
      setError(null);
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError('Нямате права за достъп до готовите програми');
      } else {
        setError('Грешка при зареждане на готовите програми по трудност');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const getProgramById = useCallback(async (id: number) => {
    try {
      setLoading(true);
      const program = await predefinedProgramsService.getProgramById(id);
      setError(null);
      return program;
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError('Нямате права за достъп до програмата');
      } else {
        setError('Грешка при зареждане на програма');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const copyProgramToUser = useCallback(async (programId: number) => {
    if (!user?.id) throw new Error('Потребителят не е автентикиран');
    
    try {
      setLoading(true);
      const copiedProgram = await predefinedProgramsService.copyProgramToUser(user.id, programId);
      setError(null);
      return copiedProgram;
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError('Нямате права за копиране на програми');
      } else {
        setError('Грешка при копиране на програма');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Зареждане на готовите програми при първоначално зареждане
  useEffect(() => {
    fetchPredefinedPrograms();
  }, [fetchPredefinedPrograms]);

  // Прилагане на филтри
  useEffect(() => {
    let filtered = predefinedPrograms;

    // Филтър по цел
    if (selectedGoal !== "") {
      filtered = filtered.filter(program => program.goal === selectedGoal);
    }

    // Филтър по трудност
    if (selectedDifficulty !== "") {
      filtered = filtered.filter(program => program.difficultyLevel === selectedDifficulty);
    }

    // Филтър по търсене
    if (searchQuery.trim()) {
      filtered = filtered.filter(program => 
        program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredPrograms(filtered);
  }, [predefinedPrograms, selectedGoal, selectedDifficulty, searchQuery]);

  const handleCopyProgram = useCallback(async (program: PredefinedProgramDTO) => {
    try {
      await copyProgramToUser(program.id);
    } catch (err) {
      // Error handling is done in the hook
    }
  }, [copyProgramToUser]);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedGoal("");
    setSelectedDifficulty("");
  }, []);

  const hasActiveFilters = Boolean(searchQuery || selectedGoal !== "" || selectedDifficulty !== "");

  return {
    predefinedPrograms,
    filteredPrograms,
    loading,
    error,
    searchQuery,
    selectedGoal,
    selectedDifficulty,
    hasActiveFilters,
    setSearchQuery,
    setSelectedGoal,
    setSelectedDifficulty,
    fetchPredefinedPrograms,
    getProgramsByGoal,
    getProgramsByDifficulty,
    getProgramById,
    handleCopyProgram,
    clearFilters,
  };
}; 