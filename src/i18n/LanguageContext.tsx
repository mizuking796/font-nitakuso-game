import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import { translations, type Language } from './translations';

type Translations = typeof translations.ja | typeof translations.en;

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

function detectLanguage(): Language {
  const stored = localStorage.getItem('lang');
  if (stored === 'ja' || stored === 'en') return stored;

  const browserLang = navigator.language.toLowerCase();
  return browserLang.startsWith('ja') ? 'ja' : 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(detectLanguage);

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('lang', newLang);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
