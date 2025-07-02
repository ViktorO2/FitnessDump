export interface User {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  }
  
  export interface LoginRequest {
    username: string;
    password: string;
  }
  
  export interface RegisterRequest {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: "USER" | "ADMIN";
  }
  
  export interface AuthResponse {
    token: string;
    refreshToken: string;
    user: User;
  }
  
  export interface UpdateProfileDTO {
    firstName: string;
    lastName: string;
    email: string;
  }
  
  export interface ChangePasswordDTO {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    newPasswordMatching: boolean;
  }
  
  // Missing types from OpenAPI spec
  export interface UserCreateDTO {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: "USER" | "ADMIN";
  }
  
  export interface UserDTO {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    role: "USER" | "ADMIN";
  }
  