"use client";

import { useState, useEffect } from "react";
import { flushSync } from "react-dom";
import type { Lang } from "@/lib/report-types";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string, days = 365) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 86400000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
  try {
    localStorage.setItem(name, value);
  } catch (e) {}
}

export function useThemeTransition() {
  const [isDark, setIsDark] = useState(true);
  const [palette, setPalette] = useState("mono");
  const [language, setLanguage] = useState<Lang>("en");

  useEffect(() => {
    const savedMode = getCookie("app_mode") || localStorage.getItem("app_mode");
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = savedMode ? savedMode === "dark" : prefersDark;

    document.documentElement.classList.toggle("dark", shouldBeDark);
    setIsDark(shouldBeDark);

    const savedPalette = getCookie("app_palette") || localStorage.getItem("app_palette") || "mono";
    setPalette(savedPalette);
    document.documentElement.setAttribute("data-palette", savedPalette);

    const savedLang = (getCookie("app_language") || localStorage.getItem("app_language")) as Lang;
    if (savedLang && (savedLang === "en" || savedLang === "ur" || savedLang === "roman_ur")) {
      setLanguage(savedLang);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !document.documentElement.classList.contains("dark");
    const modeStr = newTheme ? "dark" : "light";

    const applyTheme = () => {
      document.documentElement.classList.toggle("dark", newTheme);
      setIsDark(newTheme);
      setCookie("app_mode", modeStr);
    };

    if (typeof document !== "undefined" && "startViewTransition" in document) {
      (document as any).startViewTransition(() => {
        flushSync(() => {
          applyTheme();
        });
      });
    } else {
      applyTheme();
    }
  };

  const handlePaletteChange = (p: string) => {
    setPalette(p);
    document.documentElement.setAttribute("data-palette", p);
    setCookie("app_palette", p);
  };

  const handleLanguageChange = (lang: Lang) => {
    setLanguage(lang);
    setCookie("app_language", lang);
  };

  return {
    isDark,
    palette,
    language,
    toggleTheme,
    handlePaletteChange,
    handleLanguageChange,
    setLanguage,
  };
}

