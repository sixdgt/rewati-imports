'use client';

import { useEffect } from 'react';
import { useSettingsStore } from '../store/useSettingsStore';

export default function DynamicFavicon() {
  const { settings } = useSettingsStore();

  useEffect(() => {
    if (settings?.favicon) {
      // Find or create favicon link
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = settings.favicon;
      
      // Handle manifest/apple-touch-icon if needed
      let appleLink = document.querySelector("link[rel='apple-touch-icon']") as HTMLLinkElement;
      if (appleLink) appleLink.href = settings.favicon;
    }
  }, [settings?.favicon]);

  return null;
}
