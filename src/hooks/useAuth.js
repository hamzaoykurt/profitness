/**
 * useAuth Hook
 * Bridges authService with React components
 * Provides reactive auth state and actions
 */
import { useState, useEffect, useCallback } from 'react';
import { 
  onAuthStateChanged, 
  signInWithGoogle, 
  signInWithEmail, 
  registerWithEmail,
  logout as authLogout,
  getCurrentUser
} from '../services/authService';

/**
 * Custom hook for authentication
 * @returns {object} Auth state and methods
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Subscribe to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged((authUser) => {
      setUser(authUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  /**
   * Sign in with Google
   */
  const loginWithGoogle = useCallback(async () => {
    setActionLoading(true);
    setError(null);
    const result = await signInWithGoogle();
    setActionLoading(false);
    if (!result.success) {
      setError(result.error);
    }
    return result;
  }, []);

  /**
   * Sign in with email/password
   */
  const loginWithEmail = useCallback(async (email, password) => {
    setActionLoading(true);
    setError(null);
    const result = await signInWithEmail(email, password);
    setActionLoading(false);
    if (!result.success) {
      setError(result.error);
    }
    return result;
  }, []);

  /**
   * Register new account
   */
  const register = useCallback(async (email, password) => {
    setActionLoading(true);
    setError(null);
    const result = await registerWithEmail(email, password);
    setActionLoading(false);
    if (!result.success) {
      setError(result.error);
    }
    return result;
  }, []);

  /**
   * Sign out
   */
  const logout = useCallback(async () => {
    setActionLoading(true);
    const result = await authLogout();
    setActionLoading(false);
    if (!result.success) {
      setError(result.error);
    }
    return result;
  }, []);

  return {
    user,
    loading,
    error,
    actionLoading,
    isAuthenticated: !!user,
    loginWithGoogle,
    loginWithEmail,
    register,
    logout,
    clearError: () => setError(null)
  };
};

export default useAuth;
