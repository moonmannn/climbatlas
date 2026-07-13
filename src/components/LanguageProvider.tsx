"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Locale } from "@/types/destination";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);
const storageKey = "climbatlas-locale";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const storedLocale = window.localStorage.getItem(storageKey);
    if (storedLocale === "en" || storedLocale === "zh") setLocaleState(storedLocale);
  }, []);

  const value = useMemo<LanguageContextValue>(() => ({
    locale,
    setLocale(nextLocale) {
      setLocaleState(nextLocale);
      window.localStorage.setItem(storageKey, nextLocale);
    }
  }), [locale]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider.");
  return context;
}

export function LanguageToggle() {
  const { locale, setLocale } = useLanguage();
  return (
    <div className="flex items-center border border-brandforest/15 bg-cream p-0.5">
      <button className={`min-h-9 px-2.5 text-xs font-semibold transition-colors ${locale === "en" ? "bg-brandforest text-cream" : "text-brandforest/60 hover:text-brandforest"}`} onClick={() => setLocale("en")} type="button">EN</button>
      <button className={`min-h-9 px-2.5 text-xs font-semibold transition-colors ${locale === "zh" ? "bg-brandforest text-cream" : "text-brandforest/60 hover:text-brandforest"}`} onClick={() => setLocale("zh")} type="button">中文</button>
    </div>
  );
}

export function LocalizedText({ en, zh }: { en: string; zh: string }) {
  const { locale } = useLanguage();
  return <>{locale === "zh" ? zh : en}</>;
}
