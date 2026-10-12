import { useCallback } from 'react';

import type { Language } from '@/content/types';
import { translate, type StringKey } from '@/i18n/strings';
import { pick, type LocalizedText } from '@/services/types';

import { useAppStore } from '@/stores/app-store';

export function useLanguage(): Language {
  return useAppStore((state) => state.language);
}

export function useT() {
  const language = useLanguage();
  const t = useCallback(
    (key: StringKey, params?: Record<string, string | number>) => translate(language, key, params),
    [language],
  );
  const text = useCallback((value: LocalizedText) => pick(value, language), [language]);
  return { t, text, language, isRTL: language === 'ar' };
}
