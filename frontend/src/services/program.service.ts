import axios from "axios";
import { API_CONFIG } from "../config/api.config";
import { TrainingProgramDTO } from "../types/program.types";

const getUserPrograms = (userId: number) =>
  axios.get<TrainingProgramDTO[]>(`${API_CONFIG.BASE_URL}/training-programs/user/${userId}`).then(r => r.data);

const getProgramById = (id: number) =>
  axios.get<TrainingProgramDTO>(`${API_CONFIG.BASE_URL}/training-programs/${id}`).then(r => r.data);

const createProgram = (userId: number, data: TrainingProgramDTO) =>
  axios.post<TrainingProgramDTO>(`${API_CONFIG.BASE_URL}/training-programs/${userId}`, data).then(r => r.data);

const updateProgram = (id: number, data: TrainingProgramDTO) =>
  axios.put<TrainingProgramDTO>(`${API_CONFIG.BASE_URL}/training-programs/${id}`, data).then(r => r.data);

const deleteProgram = (id: number) =>
  axios.delete(`${API_CONFIG.BASE_URL}/training-programs/${id}`).then(r => r.data);

const programService = {
  getUserPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram
};

export default programService; 