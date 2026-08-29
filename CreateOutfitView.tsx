import React, { useState, useMemo } from 'react';
import {
  WardrobeItem,
  OutfitRecommendation,
  Occasion,
  StyleOption,
  ColorPreference,
  GenderOption,
  FitPreference,
  ClothingSize,
} from '../types';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Heart,
  Check,
  ChevronDown,
  ChevronUp,
  Shirt,
  RefreshCw,
  ArrowRight,
  Sparkle,
  X,
  Sliders,
  Plus,
  Compass,
  CheckCircle2,
  Trash2,
  Eye,
  SlidersHorizontal,
  Info,
  Palette,
  Layers,
  Wand2,
} from 'lucide-react';
import { getAuthHeaders } from '../lib/firebase';
import confetti from 'canvas-confetti';

interface CreateOutfitViewProps {
  wardrobe: WardrobeItem[];
  savedOutfits: OutfitRecommendation[];
  onSaveOutfit: (outfit: OutfitRecommendation) => void;
  onWearOutfit: (outfit: OutfitRecommendation) => void;
  onRateOutfit: (outfitId: string, rating: number, feedback: 'up' | 'down') => void;
  onOutfitGenerated?: (outfit: OutfitRecommendation, context: { occasion?: string; style?: string; mood?: string }) => void;
  onOpenAddTab: () => void;
  onClose?: () => void;
  initialPreferences?: {
    gender?: GenderOption;
    height?: string;
    bodyFit?: FitPreference;
    clothingSize?: ClothingSize;
  };
}

type SlotCategory = 'Top' | 'Bottom' | 'Shoes' | 'Outerwear' | 'Accessories';

const OCCASIONS: Occasion[] = [
  'College',
  'Casual',
  'Party',
  'Date',
  'Interview',
  'Wedding',
  'Festival',
  'Travel',
  'Formal',
  'Streetwear',
  'Other',
];

const STYLES: StyleOption[] = [
  'Minimal',
  'Classic',
  'Smart Casual',
  'Streetwear',
  'Oversized',
  'Trendy',
  'Formal',
  'Traditional',
  'Old Money',
  'Casual',
];

const COLOR_PREFERENCES: ColorPreference[] = [
  'Any',
  'Neutral',
  'Black & White',
  'Earth Tones',
  'Blue',
  'Pastel',
  'Dark',
  'Bright',
];

export const CreateOutfitView: React.FC<CreateOutfitViewProps> = ({
  wardrobe,
  savedOutfits,
  onSaveOutfit,
  onWearOutfit,
  onRateOutfit,
  onOutfitGenerated,
  onOpenAddTab,
  onClose,
  initialPreferences,
}) => {
  // Selections
  const [selectedTop, setSelectedTop] = useState<WardrobeItem | null>(null);
  const [selectedBottom, setSelectedBottom] = useState<WardrobeItem | null>(null);
  const [selectedShoes, setSelectedShoes] = useState<WardrobeItem | null>(null);
  const [selectedOuterwear, setSelectedOuterwear] = useState<WardrobeItem | null>(null);
  const [selectedAccessories, setSelectedAccessories] = useState<WardrobeItem | null>(null);

  // Styling choices
  const [occasion, setOccasion] = useState<Occasion>('Casual');
  const [style, setStyle] = useState<StyleOption>('Smart Casual');
  const [colorPreference, setColorPreference] = useState<ColorPreference>('Any');

  // Personal preferences (pre-filled from profile)
  const [gender, setGender] = useState<GenderOption>(initialPreferences?.gender || 'Male');
  const [height, setHeight] = useState<string>(initialPreferences?.height || "5'10\"");
  const [bodyFit, setBodyFit] = useState<FitPreference>(initialPreferences?.bodyFit || 'Regular');
  const [clothingSize, setClothingSize] = useState<ClothingSize>(initialPreferences?.clothingSize || 'M');
  const [showPersonalPrefs, setShowPersonalPrefs] = useState(false);

  // Active Picker Modal/Sheet
  const [activePickerSlot, setActivePickerSlot] = useState<SlotCategory | null>(null);
  const [pickerSearch, setPickerSearch] = useState('');
  const [pickerSubcategory, setPickerSubcategory] = useState<string>('All');

  // Generation & Result State
  const [viewMode, setViewMode] = useState<'builder' | 'result'>('builder');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [generatedLook, setGeneratedLook] = useState<OutfitRecommendation | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSavedToast, setIsSavedToast] = useState(false);

  // Filter wardrobe by categories
  const tops = useMemo(() => wardrobe.filter((i) => i.category === 'Tops'), [wardrobe]);
  const bottoms = useMemo(() => wardrobe.filter((i) => i.category === 'Bottoms'), [wardrobe]);
  const shoes = useMemo(() => wardrobe.filter((i) => i.category === 'Shoes'), [wardrobe]);
  const outerwear = useMemo(() => wardrobe.filter((i) => i.category === 'Outerwear'), [wardrobe]);
  const accessories = useMemo(() => wardrobe.filter((i) => i.category === 'Accessories'), [wardrobe]);

  // Selected item count
  const selectedItemsCount = [
    selectedTop,
    selectedBottom,
    selectedShoes,
    selectedOuterwear,
    selectedAccessories,
  ].filter(Boolean).length;

  const generationSteps = [
    'CATALOGING YOUR SELECTED PIECES',
    'APPLYING OCCASION & STYLE ARCHETYPES',
    'CALCULATING CHROMATIC & SILHOUETTE BALANCE',
    'FORMULATING YOUR SIGNATURE OUTFIT',
  ];

  // Helper to open picker
  const openPicker = (slot: SlotCategory) => {
    setActivePickerSlot(slot);
    setPickerSearch('');
    setPickerSubcategory('All');
  };

  // Helper to close picker
  const closePicker = () => {
    setActivePickerSlot(null);
  };

  // Items for active picker
  const currentSlotItems = useMemo(() => {
    if (!activePickerSlot) return [];
    let items: WardrobeItem[] = [];
    switch (activePickerSlot) {
      case 'Top':
        items = tops;
        break;
      case 'Bottom':
        items = bottoms;
        break;
      case 'Shoes':
        items = shoes;
        break;
      case 'Outerwear':
        items = outerwear;
        break;
      case 'Accessories':
        items = accessories;
        break;
    }

    return items.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(pickerSearch.toLowerCase()) ||
        item.color.toLowerCase().includes(pickerSearch.toLowerCase()) ||
        (item.material && item.material.toLowerCase().includes(pickerSearch.toLowerCase())) ||
        (item.style && item.style.toLowerCase().includes(pickerSearch.toLowerCase()));

      if (pickerSubcategory === 'All') return matchSearch;
      return matchSearch && (item.name.toLowerCase().includes(pickerSubcategory.toLowerCase()) || (item.style && item.style.toLowerCase().includes(pickerSubcategory.toLowerCase())));
    });
  }, [activePickerSlot, tops, bottoms, shoes, outerwear, accessories, pickerSearch, pickerSubcategory]);

  // Subcategories derived from active items
  const slotSubcategories = useMemo(() => {
    if (!activePickerSlot) return ['All'];
    switch (activePickerSlot) {
      case 'Top':
        return ['All', 'Shirt', 'T-Shirt', 'Sweatshirt', 'Hoodie', 'Kurta', 'Top'];
      case 'Bottom':
        return ['All', 'Jeans', 'Trouser', 'Pant', 'Cargo', 'Shorts', 'Traditional'];
      case 'Shoes':
        return ['All', 'Sneaker', 'Loafer', 'Formal', 'Boot', 'Sandal'];
      case 'Outerwear':
        return ['All', 'Jacket', 'Blazer', 'Denim', 'Coat', 'Overshirt'];
      case 'Accessories':
        return ['All', 'Watch', 'Belt', 'Cap', 'Bag', 'Glasses'];
      default:
        return ['All'];
    }
  }, [activePickerSlot]);

  // Handle item selection in picker
  const handleSelectItem = (item: WardrobeItem) => {
    if (!activePickerSlot) return;
    switch (activePickerSlot) {
      case 'Top':
        setSelectedTop(selectedTop?.id === item.id ? null : item);
        break;
      case 'Bottom':
        setSelectedBottom(selectedBottom?.id === item.id ? null : item);
        break;
      case 'Shoes':
        setSelectedShoes(selectedShoes?.id === item.id ? null : item);
        break;
      case 'Outerwear':
        setSelectedOuterwear(selectedOuterwear?.id === item.id ? null : item);
        break;
      case 'Accessories':
        setSelectedAccessories(selectedAccessories?.id === item.id ? null : item);
        break;
    }
    closePicker();
  };

  // Clear slot
  const handleClearSlot = (slot: SlotCategory, e: React.MouseEvent) => {
    e.stopPropagation();
    switch (slot) {
      case 'Top':
        setSelectedTop(null);
        break;
      case 'Bottom':
        setSelectedBottom(null);
        break;
      case 'Shoes':
        setSelectedShoes(null);
        break;
      case 'Outerwear':
        setSelectedOuterwear(null);
        break;
      case 'Accessories':
        setSelectedAccessories(null);
        break;
    }
  };

  // Call generation API
  const handleGenerateOutfit = async () => {
    if (selectedItemsCount === 0) {
      setErrorMessage('Please select at least one item from your wardrobe to build your outfit.');
      setTimeout(() => setErrorMessage(null), 4000);
      return;
    }

    setErrorMessage(null);
    setIsGenerating(true);
    setGenerationStep(0);

    const stepInterval = setInterval(() => {
      setGenerationStep((prev) => (prev < generationSteps.length - 1 ? prev + 1 : prev));
    }, 700);

    try {
      const authHeaders = await getAuthHeaders();
      const response = await fetch('/api/generate-outfit-look', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify({
          selectedTop,
          selectedBottom,
          selectedShoes,
          selectedOuterwear,
          selectedAccessories,
          preferences: {
            occasion,
            style,
            colorPreference,
            gender,
            height,
            bodyFit,
            clothingSize,
          },
          wardrobe,
        }),
      });

      clearInterval(stepInterval);

      if (!response.ok) {
        throw new Error('Failed to generate outfit. Please try again.');
      }

      const data = await response.json();
      if (data.outfit) {
        setGeneratedLook(data.outfit);
        setViewMode('result');

        if (onOutfitGenerated) {
          onOutfitGenerated(data.outfit, { occasion, style });
        }

        try {
          confetti({
            particleCount: 40,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#8B5CF6', '#EC4899', '#3B82F6', '#F59E0B'],
          });
        } catch {
          // ignore canvas-confetti issues
        }
      }
    } catch (err: any) {
      clearInterval(stepInterval);
      console.error('Error creating outfit:', err);
      // Fallback local creation so user never gets blocked
      const fallbackOutfit: OutfitRecommendation = {
        id: `look-local-${Date.now()}`,
        lookNumber: 'YOUR LOOK',
        title: `${selectedTop?.color || 'Modern'} & ${selectedBottom?.color || 'Refined'} ${style}`,
        occasionBadge: `${occasion.toUpperCase()} / ${style.toUpperCase()}`,
        badge: `${occasion.toUpperCase()} / ${style.toUpperCase()}`,
        itemIds: [selectedTop?.id, selectedBottom?.id, selectedShoes?.id, selectedOuterwear?.id, selectedAccessories?.id].filter(Boolean) as string[],
        whyItWorks: `Your ${selectedTop?.name || 'top'} pairs with your ${selectedBottom?.name || 'bottom'} to deliver clean proportions and relaxed versatility for ${occasion}.`,
        colorHarmony: 94,
        occasionFit: 96,
        styleMatch: 93,
        overallScore: 95,
        stylingTip: 'Tuck the front hemline into your trousers to lengthen leg line and emphasize clean tailoring.',
        whyAuraFitChoseThis: {
          colorCoordination: `The combination of ${[selectedTop?.color, selectedBottom?.color, selectedShoes?.color].filter(Boolean).join(' and ')} creates a harmonious palette.`,
          occasionSuitability: `Ideal for ${occasion}, balancing tailored comfort and contemporary style.`,
          styleCompatibility: `Embraces a ${style} aesthetic with uncluttered structure.`,
          fitContext: `Optimized for ${height} with a ${bodyFit} silhouette.`,
          wardrobeAvailability: 'Crafted 100% directly from your selected wardrobe pieces.',
        },
        occasion,
        style,
        colorPreference,
        selectedTop: selectedTop || undefined,
        selectedBottom: selectedBottom || undefined,
        selectedShoes: selectedShoes || undefined,
        selectedOuterwear: selectedOuterwear || undefined,
        selectedAccessories: selectedAccessories || undefined,
        aiStyledFootwear: !selectedShoes ? 'Clean White Minimalist Court Shoes' : undefined,
        aiStyledAccessories: !selectedAccessories ? 'Classic leather watch' : undefined,
        aiStyledItems: [
          ...(!selectedShoes ? ['Footwear: Clean Minimalist Shoes (AI-Styled)'] : []),
        ],
        generatedAt: new Date().toISOString(),
      };
      setGeneratedLook(fallbackOutfit);
      setViewMode('result');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle Save
  const handleSaveCurrentLook = () => {
    if (!generatedLook) return;
    onSaveOutfit(generatedLook);
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 3000);
  };

  const isAlreadySaved = generatedLook
    ? savedOutfits.some((s) => s.id === generatedLook.id || s.title === generatedLook.title)
    : false;

  // RENDER: Loading Overlay
  if (isGenerating) {
    return (
      <div className="py-16 px-4 text-center max-w-lg mx-auto">
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-[#8B5CF6]/20 animate-ping" />
          <div className="absolute inset-0 rounded-full border-4 border-t-[#8B5CF6] border-r-[#EC4899] border-b-transparent border-l-transparent animate-spin" />
          <div className="absolute inset-3 rounded-full bg-white dark:bg-[#1A1924] shadow-md flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-[#8B5CF6] animate-pulse" />
          </div>
        </div>

        <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-neutral-900 dark:text-white mb-2">
          CRAFTING YOUR LOOK
        </h3>
        <p className="text-xs font-mono font-semibold tracking-widest text-[#8B5CF6] dark:text-[#A78BFA] uppercase mb-4 h-6">
          {generationSteps[generationStep]}
        </p>

        {/* Selected pieces preview in loader */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {[selectedTop, selectedBottom, selectedShoes, selectedOuterwear, selectedAccessories]
            .filter(Boolean)
            .map((item, idx) => (
              <div
                key={idx}
                className="w-12 h-14 rounded-xl overflow-hidden border border-[#E8E2D9] dark:border-[#2D2A3B] shadow-sm bg-neutral-100 dark:bg-neutral-800"
              >
                <img
                  src={item!.imageUrl}
                  alt={item!.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
        </div>
      </div>
    );
  }

  // RENDER: Generated Result View
  if (viewMode === 'result' && generatedLook) {
    return (
      <div className="space-y-8 pb-12">
        {/* Result Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B5CF6]/10 text-[#8B5CF6] dark:text-[#A78BFA] text-xs font-mono font-bold tracking-widest uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>YOUR LOOK</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-bold uppercase tracking-tight text-neutral-900 dark:text-white">
              {generatedLook.title}
            </h2>
            <p className="text-xs font-mono tracking-widest text-neutral-500 uppercase mt-1">
              {generatedLook.occasionBadge || `${occasion.toUpperCase()} • ${style.toUpperCase()}`}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              id="btn-edit-outfit-result"
              onClick={() => setViewMode('builder')}
              className="px-4 py-2.5 rounded-full bg-white dark:bg-[#1A1924] border border-[#E8E2D9] dark:border-[#2D2A3B] text-neutral-800 dark:text-neutral-200 text-xs font-semibold uppercase tracking-wider hover:border-[#8B5CF6] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Edit Outfit</span>
            </button>
            <button
              id="btn-regenerate-outfit-result"
              onClick={handleGenerateOutfit}
              className="px-4 py-2.5 rounded-full bg-white dark:bg-[#1A1924] border border-[#E8E2D9] dark:border-[#2D2A3B] text-neutral-800 dark:text-neutral-200 text-xs font-semibold uppercase tracking-wider hover:border-[#8B5CF6] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Regenerate</span>
            </button>
            <button
              id="btn-save-outfit-result"
              onClick={handleSaveCurrentLook}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shadow-md ${
                isAlreadySaved
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#1C1B1F] dark:bg-[#8B5CF6] hover:bg-black dark:hover:bg-[#7C3AED] text-white'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isAlreadySaved ? 'fill-white' : ''}`} />
              <span>{isAlreadySaved ? 'Saved in Looks ✓' : 'Save Outfit'}</span>
            </button>
          </div>
        </div>

        {/* Saved Notification Toast */}
        <AnimatePresence>
          {isSavedToast && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-medium flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Outfit saved successfully to your Saved Looks collection!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Result Display: Large Look Presentation + Side Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left / Center: Large Look Visual */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-[#1A1924] border border-[#E8E2D9] dark:border-[#2D2A3B] shadow-lg aspect-[3/4] flex items-center justify-center p-4">
              {generatedLook.generatedImageUrl ? (
                <img
                  src={generatedLook.generatedImageUrl}
                  alt={generatedLook.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-2xl shadow-inner"
                />
              ) : (
                /* Rich Editorial Visual Lookbook Composite */
                <div className="w-full h-full flex flex-col justify-between p-6 bg-gradient-to-b from-neutral-50 to-neutral-100/60 dark:from-[#201E2B] dark:to-[#16151E] rounded-2xl border border-neutral-200 dark:border-neutral-700/60">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono tracking-widest uppercase font-bold text-[#8B5CF6]">
                      AURAFIT LOOKBOOK
                    </span>
                    <span className="text-[10px] font-mono uppercase bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-2 py-0.5 rounded-full font-bold">
                      {occasion}
                    </span>
                  </div>

                  {/* Wardrobe collage cards */}
                  <div className="grid grid-cols-2 gap-3 my-4">
                    {selectedTop && (
                      <div className="rounded-2xl overflow-hidden bg-white dark:bg-[#1A1924] border border-[#E8E2D9] dark:border-[#2D2A3B] p-2 shadow-sm text-center">
                        <div className="aspect-square rounded-xl overflow-hidden mb-1.5 bg-neutral-100 dark:bg-neutral-800">
                          <img
                            src={selectedTop.imageUrl}
                            alt={selectedTop.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-[10px] font-mono uppercase text-[#8B5CF6] font-bold block truncate">
                          TOP
                        </span>
                        <p className="text-[11px] font-bold text-neutral-900 dark:text-white truncate">
                          {selectedTop.name}
                        </p>
                      </div>
                    )}

                    {selectedBottom && (
                      <div className="rounded-2xl overflow-hidden bg-white dark:bg-[#1A1924] border border-[#E8E2D9] dark:border-[#2D2A3B] p-2 shadow-sm text-center">
                        <div className="aspect-square rounded-xl overflow-hidden mb-1.5 bg-neutral-100 dark:bg-neutral-800">
                          <img
                            src={selectedBottom.imageUrl}
                            alt={selectedBottom.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-[10px] font-mono uppercase text-[#8B5CF6] font-bold block truncate">
                          BOTTOM
                        </span>
                        <p className="text-[11px] font-bold text-neutral-900 dark:text-white truncate">
                          {selectedBottom.name}
                        </p>
                      </div>
                    )}

                    {selectedShoes && (
                      <div className="rounded-2xl overflow-hidden bg-white dark:bg-[#1A1924] border border-[#E8E2D9] dark:border-[#2D2A3B] p-2 shadow-sm text-center">
                        <div className="aspect-square rounded-xl overflow-hidden mb-1.5 bg-neutral-100 dark:bg-neutral-800">
                          <img
                            src={selectedShoes.imageUrl}
                            alt={selectedShoes.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-[10px] font-mono uppercase text-[#8B5CF6] font-bold block truncate">
                          SHOES
                        </span>
                        <p className="text-[11px] font-bold text-neutral-900 dark:text-white truncate">
                          {selectedShoes.name}
                        </p>
                      </div>
                    )}

                    {selectedOuterwear && (
                      <div className="rounded-2xl overflow-hidden bg-white dark:bg-[#1A1924] border border-[#E8E2D9] dark:border-[#2D2A3B] p-2 shadow-sm text-center">
                        <div className="aspect-square rounded-xl overflow-hidden mb-1.5 bg-neutral-100 dark:bg-neutral-800">
                          <img
                            src={selectedOuterwear.imageUrl}
                            alt={selectedOuterwear.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-[10px] font-mono uppercase text-[#8B5CF6] font-bold block truncate">
                          OUTERWEAR
                        </span>
                        <p className="text-[11px] font-bold text-neutral-900 dark:text-white truncate">
                          {selectedOuterwear.name}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="text-center pt-2 border-t border-neutral-200/80 dark:border-neutral-700/80">
                    <p className="font-serif italic text-sm text-neutral-700 dark:text-neutral-300">
                      &ldquo;{generatedLook.whyItWorks}&rdquo;
                    </p>
                  </div>
                </div>
              )}

              {/* Verified Wardrobe Authentic Badge */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                <span className="px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md text-white text-[10px] font-mono font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-md">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>WARDROBE-AUTHENTIC</span>
                </span>
                <span className="px-3 py-1.5 rounded-full bg-[#8B5CF6]/90 backdrop-blur-md text-white text-[10px] font-mono font-bold tracking-wider uppercase shadow-md">
                  {style}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Selected Pieces Breakdown & Styling Insights */}
          <div className="lg:col-span-6 space-y-6">
            {/* Selected Wardrobe Breakdown Card */}
            <div className="rounded-3xl bg-white dark:bg-[#1A1924] border border-[#E8E2D9] dark:border-[#2D2A3B] p-6 shadow-sm space-y-4">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#8B5CF6]" />
                <span>OUTFIT PIECES BREAKDOWN</span>
              </h3>

              <div className="space-y-3">
                {/* TOP */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/70">
                  <div className="flex items-center gap-3 min-w-0">
                    {selectedTop ? (
                      <img
                        src={selectedTop.imageUrl}
                        alt={selectedTop.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-xl object-cover shrink-0 border border-[#E8E2D9] dark:border-[#2D2A3B]"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-neutral-400 shrink-0">
                        <Shirt className="w-5 h-5" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono font-bold tracking-wider text-[#8B5CF6] uppercase block">
                        TOP
                      </span>
                      <p className="text-sm font-bold text-neutral-900 dark:text-white truncate">
                        {selectedTop ? selectedTop.name : 'None Selected'}
                      </p>
                      {selectedTop && (
                        <p className="text-[11px] text-neutral-500 truncate">
                          {selectedTop.color} • {selectedTop.pattern || 'Solid'} • {selectedTop.fit || 'Regular'}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-1 rounded-full bg-white dark:bg-[#1A1924] text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 shrink-0">
                    {selectedTop ? 'My Wardrobe ✓' : 'Empty'}
                  </span>
                </div>

                {/* BOTTOM */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/70">
                  <div className="flex items-center gap-3 min-w-0">
                    {selectedBottom ? (
                      <img
                        src={selectedBottom.imageUrl}
                        alt={selectedBottom.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-xl object-cover shrink-0 border border-[#E8E2D9] dark:border-[#2D2A3B]"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-neutral-400 shrink-0">
                        <Layers className="w-5 h-5" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono font-bold tracking-wider text-[#8B5CF6] uppercase block">
                        BOTTOM
                      </span>
                      <p className="text-sm font-bold text-neutral-900 dark:text-white truncate">
                        {selectedBottom ? selectedBottom.name : 'None Selected'}
                      </p>
                      {selectedBottom && (
                        <p className="text-[11px] text-neutral-500 truncate">
                          {selectedBottom.color} • {selectedBottom.fit || 'Regular'}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-1 rounded-full bg-white dark:bg-[#1A1924] text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 shrink-0">
                    {selectedBottom ? 'My Wardrobe ✓' : 'Empty'}
                  </span>
                </div>

                {/* SHOES */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/70">
                  <div className="flex items-center gap-3 min-w-0">
                    {selectedShoes ? (
                      <img
                        src={selectedShoes.imageUrl}
                        alt={selectedShoes.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-xl object-cover shrink-0 border border-[#E8E2D9] dark:border-[#2D2A3B]"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-[#8B5CF6] flex items-center justify-center shrink-0">
                        <Sparkles className="w-5 h-5" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono font-bold tracking-wider text-[#8B5CF6] uppercase block">
                        SHOES
                      </span>
                      <p className="text-sm font-bold text-neutral-900 dark:text-white truncate">
                        {selectedShoes ? selectedShoes.name : (generatedLook.aiStyledFootwear || 'AI-Styled Footwear')}
                      </p>
                      <p className="text-[11px] text-neutral-500 truncate">
                        {selectedShoes ? selectedShoes.color : 'Stylist Recommendation'}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-1 rounded-full border shrink-0 ${
                      selectedShoes
                        ? 'bg-white dark:bg-[#1A1924] text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700'
                        : 'bg-purple-100 dark:bg-purple-900/50 text-[#8B5CF6] dark:text-[#A78BFA] border-purple-200 dark:border-purple-800'
                    }`}
                  >
                    {selectedShoes ? 'My Wardrobe ✓' : 'AI-Styled'}
                  </span>
                </div>

                {/* OUTERWEAR (If selected) */}
                {selectedOuterwear && (
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/70">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={selectedOuterwear.imageUrl}
                        alt={selectedOuterwear.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-xl object-cover shrink-0 border border-[#E8E2D9] dark:border-[#2D2A3B]"
                      />
                      <div className="min-w-0">
                        <span className="text-[10px] font-mono font-bold tracking-wider text-[#8B5CF6] uppercase block">
                          OUTERWEAR
                        </span>
                        <p className="text-sm font-bold text-neutral-900 dark:text-white truncate">
                          {selectedOuterwear.name}
                        </p>
                        <p className="text-[11px] text-neutral-500 truncate">{selectedOuterwear.color}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono uppercase px-2 py-1 rounded-full bg-white dark:bg-[#1A1924] text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 shrink-0">
                      My Wardrobe ✓
                    </span>
                  </div>
                )}

                {/* ACCESSORIES (If selected) */}
                {selectedAccessories && (
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/70">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={selectedAccessories.imageUrl}
                        alt={selectedAccessories.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-xl object-cover shrink-0 border border-[#E8E2D9] dark:border-[#2D2A3B]"
                      />
                      <div className="min-w-0">
                        <span className="text-[10px] font-mono font-bold tracking-wider text-[#8B5CF6] uppercase block">
                          ACCESSORIES
                        </span>
                        <p className="text-sm font-bold text-neutral-900 dark:text-white truncate">
                          {selectedAccessories.name}
                        </p>
                        <p className="text-[11px] text-neutral-500 truncate">{selectedAccessories.color}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono uppercase px-2 py-1 rounded-full bg-white dark:bg-[#1A1924] text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 shrink-0">
                      My Wardrobe ✓
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Editorial Why It Works & Styling Pro Tip */}
            <div className="rounded-3xl bg-white dark:bg-[#1A1924] border border-[#E8E2D9] dark:border-[#2D2A3B] p-6 shadow-sm space-y-4">
              <div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#8B5CF6] mb-1">
                  EDITORIAL STYLING EVALUATION
                </h4>
                <p className="text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed font-sans">
                  {generatedLook.whyItWorks}
                </p>
              </div>

              {generatedLook.stylingTip && (
                <div className="p-3.5 rounded-2xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8B5CF6] block mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    <span>PRO STYLING TIP</span>
                  </span>
                  <p className="text-xs text-neutral-800 dark:text-neutral-200 font-medium">
                    {generatedLook.stylingTip}
                  </p>
                </div>
              )}

              {/* Synergy Metrics */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 text-center">
                  <span className="text-[10px] font-mono uppercase text-neutral-500 block">HARMONY</span>
                  <span className="text-lg font-bold text-neutral-900 dark:text-white font-mono">
                    {generatedLook.colorHarmony}%
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 text-center">
                  <span className="text-[10px] font-mono uppercase text-neutral-500 block">OCCASION</span>
                  <span className="text-lg font-bold text-neutral-900 dark:text-white font-mono">
                    {generatedLook.occasionFit}%
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 text-center">
                  <span className="text-[10px] font-mono uppercase text-neutral-500 block">STYLE MATCH</span>
                  <span className="text-lg font-bold text-neutral-900 dark:text-white font-mono">
                    {generatedLook.styleMatch}%
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                id="btn-return-builder"
                onClick={() => setViewMode('builder')}
                className="flex-1 py-3.5 rounded-full bg-white dark:bg-[#1A1924] border border-[#E8E2D9] dark:border-[#2D2A3B] hover:border-[#8B5CF6] text-neutral-900 dark:text-white text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer text-center"
              >
                Change Selections
              </button>
              <button
                id="btn-save-look-bottom"
                onClick={handleSaveCurrentLook}
                className="flex-1 py-3.5 rounded-full bg-[#1C1B1F] dark:bg-[#8B5CF6] hover:bg-black dark:hover:bg-[#7C3AED] text-white text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer text-center shadow-md"
              >
                {isAlreadySaved ? 'Saved in Collection ✓' : 'Save To My Outfits'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // RENDER: Main Wardrobe Outfit Builder View
  return (
    <div className="space-y-10 pb-16">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#8B5CF6] dark:text-[#A78BFA] uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>WARDROBE-BASED OUTFIT BUILDER</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-tight text-neutral-900 dark:text-white">
            CREATE YOUR OUTFIT
          </h1>
          <p className="font-serif italic text-lg text-neutral-600 dark:text-neutral-300 mt-1">
            Choose what you want to wear.
          </p>
        </div>

        {/* Selected count pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-[#1A1924] border border-[#E8E2D9] dark:border-[#2D2A3B] text-xs font-mono text-neutral-700 dark:text-neutral-300 shadow-sm shrink-0">
          <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-pulse" />
          <span>
            {selectedItemsCount} of 5 slots chosen
          </span>
        </div>
      </div>

      {/* Error Banner */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-medium flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-amber-700 hover:text-amber-900 p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Selectable Clothing Sections Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-2">
            <Shirt className="w-4 h-4 text-[#8B5CF6]" />
            <span>1. SELECT WARDROBE PIECES</span>
          </h2>
          <span className="text-xs text-neutral-500 font-sans">
            Click any section to pick from your catalog
          </span>
        </div>

        {/* 5 Slot Cards Grid (Top, Bottom, Shoes, Outerwear, Accessories) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* SLOT: TOP */}
          <div
            id="slot-picker-top"
            onClick={() => openPicker('Top')}
            className={`relative rounded-3xl p-4 transition-all duration-200 cursor-pointer border flex flex-col justify-between group min-h-[220px] ${
              selectedTop
                ? 'bg-purple-50/40 dark:bg-purple-950/20 border-[#8B5CF6] ring-2 ring-[#8B5CF6]/30 shadow-md'
                : 'bg-white dark:bg-[#1A1924] border-[#E8E2D9] dark:border-[#2D2A3B] hover:border-[#8B5CF6]/60 hover:shadow-md'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono font-bold tracking-wider text-[#8B5CF6] uppercase">
                  TOP
                </span>
                {selectedTop && (
                  <button
                    onClick={(e) => handleClearSlot('Top', e)}
                    className="p-1 text-neutral-400 hover:text-red-500 transition-colors cursor-pointer"
                    title="Remove Top"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {selectedTop ? (
                <div className="space-y-2">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-[#E8E2D9] dark:border-[#2D2A3B]">
                    <img
                      src={selectedTop.imageUrl}
                      alt={selectedTop.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="font-bold text-xs text-neutral-900 dark:text-white line-clamp-1">
                    {selectedTop.name}
                  </h4>
                  <p className="text-[11px] text-neutral-500 truncate">
                    {selectedTop.color} • {selectedTop.fit || 'Regular'}
                  </p>
                </div>
              ) : (
                <div className="py-6 text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 flex items-center justify-center mx-auto group-hover:text-[#8B5CF6] group-hover:scale-105 transition-all">
                    <Shirt className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    [ Select Top ]
                  </p>
                  <p className="text-[10px] text-neutral-400 font-sans">
                    {tops.length} shirts & tops available
                  </p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-[11px]">
              <span className={`font-mono text-[10px] uppercase ${selectedTop ? 'text-[#8B5CF6] font-bold' : 'text-neutral-400'}`}>
                {selectedTop ? 'Selected ✓' : 'Required / Flexible'}
              </span>
              <span className="text-[#8B5CF6] group-hover:translate-x-0.5 transition-transform text-xs font-bold">
                {selectedTop ? 'Change' : '+ Choose'}
              </span>
            </div>
          </div>

          {/* SLOT: BOTTOM */}
          <div
            id="slot-picker-bottom"
            onClick={() => openPicker('Bottom')}
            className={`relative rounded-3xl p-4 transition-all duration-200 cursor-pointer border flex flex-col justify-between group min-h-[220px] ${
              selectedBottom
                ? 'bg-purple-50/40 dark:bg-purple-950/20 border-[#8B5CF6] ring-2 ring-[#8B5CF6]/30 shadow-md'
                : 'bg-white dark:bg-[#1A1924] border-[#E8E2D9] dark:border-[#2D2A3B] hover:border-[#8B5CF6]/60 hover:shadow-md'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono font-bold tracking-wider text-[#8B5CF6] uppercase">
                  BOTTOM
                </span>
                {selectedBottom && (
                  <button
                    onClick={(e) => handleClearSlot('Bottom', e)}
                    className="p-1 text-neutral-400 hover:text-red-500 transition-colors cursor-pointer"
                    title="Remove Bottom"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {selectedBottom ? (
                <div className="space-y-2">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-[#E8E2D9] dark:border-[#2D2A3B]">
                    <img
                      src={selectedBottom.imageUrl}
                      alt={selectedBottom.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="font-bold text-xs text-neutral-900 dark:text-white line-clamp-1">
                    {selectedBottom.name}
                  </h4>
                  <p className="text-[11px] text-neutral-500 truncate">
                    {selectedBottom.color} • {selectedBottom.fit || 'Regular'}
                  </p>
                </div>
              ) : (
                <div className="py-6 text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 flex items-center justify-center mx-auto group-hover:text-[#8B5CF6] group-hover:scale-105 transition-all">
                    <Layers className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    [ Select Bottom ]
                  </p>
                  <p className="text-[10px] text-neutral-400 font-sans">
                    {bottoms.length} pants & trousers available
                  </p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-[11px]">
              <span className={`font-mono text-[10px] uppercase ${selectedBottom ? 'text-[#8B5CF6] font-bold' : 'text-neutral-400'}`}>
                {selectedBottom ? 'Selected ✓' : 'Required / Flexible'}
              </span>
              <span className="text-[#8B5CF6] group-hover:translate-x-0.5 transition-transform text-xs font-bold">
                {selectedBottom ? 'Change' : '+ Choose'}
              </span>
            </div>
          </div>

          {/* SLOT: SHOES */}
          <div
            id="slot-picker-shoes"
            onClick={() => openPicker('Shoes')}
            className={`relative rounded-3xl p-4 transition-all duration-200 cursor-pointer border flex flex-col justify-between group min-h-[220px] ${
              selectedShoes
                ? 'bg-purple-50/40 dark:bg-purple-950/20 border-[#8B5CF6] ring-2 ring-[#8B5CF6]/30 shadow-md'
                : 'bg-white dark:bg-[#1A1924] border-[#E8E2D9] dark:border-[#2D2A3B] hover:border-[#8B5CF6]/60 hover:shadow-md'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono font-bold tracking-wider text-[#8B5CF6] uppercase">
                  SHOES
                </span>
                {selectedShoes && (
                  <button
                    onClick={(e) => handleClearSlot('Shoes', e)}
                    className="p-1 text-neutral-400 hover:text-red-500 transition-colors cursor-pointer"
                    title="Remove Shoes"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {selectedShoes ? (
                <div className="space-y-2">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-[#E8E2D9] dark:border-[#2D2A3B]">
                    <img
                      src={selectedShoes.imageUrl}
                      alt={selectedShoes.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="font-bold text-xs text-neutral-900 dark:text-white line-clamp-1">
                    {selectedShoes.name}
                  </h4>
                  <p className="text-[11px] text-neutral-500 truncate">{selectedShoes.color}</p>
                </div>
              ) : (
                <div className="py-6 text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 flex items-center justify-center mx-auto group-hover:text-[#8B5CF6] group-hover:scale-105 transition-all">
                    <Compass className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    [ Select Shoes ]
                  </p>
                  <p className="text-[10px] text-neutral-400 font-sans">
                    {shoes.length} footwear items
                  </p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-[11px]">
              <span className={`font-mono text-[10px] uppercase ${selectedShoes ? 'text-[#8B5CF6] font-bold' : 'text-neutral-400'}`}>
                {selectedShoes ? 'Selected ✓' : 'Optional'}
              </span>
              <span className="text-[#8B5CF6] group-hover:translate-x-0.5 transition-transform text-xs font-bold">
                {selectedShoes ? 'Change' : '+ Choose'}
              </span>
            </div>
          </div>

          {/* SLOT: OUTERWEAR (OPTIONAL) */}
          <div
            id="slot-picker-outerwear"
            onClick={() => openPicker('Outerwear')}
            className={`relative rounded-3xl p-4 transition-all duration-200 cursor-pointer border flex flex-col justify-between group min-h-[220px] ${
              selectedOuterwear
                ? 'bg-purple-50/40 dark:bg-purple-950/20 border-[#8B5CF6] ring-2 ring-[#8B5CF6]/30 shadow-md'
                : 'bg-white dark:bg-[#1A1924] border-[#E8E2D9] dark:border-[#2D2A3B] hover:border-[#8B5CF6]/60 hover:shadow-md'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono font-bold tracking-wider text-[#8B5CF6] uppercase">
                  OUTERWEAR
                </span>
                {selectedOuterwear ? (
                  <button
                    onClick={(e) => handleClearSlot('Outerwear', e)}
                    className="p-1 text-neutral-400 hover:text-red-500 transition-colors cursor-pointer"
                    title="Remove Outerwear"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <span className="text-[10px] font-mono text-neutral-400">OPTIONAL</span>
                )}
              </div>

              {selectedOuterwear ? (
                <div className="space-y-2">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-[#E8E2D9] dark:border-[#2D2A3B]">
                    <img
                      src={selectedOuterwear.imageUrl}
                      alt={selectedOuterwear.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="font-bold text-xs text-neutral-900 dark:text-white line-clamp-1">
                    {selectedOuterwear.name}
                  </h4>
                  <p className="text-[11px] text-neutral-500 truncate">{selectedOuterwear.color}</p>
                </div>
              ) : (
                <div className="py-6 text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 flex items-center justify-center mx-auto group-hover:text-[#8B5CF6] group-hover:scale-105 transition-all">
                    <Layers className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    [ None / Select ]
                  </p>
                  <p className="text-[10px] text-neutral-400 font-sans">
                    Jackets, Blazers, Coats
                  </p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-[11px]">
              <span className={`font-mono text-[10px] uppercase ${selectedOuterwear ? 'text-[#8B5CF6] font-bold' : 'text-neutral-400'}`}>
                {selectedOuterwear ? 'Selected ✓' : 'None'}
              </span>
              <span className="text-[#8B5CF6] group-hover:translate-x-0.5 transition-transform text-xs font-bold">
                {selectedOuterwear ? 'Change' : '+ Choose'}
              </span>
            </div>
          </div>

          {/* SLOT: ACCESSORIES (OPTIONAL) */}
          <div
            id="slot-picker-accessories"
            onClick={() => openPicker('Accessories')}
            className={`relative rounded-3xl p-4 transition-all duration-200 cursor-pointer border flex flex-col justify-between group min-h-[220px] ${
              selectedAccessories
                ? 'bg-purple-50/40 dark:bg-purple-950/20 border-[#8B5CF6] ring-2 ring-[#8B5CF6]/30 shadow-md'
                : 'bg-white dark:bg-[#1A1924] border-[#E8E2D9] dark:border-[#2D2A3B] hover:border-[#8B5CF6]/60 hover:shadow-md'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono font-bold tracking-wider text-[#8B5CF6] uppercase">
                  ACCESSORIES
                </span>
                {selectedAccessories ? (
                  <button
                    onClick={(e) => handleClearSlot('Accessories', e)}
                    className="p-1 text-neutral-400 hover:text-red-500 transition-colors cursor-pointer"
                    title="Remove Accessories"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <span className="text-[10px] font-mono text-neutral-400">OPTIONAL</span>
                )}
              </div>

              {selectedAccessories ? (
                <div className="space-y-2">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-[#E8E2D9] dark:border-[#2D2A3B]">
                    <img
                      src={selectedAccessories.imageUrl}
                      alt={selectedAccessories.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="font-bold text-xs text-neutral-900 dark:text-white line-clamp-1">
                    {selectedAccessories.name}
                  </h4>
                  <p className="text-[11px] text-neutral-500 truncate">{selectedAccessories.color}</p>
                </div>
              ) : (
                <div className="py-6 text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 flex items-center justify-center mx-auto group-hover:text-[#8B5CF6] group-hover:scale-105 transition-all">
                    <Palette className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    [ None / Select ]
                  </p>
                  <p className="text-[10px] text-neutral-400 font-sans">
                    Watches, Bags, Caps
                  </p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-[11px]">
              <span className={`font-mono text-[10px] uppercase ${selectedAccessories ? 'text-[#8B5CF6] font-bold' : 'text-neutral-400'}`}>
                {selectedAccessories ? 'Selected ✓' : 'None'}
              </span>
              <span className="text-[#8B5CF6] group-hover:translate-x-0.5 transition-transform text-xs font-bold">
                {selectedAccessories ? 'Change' : '+ Choose'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Occasion Selector */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono font-bold tracking-wider text-neutral-900 dark:text-white uppercase flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span>2. OCCASION</span>
          </label>
          <span className="text-[11px] text-neutral-500 font-mono">Select ONE</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {OCCASIONS.map((occ) => {
            const isSelected = occasion === occ;
            return (
              <button
                key={occ}
                id={`chip-occasion-${occ.toLowerCase()}`}
                onClick={() => setOccasion(occ)}
                className={`px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-[#1C1B1F] dark:bg-[#8B5CF6] text-white shadow-md font-semibold ring-2 ring-[#8B5CF6]/30'
                    : 'bg-white dark:bg-[#1A1924] text-neutral-700 dark:text-neutral-300 border border-[#E8E2D9] dark:border-[#2D2A3B] hover:border-[#8B5CF6]'
                }`}
              >
                {occ}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Style Selector */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono font-bold tracking-wider text-neutral-900 dark:text-white uppercase flex items-center gap-1.5">
            <Sparkle className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span>3. STYLE</span>
          </label>
          <span className="text-[11px] text-neutral-500 font-mono">Select ONE</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {STYLES.map((st) => {
            const isSelected = style === st;
            return (
              <button
                key={st}
                id={`chip-style-${st.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setStyle(st)}
                className={`px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-[#1C1B1F] dark:bg-[#8B5CF6] text-white shadow-md font-semibold ring-2 ring-[#8B5CF6]/30'
                    : 'bg-white dark:bg-[#1A1924] text-neutral-700 dark:text-neutral-300 border border-[#E8E2D9] dark:border-[#2D2A3B] hover:border-[#8B5CF6]'
                }`}
              >
                {st}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Color / Tone Preference (Optional) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono font-bold tracking-wider text-neutral-900 dark:text-white uppercase flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span>4. COLOR / TONE PREFERENCE (OPTIONAL)</span>
          </label>
          <span className="text-[11px] text-neutral-500 font-mono">Influences Styling Tone</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {COLOR_PREFERENCES.map((col) => {
            const isSelected = colorPreference === col;
            return (
              <button
                key={col}
                id={`chip-color-pref-${col.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setColorPreference(col)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-900 shadow-sm font-semibold'
                    : 'bg-white dark:bg-[#1A1924] text-neutral-600 dark:text-neutral-400 border border-[#E8E2D9] dark:border-[#2D2A3B] hover:border-neutral-400'
                }`}
              >
                {col}
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Personal Profile Preferences (Collapsible) */}
      <div className="rounded-3xl bg-white dark:bg-[#1A1924] border border-[#E8E2D9] dark:border-[#2D2A3B] p-5 shadow-sm">
        <button
          id="btn-toggle-personal-prefs"
          onClick={() => setShowPersonalPrefs(!showPersonalPrefs)}
          className="w-full flex items-center justify-between text-left cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <Sliders className="w-4 h-4 text-[#8B5CF6]" />
            <div>
              <h4 className="font-display text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                Personal Fit & Proportion Context
              </h4>
              <p className="text-[11px] text-neutral-500 font-sans">
                Automatically pre-filled from your profile ({gender} • {height} • {clothingSize} • {bodyFit} fit)
              </p>
            </div>
          </div>
          <div className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200">
            {showPersonalPrefs ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        <AnimatePresence>
          {showPersonalPrefs && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-800/80 space-y-4"
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {/* Gender */}
                <div>
                  <label className="text-[10px] font-mono font-bold uppercase text-neutral-500 block mb-1.5">
                    GENDER CONTEXT
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as GenderOption)}
                    className="w-full text-xs font-medium p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Prefer not to specify">Neutral / Unspecified</option>
                  </select>
                </div>

                {/* Height */}
                <div>
                  <label className="text-[10px] font-mono font-bold uppercase text-neutral-500 block mb-1.5">
                    HEIGHT
                  </label>
                  <input
                    type="text"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="e.g. 5'10&quot;"
                    className="w-full text-xs font-medium p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white"
                  />
                </div>

                {/* Clothing Size */}
                <div>
                  <label className="text-[10px] font-mono font-bold uppercase text-neutral-500 block mb-1.5">
                    SIZE
                  </label>
                  <select
                    value={clothingSize}
                    onChange={(e) => setClothingSize(e.target.value as ClothingSize)}
                    className="w-full text-xs font-medium p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white"
                  >
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Preferred Fit */}
                <div>
                  <label className="text-[10px] font-mono font-bold uppercase text-neutral-500 block mb-1.5">
                    FIT SILHOUETTE
                  </label>
                  <select
                    value={bodyFit}
                    onChange={(e) => setBodyFit(e.target.value as FitPreference)}
                    className="w-full text-xs font-medium p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white"
                  >
                    {['Slim', 'Regular', 'Relaxed', 'Oversized'].map((f) => (
                      <option key={f} value={f}>
                        {f} Fit
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 7. Bottom Master CTA: GENERATE OUTFIT ✨ */}
      <div className="pt-4 text-center">
        <button
          id="btn-generate-outfit-builder"
          onClick={handleGenerateOutfit}
          disabled={selectedItemsCount === 0}
          className={`w-full sm:w-auto min-w-[280px] px-8 py-4 rounded-full text-sm font-bold uppercase tracking-widest transition-all duration-300 shadow-xl cursor-pointer flex items-center justify-center gap-2 mx-auto ${
            selectedItemsCount > 0
              ? 'bg-[#1C1B1F] dark:bg-[#8B5CF6] hover:bg-black dark:hover:bg-[#7C3AED] text-white shadow-purple-900/20 hover:scale-[1.02]'
              : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed opacity-60'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#F472B6] dark:text-white" />
          <span>GENERATE OUTFIT ✨</span>
        </button>
        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono uppercase mt-2">
          {selectedItemsCount > 0
            ? `${selectedItemsCount} chosen piece${selectedItemsCount > 1 ? 's' : ''} ready to style for ${occasion}`
            : 'Select at least one clothing piece above to generate your look'}
        </p>
      </div>

      {/* MODAL / BOTTOM SHEET: Wardrobe Item Picker */}
      <AnimatePresence>
        {activePickerSlot && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-3xl max-h-[85vh] bg-white dark:bg-[#1A1924] rounded-3xl border border-[#E8E2D9] dark:border-[#2D2A3B] shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Picker Header with Clear X button */}
              <div className="p-4 sm:p-6 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-4 shrink-0">
                <div>
                  <div className="text-[10px] font-mono font-bold tracking-widest text-[#8B5CF6] uppercase mb-0.5">
                    SELECT {activePickerSlot.toUpperCase()}
                  </div>
                  <h3 className="font-display text-xl font-bold uppercase text-neutral-900 dark:text-white">
                    Choose from My Wardrobe
                  </h3>
                </div>

                <button
                  id="btn-close-item-picker"
                  onClick={closePicker}
                  className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
                  title="Close Picker"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Subcategories & Search */}
              <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 space-y-3 shrink-0">
                {/* Search input */}
                <input
                  type="text"
                  value={pickerSearch}
                  onChange={(e) => setPickerSearch(e.target.value)}
                  placeholder={`Search ${activePickerSlot.toLowerCase()} by name, color, material...`}
                  className="w-full px-4 py-2.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border-none text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:ring-2 focus:ring-[#8B5CF6]"
                />

                {/* Subcategory pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {slotSubcategories.map((sub) => (
                    <button
                      key={sub}
                      onClick={() => setPickerSubcategory(sub)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
                        pickerSubcategory === sub
                          ? 'bg-[#1C1B1F] dark:bg-[#8B5CF6] text-white font-semibold'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>

              {/* Picker Items Grid */}
              <div className="p-4 sm:p-6 overflow-y-auto flex-1">
                {currentSlotItems.length === 0 ? (
                  <div className="py-12 text-center space-y-3">
                    <Shirt className="w-10 h-10 text-neutral-300 dark:text-neutral-600 mx-auto" />
                    <p className="font-bold text-neutral-700 dark:text-neutral-300 text-sm">
                      No {activePickerSlot.toLowerCase()} pieces found
                    </p>
                    <p className="text-xs text-neutral-400 max-w-sm mx-auto font-sans">
                      Add a piece to your wardrobe first to use it in your outfit combinations.
                    </p>
                    <button
                      onClick={() => {
                        closePicker();
                        onOpenAddTab();
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#8B5CF6] text-white text-xs font-semibold uppercase tracking-wider shadow-md hover:bg-[#7C3AED] transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Add New {activePickerSlot}</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                    {currentSlotItems.map((item) => {
                      const isSelected =
                        (activePickerSlot === 'Top' && selectedTop?.id === item.id) ||
                        (activePickerSlot === 'Bottom' && selectedBottom?.id === item.id) ||
                        (activePickerSlot === 'Shoes' && selectedShoes?.id === item.id) ||
                        (activePickerSlot === 'Outerwear' && selectedOuterwear?.id === item.id) ||
                        (activePickerSlot === 'Accessories' && selectedAccessories?.id === item.id);

                      return (
                        <div
                          key={item.id}
                          id={`item-card-${item.id}`}
                          onClick={() => handleSelectItem(item)}
                          className={`rounded-2xl p-2.5 border transition-all duration-150 cursor-pointer text-left flex flex-col justify-between group relative overflow-hidden ${
                            isSelected
                              ? 'bg-purple-50 dark:bg-purple-950/40 border-[#8B5CF6] ring-2 ring-[#8B5CF6] shadow-md'
                              : 'bg-white dark:bg-[#201E2B] border-neutral-200 dark:border-neutral-800 hover:border-[#8B5CF6]/50 hover:shadow-sm'
                          }`}
                        >
                          <div>
                            <div className="aspect-square rounded-xl overflow-hidden mb-2 bg-neutral-100 dark:bg-neutral-800 relative">
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              />
                              {isSelected && (
                                <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center shadow-md">
                                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                                </div>
                              )}
                            </div>

                            <h4 className="font-bold text-xs text-neutral-900 dark:text-white line-clamp-1">
                              {item.name}
                            </h4>
                            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                              {item.color} {item.fit ? `• ${item.fit}` : ''}
                            </p>
                          </div>

                          <div className="mt-2 pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[10px]">
                            <span className="font-mono text-neutral-400 uppercase">
                              {item.pattern || 'Solid'}
                            </span>
                            <span
                              className={`font-semibold uppercase ${
                                isSelected ? 'text-[#8B5CF6]' : 'text-neutral-600 dark:text-neutral-300'
                              }`}
                            >
                              {isSelected ? 'Selected ✓' : 'Select'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Picker Footer */}
              <div className="p-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between bg-neutral-50 dark:bg-[#16151E] shrink-0">
                <span className="text-xs text-neutral-500 font-sans">
                  {currentSlotItems.length} items in {activePickerSlot}
                </span>
                <button
                  onClick={closePicker}
                  className="px-5 py-2 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold uppercase tracking-wider cursor-pointer"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
