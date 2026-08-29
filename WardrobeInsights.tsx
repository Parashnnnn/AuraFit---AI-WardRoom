import React from 'react';
import { WardrobeItem } from '../types';
import { motion } from 'motion/react';
import { Sparkles, PieChart, Layers, Shuffle, Flame, Award } from 'lucide-react';

interface WardrobeInsightsProps {
  wardrobe: WardrobeItem[];
}

export const WardrobeInsights: React.FC<WardrobeInsightsProps> = ({ wardrobe }) => {
  const tops = wardrobe.filter((i) => i.category === 'Tops');
  const bottoms = wardrobe.filter((i) => i.category === 'Bottoms');
  const shoes = wardrobe.filter((i) => i.category === 'Shoes');
  const outerwear = wardrobe.filter((i) => i.category === 'Outerwear');

  // Realistic combinatorics calculation
  const outfitCombinations = Math.max(1, tops.length * bottoms.length * Math.max(1, shoes.length));
  const versatilityScore = Math.min(99, Math.round(70 + wardrobe.length * 2.5));

  // Color frequency
  const colorCounts: Record<string, number> = {};
  wardrobe.forEach((item) => {
    colorCounts[item.color] = (colorCounts[item.color] || 0) + 1;
  });
  const topColors = Object.entries(colorCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  // Most worn items
  const mostWorn = [...wardrobe].sort((a, b) => b.wearCount - a.wearCount).slice(0, 3);

  return (
    <section id="wardrobe-insights-section" className="py-8">
      <div className="rounded-3xl bg-white/70 dark:bg-[#1A1924]/70 border border-[#E8E2D9] dark:border-[#2D2A3B] shadow-sm p-6 sm:p-8 backdrop-blur-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#8B5CF6]/10 text-[#8B5CF6]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#8B5CF6] uppercase block">
                WARDROBE TELEMETRY
              </span>
              <h3 className="font-display text-xl font-bold uppercase tracking-tight text-neutral-900 dark:text-white">
                CLOSET VERSATILITY &amp; METRICS
              </h3>
            </div>
          </div>

          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            <Award className="w-3.5 h-3.5" />
            <span>Versatility Index: {versatilityScore}%</span>
          </div>
        </div>

        {/* 4-Stat Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#201E2B] border border-neutral-200/60 dark:border-neutral-800">
            <span className="text-[10px] font-mono text-neutral-400 uppercase block">
              Total Pieces
            </span>
            <p className="font-display text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mt-1">
              {wardrobe.length}
            </p>
            <span className="text-[11px] text-neutral-500 mt-1 block">Cataloged garments</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#201E2B] border border-neutral-200/60 dark:border-neutral-800">
            <span className="text-[10px] font-mono text-neutral-400 uppercase block">
              Potential Outfits
            </span>
            <p className="font-display text-2xl sm:text-3xl font-bold text-[#8B5CF6] mt-1">
              {outfitCombinations}+
            </p>
            <span className="text-[11px] text-neutral-500 mt-1 block">Unique styling permutations</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#201E2B] border border-neutral-200/60 dark:border-neutral-800">
            <span className="text-[10px] font-mono text-neutral-400 uppercase block">
              Tops / Bottoms
            </span>
            <p className="font-display text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mt-1">
              {tops.length} : {bottoms.length}
            </p>
            <span className="text-[11px] text-neutral-500 mt-1 block">Optimal restyle ratio</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#201E2B] border border-neutral-200/60 dark:border-neutral-800">
            <span className="text-[10px] font-mono text-neutral-400 uppercase block">
              Outerwear / Shoes
            </span>
            <p className="font-display text-2xl sm:text-3xl font-bold text-[#F472B6] mt-1">
              {outerwear.length} / {shoes.length}
            </p>
            <span className="text-[11px] text-neutral-500 mt-1 block">Layering &amp; accent pieces</span>
          </div>
        </div>

        {/* Color Palette & Wardrobe Heroes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-neutral-200/70 dark:border-neutral-800/80">
          {/* Dominant Palette */}
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block mb-3">
              Dominant Palette In Your Closet
            </span>
            <div className="flex flex-wrap gap-2">
              {topColors.map(([colorName, count]) => (
                <div
                  key={colorName}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/70 text-xs font-medium text-neutral-800 dark:text-neutral-200"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" />
                  <span>{colorName}</span>
                  <span className="text-[10px] font-mono text-neutral-400">({count} items)</span>
                </div>
              ))}
            </div>
          </div>

          {/* Wardrobe Heroes */}
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block mb-3">
              Most Versatile Wardrobe Heroes
            </span>
            <div className="space-y-2">
              {mostWorn.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-neutral-100/70 dark:bg-neutral-800/50 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-lg object-cover"
                    />
                    <span className="font-medium text-neutral-800 dark:text-neutral-200 truncate">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#8B5CF6] shrink-0">
                    {item.wearCount} wears
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
