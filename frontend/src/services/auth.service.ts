import axios from "axios";
import { API_CONFIG } from "../config/api.config";
import { AuthResponse, LoginRequest, RegisterRequest, User, UpdateProfileDTO, ChangePasswordDTO } from "../types/auth.types";

const AUTH_KEY = "auth";

class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await axios.post<AuthResponse>(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`,
        credentials
      );

      const authData = response.data;
      
      localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${authData.token}`;

      return authData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(data: RegisterRequest): Promise<void> {
    await axios.post(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REGISTER}`, data);
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REFRESH}`,
      { refreshToken }
    );
    return response.data;
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      await axios.post(`${API_CONFIG.BASE_URL}/auth/validate`, { token });
      return true;
    } catch (error) {
      return false;
    }
  }

  async logout(): Promise<void> {
    try {
      await axios.post(`${API_CONFIG.BASE_URL}/auth/logout`);
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      this.clearLocalAuth();
    }
  }

  async updateProfile(data: UpdateProfileDTO): Promise<void> {
    await axios.put(`${API_CONFIG.BASE_URL}/auth/profile`, data);
  }

  async changePassword(data: ChangePasswordDTO): Promise<void> {
    await axios.post(`${API_CONFIG.BASE_URL}/auth/change-password`, data);
  }

  async getUserById(id: number): Promise<User> {
    const response = await axios.get<User>(`${API_CONFIG.BASE_URL}/users/${id}`);
    return response.data;
  }

  getToken(): string | null {
    const authData = localStorage.getItem(AUTH_KEY);
    if (authData) {
      const parsed = JSON.parse(authData);
      return parsed.token;
    }
    return null;
  }

  getRefreshToken(): string | null {
    const authData = localStorage.getItem(AUTH_KEY);
    if (authData) {
      const parsed = JSON.parse(authData);
      return parsed.refreshToken;
    }
    return null;
  }

  getUser(): User | null {
    const authData = localStorage.getItem(AUTH_KEY);
    if (authData) {
      const parsed = JSON.parse(authData);
      return parsed.user;
    }
    return null;
  }

  clearLocalAuth(): void {
    localStorage.removeItem(AUTH_KEY);
    delete axios.defaults.headers.common['Authorization'];
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  debugToken(): void {
    const token = this.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
      } catch (e) {
        // Could not decode token payload
      }
    }
  }
}

const authService = new AuthService();
export default authService;