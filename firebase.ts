import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  onSnapshot,
} from 'firebase/firestore';
import config from '../../firebase-applet-config.json';
import {
  UserProfile,
  WardrobeItem,
  OutfitRecommendation,
  ThemeMode,
  GenderOption,
  ClothingSize,
  FitPreference,
  StyleOption,
} from '../types';

// Firebase Configuration explicitly targeted for project: aura-fit-eb43a
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || config.apiKey || "AIzaSyDF9eQAaYG4oYLUXOq46NP5O8-j2sX3FBw",
  authDomain: config.authDomain || "aura-fit-eb43a.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || config.projectId || "aura-fit-eb43a",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || config.storageBucket || "aura-fit-eb43a.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || config.messagingSenderId || "811845692765",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || config.appId || "1:811845692765:web:9b06a2d97a9c92880dccb4",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || config.measurementId || "",
};

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app, config.firestoreDatabaseId || undefined);
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

/**
 * Get current user authorization header with Firebase ID Token
 */
export async function getAuthHeaders(): Promise<Record<string, string>> {
  try {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const idToken = await currentUser.getIdToken(false);
      return {
        Authorization: `Bearer ${idToken}`,
      };
    }
  } catch (err) {
    console.warn('Failed to retrieve Firebase ID token for request:', err);
  }
  return {};
}

/**
 * Sign in with Google Popup
 */
export async function signInWithGoogle(): Promise<FirebaseUser | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
}

/**
 * Sign out current user
 */
export async function logOut(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign Out Error:', error);
    throw error;
  }
}

/**
 * Default User Profile for prototype & guest wardrobe styling
 */
export const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'aurafit_user_default',
  name: 'Julian Sterling',
  username: 'julian_sterling',
  email: 'julian.sterling@aurafit.demo',
  bio: 'Building effortless, intentional daily looks with conscious AI restyling.',
  avatarUrl:
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
  gender: 'Male' as GenderOption,
  height: "5'10\"",
  bodyContext: 'Lean Athletic',
  clothingSize: 'M' as ClothingSize,
  preferredFit: 'Regular' as FitPreference,
  preferredStyles: ['Smart Casual', 'Minimal', 'Streetwear'] as StyleOption[],
  favoriteColors: ['Olive Green', 'Cream', 'Charcoal', 'Indigo'],
  avoidColors: ['Neon Yellow', 'Bright Orange'],
  theme: 'default' as ThemeMode,
  notificationsEnabled: true,
  createdAt: new Date().toISOString(),
};

/**
 * Fetch or initialize user profile from Firestore: users/{uid}
 */
export async function fetchUserFirestoreProfile(uid: string, fallbackUser?: Partial<UserProfile>): Promise<UserProfile> {
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const d = snap.data();
      return {
        id: uid,
        name: d.name || fallbackUser?.name || 'AuraFit Member',
        username: d.username || (fallbackUser?.username || 'member'),
        email: d.email || fallbackUser?.email || '',
        bio: d.bio || fallbackUser?.bio || 'Building intentional outfits with conscious styling.',
        avatarUrl: d.photoURL || d.avatarUrl || fallbackUser?.avatarUrl || DEFAULT_USER_PROFILE.avatarUrl,
        gender: d.gender || fallbackUser?.gender || 'Male',
        height: d.height || fallbackUser?.height || "5'10\"",
        bodyContext: d.bodyContext || fallbackUser?.bodyContext || 'Lean Athletic',
        clothingSize: d.clothingSize || fallbackUser?.clothingSize || 'M',
        preferredFit: d.preferredFit || fallbackUser?.preferredFit || 'Regular',
        preferredStyles: d.preferredStyles || fallbackUser?.preferredStyles || ['Smart Casual', 'Minimal'],
        favoriteColors: d.favoriteColors || fallbackUser?.favoriteColors || ['Olive Green', 'Cream', 'Charcoal'],
        avoidColors: d.colorsToAvoid || d.avoidColors || fallbackUser?.avoidColors || ['Neon Yellow'],
        theme: d.theme || fallbackUser?.theme || 'default',
        notificationsEnabled: d.notificationsEnabled !== undefined ? d.notificationsEnabled : true,
        createdAt: d.createdAt || new Date().toISOString(),
      };
    } else {
      // Initialize new document in Firestore
      const initialProfile: UserProfile = {
        ...DEFAULT_USER_PROFILE,
        id: uid,
        ...fallbackUser,
      };
      await setDoc(userRef, {
        name: initialProfile.name,
        email: initialProfile.email,
        username: initialProfile.username,
        photoURL: initialProfile.avatarUrl,
        bio: initialProfile.bio,
        gender: initialProfile.gender,
        height: initialProfile.height,
        clothingSize: initialProfile.clothingSize,
        preferredFit: initialProfile.preferredFit,
        preferredStyles: initialProfile.preferredStyles,
        favoriteColors: initialProfile.favoriteColors,
        colorsToAvoid: initialProfile.avoidColors,
        theme: initialProfile.theme,
        createdAt: new Date().toISOString(),
      }, { merge: true });
      return initialProfile;
    }
  } catch (err) {
    console.warn('Firestore profile fetch fallback:', err);
    return {
      ...DEFAULT_USER_PROFILE,
      id: uid,
      ...fallbackUser,
    };
  }
}

/**
 * Update user profile in Firestore: users/{uid}
 */
export async function updateUserFirestoreProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
  try {
    const userRef = doc(db, 'users', uid);
    const now = new Date().toISOString();

    const firestoreUpdates: Record<string, any> = {
      ...updates,
      updatedAt: now,
    };

    if (updates.avatarUrl) {
      firestoreUpdates.photoURL = updates.avatarUrl;
    }
    if (updates.avoidColors) {
      firestoreUpdates.colorsToAvoid = updates.avoidColors;
    }

    await setDoc(userRef, firestoreUpdates, { merge: true });

    // Also update users/{uid}/preferences if theme or styling changed
    if (updates.theme || updates.preferredStyles || updates.favoriteColors || updates.avoidColors) {
      const prefRef = doc(db, 'users', uid, 'preferences', 'settings');
      await setDoc(
        prefRef,
        {
          ...(updates.theme && { theme: updates.theme }),
          stylePreferences: {
            ...(updates.preferredStyles && { preferredStyles: updates.preferredStyles }),
            ...(updates.favoriteColors && { favoriteColors: updates.favoriteColors }),
            ...(updates.avoidColors && { colorsToAvoid: updates.avoidColors }),
            ...(updates.preferredFit && { preferredFit: updates.preferredFit }),
            ...(updates.clothingSize && { clothingSize: updates.clothingSize }),
          },
          updatedAt: now,
        },
        { merge: true }
      );
    }
  } catch (e) {
    console.warn('Firestore profile sync fallback:', e);
  }
}

// -------------------------------------------------------------
// USER WARDROBE FIRESTORE OPERATIONS: users/{uid}/wardrobe/{itemId}
// -------------------------------------------------------------

export function subscribeUserWardrobe(
  uid: string,
  onUpdate: (items: WardrobeItem[]) => void
): () => void {
  const wardrobeColl = collection(db, 'users', uid, 'wardrobe');
  return onSnapshot(
    wardrobeColl,
    (snapshot) => {
      const items: WardrobeItem[] = snapshot.docs.map((docSnap) => {
        const d = docSnap.data();
        return {
          id: docSnap.id,
          userId: uid,
          name: d.name || `${d.color || ''} ${d.category || 'Clothing'}`.trim(),
          category: d.category || 'Tops',
          color: d.color || '',
          secondaryColor: d.secondaryColor || '',
          pattern: d.pattern || 'Solid',
          material: d.material || 'Cotton',
          style: d.style || 'Casual',
          size: d.size || 'M',
          fit: d.fit || 'Regular',
          brand: d.brand || '',
          notes: d.notes || '',
          imageUrl: d.image || d.imageUrl || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=400&auto=format&fit=crop',
          dateAdded: d.dateAdded || (d.createdAt ? new Date(d.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'),
          wearCount: d.wearCount || 0,
          isFavorite: !!d.isFavorite,
          occasions: d.occasions || [],
        };
      });
      onUpdate(items);
    },
    (err) => {
      console.warn('Firestore wardrobe subscription listener notice:', err);
    }
  );
}

export async function addWardrobeItemFirestore(
  uid: string,
  item: Omit<WardrobeItem, 'id' | 'userId' | 'dateAdded' | 'wearCount' | 'isFavorite'>
): Promise<WardrobeItem> {
  const wardrobeColl = collection(db, 'users', uid, 'wardrobe');
  const now = new Date().toISOString();
  const newItemRef = doc(wardrobeColl);

  const payload = {
    image: item.imageUrl,
    imageUrl: item.imageUrl,
    name: item.name,
    category: item.category,
    color: item.color,
    secondaryColor: item.secondaryColor || '',
    pattern: item.pattern,
    style: item.style,
    material: item.material,
    size: item.size,
    fit: item.fit,
    brand: item.brand || '',
    notes: item.notes || '',
    wearCount: 0,
    isFavorite: false,
    occasions: item.occasions || [],
    createdAt: now,
    dateAdded: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
  };

  await setDoc(newItemRef, payload);

  return {
    ...item,
    id: newItemRef.id,
    userId: uid,
    dateAdded: payload.dateAdded,
    wearCount: 0,
    isFavorite: false,
  };
}

export async function deleteWardrobeItemFirestore(uid: string, itemId: string): Promise<void> {
  const itemRef = doc(db, 'users', uid, 'wardrobe', itemId);
  await deleteDoc(itemRef);
}

export async function updateWardrobeItemFirestore(
  uid: string,
  itemId: string,
  updates: Partial<WardrobeItem>
): Promise<void> {
  const itemRef = doc(db, 'users', uid, 'wardrobe', itemId);
  const payload: Record<string, any> = { ...updates };
  if (updates.imageUrl) payload.image = updates.imageUrl;
  await updateDoc(itemRef, payload);
}

// -------------------------------------------------------------
// GENERATED OUTFITS FIRESTORE OPERATIONS: users/{uid}/outfits/{outfitId}
// -------------------------------------------------------------

export async function saveGeneratedOutfitFirestore(
  uid: string,
  outfit: OutfitRecommendation,
  context?: { occasion?: string; style?: string; mood?: string }
): Promise<void> {
  const outfitRef = doc(db, 'users', uid, 'outfits', outfit.id);
  const now = new Date().toISOString();

  await setDoc(outfitRef, {
    occasion: context?.occasion || outfit.occasionBadge || 'Casual',
    style: context?.style || 'Smart Casual',
    mood: context?.mood || 'Elevated',
    itemsUsed: outfit.itemIds,
    generatedResult: outfit,
    createdAt: now,
  });
}

// -------------------------------------------------------------
// SAVED OUTFITS FIRESTORE OPERATIONS: users/{uid}/savedOutfits/{outfitId}
// -------------------------------------------------------------

export function subscribeUserSavedOutfits(
  uid: string,
  onUpdate: (outfits: OutfitRecommendation[]) => void
): () => void {
  const savedColl = collection(db, 'users', uid, 'savedOutfits');
  return onSnapshot(
    savedColl,
    (snapshot) => {
      const list: OutfitRecommendation[] = snapshot.docs.map((docSnap) => {
        const d = docSnap.data();
        if (d.generatedResult) {
          return {
            ...d.generatedResult,
            id: docSnap.id,
          };
        }
        return {
          id: docSnap.id,
          lookNumber: d.lookNumber || 'LOOK-01',
          title: d.title || 'Curated Outfit',
          occasionBadge: d.occasionBadge || d.occasion || 'Casual',
          itemIds: d.itemsUsed || d.itemIds || [],
          whyItWorks: d.whyItWorks || 'Harmonious color balancing and silhouette matching.',
          colorHarmony: d.colorHarmony || 95,
          occasionFit: d.occasionFit || 92,
          styleMatch: d.styleMatch || 94,
          whyAuraFitChoseThis: d.whyAuraFitChoseThis || {
            colorCoordination: 'Monochrome and complementary accents',
            occasionSuitability: 'Engineered for contemporary casual balance',
            styleCompatibility: 'Unified modern proportions',
            fitContext: 'Tailored drape with comfortable ease',
          },
          generatedAt: d.createdAt || new Date().toISOString(),
          isSaved: true,
          rating: d.rating,
          feedbackThumb: d.feedbackThumb,
        };
      });
      onUpdate(list);
    },
    (err) => {
      console.warn('Firestore savedOutfits listener notice:', err);
    }
  );
}

export async function saveOutfitToFavoritesFirestore(
  uid: string,
  outfit: OutfitRecommendation
): Promise<void> {
  const outfitRef = doc(db, 'users', uid, 'savedOutfits', outfit.id);
  const now = new Date().toISOString();

  await setDoc(outfitRef, {
    occasion: outfit.occasionBadge || 'Casual',
    style: 'Curated Look',
    mood: 'Personalized',
    itemsUsed: outfit.itemIds,
    generatedResult: {
      ...outfit,
      isSaved: true,
    },
    createdAt: now,
    updatedAt: now,
  });
}

export async function removeSavedOutfitFirestore(uid: string, outfitId: string): Promise<void> {
  const outfitRef = doc(db, 'users', uid, 'savedOutfits', outfitId);
  await deleteDoc(outfitRef);
}

export async function rateSavedOutfitFirestore(
  uid: string,
  outfitId: string,
  rating: number,
  feedback: 'up' | 'down'
): Promise<void> {
  const outfitRef = doc(db, 'users', uid, 'savedOutfits', outfitId);
  await updateDoc(outfitRef, {
    rating,
    feedbackThumb: feedback,
    'generatedResult.rating': rating,
    'generatedResult.feedbackThumb': feedback,
  });
}
