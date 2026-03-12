/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from 'react';
import en from '../i18n/en.json';
import am from '../i18n/am.json';

const translations = { en, am };

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('gs_lang') || 'en');

  const switchLanguage = useCallback((code) => {
    setLang(code);
    localStorage.setItem('gs_lang', code);
  }, []);

  /** Get a nested translation key like "hero.title_1" */
  const t = useCallback((key) => {
    const keys = key.split('.');
    let value = translations[lang];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, switchLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
