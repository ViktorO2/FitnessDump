import axios from "axios";
import authService from "../services/auth.service";

axios.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  config.headers["Content-Type"] = "application/json";
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await authService.refreshToken();
        return axios(originalRequest);
      } catch (e) {
        authService.logout();
      }
    }

    return Promise.reject(error);
  }
);
