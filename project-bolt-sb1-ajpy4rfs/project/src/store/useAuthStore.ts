import { create } from 'zustand';
import { authApi } from '../services/auth';
import { User, LoginData, RegisterData } from '../types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  login: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const user = await authApi.login(data);
      set({ user, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Login failed',
        isLoading: false 
      });
    }
  },

  register: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const user = await authApi.register(data);
      set({ user, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Registration failed',
        isLoading: false 
      });
    }
  },

  logout: () => {
    authApi.logout();
    set({ user: null });
  },

  clearError: () => set({ error: null })
}));