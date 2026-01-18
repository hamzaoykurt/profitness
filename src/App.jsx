import React, { useState, useEffect } from 'react';

// Views & Components
import AuthView from './views/AuthView';
import WorkoutView from './views/WorkoutView';
import NewsView from './views/NewsView';
import AICoachView from './views/AICoachView';
import ProfileView from './views/ProfileView';
import ProgramBuilderView from './views/ProgramBuilderView';
import PremiumView from './views/PremiumView';
import Navbar from './components/layout/Navbar';
import EmptyState from './components/ui/EmptyState';
import SilkBackground from './components/ui/SilkBackground';

// Hooks
import { useAuth } from './hooks/useAuth';
import { useUserProfile } from './hooks/useUserProfile';
import { useProgram } from './hooks/useProgram';

// Data & Config
import { TRANSLATIONS } from './services/mockData';

// --- MAIN APP ---
export default function App() {
  const { user, loading, actionLoading, error, loginWithGoogle, loginWithEmail, register, logout, clearError } = useAuth();
  const { profile, xpProgress, xpAnimation, completeSet, isSetCompleted, updateUserProfile } = useUserProfile(user?.uid);
  const { program, loading: programLoading, hasProgram, saveProgram, removeExercise, editExercise, removeDay } = useProgram(user?.uid);
  
  const [view, setView] = useState('workout');
  const [lang, setLang] = useState('tr');
  const [activeDayId, setActiveDayId] = useState(0);
  const [completed, setCompleted] = useState({});
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [programMode, setProgramMode] = useState(null); // 'manual' or 'ai'
  
  const t = TRANSLATIONS[lang];

  // Sync local completed state with profile
  useEffect(() => {
    if (profile?.completedSets) {
      const completedMap = {};
      profile.completedSets.forEach(setKey => {
        const [exerciseId] = setKey.split('_set');
        completedMap[exerciseId] = true;
      });
      setCompleted(completedMap);
    }
  }, [profile?.completedSets]);

  const handleLogout = async () => {
    await logout();
    setCompleted({});
    setView('workout');
  };

  // Handle set completion with XP
  const handleCompleteSet = async (exerciseId, setIndex = 0) => {
    if (!user?.uid) return;
    
    const result = await completeSet(exerciseId, setIndex);
    if (result.success) {
      setCompleted(prev => ({ ...prev, [exerciseId]: true }));
    }
  };

  // Program creation handlers
  const handleCreateManual = () => {
    setProgramMode('manual');
    setView('create');
  };

  const handleCreateAI = () => {
    setProgramMode('ai');
    setView('create');
  };

  // Handle program save from builder
  const handleSaveProgram = async (days) => {
    const result = await saveProgram(days);
    if (result.success) {
      setView('workout');
      setProgramMode(null);
    }
    return result;
  };

  // Loading state
  if (loading || programLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Auth screen
  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white font-sans">
        <AuthView 
          t={t} 
          onLoginWithGoogle={loginWithGoogle}
          onLoginWithEmail={loginWithEmail}
          onRegister={register}
          loading={actionLoading}
          error={error}
          clearError={clearError}
        />
      </div>
    );
  }

  // Get current day from user's program or show empty
  const currentDays = program?.days || [];
  const currentDay = currentDays[activeDayId] || null;
  const progress = currentDay?.exercises?.length > 0
    ? Math.round((currentDay.exercises.filter(e => completed[e.id]).length / currentDay.exercises.length) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-emerald-500/30">
      {/* Animated Silk Background */}
      <SilkBackground 
        speed={2} 
        scale={1} 
        color="#1e1b4b"
      />
      
      {/* XP Animation Popup */}
      {xpAnimation && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-enter">
          <div className="bg-emerald-500/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg shadow-emerald-500/30">
            <span className="font-bold text-black">
              +{xpAnimation.amount} XP
              {xpAnimation.leveledUp && ' 🎉 LEVEL UP!'}
            </span>
          </div>
        </div>
      )}
      
      <Navbar 
        view={view} 
        setView={setView} 
        handleLogout={handleLogout}
        lang={lang}
        setLang={setLang}
        profile={profile}
      />

      {/* Workout View - Show Empty State or Program */}
      {view === 'workout' && (
        hasProgram ? (
          <WorkoutView 
            currentDay={currentDay} 
            progress={progress} 
            program={currentDays} 
            activeDayId={activeDayId} 
            setActiveDayId={setActiveDayId} 
            completed={completed} 
            setCompleted={setCompleted}
            onCompleteSet={handleCompleteSet}
            onDeleteExercise={removeExercise}
            onEditExercise={editExercise}
            onDeleteDay={removeDay}
            t={t}
            lang={lang}
          />
        ) : (
          <EmptyState 
            t={t}
            lang={lang}
            onCreateManual={handleCreateManual}
            onCreateAI={handleCreateAI}
          />
        )
      )}

      {view === 'create' && (
        <ProgramBuilderView 
          onSave={handleSaveProgram}
          t={t} 
          lang={lang}
          mode={programMode}
          onBack={() => setView('workout')}
          userId={user?.uid}
          profile={profile}
          onNavigateToPremium={() => setView('premium')}
        />
      )}
      
      {view === 'ai' && (
        <AICoachView 
          t={t} 
          lang={lang} 
          profile={profile}
          hasProgram={hasProgram}
          onCreateProgram={async (days) => {
            const result = await saveProgram(days);
            if (result.success) {
              setView('workout');
            }
            return result;
          }}
          onUpdateProgram={async (days) => {
            const result = await saveProgram(days);
            if (result.success) {
              setView('workout');
            }
            return result;
          }}
        />
      )}
      {view === 'news' && <NewsView t={t} lang={lang} />}
      {view === 'profile' && (
        <ProfileView 
          t={t} 
          profile={profile}
          xpProgress={xpProgress}
          onUpdateProfile={updateUserProfile}
          userId={user?.uid}
          onPremium={() => setView('premium')}
        />
      )}
      
      {view === 'premium' && (
        <PremiumView 
          t={t} 
          lang={lang}
          profile={profile}
          onBack={() => setView('profile')}
        />
      )}
      
    </div>
  );
}
