import React from 'react';
import { motion } from 'motion/react';
import { AuraFitLogo } from './AuraFitLogo';
import { UserProfile, ThemeMode, AppTab } from '../types';
import { Plus, Home, User, Sparkles } from 'lucide-react';
import { ThemeSwitcher } from './ThemeSwitcher';

interface NavbarProps {
  currentTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  user: UserProfile | null;
  currentTheme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  onReplayIntro?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  user,
  currentTheme,
  onThemeChange,
  onReplayIntro,
}) => {
  return (
    <>
      {/* Desktop Floating Navigation Bar */}
      <header className="sticky top-3 sm:top-4 z-40 w-full px-3 sm:px-6 pointer-events-none mb-4 sm:mb-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between pointer-events-auto gap-2">
          {/* Brand Identity - Returns to Intro Screen */}
          <button
            id="brand-logo-btn"
            type="button"
            onClick={() => {
              if (onReplayIntro) {
                onReplayIntro();
              } else {
                onSelectTab('home');
              }
            }}
            title="AuraFit — Click to experience Intro"
            className="cursor-pointer bg-white/85 dark:bg-[#1A1924]/85 backdrop-blur-xl border border-[#E8E2D9] dark:border-[#2D2A3B] px-3 sm:px-4 py-2 rounded-full shadow-sm hover:border-[#8B5CF6]/50 transition-all flex items-center group text-left shrink-0"
          >
            <AuraFitLogo size="sm" showTagline={false} />
          </button>

          {/* 3-Tab Floating Center Pill: HOME | ADD | PROFILE */}
          <nav
            id="desktop-primary-nav"
            className="hidden md:flex items-center gap-1.5 p-1.5 rounded-full bg-white/90 dark:bg-[#16151E]/90 backdrop-blur-2xl border border-[#E8E2D9] dark:border-[#2D2A3B] shadow-lg shadow-purple-950/5"
          >
            {/* HOME */}
            <button
              id="nav-tab-home"
              onClick={() => onSelectTab('home')}
              className={`relative px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                currentTab === 'home'
                  ? 'text-white'
                  : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {currentTab === 'home' && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 rounded-full bg-[#1C1B1F] dark:bg-[#8B5CF6] shadow-sm"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5" />
                <span>HOME</span>
              </span>
            </button>

            {/* ADD */}
            <button
              id="nav-tab-add"
              onClick={() => onSelectTab('add')}
              className={`relative px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                currentTab === 'add'
                  ? 'text-white'
                  : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {currentTab === 'add' && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 rounded-full bg-[#1C1B1F] dark:bg-[#8B5CF6] shadow-sm"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" />
                <span>ADD</span>
              </span>
            </button>

            {/* PROFILE */}
            <button
              id="nav-tab-profile"
              onClick={() => onSelectTab('profile')}
              className={`relative px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                currentTab === 'profile'
                  ? 'text-white'
                  : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {currentTab === 'profile' && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 rounded-full bg-[#1C1B1F] dark:bg-[#8B5CF6] shadow-sm"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span>PROFILE</span>
              </span>
            </button>
          </nav>

          {/* Right Action Controls: Quick Theme & Profile Access */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <ThemeSwitcher
              currentTheme={currentTheme}
              onThemeChange={onThemeChange}
              minimal={true}
            />

            <button
              id="btn-nav-avatar"
              onClick={() => onSelectTab('profile')}
              className="flex items-center gap-2 p-1 pl-2 sm:pl-2.5 pr-1 rounded-full bg-white/80 dark:bg-[#1A1924]/85 border border-[#E8E2D9] dark:border-[#2D2A3B] shadow-sm hover:border-[#8B5CF6] transition-all cursor-pointer"
              title="Your Profile"
            >
              <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 hidden lg:inline-block">
                {user ? user.name.split(' ')[0] : 'Profile'}
              </span>
              <img
                src={
                  user?.avatarUrl ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop'
                }
                alt={user?.name || 'Profile'}
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-full object-cover border border-[#8B5CF6]/40"
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Fixed Bottom Navigation Bar: 3 TABS (HOME | ADD | PROFILE) */}
      <div className="md:hidden fixed bottom-3 left-0 right-0 z-40 px-3 sm:px-6 flex justify-center pointer-events-none pb-safe">
        <nav
          id="mobile-bottom-nav"
          className="grid grid-cols-3 items-center gap-1 px-2.5 py-2 rounded-full bg-white/95 dark:bg-[#16151E]/95 backdrop-blur-2xl border border-[#E8E2D9] dark:border-[#2D2A3B] shadow-2xl shadow-purple-950/20 pointer-events-auto w-full max-w-sm"
        >
          {/* HOME */}
          <button
            id="mobile-nav-home"
            onClick={() => onSelectTab('home')}
            className={`min-h-[44px] py-1.5 flex flex-col items-center justify-center gap-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              currentTab === 'home'
                ? 'bg-[#1C1B1F] dark:bg-[#8B5CF6] text-white shadow-md'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Home className="w-4 h-4 shrink-0" />
            <span className="truncate">HOME</span>
          </button>

          {/* ADD */}
          <button
            id="mobile-nav-add"
            onClick={() => onSelectTab('add')}
            className={`min-h-[44px] py-1.5 flex flex-col items-center justify-center gap-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              currentTab === 'add'
                ? 'bg-[#1C1B1F] dark:bg-[#8B5CF6] text-white shadow-md'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span className="truncate">ADD</span>
          </button>

          {/* PROFILE */}
          <button
            id="mobile-nav-profile"
            onClick={() => onSelectTab('profile')}
            className={`min-h-[44px] py-1.5 flex flex-col items-center justify-center gap-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              currentTab === 'profile'
                ? 'bg-[#1C1B1F] dark:bg-[#8B5CF6] text-white shadow-md'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <User className="w-4 h-4 shrink-0" />
            <span className="truncate">PROFILE</span>
          </button>
        </nav>
      </div>
    </>
  );
};
