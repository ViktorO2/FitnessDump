import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/auth.context';
import workoutProgressService, { WorkoutProgressDTO } from '../services/workout-progress.service';

export const useWorkoutProgress = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<WorkoutProgressDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const progressData = await workoutProgressService.getUserProgress(user.id);
      setProgress(progressData);
      setError(null);
    } catch (err) {
      setError('Грешка при зареждане на прогреса');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const fetchProgressByDateRange = useCallback(async (start: string, end: string) => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const progressData = await workoutProgressService.getUserProgressByDateRange(user.id, start, end);
      setProgress(progressData);
      setError(null);
    } catch (err) {
      setError('Грешка при зареждане на прогреса по период');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const fetchProgressByProgram = useCallback(async (programId: number) => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const progressData = await workoutProgressService.getUserProgressByProgram(user.id, programId);
      setProgress(progressData);
      setError(null);
    } catch (err) {
      setError('Грешка при зареждане на прогреса по програма');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const fetchProgressByExercise = useCallback(async (exerciseId: number) => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const progressData = await workoutProgressService.getUserExerciseProgress(user.id, exerciseId);
      setProgress(progressData);
      setError(null);
    } catch (err) {
      setError('Грешка при зареждане на прогреса по упражнение');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const saveProgress = useCallback(async (progressData: WorkoutProgressDTO) => {
    try {
      setLoading(true);
      const newProgress = await workoutProgressService.saveProgress(progressData);
      setProgress(prev => [...prev, newProgress]);
      setError(null);
      return newProgress;
    } catch (err) {
      setError('Грешка при запазване на прогреса');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProgress = useCallback(async (id: number, progressData: WorkoutProgressDTO) => {
    try {
      setLoading(true);
      const updatedProgress = await workoutProgressService.updateProgress(id, progressData);
      setProgress(prev => prev.map(prog => prog.id === id ? updatedProgress : prog));
      setError(null);
      return updatedProgress;
    } catch (err) {
      setError('Грешка при обновяване на прогреса');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProgress = useCallback(async (id: number) => {
    try {
      setLoading(true);
      await workoutProgressService.deleteProgress(id);
      setProgress(prev => prev.filter(prog => prog.id !== id));
      setError(null);
    } catch (err) {
      setError('Грешка при изтриване на прогреса');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  return {
    progress,
    loading,
    error,
    fetchProgress,
    fetchProgressByDateRange,
    fetchProgressByProgram,
    fetchProgressByExercise,
    saveProgress,
    updateProgress,
    deleteProgress
  };
}; 