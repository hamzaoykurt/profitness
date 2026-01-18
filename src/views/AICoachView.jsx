import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Loader2, Plus, RefreshCw, Bot, User, Zap } from 'lucide-react';
import GlassPanel from '../components/ui/GlassPanel';
import { askCoach } from '../services/geminiService';

const AICoachView = ({ t, lang, profile, onCreateProgram, onUpdateProgram, hasProgram }) => {
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Program-related keywords
  const PROGRAM_KEYWORDS = {
    tr: ['program', 'antrenman', 'egzersiz', 'hareket', 'bisiklet', 'koşu', 'yüzme', 'yoga', 'spor', 'kas', 'kilo', 'zayıfla', 'güçlen', 'set', 'tekrar'],
    en: ['program', 'workout', 'exercise', 'training', 'cycling', 'running', 'swimming', 'yoga', 'muscle', 'weight', 'lose', 'gain', 'strength', 'set', 'reps']
  };

  const isProgramRelated = (text) => {
    const lowerText = text.toLowerCase();
    const keywords = PROGRAM_KEYWORDS[lang] || PROGRAM_KEYWORDS.tr;
    return keywords.some(keyword => lowerText.includes(keyword));
  };

  // Initial greeting
  useEffect(() => {
    const greeting = lang === 'tr' 
      ? "Merhaba! Ben Pro Vision AI Koçu. 💪 Fitness hedeflerine ulaşmanda sana yardımcı olabilirim. Sormak istediğin bir şey var mı?"
      : "Hello! I'm your Pro Vision AI Coach. 💪 I can help you reach your fitness goals. What would you like to know?";
    
    setMsgs([{ role: 'assistant', text: greeting }]);
  }, [lang]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMsgs(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);
    setPendingAction(null);

    const programRelated = isProgramRelated(userMessage);

    const result = await askCoach(userMessage, lang, {
      level: profile?.level || 1,
      activeDays: profile?.activeDays || 0
    });

    setLoading(false);

    if (result.success) {
      setMsgs(prev => [...prev, { role: 'assistant', text: result.response }]);

      if (programRelated) {
        setTimeout(() => {
          if (hasProgram) {
            setPendingAction({ type: 'update', context: userMessage });
            setMsgs(prev => [...prev, { 
              role: 'assistant', 
              text: lang === 'tr' 
                ? '📋 Bu bilgiye göre mevcut programını güncellememi ister misin?' 
                : '📋 Would you like me to update your current program based on this?',
              isAction: true
            }]);
          } else {
            setPendingAction({ type: 'create', context: userMessage });
            setMsgs(prev => [...prev, { 
              role: 'assistant', 
              text: lang === 'tr' 
                ? '📋 Sana özel bir antrenman programı oluşturmamı ister misin?' 
                : '📋 Would you like me to create a custom workout program for you?',
              isAction: true
            }]);
          }
        }, 500);
      }
    } else {
      setMsgs(prev => [...prev, { role: 'assistant', text: result.error }]);
    }
  };

  const handleAcceptAction = async () => {
    if (!pendingAction || actionLoading) return;
    
    setActionLoading(true);
    const actionContext = pendingAction.context;
    const actionType = pendingAction.type;
    
    const prompt = lang === 'tr'
      ? `Kullanıcı şunu söyledi: "${actionContext}"

Bu bilgiye göre 3 günlük antrenman programı oluştur. JSON formatında yanıt ver:
[{"label":"1. GÜN","title":"Başlık","exercises":[{"name":"Hareket","sets":4,"reps":10}]}]

Sadece JSON döndür.`
      : `User said: "${actionContext}"

Create a 3-day workout program based on this. Reply in JSON format:
[{"label":"DAY 1","title":"Title","exercises":[{"name":"Exercise","sets":4,"reps":10}]}]

Only return JSON.`;

    const result = await askCoach(prompt, lang, {});
    
    if (result.success) {
      try {
        let cleanResponse = result.response.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
        const arrayMatch = cleanResponse.match(/\[[\s\S]*\]/);
        
        if (arrayMatch) {
          const programData = JSON.parse(arrayMatch[0]);
          
          if (Array.isArray(programData) && programData.length > 0) {
            const processedDays = programData.map((day, dayIndex) => ({
              ...day,
              id: Date.now() + dayIndex,
              exercises: (day.exercises || []).map((ex, exIndex) => ({
                ...ex,
                id: `e${Date.now()}_${dayIndex}_${exIndex}`,
                sets: parseInt(ex.sets) || 3,
                reps: parseInt(ex.reps) || 10,
                note: lang === 'tr' ? "AI tarafından oluşturuldu." : "Created by AI.",
                gym: "-"
              }))
            }));
            
            if (actionType === 'create' && onCreateProgram) {
              await onCreateProgram(processedDays);
            } else if (actionType === 'update' && onUpdateProgram) {
              await onUpdateProgram(processedDays);
            }
            
            setMsgs(prev => [...prev, { 
              role: 'assistant', 
              text: lang === 'tr' 
                ? '✅ Harika! Programın hazır. Anasayfada görebilirsin!' 
                : '✅ Great! Your program is ready. You can see it on the home screen!'
            }]);
          }
        }
      } catch (e) {
        console.error('Program generation error:', e);
        setMsgs(prev => [...prev, { 
          role: 'assistant', 
          text: lang === 'tr' ? '❌ Program oluşturulurken bir hata oluştu.' : '❌ Error creating program.'
        }]);
      }
    }
    
    setActionLoading(false);
    setPendingAction(null);
  };

  const handleDeclineAction = () => {
    setPendingAction(null);
    setMsgs(prev => [...prev, { 
      role: 'assistant', 
      text: lang === 'tr' 
        ? 'Tamam! Başka bir konuda yardımcı olabilir miyim?' 
        : 'Okay! Can I help you with something else?'
    }]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Quick suggestion buttons
  const quickSuggestions = lang === 'tr' 
    ? ['Kas kazanmak istiyorum', 'Kilo vermek istiyorum', 'Evde antrenman']
    : ['Build muscle', 'Lose weight', 'Home workout'];

  return (
    <div className="px-4 pt-28 sm:pt-32 pb-32 mx-auto h-screen flex flex-col animate-enter max-w-lg lg:max-w-2xl xl:max-w-3xl">
      {/* Premium Header */}
      <div className="flex items-center gap-4 mb-6 px-2">
        <div className="relative">
          <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.25)] border border-emerald-500/20">
            <Sparkles size={28} className="text-emerald-400" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
            <Zap size={12} className="text-black" fill="currentColor" />
          </div>
        </div>
        <div>
          <h2 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">{t.ai_coach_title || 'AI ANTRENÖR'}</h2>
          <h1 className="text-2xl lg:text-3xl font-black text-white font-display tracking-tight">Pro Vision</h1>
          {profile && (
            <p className="text-[10px] text-gray-500 mt-0.5">
              Level {profile.level || 1} • {profile.activeDays || 0} {lang === 'tr' ? 'aktif gün' : 'active days'}
            </p>
          )}
        </div>
      </div>
      
      {/* Quick Suggestions (only if no messages yet) */}
      {msgs.length <= 1 && (
        <div className="flex flex-wrap gap-2 mb-4 px-2">
          {quickSuggestions.map((suggestion, i) => (
            <button
              key={i}
              onClick={() => setInput(suggestion)}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs font-medium text-gray-300 transition-all hover:text-white hover:border-emerald-500/30"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
      
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar pb-4 px-2">
        {msgs.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            {/* Avatar */}
            <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${
              m.role === 'user' 
                ? 'bg-emerald-500/20' 
                : 'bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-white/10'
            }`}>
              {m.role === 'user' 
                ? <User size={14} className="text-emerald-400" />
                : <Bot size={14} className="text-emerald-400" />
              }
            </div>
            
            {/* Message Bubble */}
            <div className="flex flex-col gap-2 max-w-[80%] lg:max-w-[70%]">
              <div 
                className={`p-4 lg:p-5 rounded-2xl text-sm font-medium leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-emerald-600 text-white rounded-tr-sm' 
                    : 'glass-panel text-gray-200 rounded-tl-sm border border-white/5'
                }`}
              >
                {m.text}
              </div>
              
              {/* Action Buttons */}
              {m.isAction && pendingAction && (
                <div className="flex gap-2">
                  <button
                    onClick={handleAcceptAction}
                    disabled={actionLoading}
                    className="flex items-center gap-2 px-5 py-3 bg-emerald-500 text-black font-bold rounded-xl text-sm hover:bg-emerald-400 transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/20"
                  >
                    {actionLoading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : pendingAction.type === 'create' ? (
                      <Plus size={16} />
                    ) : (
                      <RefreshCw size={16} />
                    )}
                    {lang === 'tr' ? 'Evet, oluştur' : 'Yes, create'}
                  </button>
                  <button
                    onClick={handleDeclineAction}
                    disabled={actionLoading}
                    className="px-5 py-3 bg-white/10 text-white font-bold rounded-xl text-sm hover:bg-white/20 transition-all disabled:opacity-50"
                  >
                    {lang === 'tr' ? 'Hayır' : 'No'}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {/* Loading indicator */}
        {loading && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center border border-white/10">
              <Bot size={14} className="text-emerald-400" />
            </div>
            <div className="glass-panel p-4 rounded-2xl rounded-tl-sm border border-white/5">
              <div className="flex items-center gap-2 text-gray-400">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
                <span className="text-sm ml-2">{lang === 'tr' ? 'Düşünüyor...' : 'Thinking...'}</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Premium Input */}
      <div className="mt-2">
        <GlassPanel className="p-2 rounded-[28px] flex items-center gap-2 border border-white/10 shadow-[0_-10px_40px_-15px_rgba(16,185,129,0.15)]">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t.coach_placeholder || (lang === 'tr' ? 'Bir şey sor...' : 'Ask something...')} 
            className="bg-transparent flex-1 text-white px-4 py-3 focus:outline-none text-sm placeholder-gray-500" 
            disabled={loading || actionLoading}
          />
          <button 
            onClick={handleSend}
            disabled={loading || actionLoading || !input.trim()}
            className={`p-3.5 rounded-2xl transition-all ${
              loading || actionLoading || !input.trim() 
                ? 'bg-white/5 text-gray-600 cursor-not-allowed' 
                : 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-black hover:scale-105 shadow-lg shadow-emerald-500/20'
            }`}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </GlassPanel>
      </div>
    </div>
  );
};

export default AICoachView;
