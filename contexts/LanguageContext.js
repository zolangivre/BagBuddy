import React, { createContext, useState, useEffect, useContext } from "react";
import i18n, { initI18n, setLanguage } from "@/i18n";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLangState] = useState(i18n.locale);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    (async () => {
      await initI18n();
      setLangState(i18n.locale);
      setIsReady(true);
    })();
  }, []);

  const changeLanguage = async (lang) => {
    await setLanguage(lang);
    setLangState(lang);
  };

  if (!isReady) return null;

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, i18n }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
