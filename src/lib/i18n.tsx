"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Language = "fa" | "en";
export type Theme = "light" | "dark";
type LocaleContextValue = { lang: Language; setLang: (lang: Language) => void; theme: Theme; setTheme: (theme: Theme) => void; tr: (fa: string, en: string) => string };
const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ initialLang, initialTheme, children }: { initialLang: Language; initialTheme: Theme; children: React.ReactNode }) {
  const [lang, updateLang] = useState<Language>(initialLang);
  const [theme, updateTheme] = useState<Theme>(initialTheme);
  useEffect(() => { document.documentElement.lang = lang; document.documentElement.dir = lang === "fa" ? "rtl" : "ltr"; document.title = lang === "fa" ? "استاکلی | مدیریت فروش و موجودی" : "Stockly | Orders and inventory"; }, [lang]);
  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);
  const value = useMemo<LocaleContextValue>(() => ({
    lang,
    theme,
    setTheme(next) { updateTheme(next); document.cookie = `stockly_theme=${next}; Path=/; Max-Age=31536000; SameSite=Lax`; },
    setLang(next) {
      updateLang(next);
      document.cookie = `stockly_lang=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
    },
    tr: (fa, en) => lang === "fa" ? fa : en,
  }), [lang, theme]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}
export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("LocaleProvider is missing");
  return context;
}
export function localizedError(error: unknown, lang: Language, englishFallback = "Something went wrong. Please try again."): string {
  return lang === "fa" && error instanceof Error ? error.message : englishFallback;
}
