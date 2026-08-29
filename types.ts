export type Category = 'All' | 'Tops' | 'Bottoms' | 'Shoes' | 'Outerwear' | 'Accessories';

export type AppTab = 'home' | 'add' | 'create' | 'profile';

export type Occasion =
  | 'College'
  | 'Casual'
  | 'Party'
  | 'Date'
  | 'Interview'
  | 'Wedding'
  | 'Festival'
  | 'Travel'
  | 'Formal'
  | 'Streetwear'
  | 'Other';

export type GenderOption = 'Male' | 'Female' | 'Prefer not to specify';

export type FitPreference = 'Slim' | 'Regular' | 'Relaxed' | 'Oversized';

export type ClothingSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export type StyleOption =
  | 'Minimal'
  | 'Classic'
  | 'Smart Casual'
  | 'Streetwear'
  | 'Oversized'
  | 'Trendy'
  | 'Formal'
  | 'Traditional'
  | 'Old Money'
  | 'Casual';

export type ColorPreference =
  | 'Any'
  | 'Neutral'
  | 'Black & White'
  | 'Earth Tones'
  | 'Blue'
  | 'Pastel'
  | 'Dark'
  | 'Bright';

export type ThemeMode = 'default' | 'light' | 'dark';

export interface WardrobeItem {
  id: string;
  userId: string;
  name: string;
  category: 'Tops' | 'Bottoms' | 'Shoes' | 'Outerwear' | 'Accessories';
  color: string;
  secondaryColor?: string;
  pattern: string;
  material: string;
  style: string;
  size: ClothingSize | string;
  fit: FitPreference | string;
  brand?: string;
  notes?: string;
  imageUrl: string;
  dateAdded: string;
  wearCount: number;
  isFavorite: boolean;
  occasions?: string[];
}

export interface OutfitRecommendation {
  id: string;
  lookNumber: string | number;
  title: string;
  occasionBadge?: string;
  badge?: string;
  itemIds: string[];
  whyItWorks: string;
  colorHarmony: number;
  occasionFit: number;
  styleMatch: number;
  overallScore?: number;
  stylingTip?: string;
  whyAuraFitChoseThis: {
    colorCoordination: string;
    occasionSuitability: string;
    styleCompatibility: string;
    fitContext: string;
    wardrobeAvailability?: string;
  };
  generatedImageUrl?: string;
  occasion?: string;
  style?: string;
  colorPreference?: string;
  selectedTop?: WardrobeItem;
  selectedBottom?: WardrobeItem;
  selectedShoes?: WardrobeItem;
  selectedOuterwear?: WardrobeItem;
  selectedAccessories?: WardrobeItem;
  aiStyledFootwear?: string;
  aiStyledAccessories?: string;
  aiStyledItems?: string[];
  isSaved?: boolean;
  isWorn?: boolean;
  rating?: number; // 1-5
  feedbackThumb?: 'up' | 'down' | null;
  userFeedback?: 'up' | 'down' | null;
  generatedAt?: string;
}

export interface UserPreferences {
  gender: GenderOption;
  height: string;
  bodyFit: FitPreference;
  clothingSize: ClothingSize;
  occasion: Occasion;
  style: StyleOption;
  preferredColors: string[];
  avoidColors: string[];
  useOnlyWardrobe: boolean;
  customOccasion?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  bio: string;
  avatarUrl: string;
  gender: GenderOption;
  height: string;
  bodyContext?: string;
  clothingSize: ClothingSize;
  preferredFit: FitPreference;
  preferredStyles: StyleOption[];
  favoriteColors: string[];
  avoidColors: string[];
  theme: ThemeMode;
  notificationsEnabled: boolean;
  createdAt: string;
}

export interface WardrobeInsightsData {
  totalItems: number;
  topsCount: number;
  bottomsCount: number;
  shoesCount: number;
  outerwearCount: number;
  accessoriesCount: number;
  possibleCombinations: number;
  dominantColor: string;
  topStyle: string;
  mostVersatileItemName?: string;
}
