import axios from '../config/axios.config';
import { API_CONFIG } from '../config/api.config';

export interface TrainingSessionDTO {
  userId: number;
  name: string;
  description?: string;
  date: string;
  durationMinutes: number;
}

const getUserTrainingSessions = (userId: number) =>
  axios.get<TrainingSessionDTO[]>(`${API_CONFIG.BASE_URL}/training-sessions/user/${userId}`).then(r => r.data);

const getTrainingSessionById = (id: number) =>
  axios.get<TrainingSessionDTO>(`${API_CONFIG.BASE_URL}/training-sessions/${id}`).then(r => r.data);

const saveTrainingSession = (userId: number, data: TrainingSessionDTO) =>
  axios.post<TrainingSessionDTO>(`${API_CONFIG.BASE_URL}/training-sessions/${userId}`, data).then(r => r.data);

const deleteTrainingSession = (id: number) =>
  axios.delete(`${API_CONFIG.BASE_URL}/training-sessions/${id}`).then(r => r.data);

const trainingSessionsService = {
  getUserTrainingSessions,
  getTrainingSessionById,
  saveTrainingSession,
  deleteTrainingSession,
};

export default trainingSessionsService; 