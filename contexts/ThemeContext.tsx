'use client';
import { useState, useEffect, type ReactNode } from "react";
import { ThemeContext } from "./ThemeContextValue";

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<string>("auto");

  // useEffect(() => {
  //   const stored = localStorage.getItem("theme") as string | null;
  //   if (stored === "dark" || stored === "light") return stored;
  //   setThemeState("auto");
  // }, []);

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyResolvedTheme = (resolvedTheme: string) => {
      root.classList.toggle("dark", resolvedTheme === "dark");
      root.style.colorScheme = resolvedTheme;
      root.setAttribute("data-theme", resolvedTheme);
    };

    const syncTheme = () => {
      if (theme === "auto") {
        applyResolvedTheme(mediaQuery.matches ? "dark" : "light");
        return;
      }

      applyResolvedTheme(theme);
    };

    syncTheme();

    if (theme === "auto") {
      const onChange = () => syncTheme();
      mediaQuery.addEventListener("change", onChange);
      return () => mediaQuery.removeEventListener("change", onChange);
    }
  }, [theme]);

  const setTheme = (value: string) => {
    setThemeState(value);

    if (value === "light" || value === "dark") {
      localStorage.setItem("theme", value);
    } else {
      localStorage.removeItem("theme");
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
