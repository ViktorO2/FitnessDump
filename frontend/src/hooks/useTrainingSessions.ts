import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/auth.context';
import trainingSessionsService, { TrainingSessionDTO } from '../services/training-sessions.service';

export const useTrainingSessions = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<TrainingSessionDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const sessionsData = await trainingSessionsService.getUserTrainingSessions(user.id);
      setSessions(sessionsData);
      setError(null);
    } catch (err) {
      setError('Грешка при зареждане на сесиите');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const createSession = useCallback(async (sessionData: TrainingSessionDTO) => {
    if (!user?.id) throw new Error('Потребителят не е автентикиран');
    
    try {
      setLoading(true);
      const newSession = await trainingSessionsService.saveTrainingSession(user.id, sessionData);
      setSessions(prev => [...prev, newSession]);
      setError(null);
      return newSession;
    } catch (err) {
      setError('Грешка при създаване на сесия');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const deleteSession = useCallback(async (id: number) => {
    try {
      setLoading(true);
      await trainingSessionsService.deleteTrainingSession(id);
      setSessions(prev => prev.filter(session => session.userId !== id));
      setError(null);
    } catch (err) {
      setError('Грешка при изтриване на сесия');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getSessionById = useCallback(async (id: number) => {
    try {
      setLoading(true);
      const session = await trainingSessionsService.getTrainingSessionById(id);
      setError(null);
      return session;
    } catch (err) {
      setError('Грешка при зареждане на сесия');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return {
    sessions,
    loading,
    error,
    fetchSessions,
    createSession,
    deleteSession,
    getSessionById
  };
}; 