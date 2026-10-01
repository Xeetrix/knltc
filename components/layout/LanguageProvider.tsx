"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { defaultLanguage, Language, languageStorageKey } from "@/lib/i18n";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
};

const LanguageContext = createContext<LanguageContextValue>({
  language: defaultLanguage,
  setLanguage: () => undefined,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const applyLang = (val: Language) => {
      setLanguageState(val);
      document.documentElement.lang = val;
    };

    const stored = window.localStorage.getItem(languageStorageKey) as Language | null;
    if (stored === "en" || stored === "bn" || stored === "ja") {
      applyLang(stored);
    } else {
      applyLang("en");
      window.localStorage.setItem(languageStorageKey, "en");
    }

    const onCustomEvent = () => {
      const current = window.localStorage.getItem(languageStorageKey) as Language | null;
      if (current === "en" || current === "bn" || current === "ja") {
        applyLang(current);
      }
    };

    const onStorage = (e: StorageEvent) => {
      if (e.key === languageStorageKey && (e.newValue === "en" || e.newValue === "bn" || e.newValue === "ja")) {
        applyLang(e.newValue as Language);
      }
    };

    window.addEventListener("knltc-language-changed", onCustomEvent);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("knltc-language-changed", onCustomEvent);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    window.localStorage.setItem(languageStorageKey, nextLanguage);
    document.documentElement.lang = nextLanguage;
    window.dispatchEvent(new Event("knltc-language-changed"));
  };

  const value = useMemo(() => ({ language, setLanguage }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
