'use client';
import { useState, useEffect, useCallback } from 'react';

export type Theme = 'dark' | 'light';

export function useTheme(): { theme: Theme; toggle: () => void; isDark: boolean } {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const stored = (typeof window !== 'undefined'
      ? (localStorage.getItem('geosite-theme') as Theme | null)
      : null) ?? 'dark';
    setTheme(stored);
    document.documentElement.setAttribute('data-theme', stored);
  }, []);

  const toggle = useCallback(() => {
    setTheme(prev => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('geosite-theme', next);
      document.documentElement.setAttribute('data-theme', next);
      return next;
    });
  }, []);

  return { theme, toggle, isDark: theme === 'dark' };
}
