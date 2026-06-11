"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
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

    if (storedLocale === "en" || storedLocale === "zh") {
      setLocaleState(storedLocale);
    }
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      setLocale(nextLocale) {
        setLocaleState(nextLocale);
        window.localStorage.setItem(storageKey, nextLocale);
      }
    }),
    [locale]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider.");
  }

  return context;
}

export function LanguageToggle() {
  const { locale, setLocale } = useLanguage();
  const buttonBase =
    "rounded-md border px-3 py-2 text-xs font-black uppercase tracking-wide transition";

  return (
    <div className="flex rounded-lg border border-antiquegold/30 bg-bark/88 p-1 shadow-atlas backdrop-blur">
      <button
        className={`${buttonBase} ${
          locale === "en"
            ? "border-antiquegold/40 bg-antiquegold text-bark"
            : "border-transparent text-parchment hover:border-antiquegold/30"
        }`}
        onClick={() => setLocale("en")}
        type="button"
      >
        EN
      </button>
      <button
        className={`${buttonBase} ${
          locale === "zh"
            ? "border-antiquegold/40 bg-antiquegold text-bark"
            : "border-transparent text-parchment hover:border-antiquegold/30"
        }`}
        onClick={() => setLocale("zh")}
        type="button"
      >
        中文
      </button>
    </div>
  );
}

export function LocalizedText({ en, zh }: { en: string; zh: string }) {
  const { locale } = useLanguage();

  return <>{locale === "zh" ? zh : en}</>;
}
