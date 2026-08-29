import React, { useState, useRef } from 'react';
import { UserProfile, WardrobeItem, OutfitRecommendation, ThemeMode } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  Sparkles,
  Heart,
  Edit2,
  Trash2,
  Check,
  ShieldCheck,
  Palette,
  Sliders,
  Layers,
  ArrowRight,
  Sun,
  Moon,
  AlertTriangle,
  Mail,
  X,
  RotateCcw,
  Upload,
  Camera,
  Shuffle,
  ImageIcon,
} from 'lucide-react';
import { ThemeSwitcher } from './ThemeSwitcher';
import { FICTIONAL_PERSONAS, getRandomFictionalPersona, sanitizeProfileForDemo } from '../utils/demoIdentity';

interface ProfileViewProps {
  profile: UserProfile;
  wardrobe: WardrobeItem[];
  savedOutfits: OutfitRecommendation[];
  currentTheme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onDeleteAccount: () => void;
  onRemoveSavedOutfit: (outfitId: string) => void;
  onNavigateHome: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  wardrobe,
  savedOutfits,
  currentTheme,
  onThemeChange,
  onUpdateProfile,
  onDeleteAccount,
  onRemoveSavedOutfit,
  onNavigateHome,
}) => {
  const safeProfile = sanitizeProfileForDemo(profile);

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // Edit form local state
  const [name, setName] = useState(safeProfile.name);
  const [username, setUsername] = useState(safeProfile.username || 'julian_sterling');
  const [email, setEmail] = useState(safeProfile.email || 'julian.sterling@aurafit.demo');
  const [bio, setBio] = useState(safeProfile.bio || 'Building better outfits from what I already own.');
  const [height, setHeight] = useState(safeProfile.height || "5'10\"");
  const [gender, setGender] = useState(safeProfile.gender || 'Male');
  const [clothingSize, setClothingSize] = useState(safeProfile.clothingSize || 'M');
  const [preferredFit, setPreferredFit] = useState(safeProfile.preferredFit || 'Regular');
  const [avatarPreview, setAvatarPreview] = useState<string>(
    safeProfile.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop'
  );
  const [preferredStyles, setPreferredStyles] = useState(
    (safeProfile.preferredStyles || ['Smart Casual', 'Minimal', 'Streetwear']).join(', ')
  );
  const [favoriteColors, setFavoriteColors] = useState(
    (safeProfile.favoriteColors || ['Olive Green', 'Cream', 'Charcoal', 'Indigo']).join(', ')
  );
  const [avoidColors, setAvoidColors] = useState(
    (safeProfile.avoidColors || ['Neon Yellow', 'Bright Orange']).join(', ')
  );

  const [photoError, setPhotoError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Photo Picker Upload
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setPhotoError('Please select a valid image file (PNG, JPEG, WebP, GIF).');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('Image size exceeds 5MB limit. Please choose a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setAvatarPreview(base64);
    };
    reader.onerror = () => {
      setPhotoError('Failed to read image file. Please try another image.');
    };
    reader.readAsDataURL(file);
  };

  // Randomize demo persona
  const handleRandomizePersona = () => {
    const persona = getRandomFictionalPersona();
    setName(persona.name);
    setUsername(persona.username);
    setEmail(persona.email);
    setBio(persona.bio);
    setGender(persona.gender);
    setHeight(persona.height);
    setClothingSize(persona.clothingSize);
    setPreferredFit(persona.preferredFit);
    setPreferredStyles(persona.preferredStyles.join(', '));
    setFavoriteColors(persona.favoriteColors.join(', '));
    setAvoidColors(persona.avoidColors.join(', '));
    setAvatarPreview(persona.avatarUrl);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name,
      username: username.toLowerCase().replace(/[^a-z0-9_]/g, ''),
      email,
      bio,
      height,
      gender,
      clothingSize,
      preferredFit,
      avatarUrl: avatarPreview,
      preferredStyles: preferredStyles.split(',').map((s) => s.trim()).filter(Boolean) as any,
      favoriteColors: favoriteColors.split(',').map((s) => s.trim()).filter(Boolean),
      avoidColors: avoidColors.split(',').map((s) => s.trim()).filter(Boolean),
    });
    setIsEditing(false);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const currentAvatar = safeProfile.avatarUrl || avatarPreview;

  return (
    <div id="profile-view-container" className="py-6 max-w-5xl mx-auto px-4 sm:px-6">
      {/* Save Success Banner */}
      <AnimatePresence>
        {saveToast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between shadow-sm"
          >
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500" />
              <span className="font-semibold">Styling Profile &amp; Preferences Saved Successfully!</span>
            </div>
            <button onClick={() => setSaveToast(false)} className="text-neutral-400 hover:text-neutral-600">
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Banner Navigation Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4 mb-8">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#8B5CF6] dark:text-[#A78BFA] block">
            AURAFIT ACCOUNT
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-neutral-900 dark:text-white">
            YOUR STYLING IDENTITY
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-edit-profile-open"
            onClick={() => {
              setName(safeProfile.name);
              setUsername(safeProfile.username || 'julian_sterling');
              setEmail(safeProfile.email || 'julian.sterling@aurafit.demo');
              setBio(safeProfile.bio || 'Building better outfits from what I already own.');
              setAvatarPreview(currentAvatar);
              setIsEditing(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-neutral-300 dark:border-neutral-700 text-xs font-semibold uppercase tracking-wider hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer text-neutral-800 dark:text-neutral-200"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>

          <button
            id="btn-close-profile-view"
            onClick={onNavigateHome}
            className="p-2 rounded-full border border-neutral-300 dark:border-neutral-700 text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            title="Close Profile & Return Home"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Main Identity Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1A1924] border border-[#E8E2D9] dark:border-[#2D2A3B] shadow-md flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden">
          {/* Subtle Ambient Background Accent */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#8B5CF6]/10 to-transparent rounded-full blur-2xl pointer-events-none" />

          <div className="relative shrink-0 group">
            <img
              src={currentAvatar}
              alt={safeProfile.name}
              referrerPolicy="no-referrer"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white dark:border-[#201E2B] shadow-lg ring-2 ring-[#8B5CF6]/20"
            />
            <div className="absolute bottom-1 right-1 p-1.5 rounded-full bg-emerald-500 text-white shadow-sm" title="Verified Styling Identity">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-neutral-900 dark:text-white">
                  {safeProfile.name}
                </h2>
                <p className="text-xs font-mono text-[#8B5CF6] dark:text-[#A78BFA] mt-0.5">
                  @{safeProfile.username || 'julian_sterling'} • {safeProfile.email}
                </p>
              </div>

              <div className="flex items-center justify-center sm:justify-end gap-2">
                <ThemeSwitcher
                  currentTheme={currentTheme}
                  onThemeChange={onThemeChange}
                  minimal={true}
                />
              </div>
            </div>

            <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300 font-serif italic max-w-xl">
              &ldquo;{safeProfile.bio || 'Building better outfits from what I already own.'}&rdquo;
            </p>

            {/* Storage Status Badge */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800/80 text-[11px] font-mono text-neutral-600 dark:text-neutral-300">
                <ShieldCheck className="w-3.5 h-3.5 text-[#8B5CF6]" />
                <span>Digital Wardrobe • Cloud &amp; Local Synchronized</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-[#1A1924] border border-[#E8E2D9] dark:border-[#2D2A3B] shadow-sm">
            <span className="text-[10px] font-mono text-neutral-400 uppercase block">
              Wardrobe Items
            </span>
            <p className="font-display text-3xl font-bold text-neutral-900 dark:text-white mt-1">
              {wardrobe.length}
            </p>
            <span className="text-xs text-neutral-500 mt-1 block">In your digital closet</span>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-[#1A1924] border border-[#E8E2D9] dark:border-[#2D2A3B] shadow-sm">
            <span className="text-[10px] font-mono text-neutral-400 uppercase block">
              Generated Looks
            </span>
            <p className="font-display text-3xl font-bold text-[#8B5CF6] mt-1">
              {Math.max(3, savedOutfits.length * 2 + 1)}
            </p>
            <span className="text-xs text-neutral-500 mt-1 block">Personalized recommendations</span>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-[#1A1924] border border-[#E8E2D9] dark:border-[#2D2A3B] shadow-sm">
            <span className="text-[10px] font-mono text-neutral-400 uppercase block">
              Saved Looks
            </span>
            <p className="font-display text-3xl font-bold text-[#F472B6] mt-1">
              {savedOutfits.length}
            </p>
            <span className="text-xs text-neutral-500 mt-1 block">Saved outfit formulas</span>
          </div>
        </div>

        {/* Sizing & Fit Profile Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1A1924] border border-[#E8E2D9] dark:border-[#2D2A3B] shadow-sm">
            <span className="text-xs font-mono uppercase tracking-wider text-[#8B5CF6] block mb-4">
              BODY CONTEXT &amp; SIZING
            </span>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60">
                <span className="text-[10px] text-neutral-400 font-mono uppercase block">
                  Height
                </span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200 text-sm mt-0.5 block">
                  {safeProfile.height || "5'10\""}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60">
                <span className="text-[10px] text-neutral-400 font-mono uppercase block">
                  Gender Expression
                </span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200 text-sm mt-0.5 block">
                  {safeProfile.gender || 'Male'}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60">
                <span className="text-[10px] text-neutral-400 font-mono uppercase block">
                  Clothing Size
                </span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200 text-sm mt-0.5 block">
                  {safeProfile.clothingSize || 'M'}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60">
                <span className="text-[10px] text-neutral-400 font-mono uppercase block">
                  Preferred Fit
                </span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200 text-sm mt-0.5 block">
                  {safeProfile.preferredFit || 'Regular'}
                </span>
              </div>
            </div>
          </div>

          {/* Style DNA & Color Preferences */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1A1924] border border-[#E8E2D9] dark:border-[#2D2A3B] shadow-sm">
            <span className="text-xs font-mono uppercase tracking-wider text-[#8B5CF6] block mb-4">
              STYLE DNA &amp; PALETTE
            </span>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-[10px] text-neutral-400 font-mono uppercase block mb-1.5">
                  Preferred Aesthetics
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(safeProfile.preferredStyles || ['Smart Casual', 'Minimal', 'Streetwear']).map(
                    (st) => (
                      <span
                        key={st}
                        className="px-2.5 py-1 rounded-lg bg-[#8B5CF6]/10 text-[#8B5CF6] dark:text-[#A78BFA] font-medium"
                      >
                        {st}
                      </span>
                    )
                  )}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-neutral-400 font-mono uppercase block mb-1.5">
                  Favorite Colors
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(safeProfile.favoriteColors || ['Olive Green', 'Cream', 'Charcoal', 'Indigo']).map(
                    (col) => (
                      <span
                        key={col}
                        className="px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium"
                      >
                        {col}
                      </span>
                    )
                  )}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-neutral-400 font-mono uppercase block mb-1.5">
                  Colors to Avoid
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(safeProfile.avoidColors || ['Neon Yellow', 'Bright Orange']).map((col) => (
                    <span
                      key={col}
                      className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 font-medium text-[11px]"
                    >
                      ✕ {col}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wardrobe Data & Preferences Management */}
        <div className="p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/80 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#8B5CF6] dark:text-[#A78BFA] block">
              DATA MANAGEMENT
            </span>
            <h4 className="font-display font-semibold text-sm uppercase text-neutral-900 dark:text-white mt-0.5">
              Wardrobe Catalog &amp; Preferences Reset
            </h4>
            <p className="text-xs text-neutral-500 mt-0.5">
              Manage your digital closet items, saved outfit recommendations, and style profile configurations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="btn-edit-profile-action"
              onClick={() => {
                setName(safeProfile.name);
                setUsername(safeProfile.username || 'julian_sterling');
                setEmail(safeProfile.email || 'julian.sterling@aurafit.demo');
                setBio(safeProfile.bio || 'Building better outfits from what I already own.');
                setAvatarPreview(currentAvatar);
                setIsEditing(true);
              }}
              className="px-5 py-2.5 rounded-full bg-[#1C1B1F] dark:bg-[#8B5CF6] text-white hover:bg-black dark:hover:bg-[#7C3AED] text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer inline-flex items-center gap-2 shadow-sm"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>

            <button
              id="btn-delete-account-prompt"
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2.5 rounded-full border border-rose-300 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-semibold tracking-wider uppercase text-rose-600 dark:text-rose-400 transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Wardrobe</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-3xl bg-white dark:bg-[#1A1924] border border-rose-300 dark:border-rose-900/50 shadow-2xl p-6 sm:p-8 text-center relative"
            >
              <button
                id="btn-close-delete-modal"
                onClick={() => setShowDeleteConfirm(false)}
                className="absolute right-4 top-4 p-2 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-white transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold uppercase text-neutral-900 dark:text-white mb-2">
                Reset Digital Wardrobe?
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6 font-sans">
                This will reset your wardrobe catalog back to the initial prototype defaults and clear saved outfits.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-5 py-2.5 rounded-full border border-neutral-200 text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    onDeleteAccount();
                  }}
                  className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold uppercase tracking-wider cursor-pointer"
                >
                  Confirm Reset
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl rounded-3xl bg-white dark:bg-[#1A1924] border border-[#E8E2D9] dark:border-[#2D2A3B] shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto relative my-8"
            >
              {/* Close Button */}
              <button
                id="btn-close-edit-profile-modal"
                onClick={() => setIsEditing(false)}
                className="absolute right-4 top-4 p-2 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-white transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center justify-between mb-4 pr-8">
                <h3 className="font-display text-xl font-bold uppercase text-neutral-900 dark:text-white">
                  EDIT PROFILE &amp; STYLING SETTINGS
                </h3>
              </div>

              {/* Persona Randomizer Quick Button */}
              <div className="mb-6 p-3.5 rounded-2xl bg-[#8B5CF6]/5 border border-[#8B5CF6]/20 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300">
                  <Sparkles className="w-4 h-4 text-[#8B5CF6] shrink-0" />
                  <span>Demo profile mode: easily switch fictional personas.</span>
                </div>
                <button
                  type="button"
                  id="btn-randomize-persona"
                  onClick={handleRandomizePersona}
                  className="shrink-0 px-3 py-1.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-medium tracking-wide flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>Randomize Demo Persona</span>
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-5">
                {/* Profile Photo Upload Control */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-2">
                    Profile Photo
                  </label>

                  <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700">
                    <div className="relative shrink-0">
                      <img
                        src={avatarPreview}
                        alt="Profile Preview"
                        referrerPolicy="no-referrer"
                        className="w-20 h-20 rounded-full object-cover border-2 border-white dark:border-[#2D2A3B] shadow-md ring-2 ring-[#8B5CF6]/30"
                      />
                    </div>

                    <div className="flex-1 text-center sm:text-left space-y-2">
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        <button
                          type="button"
                          id="btn-upload-profile-photo"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-2 rounded-full bg-[#1C1B1F] dark:bg-[#8B5CF6] text-white text-xs font-semibold tracking-wider uppercase hover:bg-black dark:hover:bg-[#7C3AED] transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Choose Photo</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const p = getRandomFictionalPersona();
                            setAvatarPreview(p.avatarUrl);
                          }}
                          className="px-3.5 py-2 rounded-full border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>Sample Avatar</span>
                        </button>
                      </div>

                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                        Supports PNG, JPG, WebP up to 5MB. Photo updates instantly across your wardrobe profile.
                      </p>

                      {photoError && (
                        <p className="text-xs text-rose-500 font-medium">
                          {photoError}
                        </p>
                      )}
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png, image/jpeg, image/webp, image/gif"
                      onChange={handlePhotoSelect}
                      className="hidden"
                      id="profile-photo-file-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Display Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/40 text-neutral-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Username (@)
                    </label>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/40 text-neutral-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/40 text-neutral-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Bio / Style Tagline
                  </label>
                  <input
                    type="text"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/40 text-neutral-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Preferred Styles (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Smart Casual, Minimal, Streetwear"
                    value={preferredStyles}
                    onChange={(e) => setPreferredStyles(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 text-xs text-neutral-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Favorite Colors
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Olive, Cream, Charcoal"
                      value={favoriteColors}
                      onChange={(e) => setFavoriteColors(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white bg-neutral-50 dark:bg-neutral-800/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Colors to Avoid
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Neon Yellow, Orange"
                      value={avoidColors}
                      onChange={(e) => setAvoidColors(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white bg-neutral-50 dark:bg-neutral-800/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Height
                    </label>
                    <input
                      type="text"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white bg-neutral-50 dark:bg-neutral-800/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Clothing Size
                    </label>
                    <input
                      type="text"
                      value={clothingSize}
                      onChange={(e) => setClothingSize(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white bg-neutral-50 dark:bg-neutral-800/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Gender Expression
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white bg-neutral-50 dark:bg-neutral-800/50"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Prefer not to specify">Prefer not to specify</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Preferred Fit
                    </label>
                    <select
                      value={preferredFit}
                      onChange={(e) => setPreferredFit(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white bg-neutral-50 dark:bg-neutral-800/50"
                    >
                      <option value="Slim">Slim</option>
                      <option value="Regular">Regular</option>
                      <option value="Relaxed">Relaxed</option>
                      <option value="Oversized">Oversized</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-xl border border-neutral-200 text-xs font-medium cursor-pointer text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#1C1B1F] dark:bg-[#8B5CF6] text-white text-xs font-semibold uppercase tracking-wider shadow-md hover:bg-black dark:hover:bg-[#7C3AED] transition-colors cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
