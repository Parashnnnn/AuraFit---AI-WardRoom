import React from 'react';
import { AuraFitLogo } from './AuraFitLogo';
import { ThemeSwitcher } from './ThemeSwitcher';
import { ThemeMode, AppTab } from '../types';
import { Sparkles, Heart } from 'lucide-react';
import { motion } from 'motion/react';

interface FooterProps {
  currentTheme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  onNavigate: (tab: AppTab) => void;
  onScrollToSection: (sectionId: string) => void;
  onReplayIntro?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  currentTheme,
  onThemeChange,
  onNavigate,
  onScrollToSection,
  onReplayIntro,
}) => {
  return (
    <footer className="mt-16 border-t border-[#E8E2D9] dark:border-[#2D2A3B] bg-white/40 dark:bg-[#0D0C10]/60 backdrop-blur-md relative overflow-hidden">
      {/* Terminal Arc Termination Graphic */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-xl pointer-events-none overflow-hidden h-4">
        <svg className="w-full h-full opacity-50" viewBox="0 0 600 16" fill="none">
          <path
            d="M 0 0 Q 300 16 600 0"
            stroke="url(#footerArcTerm)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <defs>
            <linearGradient id="footerArcTerm" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="50%" stopColor="#F472B6" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-10 border-b border-neutral-200/60 dark:border-neutral-800/80">
          {/* Brand Column */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-2">
            <button
              id="footer-brand-logo-btn"
              onClick={() => {
                if (onReplayIntro) onReplayIntro();
                else onNavigate('home');
              }}
              title="AuraFit — Return to Intro Screen"
              className="cursor-pointer group text-left"
            >
              <AuraFitLogo size="lg" showTagline={true} />
            </button>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800/80 text-[11px] font-semibold tracking-widest uppercase text-neutral-600 dark:text-neutral-400 mt-2">
              <Sparkles className="w-3 h-3 text-[#8B5CF6]" />
              <span>DON&apos;T BUY. RESTYLE.</span>
            </div>
          </div>

          {/* Quick Navigation Anchor Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
            <button
              id="footer-link-home"
              onClick={() => {
                onNavigate('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Home
            </button>
            <button
              id="footer-link-add"
              onClick={() => onNavigate('add')}
              className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Add
            </button>
            <button
              id="footer-link-wardrobe"
              onClick={() => {
                onNavigate('home');
                onScrollToSection('digital-wardrobe-section');
              }}
              className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Wardrobe
            </button>
            <button
              id="footer-link-profile"
              onClick={() => onNavigate('profile')}
              className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Profile
            </button>
            <button
              id="footer-link-faq"
              onClick={() => {
                onNavigate('home');
                onScrollToSection('help-faq-section');
              }}
              className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Help &amp; FAQ
            </button>
            <button
              id="footer-link-contact"
              onClick={() => {
                onNavigate('home');
                onScrollToSection('contact-section');
              }}
              className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Contact
            </button>
          </div>

          {/* Theme Switcher Control */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">Theme:</span>
            <ThemeSwitcher currentTheme={currentTheme} onThemeChange={onThemeChange} minimal={false} />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 dark:text-neutral-500 gap-4">
          <p>© 2026 AuraFit. Designed for conscious wardrobe curation.</p>
          <div className="text-[11px] font-mono tracking-wider uppercase text-neutral-400 dark:text-neutral-500">
            AuraFit Editorial Edition
          </div>
        </div>
      </div>
    </footer>
  );
};
