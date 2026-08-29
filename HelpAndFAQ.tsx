import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronDown, Sparkles, Search } from 'lucide-react';

interface FAQItem {
  id: string;
  number: string;
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    number: '01',
    question: 'What is AuraFit?',
    answer:
      'AuraFit is an AI-powered personal stylist built exclusively around the clothes you already own. Rather than pushing fast-fashion shopping, AuraFit acts as your closet’s best friend—analyzing your garments, proportions, and occasion context to generate elevated outfit formulas without buying anything new.',
  },
  {
    id: 'faq-2',
    number: '02',
    question: 'How do I upload clothes?',
    answer:
      'Tap the ‘ADD’ tab in the navigation. You can upload a photo of your clothing item from your device, snap a live photo with your camera, or enter the garment details manually. AuraFit’s AI Vision automatically scans the photo to detect category, palette, fabric texture, and style silhouette.',
  },
  {
    id: 'faq-3',
    number: '03',
    question: 'How does AI generate outfits?',
    answer:
      'When you choose an occasion and style mood on the Home page, the AuraFit AI styling engine checks your uploaded wardrobe items, assesses color harmony and proportion balance, and generates curated, complete outfit looks with detailed stylist breakdowns explaining why each combination works.',
  },
  {
    id: 'faq-4',
    number: '04',
    question: 'Can I use only my wardrobe?',
    answer:
      'Yes! The ‘Use only my wardrobe’ toggle is turned ON by default. AuraFit is strictly built around conscious restyling of your existing pieces.',
  },
  {
    id: 'faq-5',
    number: '05',
    question: 'How do I add my size?',
    answer:
      'Open the PROFILE tab or adjust the Fit & Proportion Profile sliders inside the Outfit Generator. You can specify height, gender expression, clothing size, and preferred fit (Slim, Regular, Relaxed, or Oversized) to ensure tailored recommendations.',
  },
  {
    id: 'faq-6',
    number: '06',
    question: 'How do I save an outfit?',
    answer:
      'Whenever AuraFit generates an outfit you love, tap the ‘♡ SAVE’ button on the look card. The outfit will be immediately added to your ‘Saved Looks’ section on Home and inside your Profile.',
  },
  {
    id: 'faq-7',
    number: '07',
    question: 'How does personalization work?',
    answer:
      'AuraFit learns your aesthetic over time. When you rate generated looks with stars, thumbs up/down, or mark them as ‘Worn Today’, the recommendation engine adjusts color weights and pairing styles to match your personal taste.',
  },
  {
    id: 'faq-8',
    number: '08',
    question: 'How do I change the theme?',
    answer:
      'You can switch between Default (Editorial Warm Cream), Light (Crisp Studio), and Dark (Luxury Obsidian) themes using the quick theme toggle in the header or near the footer at the bottom of Home.',
  },
  {
    id: 'faq-9',
    number: '09',
    question: 'How do I delete a wardrobe item?',
    answer:
      'Click any piece in Your Digital Wardrobe grid to open its full detail modal, then tap ‘Delete Piece’ at the bottom right. The item will be permanently removed from your catalog.',
  },
  {
    id: 'faq-10',
    number: '10',
    question: 'How do I reset my wardrobe?',
    answer:
      'Open the PROFILE tab in the top navigation, scroll to the Data Management zone at the bottom, and tap ‘Reset Wardrobe’ to restore the default sample wardrobe.',
  },
];

export const HelpAndFAQ: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('faq-1');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = FAQS.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="help-faq-section" className="py-12 px-4 sm:px-6 max-w-4xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8B5CF6]/10 text-[#8B5CF6] dark:text-[#A78BFA] text-xs font-semibold tracking-widest uppercase mb-3">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>HOW AURAFIT WORKS &amp; NEED HELP?</span>
        </div>

        <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white uppercase">
          FREQUENTLY ASKED QUESTIONS
        </h2>

        <p className="font-serif italic text-base sm:text-lg text-neutral-600 dark:text-neutral-300 mt-2">
          “Everything you need to know about curating and styling your closet with AuraFit.”
        </p>

        {/* Search bar */}
        <div className="mt-6 max-w-md mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            id="faq-search-input"
            type="text"
            placeholder="Search questions or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-[#1E1D26] border border-[#E8E2D9] dark:border-[#2D2B3A] text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/40 transition-all shadow-xs"
          />
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.map((faq) => {
          const isOpen = openId === faq.id;

          return (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                isOpen
                  ? 'bg-white dark:bg-[#1E1D26] border-[#8B5CF6]/40 dark:border-[#8B5CF6]/40 shadow-md shadow-purple-500/5'
                  : 'bg-white/60 dark:bg-[#181720]/70 border-[#E8E2D9] dark:border-[#282633] hover:border-neutral-400 dark:hover:border-neutral-600'
              }`}
            >
              <button
                id={`faq-btn-${faq.id}`}
                onClick={() => toggleFAQ(faq.id)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <span className="text-xs font-mono font-bold tracking-wider text-[#8B5CF6] dark:text-[#A78BFA]">
                    {faq.number}
                  </span>
                  <h3 className="font-display font-medium text-sm sm:text-base text-neutral-900 dark:text-neutral-100">
                    {faq.question}
                  </h3>
                </div>

                <div
                  className={`p-1.5 rounded-full shrink-0 transition-transform duration-300 ${
                    isOpen
                      ? 'rotate-180 bg-[#8B5CF6]/10 text-[#8B5CF6]'
                      : 'text-neutral-400 bg-neutral-100 dark:bg-neutral-800'
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: 'easeInOut' }}
                  >
                    <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-sans border-t border-neutral-100 dark:border-neutral-800/80">
                      <p className="mt-2">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        {filteredFaqs.length === 0 && (
          <div className="text-center py-10 bg-white/40 dark:bg-white/[0.02] rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-800">
            <Sparkles className="w-6 h-6 text-neutral-400 mx-auto mb-2" />
            <p className="text-neutral-600 dark:text-neutral-400 text-xs">
              No matching questions found for &ldquo;{searchQuery}&rdquo;.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
