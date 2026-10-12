import Storage from 'expo-sqlite/kv-store';
import { Platform } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Language } from '@/content/types';

function detectLanguage(): Language {
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale.toLowerCase();
    if (locale.startsWith('ar')) return 'ar';
    if (locale.startsWith('id') || locale.startsWith('in')) return 'id';
  } catch {}
  return 'en';
}

type AppState = {
  language: Language;
  onboardingDone: boolean;
  setLanguage: (language: Language) => void;
  completeOnboarding: (language: Language) => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      language: detectLanguage(),
      onboardingDone: false,
      setLanguage: (language) => set({ language }),
      completeOnboarding: (language) => set({ language, onboardingDone: true }),
    }),
    {
      name: 'hifz-app',
      storage: createJSONStorage(() =>
        Platform.OS === 'web'
          ? window.localStorage
          : {
              getItem: (key) => Storage.getItemSync(key),
              setItem: (key, value) => Storage.setItemSync(key, value),
              removeItem: (key) => {
                Storage.removeItemSync(key);
              },
            },
      ),
    },
  ),
);
