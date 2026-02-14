import api from './api';
import { SignupDto, LoginDto, AuthResponse, User } from '../types';

export const authService = {
  signup: async (data: SignupDto): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/signup', data);
    return response.data;
  },

  login: async (data: LoginDto): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  getMe: async (): Promise<User> => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  updateProfile: async (username: string): Promise<User> => {
    const response = await api.put<User>('/auth/profile', { username });
    return response.data;
  },
};
