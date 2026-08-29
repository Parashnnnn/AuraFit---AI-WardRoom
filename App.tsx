import React, { useState, useEffect } from 'react';
import { WardrobeItem, OutfitRecommendation, UserProfile, ThemeMode, AppTab } from './types';
import { INITIAL_WARDROBE } from './data/defaultWardrobe';
import { OpeningExperience } from './components/OpeningExperience';
import { Navbar } from './components/Navbar';
import { HomeGreetingHeader } from './components/HomeGreetingHeader';
import { DigitalWardrobe } from './components/DigitalWardrobe';
import { CreateOutfitView } from './components/CreateOutfitView';
import { SavedLooksSection } from './components/SavedLooksSection';
import { WardrobeInsights } from './components/WardrobeInsights';
import { HelpAndFAQ } from './components/HelpAndFAQ';
import { ContactSection } from './components/ContactSection';
import { ContinuousArc } from './components/ContinuousArc';
import { AddClothingView } from './components/AddClothingView';
import { AddClothingModal } from './components/AddClothingModal';
import { ProfileView } from './components/ProfileView';
import { Footer } from './components/Footer';
import { motion, AnimatePresence } from 'motion/react';
import {
  DEFAULT_USER_PROFILE,
  updateUserFirestoreProfile,
  fetchUserFirestoreProfile,
  auth,
  subscribeUserWardrobe,
  addWardrobeItemFirestore,
  deleteWardrobeItemFirestore,
  updateWardrobeItemFirestore,
  subscribeUserSavedOutfits,
  saveOutfitToFavoritesFirestore,
  removeSavedOutfitFirestore,
  rateSavedOutfitFirestore,
} from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

import { sanitizeProfileForDemo, getRandomFictionalPersona } from './utils/demoIdentity';

export default function App() {
  // Opening Experience Flow State - ALWAYS show intro on every new site visit/load
  const [hasEnteredApp, setHasEnteredApp] = useState<boolean>(false);

  // Current Navigation Tab: exactly 3 primary tabs ('home' | 'add' | 'profile')
  const [currentTab, setCurrentTab] = useState<AppTab>('home');

  // Sub-mode inside ADD tab: 'add_clothing' or 'create_outfits'
  const [addSubMode, setAddSubMode] = useState<'add_clothing' | 'create_outfits'>('add_clothing');

  // Theme State
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('aurafit_theme') as ThemeMode;
    return saved || 'default';
  });

  // User Profile State (Guest & prototype default)
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('aurafit_user_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return sanitizeProfileForDemo(parsed);
      } catch {
        return DEFAULT_USER_PROFILE;
      }
    }
    return DEFAULT_USER_PROFILE;
  });

  // Wardrobe Items State (User-scoped Firestore & fallback state)
  const [wardrobe, setWardrobe] = useState<WardrobeItem[]>(() => {
    const saved = localStorage.getItem('aurafit_wardrobe');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_WARDROBE;
      }
    }
    return INITIAL_WARDROBE;
  });

  // Saved Outfits State (User-scoped Firestore & fallback state)
  const [savedOutfits, setSavedOutfits] = useState<OutfitRecommendation[]>(() => {
    const saved = localStorage.getItem('aurafit_saved_outfits');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  // Quick Modal Controls
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const remoteProfile = await fetchUserFirestoreProfile(firebaseUser.uid, {
            name: firebaseUser.displayName || 'Julian Sterling',
            email: firebaseUser.email || 'julian.sterling@aurafit.demo',
            avatarUrl: firebaseUser.photoURL || undefined,
          });
          const sanitized = sanitizeProfileForDemo(remoteProfile);
          setUser(sanitized);
          localStorage.setItem('aurafit_user_profile', JSON.stringify(sanitized));
        } catch (err) {
          console.warn('Auth state profile fetch notice:', err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Subscribe to real-time Firestore Wardrobe and Saved Outfits
  useEffect(() => {
    if (!user?.id) return;

    // Listen to users/{uid}/wardrobe
    const unsubWardrobe = subscribeUserWardrobe(user.id, (remoteItems) => {
      if (remoteItems.length > 0) {
        setWardrobe(remoteItems);
      } else {
        const localStored = localStorage.getItem(`aurafit_wardrobe_${user.id}`);
        if (localStored) {
          try {
            setWardrobe(JSON.parse(localStored));
          } catch {
            setWardrobe(INITIAL_WARDROBE);
          }
        }
      }
    });

    // Listen to users/{uid}/savedOutfits
    const unsubSaved = subscribeUserSavedOutfits(user.id, (remoteSaved) => {
      if (remoteSaved.length > 0) {
        setSavedOutfits(remoteSaved);
      }
    });

    return () => {
      unsubWardrobe();
      unsubSaved();
    };
  }, [user?.id]);

  // Sync Theme with HTML root
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-dark', 'theme-default', 'dark');

    if (theme === 'light') {
      root.classList.add('theme-light');
    } else if (theme === 'dark') {
      root.classList.add('theme-dark', 'dark');
    } else {
      root.classList.add('theme-default');
    }

    localStorage.setItem('aurafit_theme', theme);
  }, [theme]);

  // Persist Wardrobe locally as offline backup
  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`aurafit_wardrobe_${user.id}`, JSON.stringify(wardrobe));
    }
    localStorage.setItem('aurafit_wardrobe', JSON.stringify(wardrobe));
  }, [wardrobe, user?.id]);

  // Persist Saved Outfits locally as offline backup
  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`aurafit_saved_outfits_${user.id}`, JSON.stringify(savedOutfits));
    }
    localStorage.setItem('aurafit_saved_outfits', JSON.stringify(savedOutfits));
  }, [savedOutfits, user?.id]);

  // Handle Enter App from Opening Experience Scissors
  const handleEnterApp = () => {
    setHasEnteredApp(true);
    localStorage.setItem('aurafit_entered', 'true');
  };

  // Return to AuraFit intro page (when unauthenticated user closes login panel)
  const handleBackToIntro = () => {
    setHasEnteredApp(false);
    localStorage.removeItem('aurafit_entered');
    setCurrentTab('home');
  };

  // Wardrobe Operations (Syncs with users/{uid}/wardrobe/{itemId})
  const handleAddItem = async (
    itemData: Omit<WardrobeItem, 'id' | 'userId' | 'dateAdded' | 'wearCount' | 'isFavorite'>
  ) => {
    if (user?.id) {
      try {
        const created = await addWardrobeItemFirestore(user.id, itemData);
        setWardrobe((prev) => [created, ...prev.filter((i) => i.id !== created.id)]);
        return;
      } catch (err) {
        console.warn('Firestore add item failed, saving to local state:', err);
      }
    }

    const newItem: WardrobeItem = {
      ...itemData,
      id: `item-${Date.now()}`,
      userId: user?.id || 'guest',
      dateAdded: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      wearCount: 0,
      isFavorite: false,
    };

    setWardrobe((prev) => [newItem, ...prev]);
  };

  const handleDeleteItem = async (id: string) => {
    setWardrobe((prev) => prev.filter((item) => item.id !== id));
    if (user?.id) {
      try {
        await deleteWardrobeItemFirestore(user.id, id);
      } catch (e) {
        console.warn('Firestore delete error:', e);
      }
    }
  };

  const handleToggleFavorite = async (id: string) => {
    const target = wardrobe.find((i) => i.id === id);
    const nextFav = target ? !target.isFavorite : true;
    setWardrobe((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isFavorite: nextFav } : item))
    );
    if (user?.id) {
      try {
        await updateWardrobeItemFirestore(user.id, id, { isFavorite: nextFav });
      } catch (e) {
        console.warn('Firestore update favorite error:', e);
      }
    }
  };

  const handleLogWear = async (id: string) => {
    const target = wardrobe.find((i) => i.id === id);
    const nextWear = (target?.wearCount || 0) + 1;
    setWardrobe((prev) =>
      prev.map((item) => (item.id === id ? { ...item, wearCount: nextWear } : item))
    );
    if (user?.id) {
      try {
        await updateWardrobeItemFirestore(user.id, id, { wearCount: nextWear });
      } catch (e) {
        console.warn('Firestore update wear error:', e);
      }
    }
  };

  // Outfit Operations (Syncs with users/{uid}/savedOutfits/{outfitId})
  const handleSaveOutfit = async (outfit: OutfitRecommendation) => {
    const exists = savedOutfits.some((o) => o.id === outfit.id || o.title === outfit.title);
    if (exists) {
      setSavedOutfits((prev) => prev.filter((o) => o.id !== outfit.id && o.title !== outfit.title));
      if (user?.id) {
        try {
          await removeSavedOutfitFirestore(user.id, outfit.id);
        } catch (e) {
          console.warn('Firestore remove saved outfit:', e);
        }
      }
    } else {
      setSavedOutfits((prev) => [outfit, ...prev]);
      if (user?.id) {
        try {
          await saveOutfitToFavoritesFirestore(user.id, outfit);
        } catch (e) {
          console.warn('Firestore save outfit error:', e);
        }
      }
    }
  };

  const handleWearOutfit = (outfit: OutfitRecommendation) => {
    setWardrobe((prev) =>
      prev.map((item) =>
        outfit.itemIds.includes(item.id) ? { ...item, wearCount: item.wearCount + 1 } : item
      )
    );
  };

  const handleRateOutfit = async (outfitId: string, rating: number, feedback: 'up' | 'down') => {
    setSavedOutfits((prev) =>
      prev.map((o) => (o.id === outfitId ? { ...o, rating, userFeedback: feedback } : o))
    );
    if (user?.id) {
      try {
        await rateSavedOutfitFirestore(user.id, outfitId, rating, feedback);
      } catch (e) {
        console.warn('Firestore rate outfit error:', e);
      }
    }
  };

  const handleRemoveSavedOutfit = async (outfitId: string) => {
    setSavedOutfits((prev) => prev.filter((o) => o.id !== outfitId));
    if (user?.id) {
      try {
        await removeSavedOutfitFirestore(user.id, outfitId);
      } catch (e) {
        console.warn('Firestore remove outfit error:', e);
      }
    }
  };

  // Update Profile & Sync with users/{uid} in Firestore
  const handleUpdateProfile = async (updated: Partial<UserProfile>) => {
    const newProfile = { ...user, ...updated };
    setUser(newProfile);

    try {
      await updateUserFirestoreProfile(user.id, updated);
    } catch (err) {
      console.warn('Profile firestore sync fallback:', err);
    }
  };

  // Reset Wardrobe & Preferences to Prototype Defaults
  const handleResetWardrobe = () => {
    setWardrobe(INITIAL_WARDROBE);
    setSavedOutfits([]);
    setUser(DEFAULT_USER_PROFILE);
    localStorage.setItem('aurafit_wardrobe', JSON.stringify(INITIAL_WARDROBE));
    localStorage.removeItem('aurafit_saved_outfits');
    localStorage.setItem('aurafit_user_profile', JSON.stringify(DEFAULT_USER_PROFILE));
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // STEP 1: If user hasn't clicked "OPEN YOUR WARDROBE" scissors, show the Opening Experience
  if (!hasEnteredApp) {
    return <OpeningExperience onEnter={handleEnterApp} />;
  }

  // STEP 2: Main Application (4 Tabs: HOME, ADD, CREATE ✦, PROFILE)
  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-[#8B5CF6]/30 selection:text-neutral-900 dark:selection:text-white transition-colors duration-300 bg-[var(--bg-primary,#FAF8F5)] text-[var(--text-primary,#1C1B1F)] overflow-x-hidden">
      {/* Top Main Navigation Bar: 4 Tabs (HOME, ADD, CREATE ✦, PROFILE) */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        currentTheme={theme}
        onThemeChange={(newTheme) => {
          setTheme(newTheme);
          if (user?.id) {
            handleUpdateProfile({ theme: newTheme });
          }
        }}
        user={user}
        onReplayIntro={handleBackToIntro}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-28 md:pb-16">
        <AnimatePresence mode="wait">
          {/* 1. HOME TAB: Dynamic Greeting, Wardrobe, AI Generator, Saved Looks */}
          {currentTab === 'home' && (
            <motion.div
              key="home-tab-flow"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* 1. Greeting & Header with dynamic time-based greeting & Firebase user's actual first name */}
              <HomeGreetingHeader
                user={user}
                wardrobe={wardrobe}
                onOpenAdd={() => {
                  setAddSubMode('add_clothing');
                  setCurrentTab('add');
                }}
                onScrollToGenerator={() => {
                  setAddSubMode('create_outfits');
                  setCurrentTab('add');
                }}
                onScrollToWardrobe={() => scrollToSection('digital-wardrobe-section')}
              />

              {/* Continuous Arc Visual Motif */}
              <ContinuousArc variant="divider" />

              {/* 2. Your Wardrobe Grid & Catalog */}
              <div id="digital-wardrobe-section">
                <DigitalWardrobe
                  items={wardrobe}
                  onAddItemClick={() => setCurrentTab('add')}
                  onDeleteItem={handleDeleteItem}
                  onToggleFavorite={handleToggleFavorite}
                  onLogWear={handleLogWear}
                />
              </div>

              {/* Continuous Arc Visual Motif */}
              <ContinuousArc variant="curve-left" />

              {/* 3. Wardrobe-Based Outfit Builder */}
              <div id="ai-generator-section">
                <CreateOutfitView
                  wardrobe={wardrobe}
                  savedOutfits={savedOutfits}
                  onSaveOutfit={handleSaveOutfit}
                  onWearOutfit={handleWearOutfit}
                  onRateOutfit={handleRateOutfit}
                  onOpenAddTab={() => {
                    setAddSubMode('add_clothing');
                    setCurrentTab('add');
                  }}
                  onOutfitGenerated={(outfit, ctx) => {
                    if (user?.id) {
                      import('./lib/firebase').then(({ saveGeneratedOutfitFirestore }) => {
                        saveGeneratedOutfitFirestore(user.id, outfit, ctx);
                      });
                    }
                  }}
                  initialPreferences={{
                    gender: user?.gender || 'Male',
                    height: user?.height || "5'10\"",
                    bodyFit: user?.preferredFit || 'Regular',
                    clothingSize: user?.clothingSize || 'M',
                  }}
                />
              </div>

              {/* Continuous Arc Visual Motif */}
              <ContinuousArc variant="curve-right" />

              {/* 4. Saved Looks Collection */}
              <SavedLooksSection
                savedOutfits={savedOutfits}
                wardrobe={wardrobe}
                onRemoveSavedOutfit={handleRemoveSavedOutfit}
                onWearOutfit={handleWearOutfit}
                onScrollToGenerator={() => {
                  setAddSubMode('create_outfits');
                  setCurrentTab('add');
                }}
              />

              {/* Continuous Arc Visual Motif */}
              <ContinuousArc variant="divider" />

              {/* 5. Wardrobe Telemetry / Analytics */}
              <WardrobeInsights wardrobe={wardrobe} />

              {/* Continuous Arc Visual Motif */}
              <ContinuousArc variant="curve-left" />

              {/* 6. How AuraFit Works & Need Help (10 FAQs) */}
              <HelpAndFAQ />

              {/* Continuous Arc Visual Motif */}
              <ContinuousArc variant="curve-right" />

              {/* 7. Contact / Direct Dialogue */}
              <ContactSection />
            </motion.div>
          )}

          {/* 2. ADD TAB: Clothing Addition & AI Outfit Formulation Studio */}
          {currentTab === 'add' && (
            <motion.div
              key="add-clothing-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Studio Segment Control */}
              <div className="flex items-center justify-center">
                <div className="inline-flex items-center p-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800/90 border border-neutral-200 dark:border-neutral-700 shadow-inner">
                  <button
                    id="btn-submode-add-clothing"
                    onClick={() => setAddSubMode('add_clothing')}
                    className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                      addSubMode === 'add_clothing'
                        ? 'bg-white dark:bg-[#201E2B] text-neutral-900 dark:text-white shadow-sm'
                        : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    + Add Clothing
                  </button>
                  <button
                    id="btn-submode-create-outfits"
                    onClick={() => setAddSubMode('create_outfits')}
                    className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                      addSubMode === 'create_outfits'
                        ? 'bg-white dark:bg-[#201E2B] text-[#8B5CF6] dark:text-[#A78BFA] shadow-sm'
                        : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    <span>✦ Create Outfits</span>
                  </button>
                </div>
              </div>

              {addSubMode === 'add_clothing' ? (
                <AddClothingView
                  onAddItem={handleAddItem}
                  onReturnHome={() => {
                    setCurrentTab('home');
                    setTimeout(() => scrollToSection('digital-wardrobe-section'), 100);
                  }}
                />
              ) : (
                <CreateOutfitView
                  wardrobe={wardrobe}
                  savedOutfits={savedOutfits}
                  onSaveOutfit={handleSaveOutfit}
                  onWearOutfit={handleWearOutfit}
                  onRateOutfit={handleRateOutfit}
                  onClose={() => setCurrentTab('home')}
                  onOutfitGenerated={(outfit, ctx) => {
                    if (user?.id) {
                      import('./lib/firebase').then(({ saveGeneratedOutfitFirestore }) => {
                        saveGeneratedOutfitFirestore(user.id, outfit, ctx);
                      });
                    }
                  }}
                  onOpenAddTab={() => setAddSubMode('add_clothing')}
                  initialPreferences={{
                    gender: user?.gender || 'Male',
                    height: user?.height || "5'10\"",
                    bodyFit: user?.preferredFit || 'Regular',
                    clothingSize: user?.clothingSize || 'M',
                  }}
                />
              )}
            </motion.div>
          )}

          {/* 4. PROFILE TAB: Personal Styling Identity */}
          {currentTab === 'profile' && (
            <motion.div
              key="profile-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <ProfileView
                profile={user}
                wardrobe={wardrobe}
                savedOutfits={savedOutfits}
                currentTheme={theme}
                onThemeChange={(newTheme) => {
                  setTheme(newTheme);
                  handleUpdateProfile({ theme: newTheme });
                }}
                onUpdateProfile={handleUpdateProfile}
                onDeleteAccount={handleResetWardrobe}
                onRemoveSavedOutfit={handleRemoveSavedOutfit}
                onNavigateHome={() => setCurrentTab('home')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global Quick Add Modal */}
      <AddClothingModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddItem={handleAddItem}
      />

      {/* Global Footer */}
      <Footer
        currentTheme={theme}
        onThemeChange={(newTheme) => {
          setTheme(newTheme);
          if (user?.id) {
            handleUpdateProfile({ theme: newTheme });
          }
        }}
        onNavigate={(tab) => setCurrentTab(tab)}
        onScrollToSection={scrollToSection}
        onReplayIntro={handleBackToIntro}
      />
    </div>
  );
}
