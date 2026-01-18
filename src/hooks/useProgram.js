/**
 * useProgram Hook
 * Manages user's workout program with Firestore
 */
import { useState, useEffect, useCallback } from 'react';
import { 
  getUserProgram, 
  saveUserProgram, 
  updateProgramDay,
  deleteProgramDay,
  addExerciseToDay,
  updateExercise,
  deleteExercise,
  deleteProgram
} from '../services/programService';

/**
 * Custom hook for program management
 * @param {string} uid - User ID
 * @returns {object} Program state and methods
 */
export const useProgram = (uid) => {
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load program on mount
  useEffect(() => {
    if (!uid) {
      setProgram(null);
      setLoading(false);
      return;
    }

    const loadProgram = async () => {
      setLoading(true);
      const data = await getUserProgram(uid);
      setProgram(data);
      setLoading(false);
    };

    loadProgram();
  }, [uid]);

  /**
   * Save complete program
   */
  const saveProgram = useCallback(async (days) => {
    if (!uid) return { success: false, error: 'No user' };
    
    setSaving(true);
    const result = await saveUserProgram(uid, days);
    
    if (result.success) {
      setProgram({ days });
    }
    
    setSaving(false);
    return result;
  }, [uid]);

  /**
   * Update a specific day
   */
  const updateDay = useCallback(async (dayIndex, dayData) => {
    if (!uid) return { success: false, error: 'No user' };
    
    setSaving(true);
    const result = await updateProgramDay(uid, dayIndex, dayData);
    
    if (result.success && program) {
      const newDays = [...program.days];
      newDays[dayIndex] = { ...newDays[dayIndex], ...dayData };
      setProgram({ ...program, days: newDays });
    }
    
    setSaving(false);
    return result;
  }, [uid, program]);

  /**
   * Delete a day
   */
  const removeDay = useCallback(async (dayIndex) => {
    if (!uid) return { success: false, error: 'No user' };
    
    setSaving(true);
    const result = await deleteProgramDay(uid, dayIndex);
    
    if (result.success && program) {
      const newDays = program.days.filter((_, i) => i !== dayIndex);
      setProgram({ ...program, days: newDays });
    }
    
    setSaving(false);
    return result;
  }, [uid, program]);

  /**
   * Add exercise to a day
   */
  const addExercise = useCallback(async (dayIndex, exercise) => {
    if (!uid) return { success: false, error: 'No user' };
    
    setSaving(true);
    const result = await addExerciseToDay(uid, dayIndex, exercise);
    
    if (result.success && program) {
      const newDays = [...program.days];
      const newExercise = { id: result.exerciseId, ...exercise };
      newDays[dayIndex].exercises = [...(newDays[dayIndex].exercises || []), newExercise];
      setProgram({ ...program, days: newDays });
    }
    
    setSaving(false);
    return result;
  }, [uid, program]);

  /**
   * Update an exercise
   */
  const editExercise = useCallback(async (dayIndex, exerciseId, updates) => {
    if (!uid) return { success: false, error: 'No user' };
    
    setSaving(true);
    const result = await updateExercise(uid, dayIndex, exerciseId, updates);
    
    if (result.success && program) {
      const newDays = [...program.days];
      const exIndex = newDays[dayIndex].exercises.findIndex(e => e.id === exerciseId);
      if (exIndex !== -1) {
        newDays[dayIndex].exercises[exIndex] = {
          ...newDays[dayIndex].exercises[exIndex],
          ...updates
        };
      }
      setProgram({ ...program, days: newDays });
    }
    
    setSaving(false);
    return result;
  }, [uid, program]);

  /**
   * Remove an exercise
   */
  const removeExercise = useCallback(async (dayIndex, exerciseId) => {
    if (!uid) return { success: false, error: 'No user' };
    
    setSaving(true);
    const result = await deleteExercise(uid, dayIndex, exerciseId);
    
    if (result.success && program) {
      const newDays = [...program.days];
      newDays[dayIndex].exercises = newDays[dayIndex].exercises.filter(e => e.id !== exerciseId);
      setProgram({ ...program, days: newDays });
    }
    
    setSaving(false);
    return result;
  }, [uid, program]);

  /**
   * Delete entire program
   */
  const clearProgram = useCallback(async () => {
    if (!uid) return { success: false, error: 'No user' };
    
    setSaving(true);
    const result = await deleteProgram(uid);
    
    if (result.success) {
      setProgram(null);
    }
    
    setSaving(false);
    return result;
  }, [uid]);

  /**
   * Check if user has a program
   */
  const hasProgram = program?.days?.length > 0;

  return {
    program,
    loading,
    saving,
    hasProgram,
    saveProgram,
    updateDay,
    removeDay,
    addExercise,
    editExercise,
    removeExercise,
    clearProgram,
    refreshProgram: async () => {
      if (!uid) return;
      const data = await getUserProgram(uid);
      setProgram(data);
    }
  };
};

export default useProgram;
