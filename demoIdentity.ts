import { UserProfile, GenderOption, ClothingSize, FitPreference, StyleOption, ThemeMode } from '../types';

export interface FictionalPersona {
  name: string;
  username: string;
  email: string;
  bio: string;
  gender: GenderOption;
  height: string;
  clothingSize: ClothingSize;
  preferredFit: FitPreference;
  preferredStyles: StyleOption[];
  favoriteColors: string[];
  avoidColors: string[];
  avatarUrl: string;
}

export const FICTIONAL_PERSONAS: FictionalPersona[] = [
  {
    name: 'Julian Sterling',
    username: 'julian_sterling',
    email: 'julian.sterling@aurafit.demo',
    bio: 'Curating minimal, architectural silhouettes with monochrome layers.',
    gender: 'Male',
    height: "5'11\"",
    clothingSize: 'M',
    preferredFit: 'Regular',
    preferredStyles: ['Minimal', 'Smart Casual', 'Classic'],
    favoriteColors: ['Charcoal', 'Cream', 'Olive Green', 'Indigo'],
    avoidColors: ['Neon Yellow', 'Bright Orange'],
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
  },
  {
    name: 'Elena Rostova',
    username: 'elena_style',
    email: 'elena.rostova@aurafit.demo',
    bio: 'Championing tailored vintage outerwear and thoughtful capsule rotations.',
    gender: 'Female',
    height: "5'8\"",
    clothingSize: 'S',
    preferredFit: 'Relaxed',
    preferredStyles: ['Old Money', 'Classic', 'Smart Casual'],
    favoriteColors: ['Cream', 'Beige', 'Camel', 'Navy Blue'],
    avoidColors: ['Hot Pink', 'Lime Green'],
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
  },
  {
    name: 'Kai Thorne',
    username: 'kaithorne',
    email: 'kai.thorne@aurafit.demo',
    bio: 'Experimental streetwear enthusiast blending utilitarian cuts with crisp sneakers.',
    gender: 'Male',
    height: "6'0\"",
    clothingSize: 'L',
    preferredFit: 'Oversized',
    preferredStyles: ['Streetwear', 'Oversized', 'Trendy'],
    favoriteColors: ['Black', 'Charcoal', 'Sage', 'Terracotta'],
    avoidColors: ['Pastel Yellow', 'Magenta'],
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
  },
  {
    name: 'Maya Chen',
    username: 'maya_chen',
    email: 'maya.chen@aurafit.demo',
    bio: 'Effortless everyday styling focusing on tonal neutrals and organic cotton textures.',
    gender: 'Female',
    height: "5'6\"",
    clothingSize: 'M',
    preferredFit: 'Regular',
    preferredStyles: ['Minimal', 'Smart Casual', 'Casual'],
    favoriteColors: ['Olive Green', 'Cream', 'Burgundy', 'White'],
    avoidColors: ['Neon Green', 'Silver'],
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop',
  },
  {
    name: 'Aria Bennett',
    username: 'aria_b',
    email: 'aria.bennett@aurafit.demo',
    bio: 'Elevated contemporary dressing with an emphasis on drape and proportion.',
    gender: 'Female',
    height: "5'9\"",
    clothingSize: 'S',
    preferredFit: 'Slim',
    preferredStyles: ['Old Money', 'Smart Casual', 'Formal'],
    favoriteColors: ['Navy Blue', 'Cream', 'Charcoal', 'Sage'],
    avoidColors: ['Electric Blue', 'Mustard'],
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=400&auto=format&fit=crop',
  },
];

/**
 * Returns a randomly picked safe fictional persona
 */
export function getRandomFictionalPersona(): FictionalPersona {
  const index = Math.floor(Math.random() * FICTIONAL_PERSONAS.length);
  return FICTIONAL_PERSONAS[index];
}

/**
 * Sanitizes any real persona info so only fictional identity is displayed
 */
export function sanitizeProfileForDemo(profile: UserProfile): UserProfile {
  // If the profile has real personal markers or default placeholder, replace with safe fictional identity
  const isPersonalName =
    profile.name.toLowerCase().includes('parash') ||
    profile.name.toLowerCase().includes('bhardwaj') ||
    profile.email?.toLowerCase().includes('parash') ||
    profile.username?.toLowerCase().includes('parash');

  if (isPersonalName) {
    const persona = FICTIONAL_PERSONAS[0];
    return {
      ...profile,
      name: persona.name,
      username: persona.username,
      email: persona.email,
      bio: profile.bio && !profile.bio.includes('parash') ? profile.bio : persona.bio,
      avatarUrl: profile.avatarUrl || persona.avatarUrl,
    };
  }

  return profile;
}
