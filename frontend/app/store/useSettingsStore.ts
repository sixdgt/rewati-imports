import { create } from 'zustand';
import api from '@/app/lib/api-client';

interface SettingsState {
  settings: any;
  ads: any[];
  settingsLoading: boolean;
  adsLoading: boolean;
  fetchSettings: () => Promise<void>;
  fetchAds: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: null,
  ads: [],
  settingsLoading: false,
  adsLoading: false,

  fetchSettings: async () => {
    set({ settingsLoading: true });
    try {
      const res = await api.get('/settings/website/');
      const data = res.data;
      const backendUrl = 'http://localhost:8000';
      if (data.logo && !data.logo.startsWith('http')) data.logo = backendUrl + data.logo;
      if (data.favicon && !data.favicon.startsWith('http')) data.favicon = backendUrl + data.favicon;
      set({ settings: data });
      if (data.primary_color) document.documentElement.style.setProperty('--color-primary', data.primary_color);
      if (data.secondary_color) document.documentElement.style.setProperty('--color-secondary', data.secondary_color);
    } catch (err) {
      console.error('Failed to fetch settings', err);
    } finally {
      set({ settingsLoading: false });
    }
  },

  fetchAds: async () => {
    set({ adsLoading: true });
    try {
      const res = await api.get('/settings/ads/');
      set({ ads: Array.isArray(res.data) ? res.data : [] });
    } catch (err) {
      console.error('Failed to fetch ads', err);
      set({ ads: [] });
    } finally {
      set({ adsLoading: false });
    }
  },
}));
