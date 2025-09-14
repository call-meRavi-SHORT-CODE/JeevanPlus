import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TRANSLATIONS } from '@/constants/languages';

type LanguageCode = 'punjabi' | 'hindi' | 'english';

interface LanguageContextType {
  currentLanguage: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('punjabi');

  const setLanguage = (language: LanguageCode) => {
    setCurrentLanguage(language);
  };

  const t = (key: string): string => {
    return TRANSLATIONS[currentLanguage][key as keyof typeof TRANSLATIONS[typeof currentLanguage]] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}