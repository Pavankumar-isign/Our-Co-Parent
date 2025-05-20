import api from './api';
import { LoginData, RegisterData } from '../types';

export const authApi = {
  login: async (data: LoginData) => {
    const response = await api.post('http://localhost:8080/api/auth/login', data);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    return user;
  },

  register: async (data: RegisterData) => {
    console.log(data);
    const response = await api.post('http://localhost:8080/api/auth/register', data);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    return user;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getCurrentUser: async () => {
    const response = await api.get('http://localhost:8080/api/auth/me');
    return response.data;
  }
};