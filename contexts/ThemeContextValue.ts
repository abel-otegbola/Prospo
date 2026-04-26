import { createContext } from "react";

export type ThemeContextValue = {
  theme: string;
  setTheme: (theme: string) => void;
};

export const ThemeContext = createContext({} as ThemeContextValue);
