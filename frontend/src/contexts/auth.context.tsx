import React, { createContext, useContext, useState, useEffect } from "react";
import {
  AuthResponse,
  User,
  LoginRequest,
  RegisterRequest,
  UpdateProfileDTO,
  ChangePasswordDTO,
} from "../types/auth.types";
import authService from "../services/auth.service";

interface AuthContextType {
  user: User | null;
  token: string | null;
  userId: number | null;
  isAuthenticated: boolean;
  loading: boolean;
  setAuth: (data: AuthResponse) => void;
  login: (credentials: LoginRequest) => Promise<AuthResponse>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  updateProfile: (data: UpdateProfileDTO) => Promise<void>;
  changePassword: (data: ChangePasswordDTO) => Promise<void>;
  refreshToken: () => Promise<AuthResponse>;
  getUserById: (id: number) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [auth, setAuthState] = useState<AuthResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        // Проверяваме за запазени auth данни при зареждане
        const currentToken = authService.getToken();
        const currentUser = authService.getUser();
        const currentRefreshToken = authService.getRefreshToken();

        if (currentToken && currentUser) {
          setAuthState({
            token: currentToken,
            refreshToken: currentRefreshToken || "",
            user: currentUser,
          });
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        // Clear corrupted data
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const setAuth = (data: AuthResponse) => {
    setAuthState(data);
  };

  const login = async (credentials: LoginRequest) => {
    setLoading(true);
    try {
      const response = await authService.login(credentials);
      setAuth(response);
      return response;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    setLoading(true);
    try {
      await authService.register(data);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setAuthState(null);
  };

  const updateProfile = async (data: UpdateProfileDTO) => {
    await authService.updateProfile(data);
    // Обновяваме user данните след успешно обновяване
    if (auth?.user) {
      setAuthState({
        ...auth,
        user: {
          ...auth.user,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
        },
      });
    }
  };

  const changePassword = async (data: ChangePasswordDTO) => {
    await authService.changePassword(data);
  };

  const refreshToken = async () => {
    const currentRefreshToken = authService.getRefreshToken();
    if (!currentRefreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      const response = await authService.refreshToken(currentRefreshToken);
      setAuth(response);
      return response;
    } catch (error) {
      logout();
      throw error;
    }
  };

  const getUserById = async (id: number) => {
    return await authService.getUserById(id);
  };

  return (
    <AuthContext.Provider
      value={{
        user: auth?.user || null,
        token: auth?.token || null,
        userId: auth?.user?.id || null,
        isAuthenticated: !!auth?.token,
        loading,
        setAuth,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        refreshToken,
        getUserById,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
