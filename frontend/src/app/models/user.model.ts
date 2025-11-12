export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  schoolId: string;
  role: 'admin' | 'member';
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  schoolId: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
}

export interface School {
  id: string;
  name: string;
}
