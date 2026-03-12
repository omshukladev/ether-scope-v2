import React, { createContext, useContext, useEffect, useState } from "react";
import { getDarkMode, setDarkMode } from "@/lib/settingsStore";

type ThemeContextType = {
  darkMode: boolean;
  toggleTheme: (value: boolean) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setTheme] = useState(true);

  useEffect(() => {
    const loadTheme = async () => {
      const stored = await getDarkMode();
      if (stored !== null) setTheme(stored);
    };

    loadTheme();
  }, []);

  const toggleTheme = async (value: boolean) => {
    setTheme(value);
    await setDarkMode(value);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useThemeMode = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useThemeMode must be used inside ThemeProvider");
  }

  return context;
};