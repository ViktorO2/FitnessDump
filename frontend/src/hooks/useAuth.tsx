import { useState, useEffect } from "react";
import authService from "../services/auth.service";
import {
  User,
  LoginRequest,
  RegisterRequest,
  UpdateProfileDTO,
  ChangePasswordDTO,
} from "../types/auth.types";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const currentToken = authService.getToken();
      const currentUser = authService.getUser();
      const authenticated = authService.isAuthenticated();

      setToken(currentToken);
      setUser(currentUser);
      setIsAuthenticated(authenticated);
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    setLoading(true);
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      setToken(response.token);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    setLoading(true);
    try {
      await authService.register(data);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
    }
  };

  const updateProfile = async (data: UpdateProfileDTO) => {
    try {
      await authService.updateProfile(data);
      // Обновяваме user данните след успешно обновяване
      if (user) {
        setUser({
          ...user,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
        });
      }
    } catch (error) {
      throw error;
    }
  };

  const changePassword = async (data: ChangePasswordDTO) => {
    try {
      await authService.changePassword(data);
    } catch (error) {
      throw error;
    }
  };

  const refreshToken = async () => {
    const currentRefreshToken = authService.getRefreshToken();
    if (!currentRefreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      const response = await authService.refreshToken(currentRefreshToken);
      setUser(response.user);
      setToken(response.token);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      // Ако refresh token е невалиден, logout-ваме потребителя
      logout();
      throw error;
    }
  };

  const getUserById = async (id: number) => {
    try {
      const userData = await authService.getUserById(id);
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const validateToken = async (token: string) => {
    try {
      return await authService.validateToken(token);
    } catch (error) {
      return false;
    }
  };

  return {
    isAuthenticated,
    user,
    loading,
    token,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    refreshToken,
    getUserById,
    validateToken,
  };
};
