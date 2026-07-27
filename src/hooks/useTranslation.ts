import { useState, useEffect, useCallback } from "react";
import { vi } from "~/locales/vi";

// Future: import { en } from "~/locales/en";
const translations: Record<string, any> = { vi };

export function useTranslation() {
  const [lang, setLang] = useState(() => localStorage.getItem("attendance_lang") || "vi");

  useEffect(() => {
    const handleStorageChange = () => {
      const newLang = localStorage.getItem("attendance_lang") || "vi";
      setLang(newLang);
    };
    window.addEventListener("storage", handleStorageChange);
    // Custom event for same-window updates
    window.addEventListener("languageChange", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("languageChange", handleStorageChange);
    };
  }, []);

  const t = useCallback(
    (path: string, params?: Record<string, string | number>) => {
      const keys = path.split(".");
      let result = translations[lang] || translations["vi"];
      
      for (const k of keys) {
        if (result === undefined || result[k] === undefined) {
          console.warn(`Translation key not found: ${path}`);
          return path;
        }
        result = result[k];
      }

      if (typeof result !== "string") return path;
      
      if (params) {
        return Object.entries(params).reduce(
          (str, [key, val]) => str.replace(new RegExp(`{${key}}`, 'g'), String(val)),
          result
        );
      }
      return result;
    },
    [lang]
  );

  const changeLanguage = (newLang: string) => {
    localStorage.setItem("attendance_lang", newLang);
    setLang(newLang);
    window.dispatchEvent(new Event("languageChange"));
  };

  return { t, lang, changeLanguage };
}
