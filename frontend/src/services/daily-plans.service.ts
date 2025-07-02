import axios from '../config/axios.config';
import { API_CONFIG } from '../config/api.config';
import { DailyPlanDTO, DailyPlanGenerationConfigDTO } from '../types/program.types';

const getUserDailyPlans = (userId: number) =>
  axios.get<DailyPlanDTO[]>(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DAILY_PLANS.GET_USER_PLANS(userId)}`).then(r => r.data);

const getActiveDailyPlan = (userId: number) =>
  axios.get<DailyPlanDTO>(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DAILY_PLANS.GET_ACTIVE_PLAN(userId)}`).then(r => r.data);

const getDailyPlan = (id: number) =>
  axios.get<DailyPlanDTO>(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DAILY_PLANS.GET_PLAN(id)}`).then(r => r.data);

const createDailyPlan = (planData: Partial<DailyPlanDTO>) =>
  axios.post<DailyPlanDTO>(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DAILY_PLANS.CREATE}`, planData).then(r => r.data);

const updateDailyPlan = (id: number, planData: Partial<DailyPlanDTO>) =>
  axios.put<DailyPlanDTO>(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DAILY_PLANS.UPDATE(id)}`, planData).then(r => r.data);

const deleteDailyPlan = (id: number) =>
  axios.delete(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DAILY_PLANS.DELETE(id)}`).then(r => r.data);

const generateAutomaticDailyPlan = (userId: number) =>
  axios.post<DailyPlanDTO>(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DAILY_PLANS.GENERATE(userId)}`).then(r => r.data);

const generateAutomaticDailyPlanWithConfig = (userId: number, config: DailyPlanGenerationConfigDTO) =>
  axios.post<DailyPlanDTO>(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DAILY_PLANS.GENERATE_WITH_CONFIG(userId)}`, config).then(r => r.data);

const deactivateAllUserPlans = (userId: number) =>
  axios.post(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DAILY_PLANS.DEACTIVATE_ALL(userId)}`).then(r => r.data);

const dailyPlansService = {
  getUserDailyPlans,
  getActiveDailyPlan,
  getDailyPlan,
  createDailyPlan,
  updateDailyPlan,
  deleteDailyPlan,
  generateAutomaticDailyPlan,
  generateAutomaticDailyPlanWithConfig,
  deactivateAllUserPlans
};

export default dailyPlansService; 