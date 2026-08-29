import React from 'react';
import { UserProfile, WardrobeItem } from '../types';
import { motion } from 'motion/react';
import { Sparkles, Plus, Wand2, Shirt, ArrowDown } from 'lucide-react';

interface HomeGreetingHeaderProps {
  user: UserProfile | null;
  wardrobe: WardrobeItem[];
  onOpenAdd: () => void;
  onScrollToGenerator: () => void;
  onScrollToWardrobe: () => void;
}

export const HomeGreetingHeader: React.FC<HomeGreetingHeaderProps> = ({
  user,
  wardrobe,
  onOpenAdd,
  onScrollToGenerator,
  onScrollToWardrobe,
}) => {
  const avatarUrl =
    user?.avatarUrl ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop';

  return (
    <section id="home-greeting-header" className="pt-2 pb-8">
      <div className="relative rounded-3xl p-6 sm:p-10 bg-white/70 dark:bg-[#1A1924]/70 backdrop-blur-md border border-[#E8E2D9] dark:border-[#2D2A3B] shadow-sm overflow-hidden">
        {/* Background Ambient Aura */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#8B5CF6]/15 via-[#F472B6]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B5CF6]/10 text-[#8B5CF6] dark:text-[#A78BFA] text-xs font-semibold tracking-widest uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AURAFIT EDITORIAL STYLIST</span>
            </div>

            <div className="flex items-center gap-3.5 flex-wrap">
              <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white uppercase leading-tight">
                Hey there 👋
              </h1>

              {/* Subtly placed user profile photo beside greeting */}
              {user && (
                <div className="relative inline-flex items-center shrink-0">
                  <img
                    src={avatarUrl}
                    alt="AuraFit Member"
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-white dark:border-[#2D2A3B] shadow-md ring-2 ring-[#8B5CF6]/30"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-[#1A1924]" />
                </div>
              )}
            </div>

            <p className="font-serif italic text-lg sm:text-xl text-neutral-600 dark:text-neutral-300 mt-2">
              &ldquo;What are we styling today?&rdquo;
            </p>

            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-2 font-sans max-w-xl">
              You currently have <strong className="text-neutral-800 dark:text-neutral-200">{wardrobe.length} cataloged pieces</strong> ready for effortless matching and AI-guided daily formulas.
            </p>
          </div>

          {/* Quick Action CTAs */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <button
              id="btn-quick-generate-hero"
              onClick={onScrollToGenerator}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#1C1B1F] dark:bg-[#8B5CF6] hover:bg-black dark:hover:bg-[#7C3AED] text-white text-xs font-semibold tracking-wider uppercase shadow-md hover:shadow-lg transition-all cursor-pointer whitespace-nowrap"
            >
              <Wand2 className="w-4 h-4 text-[#F472B6] dark:text-white" />
              <span>Generate Outfit</span>
            </button>

            <button
              id="btn-quick-add-hero"
              onClick={onOpenAdd}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white dark:bg-[#201E2B] hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-900 dark:text-white text-xs font-semibold tracking-wider uppercase border border-[#E8E2D9] dark:border-[#2D2A3B] transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4 text-[#8B5CF6]" />
              <span>Add Clothing</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
