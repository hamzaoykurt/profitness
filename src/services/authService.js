/**
 * Authentication Service
 * Handles all Firebase Auth operations
 * UI components should NEVER call Firebase directly
 */
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged as firebaseOnAuthStateChanged
} from 'firebase/auth';
import { auth } from './firebase';
import { createUserProfile, getUserProfile } from './userService';

const googleProvider = new GoogleAuthProvider();

/**
 * Sign in with Google OAuth
 * @returns {Promise<{success: boolean, user?: object, error?: string}>}
 */
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if user profile exists, if not create one
    const profile = await getUserProfile(user.uid);
    if (!profile) {
      await createUserProfile(user.uid, {
        displayName: user.displayName || 'Atlet',
        email: user.email,
        photoURL: user.photoURL
      });
    }
    
    return { success: true, user };
  } catch (error) {
    return { success: false, error: mapAuthError(error.code) };
  }
};

/**
 * Sign in with email and password
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<{success: boolean, user?: object, error?: string}>}
 */
export const signInWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;
    
    // Check if user profile exists, if not create one (for migrated users)
    const profile = await getUserProfile(user.uid);
    if (!profile) {
      await createUserProfile(user.uid, {
        displayName: user.displayName || user.email.split('@')[0],
        email: user.email,
        photoURL: user.photoURL || null
      });
    }
    
    return { success: true, user };
  } catch (error) {
    return { success: false, error: mapAuthError(error.code) };
  }
};

/**
 * Register new user with email and password
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<{success: boolean, user?: object, error?: string}>}
 */
export const registerWithEmail = async (email, password) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    
    // Create fresh user profile (Level 1, 0 XP, 0 Active Days)
    await createUserProfile(user.uid, {
      displayName: user.email.split('@')[0],
      email: user.email,
      photoURL: null
    });
    
    return { success: true, user };
  } catch (error) {
    return { success: false, error: mapAuthError(error.code) };
  }
};

/**
 * Sign out current user
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const logout = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Subscribe to auth state changes
 * @param {function} callback - Called with user object or null
 * @returns {function} Unsubscribe function
 */
export const onAuthStateChanged = (callback) => {
  return firebaseOnAuthStateChanged(auth, callback);
};

/**
 * Get current authenticated user
 * @returns {object|null}
 */
export const getCurrentUser = () => auth.currentUser;

/**
 * Map Firebase auth error codes to user-friendly messages
 * @param {string} errorCode 
 * @returns {string}
 */
const mapAuthError = (errorCode) => {
  const errorMap = {
    'auth/email-already-in-use': 'Bu e-posta zaten kullanımda.',
    'auth/invalid-email': 'Geçersiz e-posta adresi.',
    'auth/operation-not-allowed': 'Bu işlem şu an aktif değil.',
    'auth/weak-password': 'Şifre en az 6 karakter olmalı.',
    'auth/user-disabled': 'Bu hesap devre dışı.',
    'auth/user-not-found': 'Kullanıcı bulunamadı.',
    'auth/wrong-password': 'Hatalı şifre.',
    'auth/popup-closed-by-user': 'Giriş penceresi kapatıldı.',
    'auth/network-request-failed': 'Ağ hatası. İnternet bağlantınızı kontrol edin.'
  };
  return errorMap[errorCode] || 'Bir hata oluştu. Lütfen tekrar deneyin.';
};
