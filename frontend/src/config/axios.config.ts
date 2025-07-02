import axios from "axios";
import authService from "../services/auth.service";

// Initialize Authorization header on app load
const token = authService.getToken();
if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

axios.interceptors.request.use(
    (config) => {
        const token = authService.getToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        config.headers['Content-Type'] = 'application/json';
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            // For now, just logout on 401 since we don't have refresh token
            authService.logout();
            window.location.href = '/';
            return Promise.reject(error);
        }

        return Promise.reject(error);
    }
);

export default axios;
  