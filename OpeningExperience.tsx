import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AuraFitLogo } from './AuraFitLogo';
import { Scissors, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface OpeningExperienceProps {
  onEnter: () => void;
}

export const OpeningExperience: React.FC<OpeningExperienceProps> = ({ onEnter }) => {
  const [isCutting, setIsCutting] = useState(false);
  const [hasCut, setHasCut] = useState(false);

  const handleCut = () => {
    if (isCutting || hasCut) return;
    setIsCutting(true);

    try {
      confetti({
        particleCount: 36,
        spread: 70,
        origin: { y: 0.62 },
        colors: ['#8B5CF6', '#F472B6', '#C7D2FE', '#E8DEFC', '#FDFBF7'],
        ticks: 90,
        gravity: 1.1,
        scalar: 0.85,
      });
    } catch {
      // safe fallback
    }

    setTimeout(() => {
      setHasCut(true);
      setTimeout(() => {
        onEnter();
      }, 700);
    }, 650);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden bg-[#FAF8F5] dark:bg-[#0E0D12] text-[#1C1B1F] dark:text-[#F7F6F9] flex flex-col items-center justify-between py-6 sm:py-10 px-4 sm:px-6 select-none min-h-[100dvh]">
      {/* Background Soft Glows & Ambient Continuous Arc */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.12, 1],
            opacity: [0.35, 0.55, 0.35],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-[12%] left-[25%] w-[450px] h-[450px] rounded-full bg-gradient-to-br from-[#E8DEFC] via-[#FBCFE8]/25 to-transparent dark:from-[#312749]/35 dark:via-[#4C1D95]/20 blur-3xl"
        />

        <motion.div
          animate={{
            scale: [1, 1.18, 1],
            opacity: [0.25, 0.45, 0.25],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute -bottom-[10%] right-[20%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#C7D2FE]/30 via-[#DDD6FE]/20 to-transparent dark:from-[#1E1B4B]/30 blur-3xl"
        />

        {/* Continuous Signature Aura Arc Starting Thread */}
        <svg className="absolute inset-0 w-full h-full opacity-40 dark:opacity-20" preserveAspectRatio="none">
          <motion.path
            d="M 200 100 Q 600 450 1000 200 T 1600 600"
            fill="none"
            stroke="url(#openingArcGrad)"
            strokeWidth="1.5"
            strokeDasharray="4 8"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.5, ease: 'easeInOut' }}
          />
          <defs>
            <linearGradient id="openingArcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A78BFA" />
              <stop offset="50%" stopColor="#F472B6" />
              <stop offset="100%" stopColor="#818CF8" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Top Brand Micro-Indicator */}
      <div className="relative z-10 opacity-70 mb-2">
        <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] uppercase text-neutral-500 dark:text-neutral-400">
          AURAFIT STUDIO EDITION
        </span>
      </div>

      {/* Center Stage: Floating Editorial Garment + Brand Typography */}
      <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center text-center my-auto py-2">
        {/* Floating Shirt with Realistic Fabric & Motion */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: [0, -10, 0],
            rotate: [-1.5, 1.5, -1.5],
          }}
          transition={{
            opacity: { duration: 1.2, ease: 'easeOut' },
            scale: { duration: 1.2, ease: 'easeOut' },
            y: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
            rotate: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
          }}
          onClick={handleCut}
          className="relative mb-5 cursor-pointer group"
          title="Click to enter wardrobe"
        >
          {/* Subtle Garment Aura Spotlight */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-[#8B5CF6]/15 to-[#F472B6]/15 blur-2xl group-hover:scale-110 transition-transform duration-700" />

          {/* Floating High-Fashion Garment Representation */}
          <div className="relative p-5 sm:p-8 rounded-3xl bg-white/80 dark:bg-[#1A1924]/80 backdrop-blur-xl border border-[#E8E2D9] dark:border-[#2D2A3B] shadow-2xl shadow-purple-900/10">
            {/* Elegant Vector Editorial Shirt with Fabric Drapes */}
            <svg
              className="w-20 h-20 sm:w-28 sm:h-28 text-neutral-800 dark:text-neutral-100 filter drop-shadow-md"
              viewBox="0 0 100 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Collar Structure */}
              <path d="M 36 24 L 50 36 L 64 24 L 50 18 Z" fill="#F3EFEA" className="dark:fill-[#2A2738]" />
              <path d="M 36 24 L 46 36 L 50 36" stroke="#8B5CF6" strokeWidth="2" />
              <path d="M 64 24 L 54 36 L 50 36" stroke="#8B5CF6" strokeWidth="2" />

              {/* Shoulders & Body Silhouette */}
              <path d="M 36 24 L 18 36 L 26 50 L 34 44 L 34 82 L 66 82 L 66 44 L 74 50 L 82 36 L 64 24" />

              {/* Placket & Buttons */}
              <path d="M 50 36 L 50 82" stroke="#A78BFA" strokeDasharray="3 3" />
              <circle cx="50" cy="46" r="1.5" fill="#8B5CF6" />
              <circle cx="50" cy="56" r="1.5" fill="#8B5CF6" />
              <circle cx="50" cy="66" r="1.5" fill="#8B5CF6" />

              {/* Hem Curve */}
              <path d="M 34 82 Q 50 86 66 82" />
            </svg>

            {/* Floating Tag */}
            <div className="absolute -bottom-2.5 right-4 px-2.5 py-0.5 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[9px] font-mono uppercase tracking-widest shadow-md">
              Restyle
            </div>
          </div>
        </motion.div>

        {/* Brand Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="space-y-1.5"
        >
          <h1 className="font-display font-bold text-3xl sm:text-6xl tracking-[0.2em] uppercase text-neutral-900 dark:text-white">
            AURAFIT
          </h1>
          <p className="font-serif italic text-lg sm:text-2xl text-neutral-600 dark:text-neutral-300 font-normal">
            Your Closet&apos;s Best Friend
          </p>
        </motion.div>

        {/* Core Philosophy Statement */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-4 inline-flex items-center gap-2 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-neutral-900/[0.04] dark:bg-white/[0.06] border border-neutral-300/60 dark:border-white/10 text-[11px] sm:text-sm font-semibold tracking-[0.22em] uppercase text-neutral-800 dark:text-neutral-200"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />
          <span>DON&apos;T BUY. RESTYLE.</span>
          <Sparkles className="w-3.5 h-3.5 text-[#F472B6]" />
        </motion.div>
      </div>

      {/* Signature Scissor CTA Button at Bottom */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.9 }}
        className="relative z-10 flex flex-col items-center mt-2"
      >
        <motion.button
          id="btn-open-wardrobe-scissors"
          onClick={handleCut}
          disabled={isCutting || hasCut}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="group relative inline-flex items-center gap-3 sm:gap-3.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-[#1C1B1F] dark:bg-[#8B5CF6] hover:bg-black dark:hover:bg-[#7C3AED] text-white shadow-2xl shadow-purple-900/20 cursor-pointer border border-white/20 overflow-hidden transition-all duration-300 touch-manipulation"
        >
          {/* Subtle Ambient Shimmer */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 transition-transform" />

          {/* Interactive Animated Scissors */}
          <motion.div
            animate={
              isCutting
                ? {
                    rotate: [0, -35, 10, -25, 0],
                    x: [0, 15, 35, 70],
                  }
                : { rotate: [0, -10, 0] }
            }
            transition={
              isCutting
                ? { duration: 0.65, ease: 'easeInOut' }
                : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
            }
            className="text-[#E8DEFC]"
          >
            <Scissors className="w-5 h-5 transition-transform group-hover:rotate-12 stroke-[2]" />
          </motion.div>

          <span className="font-display text-xs sm:text-sm tracking-[0.18em] uppercase font-semibold whitespace-nowrap">
            ✂ OPEN YOUR WARDROBE
          </span>
        </motion.button>

        <p className="mt-2.5 text-[10px] sm:text-[11px] uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-mono text-center px-4">
          Cut the fabric to enter your personal styling studio
        </p>
      </motion.div>

      {/* Cinematic Fabric Split Cut Transition Curtains */}
      <AnimatePresence>
        {isCutting && (
          <div className="fixed inset-0 z-50 pointer-events-none flex">
            {/* Cut Line Visual */}
            <motion.div
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#8B5CF6] via-[#F472B6] to-[#818CF8] -translate-x-1/2 z-60 shadow-[0_0_12px_#8B5CF6]"
            />

            {/* Left Fabric Panel */}
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: '-105%' }}
              transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1], delay: 0.15 }}
              className="w-1/2 h-full bg-[#FAF8F5] dark:bg-[#0E0D12] border-r border-[#8B5CF6]/50 shadow-2xl relative flex items-center justify-end"
            >
              <div className="absolute right-4 top-0 bottom-0 w-px border-r-2 border-dashed border-[#A78BFA]/40" />
            </motion.div>

            {/* Right Fabric Panel */}
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: '105%' }}
              transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1], delay: 0.15 }}
              className="w-1/2 h-full bg-[#FAF8F5] dark:bg-[#0E0D12] border-l border-[#F472B6]/50 shadow-2xl relative flex items-center justify-start"
            >
              <div className="absolute left-4 top-0 bottom-0 w-px border-l-2 border-dashed border-[#F472B6]/40" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
