import axios from "axios";
import { API_CONFIG } from "../config/api.config";
import { PersonalSettings, CalorieCalculatorRequestDTO, CalorieCalculatorResponseDTO } from "../types/personal-settings.types";
import { User } from "../types/auth.types";

const getPersonalSettings = (userId: number) =>
  axios.get<PersonalSettings>(`${API_CONFIG.BASE_URL}/personal-settings`, { params: { userId } }).then(r => r.data);

const savePersonalSettings = (data: PersonalSettings) =>
  axios.post(`${API_CONFIG.BASE_URL}/personal-settings`, data).then(r => r.data);

const calculatePersonalSettings = (data: CalorieCalculatorRequestDTO) =>
  axios.post<CalorieCalculatorResponseDTO>(`${API_CONFIG.BASE_URL}/personal-settings/calculate`, data).then(r => r.data);

const getUser = (userId: number) =>
  axios.get<User>(`${API_CONFIG.BASE_URL}/personal-settings/getUser`, { params: { userId } }).then(r => r.data);

const checkPersonalSettings = (userId: number) =>
  axios.get<boolean>(`${API_CONFIG.BASE_URL}/personal-settings/check`, { params: { userId } }).then(r => r.data);

const getPersonalSettingsById = (settingsId: number) =>
  axios.get<PersonalSettings>(`${API_CONFIG.BASE_URL}/personal-settings/${settingsId}`).then(r => r.data);

const updatePersonalSettingsById = (settingsId: number, data: PersonalSettings) =>
  axios.put(`${API_CONFIG.BASE_URL}/personal-settings/${settingsId}`, data).then(r => r.data);

const personalSettingsService = {
  getPersonalSettings,
  savePersonalSettings,
  calculatePersonalSettings,
  getUser,
  checkPersonalSettings,
  getPersonalSettingsById,
  updatePersonalSettingsById,
};

export default personalSettingsService; 