export type Locale = 'en' | 'zh-TW';

export interface Dictionary {
  [key: string]: string | Dictionary;
}

export interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}


