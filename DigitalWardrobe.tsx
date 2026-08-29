import React, { useState } from 'react';
import { WardrobeItem, Category } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shirt,
  Sparkles,
  Plus,
  Trash2,
  Heart,
  CheckCircle2,
  X,
  Tag,
  Clock,
  Layers,
  Sparkle,
} from 'lucide-react';

interface DigitalWardrobeProps {
  items: WardrobeItem[];
  onAddItemClick: () => void;
  onDeleteItem: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onLogWear: (id: string) => void;
}

export const DigitalWardrobe: React.FC<DigitalWardrobeProps> = ({
  items,
  onAddItemClick,
  onDeleteItem,
  onToggleFavorite,
  onLogWear,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [selectedItem, setSelectedItem] = useState<WardrobeItem | null>(null);

  const categories: Category[] = ['All', 'Tops', 'Bottoms', 'Shoes', 'Outerwear', 'Accessories'];

  const filteredItems =
    selectedCategory === 'All'
      ? items
      : items.filter((item) => item.category === selectedCategory);

  return (
    <section id="digital-wardrobe-section" className="py-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#8B5CF6] dark:text-[#A78BFA] uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>WARDROBE INVENTORY ({items.length} PIECES)</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-neutral-900 dark:text-white">
            YOUR DIGITAL WARDROBE
          </h2>
        </div>

        {/* Add Item Action */}
        <button
          id="btn-add-wardrobe-piece"
          onClick={onAddItemClick}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1C1B1F] dark:bg-[#8B5CF6] hover:bg-black dark:hover:bg-[#7C3AED] text-white text-xs font-semibold tracking-wider uppercase transition-all shadow-md shadow-purple-900/10 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Piece</span>
        </button>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          const count = cat === 'All' ? items.length : items.filter((i) => i.category === cat).length;

          return (
            <button
              key={cat}
              id={`filter-tab-${cat.toLowerCase()}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-medium tracking-wider uppercase whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-sm font-semibold'
                  : 'bg-white/70 dark:bg-[#1A1924]/70 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white border border-[#E8E2D9] dark:border-[#2D2A3B]'
              }`}
            >
              <span>{cat}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isActive
                    ? 'bg-white/20 dark:bg-black/20 text-current'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-16 px-6 rounded-3xl bg-white/60 dark:bg-[#1A1924]/50 border border-dashed border-neutral-300 dark:border-neutral-800 max-w-md mx-auto my-6">
          <motion.div
            animate={{ y: [0, -8, 0], rotate: [0, 2, -2, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#8B5CF6]/10 text-[#8B5CF6] dark:text-[#A78BFA] flex items-center justify-center"
          >
            <Shirt className="w-8 h-8 stroke-[1.5]" />
          </motion.div>
          <h3 className="font-display text-xl font-bold uppercase text-neutral-900 dark:text-white mb-2">
            Your wardrobe is waiting.
          </h3>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mb-6 font-sans">
            Add your first piece and let&apos;s build your first look.
          </p>
          <button
            id="btn-empty-add-first-item"
            onClick={onAddItemClick}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-semibold tracking-wider uppercase transition-all shadow-lg shadow-purple-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ ADD YOUR FIRST ITEM</span>
          </button>
        </div>
      )}

      {/* Grid of Items */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {filteredItems.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSelectedItem(item)}
            className="group cursor-pointer rounded-2xl bg-white dark:bg-[#1A1924] border border-[#E8E2D9] dark:border-[#2D2A3B] overflow-hidden shadow-sm hover:shadow-xl hover:border-[#8B5CF6]/40 dark:hover:border-[#8B5CF6]/40 transition-all flex flex-col relative"
          >
            {/* Image Box */}
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900">
              <img
                src={item.imageUrl}
                alt={item.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />

              {/* Category Tag */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-semibold tracking-wider uppercase text-white">
                {item.category}
              </div>

              {/* Favorite Indicator */}
              <button
                id={`btn-fav-${item.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(item.id);
                }}
                className={`absolute top-3 right-3 p-1.5 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                  item.isFavorite
                    ? 'bg-[#F472B6] text-white shadow-md'
                    : 'bg-black/40 text-white/80 hover:bg-black/60'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${item.isFavorite ? 'fill-current' : ''}`} />
              </button>

              {/* Color swatch pill */}
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-md text-[10px] font-medium text-neutral-800 dark:text-neutral-200">
                <span
                  className="w-2.5 h-2.5 rounded-full border border-black/10"
                  style={{
                    backgroundColor:
                      item.color.toLowerCase() === 'white'
                        ? '#ffffff'
                        : item.color.toLowerCase() === 'black'
                        ? '#1a1a1a'
                        : item.color.toLowerCase().includes('cream') || item.color.toLowerCase().includes('sand')
                        ? '#EADBC8'
                        : item.color.toLowerCase().includes('blue') || item.color.toLowerCase().includes('indigo')
                        ? '#3B82F6'
                        : item.color.toLowerCase().includes('olive') || item.color.toLowerCase().includes('green')
                        ? '#556B2F'
                        : item.color.toLowerCase().includes('brown') || item.color.toLowerCase().includes('tan')
                        ? '#8B4513'
                        : '#8B5CF6',
                  }}
                />
                <span>{item.color}</span>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-3.5 flex flex-col flex-1 justify-between">
              <div>
                <h4 className="font-display font-medium text-sm text-neutral-900 dark:text-neutral-100 line-clamp-1 group-hover:text-[#8B5CF6] dark:group-hover:text-[#A78BFA] transition-colors">
                  {item.name}
                </h4>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Added {item.dateAdded}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
                <span className="font-mono text-[10px] uppercase tracking-wider">{item.style}</span>
                <span className="text-[10px] font-mono">{item.wearCount} wears</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Item Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl rounded-3xl bg-white dark:bg-[#1A1924] border border-[#E8E2D9] dark:border-[#2D2A3B] shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col md:flex-row"
            >
              {/* Close Button */}
              <button
                id="btn-close-item-detail"
                onClick={() => setSelectedItem(null)}
                className="absolute right-4 top-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-md transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Photo View */}
              <div className="md:w-1/2 relative bg-neutral-100 dark:bg-neutral-900 aspect-square md:aspect-auto">
                <img
                  src={selectedItem.imageUrl}
                  alt={selectedItem.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-xs font-semibold tracking-wider uppercase text-white">
                  {selectedItem.category}
                </div>
              </div>

              {/* Item Metadata */}
              <div className="p-6 md:w-1/2 flex flex-col justify-between overflow-y-auto">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono uppercase tracking-widest text-[#8B5CF6] dark:text-[#A78BFA]">
                      {selectedItem.brand || 'Wardrobe Core'}
                    </span>
                    <button
                      id="btn-detail-fav-toggle"
                      onClick={() => onToggleFavorite(selectedItem.id)}
                      className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                        selectedItem.isFavorite
                          ? 'text-[#F472B6]'
                          : 'text-neutral-400 hover:text-neutral-600'
                      }`}
                    >
                      <Heart
                        className={`w-5 h-5 ${selectedItem.isFavorite ? 'fill-current' : ''}`}
                      />
                    </button>
                  </div>

                  <h3 className="font-display text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white uppercase leading-tight mb-4">
                    {selectedItem.name}
                  </h3>

                  {/* Metadata Specification Grid */}
                  <div className="grid grid-cols-2 gap-2.5 text-xs mb-6">
                    <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/60">
                      <span className="block text-[10px] font-mono text-neutral-400 uppercase">
                        Color
                      </span>
                      <span className="font-medium text-neutral-800 dark:text-neutral-200">
                        {selectedItem.color}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/60">
                      <span className="block text-[10px] font-mono text-neutral-400 uppercase">
                        Size &amp; Fit
                      </span>
                      <span className="font-medium text-neutral-800 dark:text-neutral-200">
                        {selectedItem.size} / {selectedItem.fit}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/60">
                      <span className="block text-[10px] font-mono text-neutral-400 uppercase">
                        Style
                      </span>
                      <span className="font-medium text-neutral-800 dark:text-neutral-200">
                        {selectedItem.style}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/60">
                      <span className="block text-[10px] font-mono text-neutral-400 uppercase">
                        Material
                      </span>
                      <span className="font-medium text-neutral-800 dark:text-neutral-200">
                        {selectedItem.material || 'Standard Fabric'}
                      </span>
                    </div>
                  </div>

                  {/* Notes / Styling Strengths */}
                  {selectedItem.notes && (
                    <div className="p-3.5 rounded-2xl bg-[#8B5CF6]/5 border border-[#8B5CF6]/20 text-xs text-neutral-700 dark:text-neutral-300 mb-6">
                      <div className="flex items-center gap-1.5 font-semibold text-[#8B5CF6] dark:text-[#A78BFA] mb-1">
                        <Sparkle className="w-3.5 h-3.5" />
                        <span>Stylist Notes</span>
                      </div>
                      <p className="font-serif italic leading-relaxed">{selectedItem.notes}</p>
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-3">
                  <button
                    id="btn-log-wear-count"
                    onClick={() => onLogWear(selectedItem.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-medium text-neutral-800 dark:text-neutral-200 transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Worn ({selectedItem.wearCount})</span>
                  </button>

                  <button
                    id="btn-delete-item"
                    onClick={() => {
                      onDeleteItem(selectedItem.id);
                      setSelectedItem(null);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-medium transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Piece</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
