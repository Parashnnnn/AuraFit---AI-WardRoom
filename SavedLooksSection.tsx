import React, { useState } from 'react';
import { OutfitRecommendation, WardrobeItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  Trash2,
  Sparkles,
  Check,
  ArrowRight,
  X,
  Sparkle,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface SavedLooksSectionProps {
  savedOutfits: OutfitRecommendation[];
  wardrobe: WardrobeItem[];
  onRemoveSavedOutfit: (id: string) => void;
  onWearOutfit: (outfit: OutfitRecommendation) => void;
  onScrollToGenerator: () => void;
}

export const SavedLooksSection: React.FC<SavedLooksSectionProps> = ({
  savedOutfits,
  wardrobe,
  onRemoveSavedOutfit,
  onWearOutfit,
  onScrollToGenerator,
}) => {
  const [selectedOutfit, setSelectedOutfit] = useState<OutfitRecommendation | null>(null);

  const getItem = (id: string) => wardrobe.find((i) => i.id === id);

  return (
    <section id="saved-looks-section" className="py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#8B5CF6] dark:text-[#A78BFA] uppercase mb-1">
            <Heart className="w-3.5 h-3.5 fill-[#F472B6] text-[#F472B6]" />
            <span>COLLECTION ({savedOutfits.length} LOOKS)</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-neutral-900 dark:text-white">
            YOUR SAVED LOOKS
          </h2>
        </div>
      </div>

      {savedOutfits.length === 0 ? (
        <div className="text-center py-12 px-6 rounded-3xl bg-white/50 dark:bg-[#1A1924]/50 border border-dashed border-neutral-300 dark:border-neutral-800 max-w-md mx-auto">
          <Heart className="w-10 h-10 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
          <h3 className="font-display text-lg font-bold uppercase text-neutral-800 dark:text-neutral-200">
            No Saved Looks Yet
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-sans mb-4">
            Generate your first outfit in the CREATE tab and save the combinations you love.
          </p>
          <button
            id="btn-scroll-to-gen-empty"
            onClick={onScrollToGenerator}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer shadow-md shadow-purple-500/20"
          >
            <span>Go to Create Outfit ✦</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedOutfits.map((look) => (
            <motion.div
              key={look.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              whileHover={{ y: -4 }}
              onClick={() => setSelectedOutfit(look)}
              className="rounded-3xl bg-white dark:bg-[#1A1924] border border-[#E8E2D9] dark:border-[#2D2A3B] shadow-md hover:shadow-xl hover:border-[#8B5CF6]/40 transition-all p-5 flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-[#8B5CF6]">
                    {look.lookNumber}
                  </span>
                  <button
                    id={`btn-remove-saved-${look.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveSavedOutfit(look.id);
                    }}
                    className="text-neutral-400 hover:text-red-500 p-1 cursor-pointer transition-colors"
                    title="Remove from saved looks"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h4 className="font-display text-lg font-bold uppercase text-neutral-900 dark:text-white mb-2 group-hover:text-[#8B5CF6] dark:group-hover:text-[#A78BFA] transition-colors">
                  {look.title}
                </h4>

                <div className="grid grid-cols-3 gap-2 my-3">
                  {look.itemIds.map((itemId) => {
                    const item = getItem(itemId);
                    if (!item) return null;
                    return (
                      <div key={itemId} className="relative aspect-square rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[8px] text-white font-mono uppercase">
                          {item.category}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <p className="text-xs text-neutral-600 dark:text-neutral-400 font-serif italic mt-2 line-clamp-2">
                  &ldquo;{look.whyItWorks}&rdquo;
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                  {look.colorHarmony}% Harmony
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onWearOutfit(look);
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#1C1B1F] dark:bg-[#8B5CF6] text-white text-[11px] font-semibold tracking-wider uppercase cursor-pointer"
                >
                  <Check className="w-3 h-3" />
                  <span>Wear Today</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Saved Look Full Detail Modal with Prominent ✕ Close Button */}
      <AnimatePresence>
        {selectedOutfit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl rounded-3xl bg-white dark:bg-[#1A1924] border border-[#E8E2D9] dark:border-[#2D2A3B] shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto relative"
            >
              {/* Close Button */}
              <button
                id="btn-close-saved-look-modal"
                onClick={() => setSelectedOutfit(null)}
                className="absolute right-4 top-4 p-2 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-white bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer z-10"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="pr-8">
                <span className="text-xs font-mono font-bold tracking-widest text-[#8B5CF6] dark:text-[#A78BFA] uppercase">
                  {selectedOutfit.lookNumber} • {selectedOutfit.occasionBadge}
                </span>
                <h3 className="font-display text-2xl font-bold uppercase text-neutral-900 dark:text-white mt-1">
                  {selectedOutfit.title}
                </h3>
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-5">
                {selectedOutfit.itemIds.map((itemId) => {
                  const item = getItem(itemId);
                  if (!item) return null;
                  return (
                    <div
                      key={itemId}
                      className="p-2.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/60 flex flex-col"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-full aspect-square object-cover rounded-xl mb-2"
                      />
                      <span className="text-[9px] font-mono uppercase text-[#8B5CF6] dark:text-[#A78BFA]">
                        {item.category}
                      </span>
                      <h5 className="font-medium text-xs text-neutral-900 dark:text-white truncate">
                        {item.name}
                      </h5>
                      <span className="text-[10px] text-neutral-500">{item.color}</span>
                    </div>
                  );
                })}
              </div>

              {/* Stylist Notes */}
              <div className="p-4 rounded-2xl bg-[#8B5CF6]/5 border border-[#8B5CF6]/20 text-xs mb-5">
                <span className="font-semibold text-[#8B5CF6] dark:text-[#A78BFA] block mb-1">
                  Stylist Formula &amp; Proportions:
                </span>
                <p className="text-neutral-700 dark:text-neutral-300 font-serif italic">
                  &ldquo;{selectedOutfit.whyItWorks}&rdquo;
                </p>
              </div>

              {/* Harmonization breakdown */}
              {selectedOutfit.whyAuraFitChoseThis && (
                <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 text-xs space-y-2 mb-6">
                  <div>
                    <strong className="text-neutral-900 dark:text-white font-medium block">
                      Color Coordination:
                    </strong>
                    <span className="text-neutral-600 dark:text-neutral-400">
                      {selectedOutfit.whyAuraFitChoseThis.colorCoordination}
                    </span>
                  </div>
                  <div>
                    <strong className="text-neutral-900 dark:text-white font-medium block">
                      Occasion Suitability:
                    </strong>
                    <span className="text-neutral-600 dark:text-neutral-400">
                      {selectedOutfit.whyAuraFitChoseThis.occasionSuitability}
                    </span>
                  </div>
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  onClick={() => {
                    onRemoveSavedOutfit(selectedOutfit.id);
                    setSelectedOutfit(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Remove Look</span>
                </button>

                <button
                  onClick={() => {
                    onWearOutfit(selectedOutfit);
                    setSelectedOutfit(null);
                  }}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1C1B1F] dark:bg-[#8B5CF6] hover:bg-black dark:hover:bg-[#7C3AED] text-white text-xs font-semibold uppercase tracking-wider shadow-md transition-colors cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Wear This Today</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
