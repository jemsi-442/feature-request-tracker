import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { getTranslationValue, translations } from "../i18n/translations";

export const LanguageContext = createContext(null);

const STORAGE_KEY = "feature-request-tracker-language";

function normalizeLanguage(value) {
  return value === "sw" ? "sw" : "en";
}

function interpolate(template, params = {}) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => params[key] ?? "");
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    if (typeof window === "undefined") return "en";
    return normalizeLanguage(window.localStorage.getItem(STORAGE_KEY));
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language === "sw" ? "sw" : "en";
  }, [language]);

  const t = useCallback((key, params) => {
    const value = getTranslationValue(language, key) ?? getTranslationValue("en", key) ?? key;

    if (typeof value !== "string") {
      return value;
    }

    return interpolate(value, params);
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage: (nextLanguage) => setLanguage(normalizeLanguage(nextLanguage)),
    t,
    locale: language === "sw" ? "sw-TZ" : "en-US",
    translatePriority: (priority) => t(`meta.priority.${priority}`),
    translateStatus: (status) => t(`meta.status.${status}`),
    translateRole: (role) => t(`meta.role.${role}`),
  }), [language, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
