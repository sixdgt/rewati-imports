import { create } from 'zustand';
import Cookies from 'js-cookie';
import api from '@/app/lib/api';

interface User {
  id: number;
  email: string;
  username: string;
  full_name: string;
  phone?: string;
  address?: string;
  is_staff: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (access: string, refresh: string) => Promise<void>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: !!Cookies.get('access_token'),
  isLoading: false,

  login: async (access: string, refresh: string) => {
    Cookies.set('access_token', access, {
      secure: true,
      sameSite: 'Strict',
    });

    Cookies.set('refresh_token', refresh, {
      secure: true,
      sameSite: 'Strict',
    });

    set({ isAuthenticated: true });
    await useAuthStore.getState().fetchProfile();
  },

  logout: () => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    set({ user: null, isAuthenticated: false });
    window.location.replace('/login');
  },

  fetchProfile: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/auth/profile/');
      set({ user: response.data, isAuthenticated: true });
    } catch (error) {
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },
}));
