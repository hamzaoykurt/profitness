import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Loader2, Plus, RefreshCw, Bot, User, Zap, Trash2, MessageSquarePlus, History, X } from "lucide-react";
import GlassPanel from "../components/ui/GlassPanel";
import { askCoach } from "../services/geminiService";
import { 
  saveChatSession, 
  getChatSessions, 
  getChatSessionMessages, 
  createChatSession, 
  deleteChatSession 
} from "../services/userService";

const AICoachView = ({
  t,
  lang,
  profile,
  onCreateProgram,
  onUpdateProgram,
  hasProgram,
  userId
}) => {
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Session state
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);


  const getGreeting = () => lang === "tr"
    ? "Merhaba! Ben Pro Vision AI Koçu. 💪 Fitness hedeflerine ulaşmanda sana yardımcı olabilirim. Sormak istediğin bir şey var mı?"
    : "Hello! I'm your Pro Vision AI Coach. 💪 I can help you reach your fitness goals. What would you like to know?";

  // Load sessions on mount
  useEffect(() => {
    const loadSessions = async () => {
      if (!userId) return;
      setSessionsLoading(true);
      const userSessions = await getChatSessions(userId);
      
      if (userSessions.length > 0) {
        setSessions(userSessions);
        setActiveSessionId(userSessions[0].id);
        setMsgs(userSessions[0].messages || []);
      } else {
        // Create initial session
        const result = await createChatSession(userId, getGreeting());
        if (result.success) {
          setActiveSessionId(result.sessionId);
          setMsgs([{ role: 'assistant', text: getGreeting() }]);
          setSessions([{ id: result.sessionId, messages: [{ role: 'assistant', text: getGreeting() }] }]);
        }
      }
      setSessionsLoading(false);
    };
    loadSessions();
  }, [userId]);

  // Save messages when they change
  useEffect(() => {
    if (userId && activeSessionId && msgs.length > 0) {
      const timeoutId = setTimeout(() => {
        saveChatSession(userId, activeSessionId, msgs);
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [msgs, userId, activeSessionId]);

  // Handle New Chat
  const handleNewChat = async () => {
    if (!userId) return;
    const result = await createChatSession(userId, getGreeting());
    if (result.success) {
      setActiveSessionId(result.sessionId);
      setMsgs([{ role: 'assistant', text: getGreeting() }]);
      setSessions(prev => [{ id: result.sessionId, messages: [{ role: 'assistant', text: getGreeting() }] }, ...prev]);
    }
  };

  // Handle Clear Current Session
  const handleClearHistory = async () => {
    if (window.confirm(lang === 'tr' ? 'Bu sohbeti silmek istediğine emin misin?' : 'Are you sure you want to delete this chat?')) {
      await deleteChatSession(userId, activeSessionId);
      const remaining = sessions.filter(s => s.id !== activeSessionId);
      
      if (remaining.length > 0) {
        setSessions(remaining);
        setActiveSessionId(remaining[0].id);
        setMsgs(remaining[0].messages || []);
      } else {
        // Create new session if last one deleted
        const result = await createChatSession(userId, getGreeting());
        if (result.success) {
          setActiveSessionId(result.sessionId);
          setMsgs([{ role: 'assistant', text: getGreeting() }]);
          setSessions([{ id: result.sessionId, messages: [{ role: 'assistant', text: getGreeting() }] }]);
        }
      }
    }
  };


  // Program-related keywords (rest of component stays same)
  const PROGRAM_KEYWORDS = {
    tr: [
      "program",
      "antrenman",
      "egzersiz",
      "hareket",
      "bisiklet",
      "koşu",
      "yüzme",
      "yoga",
      "spor",
      "kas",
      "kilo",
      "zayıfla",
      "güçlen",
      "set",
      "tekrar",
    ],
    en: [
      "program",
      "workout",
      "exercise",
      "training",
      "cycling",
      "running",
      "swimming",
      "yoga",
      "muscle",
      "weight",
      "lose",
      "gain",
      "strength",
      "set",
      "reps",
    ],
  };

  const isProgramRelated = (text) => {
    const lowerText = text.toLowerCase();
    const keywords = PROGRAM_KEYWORDS[lang] || PROGRAM_KEYWORDS.tr;
    return keywords.some((keyword) => lowerText.includes(keyword));
  };

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMsgs((prev) => [...prev, { role: "user", text: userMessage }]);
    setLoading(true);
    setPendingAction(null);

    const programRelated = isProgramRelated(userMessage);

    const result = await askCoach(userMessage, lang, {
      level: profile?.level || 1,
      activeDays: profile?.activeDays || 0,
    });

    setLoading(false);

    if (result.success) {
      setMsgs((prev) => [
        ...prev,
        { role: "assistant", text: result.response },
      ]);

      if (programRelated) {
        setTimeout(() => {
          if (hasProgram) {
            setPendingAction({ type: "update", context: userMessage });
            setMsgs((prev) => [
              ...prev,
              {
                role: "assistant",
                text:
                  lang === "tr"
                    ? "📋 Bu bilgiye göre mevcut programını güncellememi ister misin?"
                    : "📋 Would you like me to update your current program based on this?",
                isAction: true,
              },
            ]);
          } else {
            setPendingAction({ type: "create", context: userMessage });
            setMsgs((prev) => [
              ...prev,
              {
                role: "assistant",
                text:
                  lang === "tr"
                    ? "📋 Sana özel bir antrenman programı oluşturmamı ister misin?"
                    : "📋 Would you like me to create a custom workout program for you?",
                isAction: true,
              },
            ]);
          }
        }, 500);
      }
    } else {
      setMsgs((prev) => [...prev, { role: "assistant", text: result.error }]);
    }
  };

  const handleAcceptAction = async () => {
    if (!pendingAction || actionLoading) return;

    setActionLoading(true);
    
    // Simulate "working" time for program creation consistency
    await new Promise(r => setTimeout(r, 2500));

    const actionContext = pendingAction.context;
    const actionType = pendingAction.type;

    const prompt = lang === 'tr'
      ? `Kullanıcı şunu söyledi: "${actionContext}"

Bu bilgiye göre kullanıcının hedefine uygun (3-7 gün arası) kapsamlı bir antrenman programı oluştur.
ÖNEMLİ: Gün etiketleri yaparken "PAZARTESİ" yerine "PZT", "SALI" yerine "SAL" gibi KISA formatlar kullan.
"HAFTA SONU" diye bir gün asla oluşturma. Cumartesi (CMT) ve Pazar (PAZ) ayrı ayrı olmalı.
Off day (dinlenme) günlerini de panele ekle, "isRestDay": true yap.

JSON formatında yanıt ver:
[{"label":"PZT","title":"Göğüs","exercises":[{"name":"Bench Press","sets":4,"reps":10,"note":"Dirsekleri içeri al."}]}]

Sadece JSON döndür.`
      : `User said: "${actionContext}"

Create a comprehensive workout program (3-7 days).
IMPORTANT: Use SHORT day labels: "MON", "TUE", "WED" etc.
NEVER create a "WEEKEND" day. Saturday (SAT) and Sunday (SUN) must be separate.
Include Rest days in the output with "isRestDay": true.

Reply in JSON format:
[{"label":"MON","title":"Chest","exercises":[{"name":"Bench Press","sets":4,"reps":10,"note":"Tips here."}]}]

Only return JSON.`;

    const result = await askCoach(prompt, lang, {});

    if (result.success) {
      try {
        let cleanResponse = result.response
          .replace(/```json\s*/g, "")
          .replace(/```\s*/g, "")
          .trim();
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
                note: ex.note || (lang === 'tr' ? "AI tarafından oluşturuldu." : "Created by AI."),
                gym: "-",
              })),
            }));

            if (actionType === "create" && onCreateProgram) {
              await onCreateProgram(processedDays);
            } else if (actionType === "update" && onUpdateProgram) {
              await onUpdateProgram(processedDays);
            }

            setMsgs((prev) => [
              ...prev,
              {
                role: "assistant",
                text:
                  lang === "tr"
                    ? "✅ Harika! Programın hazır. Anasayfada görebilirsin!"
                    : "✅ Great! Your program is ready. You can see it on the home screen!",
              },
            ]);
          }
        }
      } catch (e) {
        console.error("Program generation error:", e);
        setMsgs((prev) => [
          ...prev,
          {
            role: "assistant",
            text:
              lang === "tr"
                ? "❌ Program oluşturulurken bir hata oluştu."
                : "❌ Error creating program.",
          },
        ]);
      }
    }

    setActionLoading(false);
    setPendingAction(null);
  };

  const handleDeclineAction = () => {
    setPendingAction(null);
    setMsgs((prev) => [
      ...prev,
      {
        role: "assistant",
        text:
          lang === "tr"
            ? "Tamam! Başka bir konuda yardımcı olabilir miyim?"
            : "Okay! Can I help you with something else?",
      },
    ]);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Quick suggestion buttons
  const quickSuggestions =
    lang === "tr"
      ? ["Kas kazanmak istiyorum", "Kilo vermek istiyorum", "Evde antrenman"]
      : ["Build muscle", "Lose weight", "Home workout"];

  return (
    <div 
      className={`relative px-4 pt-28 sm:pt-32 pb-32 mx-auto h-screen flex flex-col animate-enter transition-all duration-500 ease-in-out ${
        showHistory ? 'lg:pr-[420px] xl:pr-[480px]' : ''
      }`}
    >
      <div className="max-w-lg lg:max-w-2xl xl:max-w-3xl mx-auto w-full flex flex-col h-full">

      {/* Premium Header */}
      <div className="flex items-center justify-between mb-6 px-2">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.25)] border border-emerald-500/20">
              <Sparkles size={28} className="text-emerald-400" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
              <Zap size={12} className="text-black" fill="currentColor" />
            </div>
          </div>
          <div>
            <h2 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
              {t.ai_coach_title || "AI ANTRENÖR"}
            </h2>
            <h1 className="text-2xl lg:text-3xl font-black text-white font-display tracking-tight">
              Pro Vision
            </h1>
            {profile && (
              <p className="text-[10px] text-gray-500 mt-0.5">
                Level {profile.level || 1} • {profile.activeDays || 0}{" "}
                {lang === "tr" ? "aktif gün" : "active days"}
              </p>
            )}
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-1">
          {/* History Toggle */}
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className={`p-3 transition-colors ${showHistory ? 'text-emerald-400 bg-white/10 rounded-xl' : 'text-gray-500 hover:text-white'}`}
            title={lang === 'tr' ? 'Geçmiş' : 'History'}
          >
            <History size={20} />
          </button>

          {/* New Chat Button */}
          <button 
            onClick={handleNewChat}
            className="p-3 text-gray-500 hover:text-emerald-400 transition-colors"
            title={lang === 'tr' ? 'Yeni Sohbet' : 'New Chat'}
          >
            <MessageSquarePlus size={20} />
          </button>
          
          {/* Clear History Button */}
          <button 
            onClick={handleClearHistory}
            className="p-3 text-gray-500 hover:text-red-400 transition-colors"
            title={lang === 'tr' ? 'Sohbeti Sil' : 'Delete Chat'}
          >
            <Trash2 size={20} />
          </button>
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
          <div
            key={i}
            className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
          >
            {/* Avatar */}
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${
                m.role === "user"
                  ? "bg-emerald-500/20"
                  : "bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-white/10"
              }`}
            >
              {m.role === "user" ? (
                <User size={14} className="text-emerald-400" />
              ) : (
                <Bot size={14} className="text-emerald-400" />
              )}
            </div>

            {/* Message Bubble */}
            <div className="flex flex-col gap-2 max-w-[80%] lg:max-w-[70%]">
              <div
                className={`p-4 lg:p-5 rounded-2xl text-sm font-medium leading-relaxed ${
                  m.role === "user"
                    ? "bg-emerald-600 text-white rounded-tr-sm"
                    : "glass-panel text-gray-200 rounded-tl-sm border border-white/5"
                }`}
              >
                {(() => {
                  // Pre-process text to standardize bullets
                  let processedText = m.text.replace(/ \*/g, '\n*');
                  
                  // Split by markdown bold markers
                  const parts = processedText.split(/(\*\*.*?\*\*)/g);
                  
                  return parts.map((part, idx) => {
                    // Handle Bold Text
                    if (part.startsWith('**') && part.endsWith('**')) {
                      const content = part.slice(2, -2);
                      return <strong key={idx} className="text-white font-bold">{content}</strong>;
                    }

                    // Handle Newlines and Lists in regular text
                    return part.split('\n').map((line, lIdx) => {
                      const trimmedLine = line.trim();
                      if (trimmedLine.startsWith('*') || trimmedLine.startsWith('-')) {
                        const listContent = trimmedLine.replace(/^[*-\s]+/, '');
                        if (!listContent) return null;
                        return (
                          <div key={`${idx}-${lIdx}`} className="flex gap-2 ml-1 mt-1 mb-1">
                            <span className="text-emerald-400 font-bold">•</span>
                            <span className="flex-1">{listContent}</span>
                          </div>
                        );
                      }
                      
                      return (
                        <span key={`${idx}-${lIdx}`}>
                          {line}
                          {lIdx < part.split('\n').length - 1 && <br />}
                        </span>
                      );
                    });
                  });
                })()}
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
                    ) : pendingAction.type === "create" ? (
                      <Plus size={16} />
                    ) : (
                      <RefreshCw size={16} />
                    )}
                    {lang === "tr" ? "Evet, oluştur" : "Yes, create"}
                  </button>
                  <button
                    onClick={handleDeclineAction}
                    disabled={actionLoading}
                    className="px-5 py-3 bg-white/10 text-white font-bold rounded-xl text-sm hover:bg-white/20 transition-all disabled:opacity-50"
                  >
                    {lang === "tr" ? "Hayır" : "No"}
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
                  <span
                    className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></span>
                  <span
                    className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></span>
                  <span
                    className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></span>
                </div>
                <span className="text-sm ml-2">
                  {lang === "tr" ? "Düşünüyor..." : "Thinking..."}
                </span>
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
            placeholder={
              t.coach_placeholder ||
              (lang === "tr" ? "Bir şey sor..." : "Ask something...")
            }
            className="bg-transparent flex-1 text-white px-4 py-3 focus:outline-none text-sm placeholder-gray-500"
            disabled={loading || actionLoading}
          />
          <button
            onClick={handleSend}
            disabled={loading || actionLoading || !input.trim()}
            className={`p-3.5 rounded-2xl transition-all ${
              loading || actionLoading || !input.trim()
                ? "bg-white/5 text-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-emerald-500 to-cyan-500 text-black hover:scale-105 shadow-lg shadow-emerald-500/20"
            }`}
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </GlassPanel>
      </div>
      
      </div> 
      {/* History Sidebar Panel */}
      <div 
        className={`fixed top-24 bottom-6 right-6 w-full sm:w-[380px] xl:w-[420px] bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] z-40 transition-all duration-500 transform flex flex-col shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] ${
          showHistory ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0'
        }`}
        style={{
          boxShadow: showHistory ? 'inset 0 0 80px rgba(255,255,255,0.02), 0 25px 50px -12px rgba(0,0,0,0.5)' : 'none'
        }}
      >
        {/* Overlay for mobile outside click */}
        {showHistory && (
          <div 
            className="fixed inset-0 -z-10 bg-black/20 backdrop-blur-sm sm:hidden" 
            onClick={() => setShowHistory(false)} 
          />
        )}
        
        {/* Header */}
        <div className="pt-6 pb-4 px-6 border-b border-white/5 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-black text-white font-display tracking-tight flex items-center gap-3">
              {lang === 'tr' ? 'Geçmiş' : 'History'}
              <span className="text-sm font-normal text-gray-500 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                {sessions.length}
              </span>
            </h3>
            <p className="text-xs text-gray-500 mt-1 font-medium">
              {lang === 'tr' ? 'Eski sohbetlerine buradan ulaşabilirsin.' : 'Access your past conversations here.'}
            </p>
          </div>
          <button 
            onClick={() => setShowHistory(false)} 
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-white/5"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 no-scrollbar">
          {sessions.map(session => (
            <button
              key={session.id}
              onClick={() => {
                setActiveSessionId(session.id);
                setMsgs(session.messages || []);
                setShowHistory(false);
              }}
              className={`w-full p-4 rounded-2xl text-left transition-all border group relative overflow-hidden flex gap-3 ${
                activeSessionId === session.id
                  ? 'bg-white/10 border-white/20 shadow-lg'
                  : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/5'
              }`}
            >
              {activeSessionId === session.id && (
                 <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
              )}

              {/* Icon/Avatar Placeholder for Session */}
              <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center border ${
                activeSessionId === session.id 
                  ? 'bg-emerald-500/20 border-emerald-500/20 text-emerald-400' 
                  : 'bg-white/5 border-white/5 text-gray-500 group-hover:text-gray-300'
              }`}>
                <MessageSquarePlus size={18} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500">
                    {session.updatedAt ? new Date(session.updatedAt.seconds * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'New'}
                  </span>
                </div>
                
                <p className={`text-sm leading-relaxed line-clamp-2 ${activeSessionId === session.id ? 'text-white font-medium' : 'text-gray-400 group-hover:text-gray-200'}`}>
                  {session.messages?.[0]?.text || (lang === 'tr' ? 'Yeni Sohbet' : 'New Chat')}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Footer Gradient Fade */}
        <div className="h-12 bg-gradient-to-t from-white/[0.05] to-transparent pointer-events-none absolute bottom-0 left-0 right-0 rounded-b-[2.5rem]" />
      </div>
    </div>
  );
};

export default AICoachView;
