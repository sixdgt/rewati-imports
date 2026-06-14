import { create } from 'zustand';
import api from '../lib/api';

interface SettingsState {
  settings: any;
  ads: any[];
  loading: boolean;
  fetchSettings: () => Promise<void>;
  fetchAds: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: null,
  ads: [],
  loading: false,

  fetchSettings: async () => {
    set({ loading: true });
    try {
      const res = await api.get('/settings/website/');
      const data = res.data;
      
      // Fix image URLs if they are relative
      const backendUrl = 'http://localhost:8000';
      if (data.logo && !data.logo.startsWith('http')) {
        data.logo = backendUrl + data.logo;
      }
      if (data.favicon && !data.favicon.startsWith('http')) {
        data.favicon = backendUrl + data.favicon;
      }

      set({ settings: data });
      
      // Dynamically apply primary/secondary colors if they exist
      if (res.data.primary_color) {
        document.documentElement.style.setProperty('--color-primary', res.data.primary_color);
      }
      if (res.data.secondary_color) {
        document.documentElement.style.setProperty('--color-secondary', res.data.secondary_color);
      }
    } catch (err) {
      console.error('Failed to fetch settings', err);
    } finally {
      set({ loading: false });
    }
  },

  fetchAds: async () => {
    try {
      const res = await api.get('/settings/ads/');
      set({ ads: res.data });
    } catch (err) {
      console.error('Failed to fetch ads', err);
    }
  }
}));
