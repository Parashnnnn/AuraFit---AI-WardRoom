import React from 'react';
import { ThemeMode } from '../types';
import { Sun, Moon, Sparkles } from 'lucide-react';

interface ThemeSwitcherProps {
  currentTheme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  className?: string;
  minimal?: boolean;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  currentTheme,
  onThemeChange,
  className = '',
  minimal = false,
}) => {
  const themes: { id: ThemeMode; label: string; icon: React.ReactNode }[] = [
    {
      id: 'default',
      label: 'Default',
      icon: <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />,
    },
    {
      id: 'light',
      label: 'Light',
      icon: <Sun className="w-3.5 h-3.5 text-amber-500" />,
    },
    {
      id: 'dark',
      label: 'Dark',
      icon: <Moon className="w-3.5 h-3.5 text-[#A78BFA]" />,
    },
  ];

  if (minimal) {
    return (
      <div className={`flex items-center gap-1 p-1 rounded-full bg-neutral-200/50 dark:bg-neutral-800/60 border border-neutral-300/40 dark:border-neutral-700/50 ${className}`}>
        {themes.map((t) => {
          const isActive = currentTheme === t.id;
          return (
            <button
              key={t.id}
              id={`theme-btn-${t.id}`}
              onClick={() => onThemeChange(t.id)}
              title={`Switch to ${t.label} theme`}
              className={`p-1.5 rounded-full transition-all duration-200 flex items-center justify-center cursor-pointer ${
                isActive
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              {t.icon}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`flex items-center p-1 rounded-xl bg-neutral-200/50 dark:bg-[#1A1822] border border-neutral-300/40 dark:border-neutral-800/80 ${className}`}>
      {themes.map((t) => {
        const isActive = currentTheme === t.id;
        return (
          <button
            key={t.id}
            id={`theme-btn-full-${t.id}`}
            onClick={() => onThemeChange(t.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
              isActive
                ? 'bg-white dark:bg-[#252231] text-neutral-900 dark:text-white shadow-sm font-semibold'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
};
