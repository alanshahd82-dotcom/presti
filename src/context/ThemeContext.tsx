import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const COLORS = {
  light: {
    primary: '#1a2744',
    gold: '#F5C518',
    bg: '#F8FAFC',
    card: '#FFFFFF',
    text: '#1a2744',
    textSub: '#6B7280',
    textMuted: '#9CA3AF',
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
    inputBg: '#F9FAFB',
    heroBg: '#1a2744',
    tabBg: '#FFFFFF',
    tabBorder: 'rgba(0,0,0,0.06)',
    shadow: '#1a2744',
    skeletonBase: '#E5E7EB',
    skeletonShimmer: '#F3F4F6',
    success: '#22C55E',
    error: '#EF4444',
    economy: '#22C55E',
    luxury: '#8B5CF6',
    suv: '#3B82F6',
  },
  dark: {
    primary: '#F5C518',
    gold: '#F5C518',
    bg: '#0F172A',
    card: '#1E293B',
    text: '#F1F5F9',
    textSub: '#94A3B8',
    textMuted: '#64748B',
    border: '#334155',
    borderLight: '#1E293B',
    inputBg: '#1E293B',
    heroBg: '#0F172A',
    tabBg: '#1E293B',
    tabBorder: 'rgba(255,255,255,0.06)',
    shadow: '#000000',
    skeletonBase: '#1E293B',
    skeletonShimmer: '#334155',
    success: '#22C55E',
    error: '#EF4444',
    economy: '#22C55E',
    luxury: '#8B5CF6',
    suv: '#3B82F6',
  },
};

type Theme = typeof COLORS.light;
type Mode = 'light' | 'dark';

interface ThemeCtx {
  mode: Mode;
  colors: Theme;
  toggle: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeCtx>({
  mode: 'light',
  colors: COLORS.light,
  toggle: () => {},
  isDark: false,
});

const STORAGE_KEY = '@presticars_theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>('light');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(v => {
      if (v === 'dark') setMode('dark');
    });
  }, []);

  const toggle = useCallback(() => {
    setMode(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      AsyncStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider
      value={{ mode, colors: COLORS[mode], toggle, isDark: mode === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
