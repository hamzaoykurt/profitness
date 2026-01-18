import React from 'react';
import { Check, ArrowRight, Zap, Dumbbell, X } from 'lucide-react';
import { getExerciseImage } from '../../services/mockData';

const CinematicCard = ({ exercise, isExpanded, onToggle, onComplete, isCompleted, t }) => {
  return (
    <div 
      onClick={onToggle} 
      className={`relative w-full rounded-[28px] sm:rounded-[32px] overflow-hidden cursor-pointer mb-5 sm:mb-6 transition-all duration-[600ms] cubic-bezier(0.2, 0.8, 0.2, 1) ${
        isExpanded 
          ? 'h-[500px] sm:h-[560px] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.9)] z-20 scale-[1.01]' 
          : 'h-[240px] sm:h-[280px] active:scale-[0.98] z-0'
      }`}
    >
      <div className="absolute inset-0 z-0 bg-gray-900">
        <img 
          src={getExerciseImage(exercise.name)} 
          alt={exercise.name} 
          className={`w-full h-full object-cover transition-transform duration-[1.2s] ease-out ${
            isExpanded ? 'scale-110' : 'scale-100 opacity-70'
          }`} 
          loading="lazy" 
        />
        <div className={`absolute inset-0 bg-gradient-to-t from-[#000] via-black/40 to-transparent transition-opacity duration-500 ${
          isExpanded ? 'opacity-90' : 'opacity-70'
        }`}></div>
      </div>

      <div className={`absolute top-4 right-4 z-30 transition-all duration-500 ${
        isCompleted ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
      }`}>
        <div className="bg-emerald-500 text-black p-2 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.5)]">
          <Check size={18} strokeWidth={3} />
        </div>
      </div>

      <div className={`absolute left-0 w-full p-5 sm:p-6 flex flex-col justify-end transition-all duration-500 ease-out ${
        isExpanded ? 'bottom-[220px]' : 'bottom-0'
      }`}>
        <h3 className="text-lg sm:text-xl font-bold text-white leading-tight mb-2.5 tracking-tight">
          {exercise.name}
        </h3>
        <div className="flex items-center gap-2.5">
          <div className="liquid-glass-subtle px-3.5 py-1.5 rounded-xl">
            <span className="text-lg font-semibold text-white mr-1">{exercise.sets}</span>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{t.set}</span>
          </div>
          <div className="liquid-glass-subtle px-3.5 py-1.5 rounded-xl">
            <span className="text-lg font-semibold text-white mr-1">{exercise.reps}</span>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{t.rep}</span>
          </div>
          <div className={`ml-auto w-9 h-9 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-md transition-all duration-300 ${
            isExpanded ? 'opacity-0 scale-50' : 'opacity-100 scale-100'
          }`}>
            <ArrowRight size={16} className="text-white" />
          </div>
        </div>
      </div>

      <div className={`absolute bottom-0 left-0 w-full liquid-glass rounded-t-[28px] p-6 flex flex-col justify-between transition-all duration-500 cubic-bezier(0.2, 0.8, 0.2, 1) ${
        isExpanded ? 'translate-y-0 opacity-100' : 'translate-y-[120%] opacity-0'
      }`}>
        <div className="space-y-5">
           <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)] border border-amber-500/20">
                <Zap size={20} fill="currentColor" />
              </div>
              <div>
                <h4 className="text-[9px] font-bold text-amber-400 uppercase tracking-widest mb-1">{t.pro_tip}</h4>
                <p className="text-xs text-gray-200 leading-relaxed font-medium">{exercise.note}</p>
              </div>
           </div>
           
           {exercise.gym !== "-" && (
             <div className="flex items-center justify-between pl-14 pr-2">
               <div className="flex items-center gap-2 text-gray-500 text-[9px] font-bold uppercase tracking-widest">
                 <Dumbbell size={12} /> SALON
               </div>
               <span className="text-xs font-bold text-white tracking-wide">{exercise.gym}</span>
             </div>
           )}

           <button 
             onClick={(e) => { e.stopPropagation(); onComplete(); }} 
             className={`w-full py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 ${
               isCompleted 
                 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                 : 'bg-white text-black shadow-[0_0_25px_rgba(255,255,255,0.15)] hover:bg-gray-100'
             }`}
           >
             {isCompleted ? t.complete : t.finish_set}
             {!isCompleted && <ArrowRight size={14} />}
           </button>
        </div>
      </div>

      {isExpanded && (
        <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/10 z-20 hover:bg-black/80 transition-colors">
          <X size={16} className="text-white" />
        </div>
      )}
    </div>
  );
};

export default CinematicCard;
