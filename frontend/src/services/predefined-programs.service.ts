import axios from '../config/axios.config';
import { API_CONFIG } from '../config/api.config';
import { PredefinedProgramDTO } from '../types/program.types';

const getAllPrograms = () =>
  axios.get<PredefinedProgramDTO[]>(`${API_CONFIG.BASE_URL}/predefined-programs`).then(r => r.data);

const getProgramById = (id: number) =>
  axios.get<PredefinedProgramDTO>(`${API_CONFIG.BASE_URL}/predefined-programs/${id}`).then(r => r.data);

const getProgramsByGoal = (goal: "MUSCLE_GAIN" | "WEIGHT_LOSS" | "ENDURANCE" | "STRENGTH" | "FLEXIBILITY") =>
  axios.get<PredefinedProgramDTO[]>(`${API_CONFIG.BASE_URL}/predefined-programs/by-goal/${goal}`).then(r => r.data);

const getProgramsByDifficulty = (difficultyLevel: "BEGINNER" | "INTERMEDIATE" | "ADVANCED") =>
  axios.get<PredefinedProgramDTO[]>(`${API_CONFIG.BASE_URL}/predefined-programs/by-difficulty/${difficultyLevel}`).then(r => r.data);

const copyProgramToUser = (userId: number, programId: number) =>
  axios.post(`${API_CONFIG.BASE_URL}/predefined-programs/copy/${programId}/to-user/${userId}`).then(r => r.data);

const predefinedProgramsService = {
  getAllPrograms,
  getProgramById,
  getProgramsByGoal,
  getProgramsByDifficulty,
  copyProgramToUser,
};

export default predefinedProgramsService; 