import React, { createContext, useContext, useState, useEffect } from 'react';

export type Lang = 'en' | 'he' | 'ar';

export const LANGUAGES: { code: Lang; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'he', label: 'עברית' },
  { code: 'ar', label: 'عربي' },
];

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (en: string, he: string, ar?: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LangCtx>({
  lang: 'en',
  setLang: () => {},
  t: (en) => en,
  isRTL: false,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>(() => (localStorage.getItem('lang') as Lang) || 'en');

  const setLang = (l: Lang) => {
    localStorage.setItem('lang', l);
    setLangState(l);
  };

  const t = (en: string, he: string, ar?: string) => {
    if (lang === 'en') return en;
    if (lang === 'ar') return ar ?? he;
    return he;
  };

  const isRTL = lang !== 'en';

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [isRTL]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
