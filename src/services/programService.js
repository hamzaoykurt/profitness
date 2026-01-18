/**
 * Program Service
 * Handles user workout programs in Firestore
 */
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  collection,
  getDocs,
  query,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

const USERS_COLLECTION = 'users';
const PROGRAMS_SUBCOLLECTION = 'programs';

/**
 * Get user's program from Firestore
 * @param {string} uid 
 * @returns {Promise<object|null>}
 */
export const getUserProgram = async (uid) => {
  try {
    const programRef = doc(db, USERS_COLLECTION, uid, PROGRAMS_SUBCOLLECTION, 'active');
    const snapshot = await getDoc(programRef);
    
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() };
    }
    return null;
  } catch (error) {
    console.error('getUserProgram error:', error);
    return null;
  }
};

/**
 * Save user's program to Firestore
 * @param {string} uid 
 * @param {Array} days - Array of day objects with exercises
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const saveUserProgram = async (uid, days) => {
  try {
    const programRef = doc(db, USERS_COLLECTION, uid, PROGRAMS_SUBCOLLECTION, 'active');
    await setDoc(programRef, {
      days: days,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('saveUserProgram error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Update a specific day in the program
 * @param {string} uid 
 * @param {number} dayIndex 
 * @param {object} dayData 
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const updateProgramDay = async (uid, dayIndex, dayData) => {
  try {
    const program = await getUserProgram(uid);
    if (!program) {
      return { success: false, error: 'Program not found' };
    }

    const days = [...program.days];
    days[dayIndex] = { ...days[dayIndex], ...dayData };

    const programRef = doc(db, USERS_COLLECTION, uid, PROGRAMS_SUBCOLLECTION, 'active');
    await updateDoc(programRef, {
      days: days,
      updatedAt: serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('updateProgramDay error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Delete a day from the program
 * @param {string} uid 
 * @param {number} dayIndex 
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteProgramDay = async (uid, dayIndex) => {
  try {
    const program = await getUserProgram(uid);
    if (!program) {
      return { success: false, error: 'Program not found' };
    }

    const days = program.days.filter((_, i) => i !== dayIndex);

    const programRef = doc(db, USERS_COLLECTION, uid, PROGRAMS_SUBCOLLECTION, 'active');
    await updateDoc(programRef, {
      days: days,
      updatedAt: serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('deleteProgramDay error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Add exercise to a day
 * @param {string} uid 
 * @param {number} dayIndex 
 * @param {object} exercise 
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const addExerciseToDay = async (uid, dayIndex, exercise) => {
  try {
    const program = await getUserProgram(uid);
    if (!program) {
      return { success: false, error: 'Program not found' };
    }

    const days = [...program.days];
    const newExercise = {
      id: `e${Date.now()}`,
      ...exercise
    };
    days[dayIndex].exercises = [...(days[dayIndex].exercises || []), newExercise];

    const programRef = doc(db, USERS_COLLECTION, uid, PROGRAMS_SUBCOLLECTION, 'active');
    await updateDoc(programRef, {
      days: days,
      updatedAt: serverTimestamp()
    });

    return { success: true, exerciseId: newExercise.id };
  } catch (error) {
    console.error('addExerciseToDay error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Update exercise in a day
 * @param {string} uid 
 * @param {number} dayIndex 
 * @param {string} exerciseId 
 * @param {object} updates 
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const updateExercise = async (uid, dayIndex, exerciseId, updates) => {
  try {
    const program = await getUserProgram(uid);
    if (!program) {
      return { success: false, error: 'Program not found' };
    }

    const days = [...program.days];
    const exerciseIndex = days[dayIndex].exercises.findIndex(e => e.id === exerciseId);
    
    if (exerciseIndex === -1) {
      return { success: false, error: 'Exercise not found' };
    }

    days[dayIndex].exercises[exerciseIndex] = {
      ...days[dayIndex].exercises[exerciseIndex],
      ...updates
    };

    const programRef = doc(db, USERS_COLLECTION, uid, PROGRAMS_SUBCOLLECTION, 'active');
    await updateDoc(programRef, {
      days: days,
      updatedAt: serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('updateExercise error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Delete exercise from a day
 * @param {string} uid 
 * @param {number} dayIndex 
 * @param {string} exerciseId 
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteExercise = async (uid, dayIndex, exerciseId) => {
  try {
    const program = await getUserProgram(uid);
    if (!program) {
      return { success: false, error: 'Program not found' };
    }

    const days = [...program.days];
    days[dayIndex].exercises = days[dayIndex].exercises.filter(e => e.id !== exerciseId);

    const programRef = doc(db, USERS_COLLECTION, uid, PROGRAMS_SUBCOLLECTION, 'active');
    await updateDoc(programRef, {
      days: days,
      updatedAt: serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('deleteExercise error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Delete entire program
 * @param {string} uid 
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteProgram = async (uid) => {
  try {
    const programRef = doc(db, USERS_COLLECTION, uid, PROGRAMS_SUBCOLLECTION, 'active');
    await deleteDoc(programRef);
    return { success: true };
  } catch (error) {
    console.error('deleteProgram error:', error);
    return { success: false, error: error.message };
  }
};
