import React, { useState } from 'react';
import { Trash2, Edit2, Check, X, Minus, Plus } from 'lucide-react';
import CinematicCard from '../components/ui/CinematicCard';
import ConfirmModal from '../components/ui/ConfirmModal';

const WorkoutView = ({ 
  currentDay, 
  progress, 
  program, 
  activeDayId, 
  setActiveDayId, 
  completed, 
  setCompleted, 
  onCompleteSet,
  onDeleteExercise,
  onEditExercise,
  onDeleteDay,
  t,
  lang 
}) => {
  const [expandedId, setExpandedId] = useState(null);
  const [editingExercise, setEditingExercise] = useState(null);
  const [editValues, setEditValues] = useState({ sets: 0, reps: 0 });
  
  // Confirm modal state
  const [confirmModal, setConfirmModal] = useState({ 
    isOpen: false, 
    type: null, // 'exercise' | 'day'
    targetId: null 
  });

  if (!currentDay) return null;

  const handleStartEdit = (exercise) => {
    setEditingExercise(exercise.id);
    setEditValues({ sets: exercise.sets || 3, reps: exercise.reps || 10 });
  };

  const handleSaveEdit = async (exerciseId) => {
    if (onEditExercise) {
      await onEditExercise(activeDayId, exerciseId, editValues);
    }
    setEditingExercise(null);
  };

  const handleCancelEdit = () => {
    setEditingExercise(null);
    setEditValues({ sets: 0, reps: 0 });
  };

  // Show confirm modal for exercise delete
  const handleDeleteExerciseClick = (exerciseId) => {
    setConfirmModal({ isOpen: true, type: 'exercise', targetId: exerciseId });
  };

  // Show confirm modal for day delete
  const handleDeleteDayClick = () => {
    setConfirmModal({ isOpen: true, type: 'day', targetId: null });
  };

  // Handle confirm action
  const handleConfirm = async () => {
    if (confirmModal.type === 'exercise' && onDeleteExercise) {
      await onDeleteExercise(activeDayId, confirmModal.targetId);
    } else if (confirmModal.type === 'day' && onDeleteDay) {
      await onDeleteDay(activeDayId);
      setActiveDayId(0);
    }
    setConfirmModal({ isOpen: false, type: null, targetId: null });
  };

  // Handle cancel
  const handleCancel = () => {
    setConfirmModal({ isOpen: false, type: null, targetId: null });
  };

  // Premium stepper component
  const Stepper = ({ value, onChange, label }) => (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">{label}</span>
      <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-xl p-1">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); if (value > 1) onChange(value - 1); }}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white transition-all active:scale-95"
        >
          <Minus size={14} />
        </button>
        <span className="w-8 text-lg font-black text-white text-center font-display">{value}</span>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); if (value < 99) onChange(value + 1); }}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-500/30 text-emerald-400 hover:bg-emerald-500/50 transition-all active:scale-95"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        title={
          confirmModal.type === 'day' 
            ? (lang === 'tr' ? 'Günü Sil' : 'Delete Day')
            : (lang === 'tr' ? 'Hareketi Sil' : 'Delete Exercise')
        }
        message={
          confirmModal.type === 'day'
            ? (lang === 'tr' ? 'Bu günü ve tüm hareketlerini silmek istediğine emin misin?' : 'Are you sure you want to delete this day and all its exercises?')
            : (lang === 'tr' ? 'Bu hareketi silmek istediğine emin misin?' : 'Are you sure you want to delete this exercise?')
        }
        confirmText={lang === 'tr' ? 'Evet, Sil' : 'Yes, Delete'}
        cancelText={lang === 'tr' ? 'Vazgeç' : 'Cancel'}
        variant="danger"
      />
      
      {/* Desktop Layout Container */}
      <main className="px-4 pt-24 pb-32 mx-auto animate-enter max-w-lg lg:max-w-4xl xl:max-w-6xl relative z-10">
        {/* Header */}
        <div className="px-2 mb-6 flex justify-between items-end">
          <div>
            <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">PRO VISION</h2>
            <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">{currentDay.title || currentDay.label}</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-lg lg:text-xl font-bold text-emerald-400">{progress}%</div>
            </div>
            {onDeleteDay && (
              <button 
                onClick={handleDeleteDayClick}
                className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                title={lang === 'tr' ? 'Günü Sil' : 'Delete Day'}
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Exercises - Desktop Grid */}
        <div className="lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-6">
          {currentDay.exercises?.map((ex) => (
            <div key={ex.id} className="relative">
              {/* Premium Edit Controls */}
              {editingExercise === ex.id ? (
                <div className="absolute top-4 right-4 z-30 bg-black/90 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-white/10">
                  <div className="flex items-center gap-4 mb-3">
                    <Stepper 
                      value={editValues.sets} 
                      onChange={(v) => setEditValues(prev => ({ ...prev, sets: v }))}
                      label="SET"
                    />
                    <span className="text-gray-500 text-lg font-bold mt-4">×</span>
                    <Stepper 
                      value={editValues.reps} 
                      onChange={(v) => setEditValues(prev => ({ ...prev, reps: v }))}
                      label={lang === 'tr' ? 'TEKRAR' : 'REPS'}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleSaveEdit(ex.id)} 
                      className="flex-1 py-2.5 bg-emerald-500 rounded-xl text-black font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-400 transition-colors"
                    >
                      <Check size={16} /> {lang === 'tr' ? 'Kaydet' : 'Save'}
                    </button>
                    <button 
                      onClick={handleCancelEdit} 
                      className="px-4 py-2.5 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className={`absolute top-4 right-4 z-30 flex items-center gap-1 transition-opacity ${expandedId === ex.id ? 'opacity-0' : 'opacity-100'}`}>
                  {onEditExercise && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleStartEdit(ex); }}
                      className="p-2.5 bg-black/60 backdrop-blur-sm rounded-full text-gray-400 hover:text-white hover:bg-black/80 transition-all"
                    >
                      <Edit2 size={14} />
                    </button>
                  )}
                  {onDeleteExercise && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDeleteExerciseClick(ex.id); }}
                      className="p-2.5 bg-black/60 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-400 hover:bg-black/80 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              )}

              <CinematicCard 
                exercise={ex} 
                isExpanded={expandedId === ex.id} 
                isCompleted={!!completed[ex.id]} 
                onToggle={() => setExpandedId(expandedId === ex.id ? null : ex.id)} 
                onComplete={() => onCompleteSet ? onCompleteSet(ex.id, 0) : setCompleted({...completed, [ex.id]: !completed[ex.id]})} 
                t={t} 
              />
            </div>
          ))}
        </div>
      </main>

      {/* Day Selector - BOLD & PREMIUM */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-4">
          {program.map((day, index) => {
            const isActive = activeDayId === index;
            // Extract number if label contains it, otherwise use index+1
            const dayNum = day.label.replace(/\D/g, '') || (index + 1);
            // Regex fix: remove dots and numbers to get clean text
            const dayText = day.label.replace(/[0-9.]/g, '').trim() || (lang === 'tr' ? 'GÜN' : 'DAY');

            return (
              <button 
                key={day.id || index} 
                onClick={() => { setActiveDayId(index); setExpandedId(null); window.scrollTo({top:0, behavior:'smooth'}); }} 
                className={`group relative flex flex-col items-center justify-center transition-all duration-500 ease-out ${
                  isActive 
                    ? 'w-20 h-24 -translate-y-4' 
                    : 'w-16 h-20 hover:-translate-y-2'
                }`}
              >
                {/* Glass Background */}
                <div className={`absolute inset-0 rounded-2xl backdrop-blur-xl border transition-all duration-500 ${
                  isActive 
                    ? 'bg-white text-black border-white shadow-[0_0_30px_rgba(255,255,255,0.3)]' 
                    : 'bg-black/40 text-gray-500 border-white/10 group-hover:bg-black/60 group-hover:border-white/30'
                }`}></div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center">
                  <span className={`text-[10px] font-bold tracking-widest uppercase mb-1 transition-colors ${
                    isActive ? 'text-black/60' : 'text-gray-500 group-hover:text-gray-300'
                  }`}>
                    {dayText}
                  </span>
                  <span className={`text-3xl font-black font-display tracking-tighter transition-all ${
                    isActive ? 'text-black scale-110' : 'text-white scale-100'
                  }`}>
                    {dayNum}
                  </span>
                </div>

                {/* Active Indicator Dot */}
                {isActive && (
                  <div className="absolute -bottom-3 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_white]"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default WorkoutView;
