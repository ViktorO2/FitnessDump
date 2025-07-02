import axios from '../config/axios.config';
import { API_CONFIG } from '../config/api.config';
import { UserProfile, UserStats, ProgressData } from '../types/dashboard.types';

const getProfile = () => 
  axios.get<UserProfile>(`${API_CONFIG.BASE_URL}/dashboard/profile`).then(r => r.data);

const getUserStats = (userId: number) =>
  axios.get<UserStats>(`${API_CONFIG.BASE_URL}/dashboard/stats/${userId}`).then(r => r.data);

const getProgressData = (userId: number, period: string) =>
  axios.get<ProgressData>(`${API_CONFIG.BASE_URL}/dashboard/progress/${userId}`, {
    params: { period }
  }).then(r => r.data);

const getRecentActivities = (userId: number) =>
  axios.get(`${API_CONFIG.BASE_URL}/dashboard/activities/${userId}`).then(r => r.data);

const getNutritionSummary = (userId: number, date: string) =>
  axios.get(`${API_CONFIG.BASE_URL}/dashboard/nutrition/${userId}`, {
    params: { date }
  }).then(r => r.data);

const dashboardService = {
  getProfile,
  getUserStats,
  getProgressData,
  getRecentActivities,
  getNutritionSummary,
};

export default dashboardService; 