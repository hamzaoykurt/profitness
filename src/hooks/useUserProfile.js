/**
 * useUserProfile Hook
 * Real-time user profile subscription with XP operations
 */
import { useState, useEffect, useCallback } from 'react';
import { 
  subscribeToUserProfile, 
  updateUserProfile as updateProfile,
  completeSet as serviceCompleteSet,
  updateActiveDays as serviceUpdateActiveDays,
  XP_CONFIG
} from '../services/userService';

/**
 * Custom hook for user profile with real-time updates
 * @param {string} uid - User ID
 * @returns {object} Profile state and methods
 */
export const useUserProfile = (uid) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [xpAnimation, setXpAnimation] = useState(null);

  // Subscribe to real-time profile updates
  useEffect(() => {
    if (!uid) {
      setProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToUserProfile(uid, (data) => {
      setProfile(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [uid]);

  // Update active days on first load
  useEffect(() => {
    if (uid && profile) {
      serviceUpdateActiveDays(uid);
    }
  }, [uid, profile?.id]);

  /**
   * Update profile fields (name, photoURL)
   */
  const updateUserProfile = useCallback(async (updates) => {
    if (!uid) return { success: false, error: 'No user' };
    return updateProfile(uid, updates);
  }, [uid]);

  /**
   * Complete a set and gain XP
   */
  const completeSet = useCallback(async (exerciseId, setIndex) => {
    if (!uid) return { success: false, error: 'No user' };
    
    const result = await serviceCompleteSet(uid, exerciseId, setIndex);
    
    // Trigger XP animation
    if (result.success && result.xpResult?.xpGained > 0) {
      setXpAnimation({
        amount: result.xpResult.xpGained,
        leveledUp: result.xpResult.leveledUp,
        timestamp: Date.now()
      });
      
      // Clear animation after 2 seconds
      setTimeout(() => setXpAnimation(null), 2000);
    }
    
    return result;
  }, [uid]);

  /**
   * Check if a set is completed
   */
  const isSetCompleted = useCallback((exerciseId, setIndex) => {
    const setKey = `${exerciseId}_set${setIndex}`;
    return profile?.completedSets?.includes(setKey) || false;
  }, [profile?.completedSets]);

  /**
   * Calculate XP progress percentage
   */
  const xpProgress = profile 
    ? Math.round((profile.xp / XP_CONFIG.XP_PER_LEVEL) * 100)
    : 0;

  return {
    profile,
    loading,
    xpProgress,
    xpAnimation,
    updateUserProfile,
    completeSet,
    isSetCompleted,
    XP_CONFIG
  };
};

export default useUserProfile;
