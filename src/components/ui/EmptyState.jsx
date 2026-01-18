import React from 'react';
import { Plus, Sparkles, Layout } from 'lucide-react';
import GlassPanel from './GlassPanel';

/**
 * EmptyState component for new users without a program
 */
const EmptyState = ({ t, lang, onCreateManual, onCreateAI }) => {
  return (
    <div className="px-4 pt-32 pb-32 animate-enter max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="w-24 h-24 bg-white/5 rounded-[32px] mx-auto mb-6 flex items-center justify-center border border-white/10">
          <Layout size={40} className="text-gray-500" />
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight font-display mb-3">
          {lang === 'tr' ? 'Henüz Bir Programın Yok' : 'No Program Yet'}
        </h1>
        <p className="text-gray-400 text-sm max-w-xs mx-auto">
          {lang === 'tr' 
            ? 'Fitness yolculuğuna başlamak için bir antrenman programı oluştur.' 
            : 'Create a workout program to start your fitness journey.'}
        </p>
      </div>

      {/* Create Options */}
      <div className="space-y-4">
        {/* Manual Create */}
        <GlassPanel 
          className="rounded-[28px] p-6 cursor-pointer hover:bg-white/5 transition-all group"
          onClick={onCreateManual}
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
              <Plus size={24} className="text-white group-hover:text-emerald-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-1">
                {lang === 'tr' ? 'Manuel Oluştur' : 'Create Manually'}
              </h3>
              <p className="text-xs text-gray-400">
                {lang === 'tr' 
                  ? 'Günleri, hareketleri ve setleri kendin belirle' 
                  : 'Set days, exercises and sets yourself'}
              </p>
            </div>
          </div>
        </GlassPanel>

        {/* AI Create */}
        <GlassPanel 
          className="rounded-[28px] p-6 cursor-pointer hover:bg-white/5 transition-all group border-emerald-500/20"
          onClick={onCreateAI}
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
              <Sparkles size={24} className="text-emerald-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                {lang === 'tr' ? 'AI Mimar ile Oluştur' : 'Create with AI Architect'}
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold uppercase">
                  {lang === 'tr' ? 'Önerilen' : 'Recommended'}
                </span>
              </h3>
              <p className="text-xs text-gray-400">
                {lang === 'tr' 
                  ? 'Hedefini söyle, AI sana özel program tasarlasın' 
                  : 'Tell your goal, let AI design a program for you'}
              </p>
            </div>
          </div>
        </GlassPanel>
      </div>

      {/* Tips */}
      <div className="mt-10 text-center">
        <p className="text-[10px] text-gray-600 uppercase tracking-widest">
          {lang === 'tr' ? 'İPUCU: Her set +25 XP kazandırır!' : 'TIP: Each set gives +25 XP!'}
        </p>
      </div>
    </div>
  );
};

export default EmptyState;
