export type Locale = 'en' | 'zh-TW';

export type Dictionary = Record<string, string | Dictionary>;

export interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}


