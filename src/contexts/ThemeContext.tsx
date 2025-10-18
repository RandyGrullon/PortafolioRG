'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  resolvedTheme: 'dark' | 'light';
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: 'system',
  resolvedTheme: 'light',
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'vite-ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => {
      if (typeof window === 'undefined') return defaultTheme;
      const stored = localStorage.getItem(storageKey);
      if (stored && ['light', 'dark', 'system'].includes(stored)) {
        return stored as Theme;
      }
      return defaultTheme;
    }
  );

  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('light');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const root = window.document.documentElement;

    root.classList.remove('light', 'dark');

    let effectiveTheme: 'dark' | 'light';
    if (theme === 'system') {
      effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';
    } else {
      effectiveTheme = theme;
    }

    root.classList.add(effectiveTheme);
    setResolvedTheme(effectiveTheme);
  }, [theme]);

  const value = {
    theme,
    resolvedTheme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};