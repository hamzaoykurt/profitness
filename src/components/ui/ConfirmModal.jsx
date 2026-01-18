import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

/**
 * Premium Confirm Modal
 * Replaces ugly browser confirm() dialog
 */
const ConfirmModal = ({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  title, 
  message, 
  confirmText = 'Tamam',
  cancelText = 'Vazgeç',
  variant = 'danger' // 'danger' | 'warning' | 'info'
}) => {
  if (!isOpen) return null;

  const variants = {
    danger: {
      icon: 'bg-red-500/20 text-red-400',
      button: 'bg-red-500 hover:bg-red-400 text-white'
    },
    warning: {
      icon: 'bg-amber-500/20 text-amber-400',
      button: 'bg-amber-500 hover:bg-amber-400 text-black'
    },
    info: {
      icon: 'bg-emerald-500/20 text-emerald-400',
      button: 'bg-emerald-500 hover:bg-emerald-400 text-black'
    }
  };

  const v = variants[variant] || variants.danger;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-enter">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onCancel}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-sm bg-zinc-900 rounded-[28px] border border-white/10 shadow-2xl shadow-black/50 overflow-hidden">
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white transition-colors rounded-xl hover:bg-white/10"
        >
          <X size={18} />
        </button>

        <div className="p-8 text-center">
          {/* Icon */}
          <div className={`w-16 h-16 rounded-2xl ${v.icon} flex items-center justify-center mx-auto mb-5`}>
            <AlertTriangle size={32} />
          </div>

          {/* Title */}
          <h3 className="text-xl font-black text-white mb-2 font-display">
            {title}
          </h3>

          {/* Message */}
          <p className="text-sm text-gray-400 mb-8 leading-relaxed">
            {message}
          </p>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-3.5 bg-white/10 text-white font-bold rounded-xl text-sm hover:bg-white/20 transition-all"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 py-3.5 font-bold rounded-xl text-sm transition-all ${v.button}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
