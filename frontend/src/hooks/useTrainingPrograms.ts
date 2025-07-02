import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/auth.context';
import trainingProgramsService from '../services/training-programs.service';
import predefinedProgramsService from '../services/predefined-programs.service';
import { TrainingProgramDTO, PredefinedProgramDTO } from '../types/program.types';

export const useTrainingPrograms = () => {
  const { user } = useAuth();
  const [programs, setPrograms] = useState<TrainingProgramDTO[]>([]);
  const [predefinedPrograms, setPredefinedPrograms] = useState<PredefinedProgramDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrograms = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const programsData = await trainingProgramsService.getUserPrograms(user.id);
      setPrograms(programsData);
      setError(null);
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError('Нямате права за достъп до програмите. Моля, проверете вашите права.');
      } else {
        setError('Грешка при зареждане на програмите');
      }
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const createProgram = useCallback(async (data: TrainingProgramDTO) => {
    if (!user?.id) throw new Error('Потребителят не е автентикиран');
    
    try {
      setLoading(true);
      const newProgram = await trainingProgramsService.createProgram(user.id, data);
      setPrograms(prev => [...prev, newProgram]);
      setError(null);
      return newProgram;
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError('Нямате права за създаване на програми');
      } else {
        setError('Грешка при създаване на програма');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const updateProgram = useCallback(async (id: number, data: TrainingProgramDTO) => {
    try {
      setLoading(true);
      const updatedProgram = await trainingProgramsService.updateProgram(id, data);
      setPrograms(prev => prev.map(prog => prog.id === id ? updatedProgram : prog));
      setError(null);
      return updatedProgram;
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError('Нямате права за обновяване на програми');
      } else {
        setError('Грешка при обновяване на програма');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProgram = useCallback(async (id: number) => {
    try {
      setLoading(true);
      await trainingProgramsService.deleteProgram(id);
      setPrograms(prev => prev.filter(prog => prog.id !== id));
      setError(null);
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError('Нямате права за изтриване на програми');
      } else {
        setError('Грешка при изтриване на програма');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getProgramById = useCallback(async (id: number) => {
    try {
      setLoading(true);
      const program = await trainingProgramsService.getProgramById(id);
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

  const fetchPredefinedPrograms = useCallback(async () => {
    try {
      setLoading(true);
      const predefinedData = await predefinedProgramsService.getAllPrograms();
      setPredefinedPrograms(predefinedData);
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

  const copyProgramToUser = useCallback(async (programId: number) => {
    if (!user?.id) throw new Error('Потребителят не е автентикиран');
    
    try {
      setLoading(true);
      const copiedProgram = await predefinedProgramsService.copyProgramToUser(user.id, programId);
      setPrograms(prev => [...prev, copiedProgram]);
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

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  return {
    programs,
    predefinedPrograms,
    loading,
    error,
    fetchPrograms,
    fetchPredefinedPrograms,
    createProgram,
    updateProgram,
    deleteProgram,
    getProgramById,
    copyProgramToUser
  };
}; 