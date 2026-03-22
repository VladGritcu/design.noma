import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Language, Translations } from './types';
import { ro } from './ro';
import { ru } from './ru';
import { en } from './en';

const translations: Record<Language, Translations> = { ro, ru, en };

const SUPPORTED: Language[] = ['ro', 'ru', 'en'];

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = 'noma-lang';

function detectBrowserLanguage(): Language {
  try {
    const langs = navigator.languages?.length ? navigator.languages : [navigator.language];
    for (const tag of langs) {
      const code = tag.toLowerCase().split('-')[0];
      if (code === 'ro' || code === 'mo') return 'ro';
      if (code === 'ru' || code === 'uk' || code === 'be') return 'ru';
      if (code === 'en') return 'en';
    }
  } catch {}
  return 'ro';
}

function getInitialLanguage(): Language {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED.includes(stored as Language)) return stored as Language;
  } catch {}
  return detectBrowserLanguage();
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value: LanguageContextValue = {
    language,
    setLanguage,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
