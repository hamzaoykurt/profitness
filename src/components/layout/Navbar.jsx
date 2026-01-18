import React from 'react';
import { Home, Layout, Sparkles, Newspaper, User, LogOut, Globe, Crown, Zap } from 'lucide-react';

const Navbar = ({ view, setView, handleLogout, lang, setLang, profile }) => {
  const toggleLang = () => {
    setLang(lang === 'tr' ? 'en' : 'tr');
  };

  const credits = profile?.credits ?? 0;
  const isPremium = profile?.isPremium || false;

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
      <div className="pointer-events-auto liquid-glass-dark rounded-full px-2 py-2 flex items-center gap-1 transition-all duration-300">
        
        <button 
          onClick={() => setView('workout')} 
          className={`p-3 rounded-full transition-all duration-300 ${
            view === 'workout' ? 'bg-white text-black shadow-lg scale-105' : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Home size={20} />
        </button>

        <button 
          onClick={() => setView('create')} 
          className={`p-3 rounded-full transition-all duration-300 ${
             view === 'create' ? 'bg-white text-black shadow-lg scale-105' : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Layout size={20} />
        </button>

        <button 
          onClick={() => setView('ai')} 
          className={`p-3 rounded-full transition-all duration-300 ${
             view === 'ai' ? 'text-emerald-400 bg-emerald-500/15 shadow-[0_0_15px_rgba(16,185,129,0.25)]' : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Sparkles size={20} className={view === 'ai' ? 'icon-glow' : ''} />
        </button>

        <button 
          onClick={() => setView('news')} 
          className={`p-3 rounded-full transition-all duration-300 ${
             view === 'news' ? 'text-white bg-white/15' : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Newspaper size={20} />
        </button>

        <button 
          onClick={() => setView('profile')} 
          className={`p-3 rounded-full transition-all duration-300 ${
             view === 'profile' ? 'text-white bg-white/15' : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <User size={20} />
        </button>

        <div className="w-px h-6 bg-white/15 mx-1"></div>

        {/* Credit/Premium Badge */}
        {isPremium ? (
          <div className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 flex items-center gap-1.5 border border-amber-500/30">
            <Crown size={14} className="text-amber-400" />
            <span className="text-[10px] font-bold text-amber-400">PRO</span>
          </div>
        ) : (
          <div className="px-2.5 py-1.5 rounded-lg bg-white/5 flex items-center gap-1.5 border border-white/10">
            <Zap size={14} className={credits > 0 ? 'text-emerald-400' : 'text-gray-500'} />
            <span className={`text-[10px] font-bold ${credits > 0 ? 'text-white' : 'text-gray-500'}`}>
              {credits}
            </span>
          </div>
        )}

        {/* Language Toggle */}
        <button 
          onClick={toggleLang} 
          className="p-2.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5"
          title={lang === 'tr' ? 'Switch to English' : "Türkçe'ye geç"}
        >
          <Globe size={16} />
          <span className="text-[10px] font-bold uppercase tracking-wider">{lang}</span>
        </button>

        <button 
          onClick={handleLogout} 
          className="p-2.5 text-gray-500 hover:text-red-400 transition-colors"
        >
          <LogOut size={16} />
        </button>
        
      </div>
    </div>
  );
};

export default Navbar;
