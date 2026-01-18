import React from 'react';
import { Minus, Plus } from 'lucide-react';

/**
 * Premium Number Stepper Component
 * Replaces ugly browser default number inputs with stylish +/- buttons
 */
const NumberStepper = ({ 
  value, 
  onChange, 
  min = 1, 
  max = 99, 
  label,
  size = 'md' // 'sm' | 'md' | 'lg'
}) => {
  const handleDecrement = (e) => {
    e.stopPropagation();
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = (e) => {
    e.stopPropagation();
    if (value < max) {
      onChange(value + 1);
    }
  };

  const sizeClasses = {
    sm: {
      container: 'h-10',
      button: 'w-8 h-8',
      icon: 14,
      text: 'text-lg w-8'
    },
    md: {
      container: 'h-12',
      button: 'w-10 h-10',
      icon: 16,
      text: 'text-xl w-10'
    },
    lg: {
      container: 'h-14',
      button: 'w-12 h-12',
      icon: 18,
      text: 'text-2xl w-12'
    }
  };

  const s = sizeClasses[size] || sizeClasses.md;

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          {label}
        </span>
      )}
      <div className={`flex items-center gap-1 bg-white/5 rounded-2xl p-1 border border-white/10 ${s.container}`}>
        <button
          type="button"
          onClick={handleDecrement}
          disabled={value <= min}
          className={`${s.button} flex items-center justify-center rounded-xl bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed`}
        >
          <Minus size={s.icon} />
        </button>
        
        <span className={`${s.text} font-black text-white text-center font-display`}>
          {value}
        </span>
        
        <button
          type="button"
          onClick={handleIncrement}
          disabled={value >= max}
          className={`${s.button} flex items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 hover:text-emerald-300 transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed`}
        >
          <Plus size={s.icon} />
        </button>
      </div>
    </div>
  );
};

export default NumberStepper;
