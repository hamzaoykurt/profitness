/**
 * User Profile Service
 * Handles all Firestore operations for user profiles
 * XP Formula: 25 XP per set, 1000 XP per level
 */
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';

const USERS_COLLECTION = 'users';
const XP_PER_SET = 25;
const XP_PER_LEVEL = 1000;

/**
 * Create a fresh user profile (starts at Level 1, 0 XP)
 * @param {string} uid 
 * @param {object} data - { displayName, email, photoURL }
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const createUserProfile = async (uid, data) => {
  try {
    // Check if user is admin (hmzoodd@gmail.com)
    const isAdmin = data.email === 'hmzoodd@gmail.com';

    const userRef = doc(db, USERS_COLLECTION, uid);
    await setDoc(userRef, {
      displayName: data.displayName || 'Atlet',
      email: data.email || '',
      photoURL: data.photoURL || null,
      level: 1,
      xp: 0,
      totalXp: 0,
      activeDays: 0,
      lastActiveDate: null,
      completedSets: [],
      // Freemium system
      credits: isAdmin ? 999999 : 3,  // Free AI program generations
      isPremium: isAdmin ? true : false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('createUserProfile error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get user profile by UID
 * @param {string} uid 
 * @returns {Promise<object|null>}
 */
export const getUserProfile = async (uid) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    const snapshot = await getDoc(userRef);
    if (snapshot.exists()) {
      const data = snapshot.data();
      
      // Auto-grant Premium for Admin (Retroactive Fix)
      if (data.email === 'hmzoodd@gmail.com' && (!data.isPremium || data.credits < 1000)) {
        console.log('👑 Admin detected! Granting unlimited power...');
        await updateDoc(userRef, {
          isPremium: true,
          credits: 999999
        });
        // Return updated data
        return { ...data, isPremium: true, credits: 999999, id: snapshot.id };
      }
      
      return { ...data, id: snapshot.id };
    }
    return null;
  } catch (error) {
    console.error('getUserProfile error:', error);
    return null;
  }
};

/**
 * Update user profile fields
 * @param {string} uid 
 * @param {object} updates - Fields to update
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const updateUserProfile = async (uid, updates) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('updateUserProfile error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Subscribe to real-time user profile updates
 * @param {string} uid 
 * @param {function} callback - Called with profile data
 * @param {function} onError - Called on error
 * @returns {function} Unsubscribe function
 */
export const subscribeToUserProfile = (uid, callback, onError) => {
  const userRef = doc(db, USERS_COLLECTION, uid);
  return onSnapshot(userRef, 
    (snapshot) => {
      if (snapshot.exists()) {
        callback({ id: snapshot.id, ...snapshot.data() });
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error('subscribeToUserProfile error:', error);
      if (onError) onError(error);
    }
  );
};

/**
 * Add XP to user and handle level up
 * @param {string} uid 
 * @param {number} amount - XP to add (default: 25 for one set)
 * @returns {Promise<{success: boolean, newXp?: number, newLevel?: number, leveledUp?: boolean, error?: string}>}
 */
export const addXP = async (uid, amount = XP_PER_SET) => {
  try {
    const profile = await getUserProfile(uid);
    if (!profile) {
      return { success: false, error: 'Profile not found' };
    }

    const currentXp = profile.xp || 0;
    const currentLevel = profile.level || 1;
    const totalXp = (profile.totalXp || 0) + amount;
    
    let newXp = currentXp + amount;
    let newLevel = currentLevel;
    let leveledUp = false;

    // Check for level up
    while (newXp >= XP_PER_LEVEL) {
      newXp -= XP_PER_LEVEL;
      newLevel++;
      leveledUp = true;
    }

    await updateUserProfile(uid, {
      xp: newXp,
      level: newLevel,
      totalXp: totalXp
    });

    return { 
      success: true, 
      newXp, 
      newLevel, 
      leveledUp,
      xpGained: amount
    };
  } catch (error) {
    console.error('addXP error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Mark a set as completed and add XP
 * @param {string} uid 
 * @param {string} exerciseId 
 * @param {number} setIndex 
 * @returns {Promise<{success: boolean, xpResult?: object, error?: string}>}
 */
export const completeSet = async (uid, exerciseId, setIndex) => {
  try {
    const profile = await getUserProfile(uid);
    if (!profile) {
      return { success: false, error: 'Profile not found' };
    }

    const setKey = `${exerciseId}_set${setIndex}`;
    const completedSets = profile.completedSets || [];
    
    // Prevent duplicate XP
    if (completedSets.includes(setKey)) {
      return { success: true, xpResult: { xpGained: 0 }, alreadyCompleted: true };
    }

    // Add set to completed list
    completedSets.push(setKey);
    await updateUserProfile(uid, { completedSets });

    // Add XP
    const xpResult = await addXP(uid, XP_PER_SET);
    
    return { success: true, xpResult };
  } catch (error) {
    console.error('completeSet error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Update active days count (call once per day on first activity)
 * @param {string} uid 
 * @returns {Promise<{success: boolean, newActiveDays?: number}>}
 */
export const updateActiveDays = async (uid) => {
  try {
    const profile = await getUserProfile(uid);
    if (!profile) {
      return { success: false, error: 'Profile not found' };
    }

    const today = new Date().toDateString();
    const lastActive = profile.lastActiveDate?.toDate?.()?.toDateString?.();

    // Only increment if not already active today
    if (lastActive !== today) {
      const newActiveDays = (profile.activeDays || 0) + 1;
      await updateUserProfile(uid, {
        activeDays: newActiveDays,
        lastActiveDate: serverTimestamp()
      });
      return { success: true, newActiveDays };
    }

    return { success: true, newActiveDays: profile.activeDays };
  } catch (error) {
    console.error('updateActiveDays error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Upload profile photo as Base64 (stored in Firestore, no Firebase Storage needed)
 * @param {string} uid 
 * @param {File} file - Image file
 * @returns {Promise<{success: boolean, photoURL?: string, error?: string}>}
 */
export const uploadProfilePhoto = async (uid, file) => {
  try {
    // Compress and convert to Base64
    const compressedBase64 = await compressAndConvertToBase64(file, 200, 0.7);
    
    // Update user profile with Base64 photo
    const userRef = doc(db, USERS_COLLECTION, uid);
    await updateDoc(userRef, {
      photoURL: compressedBase64,
      updatedAt: serverTimestamp()
    });
    
    return { success: true, photoURL: compressedBase64 };
  } catch (error) {
    console.error('uploadProfilePhoto error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Compress image and convert to Base64
 * @param {File} file 
 * @param {number} maxSize - Max width/height in pixels
 * @param {number} quality - JPEG quality 0-1
 * @returns {Promise<string>} Base64 data URL
 */
const compressAndConvertToBase64 = (file, maxSize = 200, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        
        // Calculate new dimensions
        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to Base64 JPEG
        const base64 = canvas.toDataURL('image/jpeg', quality);
        resolve(base64);
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Export constants for use in UI
export const XP_CONFIG = {
  XP_PER_SET,
  XP_PER_LEVEL
};

/**
 * Check if user can use AI features
 * @param {object} profile - User profile
 * @returns {{canUse: boolean, reason?: string}}
 */
export const checkCredits = (profile) => {
  if (!profile) return { canUse: false, reason: 'no_profile' };
  if (profile.isPremium) return { canUse: true, reason: 'premium' };
  if (profile.credits > 0) return { canUse: true, reason: 'has_credits' };
  return { canUse: false, reason: 'no_credits' };
};

/**
 * Use one credit for AI feature (only for non-premium users)
 * @param {string} uid 
 * @returns {Promise<{success: boolean, remainingCredits?: number, error?: string}>}
 */
export const useCredit = async (uid) => {
  try {
    const profile = await getUserProfile(uid);
    
    if (!profile) {
      return { success: false, error: 'Profile not found' };
    }
    
    // Premium users don't use credits
    if (profile.isPremium) {
      return { success: true, remainingCredits: -1 }; // -1 = unlimited
    }
    
    // Check if user has credits
    const currentCredits = profile.credits || 0;
    if (currentCredits <= 0) {
      return { success: false, error: 'No credits remaining' };
    }
    
    // Deduct credit
    const newCredits = currentCredits - 1;
    const userRef = doc(db, USERS_COLLECTION, uid);
    await updateDoc(userRef, {
      credits: newCredits,
      updatedAt: serverTimestamp()
    });
    
    return { success: true, remainingCredits: newCredits };
  } catch (error) {
    console.error('useCredit error:', error);
    return { success: false, error: error.message };
  }
};
