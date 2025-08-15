"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { en } from './dictionaries/en';
import { zhTW } from './dictionaries/zh-TW';
import type { Dictionary, I18nContextValue, Locale } from './types';

const STORAGE_KEY = 'app.locale';

const dictionaries: Record<Locale, Dictionary> = {
  en,
  'zh-TW': zhTW,
};

function getFromPath(obj: Dictionary, path: string): string | undefined {
  const parts = path.split('.');
  let current: unknown = obj;
  for (const part of parts) {
    if (
      current !== null &&
      typeof current === 'object' &&
      part in (current as Record<string, unknown>)
    ) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }
  return typeof current === 'string' ? current : undefined;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (stored === 'en' || stored === 'zh-TW') {
        setLocaleState(stored);
      } else {
        const navigatorLang = (typeof navigator !== 'undefined' && navigator.language) || 'en';
        if (navigatorLang.toLowerCase().startsWith('zh')) {
          setLocaleState('zh-TW');
        }
      }
    } catch {}
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
  }, []);

  const t = useCallback(
    (key: string) => {
      const dict = dictionaries[locale] ?? en;
      return getFromPath(dict, key) ?? key;
    },
    [locale]
  );

  const value = useMemo<I18nContextValue>(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}

export { type Locale } from './types';


