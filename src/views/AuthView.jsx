import React, { useState } from 'react';
import { Zap, Chrome, Mail, Lock, Loader2 } from 'lucide-react';

const AuthView = ({ 
  t, 
  onLoginWithGoogle, 
  onLoginWithEmail, 
  onRegister, 
  loading, 
  error, 
  clearError 
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (isRegister) {
      await onRegister(email, password);
    } else {
      await onLoginWithEmail(email, password);
    }
  };

  const handleModeSwitch = () => {
    setIsRegister(!isRegister);
    clearError?.();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 animate-enter relative overflow-hidden bg-black">
      <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] bg-emerald-900/30 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-[500px] h-[500px] bg-cyan-900/20 rounded-full blur-[120px]"></div>
      
      <div className="w-full max-w-md glass-panel p-8 rounded-[40px] relative z-10">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-tr from-emerald-400 to-cyan-500 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.4)]">
            <Zap size={40} className="text-black fill-black" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2 neon-text font-display">{t.login_title}</h1>
          <p className="text-gray-400 text-sm font-medium tracking-wide">{t.login_subtitle}</p>
        </div>

        <button 
          onClick={onLoginWithGoogle} 
          disabled={loading} 
          className="w-full py-4 google-btn font-bold rounded-2xl text-sm uppercase tracking-widest flex items-center justify-center gap-3 mb-8 shadow-lg hover:shadow-white/20"
        >
          {loading ? <Loader2 className="animate-spin text-black" /> : <Chrome size={20} />}
          {t.google_login}
        </button>

        <div className="flex items-center gap-4 mb-8 opacity-50">
          <div className="h-[1px] bg-white flex-1"></div>
          <span className="text-[10px] text-white font-bold uppercase">VEYA</span>
          <div className="h-[1px] bg-white flex-1"></div>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-4 mb-2 block">{t.email}</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full pl-12 pr-5 py-4 rounded-2xl auth-input text-sm font-medium focus:outline-none" 
                placeholder="atlet@provision.com" 
                required 
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-4 mb-2 block">{t.password}</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full pl-12 pr-5 py-4 rounded-2xl auth-input text-sm font-medium focus:outline-none" 
                placeholder="••••••••" 
                required 
              />
            </div>
          </div>
          
          {error && (
            <p className="text-red-400 text-xs font-bold text-center mt-2 bg-red-900/20 py-2 rounded-lg">
              {error}
            </p>
          )}

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full py-4 bg-emerald-500 text-black font-bold rounded-2xl text-sm uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] mt-6"
          >
            {loading ? <Loader2 className="animate-spin mx-auto" /> : (isRegister ? t.register_btn : t.login_btn)}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={handleModeSwitch} 
            className="text-xs font-bold text-gray-500 hover:text-white transition-colors"
          >
            {isRegister ? "Hesabın var mı? Giriş Yap" : "Hesabın yok mu? Kayıt Ol"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
