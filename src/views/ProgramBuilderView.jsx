import React, { useState } from 'react';
import { Wand2, Calendar, Dumbbell, Plus, Minus, Trash2, Save, BrainCircuit, Loader2, ArrowLeft, ChevronRight, Crown, Search } from 'lucide-react';
import GlassPanel from '../components/ui/GlassPanel';
import CreditModal from '../components/ui/CreditModal';
import ExercisePicker from '../components/ui/ExercisePicker';
import { askCoach } from '../services/geminiService';
import { checkCredits, useCredit } from '../services/userService';
import { getExerciseImage } from '../services/mockData';

const ProgramBuilderView = ({ onSave, t, lang, mode: initialMode, onBack, userId, profile, onNavigateToPremium }) => {
  const [mode, setMode] = useState(initialMode || 'manual');
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);
  
  // Credit status
  const credits = profile?.credits ?? 0;
  const isPremium = profile?.isPremium || false;
  const creditCheck = checkCredits(profile);
  
  
  // Multi-day program state
  const [days, setDays] = useState([]);
  const [currentDayIndex, setCurrentDayIndex] = useState(-1);
  const [dayLabel, setDayLabel] = useState("");
  const [dayTitle, setDayTitle] = useState("");
  const [exercises, setExercises] = useState([]);
  const [tempEx, setTempEx] = useState({ name: "", sets: "3", reps: "10" });
  const [showExercisePicker, setShowExercisePicker] = useState(false);

  // Handle exercise selection from visual picker - populate tempEx for customization
  const handleSelectFromPicker = (exercise) => {
    setTempEx({
      name: exercise.name,
      sets: exercise.sets.toString(),
      reps: exercise.reps.toString(),
      note: exercise.note || (lang === 'tr' ? "Formu koru." : "Maintain form."),
      muscles: exercise.muscles
    });
  };

  const handleAddExercise = () => {
    if (tempEx.name && tempEx.sets && tempEx.reps) {
      setExercises([...exercises, { 
        id: `e${Date.now()}`, 
        name: tempEx.name,
        sets: parseInt(tempEx.sets) || 3,
        reps: parseInt(tempEx.reps) || 10,
        note: tempEx.note || (lang === 'tr' ? "Formu koru." : "Maintain form."),
        muscles: tempEx.muscles || "",
        gym: "-"
      }]);
      setTempEx({ name: "", sets: "3", reps: "10" });
    }
  };

  const handleSaveDay = () => {
    if (dayLabel && dayTitle && exercises.length > 0) {
      const newDay = {
        id: Date.now(),
        label: dayLabel,
        title: dayTitle,
        exercises: exercises
      };
      
      if (currentDayIndex >= 0) {
        // Editing existing day
        const newDays = [...days];
        newDays[currentDayIndex] = newDay;
        setDays(newDays);
      } else {
        // Adding new day
        setDays([...days, newDay]);
      }
      
      // Reset form
      setDayLabel("");
      setDayTitle("");
      setExercises([]);
      setCurrentDayIndex(-1);
    }
  };

  const handleEditDay = (index) => {
    const day = days[index];
    setDayLabel(day.label);
    setDayTitle(day.title);
    setExercises(day.exercises);
    setCurrentDayIndex(index);
  };

  const handleDeleteDay = (index) => {
    setDays(days.filter((_, i) => i !== index));
  };

  const handleSaveProgram = async () => {
    if (days.length === 0) return;
    
    setIsSaving(true);
    const result = await onSave(days);
    setIsSaving(false);
    
    if (!result.success) {
      alert(result.error || (lang === 'tr' ? 'Program kaydedilemedi' : 'Could not save program'));
    }
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    
    // Check credits before generating
    if (!creditCheck.canUse) {
      setShowCreditModal(true);
      return;
    }
    
    setIsGenerating(true);
    
    // Deduct credit before generation (for non-premium users)
    if (!isPremium && userId) {
      const creditResult = await useCredit(userId);
      if (!creditResult.success) {
        setIsGenerating(false);
        setShowCreditModal(true);
        return;
      }
    }
    
    const prompt = lang === 'tr'
      ? `Fitness hedefi: "${aiPrompt}"

Kullanıcının ihtiyacına göre 1-7 gün arası antrenman programı oluştur. Gün etiketleri için kısaltma kullan (Pzt, Sal, Çar, Per, Cum, Cmt, Paz).

ÖNEMLİ KURALLAR:
1. Her hareket için "note" alanında O HAREKETE ÖZEL pro ipuçları yaz (gerçek teknik bilgi, form tavsiyeleri veya dikkat edilmesi gereken noktalar)
2. Eğer program Pazar günü içeriyorsa, Pazar dinlenme günü olsun ve "isRestDay": true ekle, exercises boş array olsun

JSON formatında yanıt ver:
[
  {"label":"Pzt","title":"Göğüs","exercises":[{"name":"Bench Press","sets":4,"reps":10,"note":"Dirsekleri 45 derece açıda tut, omuzları geri çek."}]},
  {"label":"Paz","title":"Dinlenme","isRestDay":true,"exercises":[]}
]

Sadece JSON array döndür, başka metin yazma.`
      : `Fitness goal: "${aiPrompt}"

Create a 1-7 day workout program based on user needs. Use abbreviated weekday names (Mon, Tue, Wed, Thu, Fri, Sat, Sun).

IMPORTANT RULES:
1. For each exercise, write EXERCISE-SPECIFIC pro tips in the "note" field (real technical advice, form tips, or points to watch)
2. If the program includes Sunday, make it a rest day with "isRestDay": true and empty exercises array

Reply in JSON format:
[
  {"label":"Mon","title":"Chest","exercises":[{"name":"Bench Press","sets":4,"reps":10,"note":"Keep elbows at 45 degrees, retract shoulders."}]},
  {"label":"Sun","title":"Rest","isRestDay":true,"exercises":[]}
]

Only return JSON array, no other text.`;

    const result = await askCoach(prompt, lang, {});
    
    if (result.success) {
      console.log('AI Raw Response:', result.response);
      
      try {
        // Try multiple patterns to extract JSON
        let jsonStr = null;
        
        // Clean response - remove markdown code blocks first
        let cleanResponse = result.response
          .replace(/```json\s*/g, '')
          .replace(/```\s*/g, '')
          .trim();
        
        // Pattern 1: Look for JSON array (greedy to capture nested)
        const arrayMatch = cleanResponse.match(/\[[\s\S]*\]/);
        if (arrayMatch) {
          jsonStr = arrayMatch[0];
        }
        
        // Pattern 2: Try the whole cleaned response if it looks like JSON
        if (!jsonStr && cleanResponse.startsWith('[')) {
          jsonStr = cleanResponse;
        }
        
        if (jsonStr) {
          const programData = JSON.parse(jsonStr);
          
          if (Array.isArray(programData) && programData.length > 0) {
            const processedDays = programData.map((day, dayIndex) => ({
              ...day,
              id: Date.now() + dayIndex,
              isRestDay: day.isRestDay || false,
              exercises: (day.exercises || []).map((ex, exIndex) => ({
                ...ex,
                id: `e${Date.now()}_${dayIndex}_${exIndex}`,
                sets: parseInt(ex.sets) || 3,
                reps: parseInt(ex.reps) || 10,
                note: ex.note || (lang === 'tr' ? 'Formu koru.' : 'Maintain form.'),
                gym: "-"
              }))
            }));
            
            setIsSaving(true);
            await onSave(processedDays);
            setIsSaving(false);
          } else {
            console.error('Invalid program structure:', programData);
            alert(lang === 'tr' ? 'AI geçersiz program yapısı döndürdü.' : 'AI returned invalid program structure.');
          }
        } else {
          console.error('No JSON found in response:', result.response);
          alert(lang === 'tr' 
            ? 'AI JSON formatında yanıt vermedi. Tekrar deneyin.' 
            : 'AI did not respond in JSON format. Try again.');
        }
      } catch (e) {
        console.error('AI response parse error:', e, 'Response:', result.response);
        alert(lang === 'tr' 
          ? `JSON parse hatası. Console'u kontrol edin.` 
          : `JSON parse error. Check console.`);
      }
    } else {
      alert(result.error);
    }
    
    setIsGenerating(false);
  };

  return (
    <div className="px-4 pt-32 pb-32 animate-enter max-w-lg lg:max-w-2xl xl:max-w-3xl mx-auto min-h-screen">
      {/* Back Button */}
      {onBack && (
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-bold">{lang === 'tr' ? 'Geri' : 'Back'}</span>
        </button>
      )}

      {/* Mode Selector */}
      <div className="flex justify-center mb-8">
        <div className="liquid-glass-dark p-1.5 rounded-2xl flex">
          <button 
            onClick={() => setMode('manual')} 
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${mode === 'manual' ? 'bg-white text-black' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
          >
            {t.manual_mode || 'Manuel'}
          </button>
          <button 
            onClick={() => setMode('ai')} 
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${mode === 'ai' ? 'bg-white text-black' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
          >
            <Wand2 size={14} /> {t.ai_mode || 'AI Mimar'}
            {isPremium ? (
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                <Crown size={10} /> PRO
              </span>
            ) : (
              <span className="text-[9px] text-gray-500">(1 {lang === 'tr' ? 'Kredi' : 'Credit'})</span>
            )}
          </button>
        </div>
      </div>
      
      {mode === 'manual' ? (
        <div className="space-y-6">
          {/* Day Configuration */}
          <GlassPanel className="p-6 rounded-[32px] space-y-4">
            <div className="flex items-center gap-2 mb-2 text-emerald-400">
              <Calendar size={18} />
              <span className="text-xs font-bold uppercase tracking-widest">
                {currentDayIndex >= 0 
                  ? (lang === 'tr' ? 'GÜN DÜZENLE' : 'EDIT DAY') 
                  : (lang === 'tr' ? 'YENİ GÜN EKLE' : 'ADD NEW DAY')}
              </span>
            </div>
            <input 
              value={dayLabel} 
              onChange={e => setDayLabel(e.target.value)} 
              placeholder={t.day_name || (lang === 'tr' ? 'Gün Adı (örn: Pzt, Sal, Çar)' : 'Day Name (e.g., Mon, Tue, Wed)')}
              className="w-full p-4 bg-white/5 rounded-2xl border border-white/10 text-white focus:outline-none focus:border-emerald-500/50 transition-colors placeholder-gray-600" 
            />
            <input 
              value={dayTitle} 
              onChange={e => setDayTitle(e.target.value)} 
              placeholder={t.day_title || (lang === 'tr' ? 'Gün Başlığı (örn: Göğüs & Triceps)' : 'Day Title (e.g., Chest & Triceps)')}
              className="w-full p-4 bg-white/5 rounded-2xl border border-white/10 text-white focus:outline-none focus:border-emerald-500/50 transition-colors placeholder-gray-600" 
            />
          </GlassPanel>

          {/* Exercise Input */}
          <GlassPanel className="p-6 rounded-[32px] space-y-4">
            <div className="flex items-center gap-2 mb-2 text-emerald-400">
              <Dumbbell size={18} />
              <span className="text-xs font-bold uppercase tracking-widest">
                {lang === 'tr' ? 'HAREKET EKLE' : 'ADD EXERCISE'}
              </span>
            </div>
            
            {/* Visual Exercise Picker Button */}
            <button 
              onClick={() => setShowExercisePicker(true)}
              className="w-full p-4 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 rounded-2xl border border-emerald-500/30 text-white font-bold transition-all flex items-center justify-center gap-3 group"
            >
              <Search size={20} className="text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>{lang === 'tr' ? 'Hareket Kütüphanesinden Seç' : 'Browse Exercise Library'}</span>
            </button>
            
            {/* Selected Exercise Display */}
            {tempEx.name && (
              <div className="p-4 bg-white/5 rounded-2xl border border-emerald-500/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-800 shrink-0">
                    <img 
                      src={getExerciseImage(tempEx.name)} 
                      alt={tempEx.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-white">{tempEx.name}</div>
                    {tempEx.muscles && (
                      <div className="text-[10px] text-emerald-400">{tempEx.muscles}</div>
                    )}
                  </div>
                  <button 
                    onClick={() => setTempEx({ name: "", sets: "3", reps: "10" })}
                    className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                {/* Set/Rep Steppers */}
                <div className="flex items-center gap-4 justify-center py-2">
                  {/* Set Stepper */}
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">SET</span>
                    <div className="flex items-center gap-1 bg-white/5 rounded-2xl p-1.5 border border-white/10">
                      <button
                        type="button"
                        onClick={() => setTempEx({...tempEx, sets: Math.max(1, (parseInt(tempEx.sets) || 3) - 1).toString()})}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all active:scale-95"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-12 text-2xl font-black text-white text-center font-display">
                        {tempEx.sets || '3'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setTempEx({...tempEx, sets: Math.min(20, (parseInt(tempEx.sets) || 3) + 1).toString()})}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-all active:scale-95"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <span className="text-gray-500 text-2xl font-bold mt-6">×</span>
                  
                  {/* Reps Stepper */}
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                      {lang === 'tr' ? 'TEKRAR' : 'REPS'}
                    </span>
                    <div className="flex items-center gap-1 bg-white/5 rounded-2xl p-1.5 border border-white/10">
                      <button
                        type="button"
                        onClick={() => setTempEx({...tempEx, reps: Math.max(1, (parseInt(tempEx.reps) || 10) - 1).toString()})}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all active:scale-95"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-12 text-2xl font-black text-white text-center font-display">
                        {tempEx.reps || '10'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setTempEx({...tempEx, reps: Math.min(100, (parseInt(tempEx.reps) || 10) + 1).toString()})}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-all active:scale-95"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Add Button */}
                <button 
                  onClick={handleAddExercise} 
                  className="w-full py-4 bg-emerald-500 text-black font-bold rounded-xl text-sm uppercase tracking-widest hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2 mt-3"
                >
                  <Plus size={16} /> {lang === 'tr' ? 'Hareketi Ekle' : 'Add Exercise'}
                </button>
              </div>
            )}
            
            {!tempEx.name && (
              <p className="text-[10px] text-gray-500 text-center">
                {lang === 'tr' 
                  ? '40+ hazır hareket • Kas gruplarına göre filtreleme • Görsel seçim' 
                  : '40+ exercises • Filter by muscle group • Visual selection'}
              </p>
            )}
          </GlassPanel>

          {/* Current Day Exercises */}
          {exercises.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">
                {lang === 'tr' ? 'Bu Gündeki Hareketler' : 'Exercises in This Day'} ({exercises.length})
              </h3>
              {exercises.map((ex, i) => (
                <div key={ex.id || i} className="flex gap-4 items-center p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                  {/* Exercise Image Thumbnail */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-800 shrink-0">
                    <img 
                      src={getExerciseImage(ex.name)} 
                      alt={ex.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-white text-base font-display truncate">{ex.name}</div>
                    {ex.muscles && (
                      <div className="text-[10px] text-emerald-400 mt-0.5 truncate">{ex.muscles}</div>
                    )}
                    <div className="text-xs text-gray-400 font-mono mt-1">{ex.sets} SET × {ex.reps} {lang === 'tr' ? 'TEKRAR' : 'REPS'}</div>
                  </div>
                  <button 
                    onClick={() => setExercises(exercises.filter((_, idx) => idx !== i))} 
                    className="p-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-colors shrink-0"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              <button 
                onClick={handleSaveDay} 
                className="w-full py-4 bg-emerald-500/20 text-emerald-400 font-bold rounded-2xl text-sm uppercase tracking-widest hover:bg-emerald-500/30 transition-all border border-emerald-500/30 flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                {currentDayIndex >= 0 
                  ? (lang === 'tr' ? 'Günü Güncelle' : 'Update Day') 
                  : (lang === 'tr' ? 'Günü Kaydet' : 'Save Day')}
              </button>
            </div>
          )}

          {/* Saved Days List */}
          {days.length > 0 && (
            <div className="space-y-3 mt-8">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">
                {lang === 'tr' ? 'Program Günleri' : 'Program Days'} ({days.length})
              </h3>
              {days.map((day, i) => (
                <div 
                  key={day.id || i} 
                  className="flex justify-between items-center p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm cursor-pointer hover:bg-white/10 transition-colors"
                  onClick={() => handleEditDay(i)}
                >
                  <div>
                    <div className="font-bold text-white text-lg font-display">{day.label}</div>
                    <div className="text-xs text-gray-400 mt-1">{day.title} • {day.exercises.length} {lang === 'tr' ? 'hareket' : 'exercises'}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDeleteDay(i); }} 
                      className="p-2 text-red-400 hover:bg-red-400/10 rounded-xl transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                    <ChevronRight size={20} className="text-gray-500" />
                  </div>
                </div>
              ))}
              
              {/* Save Program Button */}
              <button 
                onClick={handleSaveProgram}
                disabled={isSaving}
                className="w-full py-5 bg-emerald-500 text-black font-black rounded-2xl text-sm uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] mt-4 flex items-center justify-center gap-3 disabled:opacity-70"
              >
                {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                {t.save_program || (lang === 'tr' ? 'Programı Kaydet' : 'Save Program')}
              </button>
            </div>
          )}
        </div>
      ) : (
        /* AI Mode */
        <GlassPanel className="p-8 rounded-[40px] text-center space-y-8 mt-10">
          <div className="w-24 h-24 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/30 shadow-[0_0_40px_rgba(168,85,247,0.2)]">
            <BrainCircuit size={48} className="text-purple-400" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight mb-2 font-display">
              {lang === 'tr' ? 'AI MİMAR' : 'AI ARCHITECT'}
            </h2>
            <p className="text-gray-400 text-sm">
              {lang === 'tr' ? 'Fitness hedefini tarif et, AI sana özel program oluştursun.' : 'Describe your fitness goal, AI will create a custom program for you.'}
            </p>
          </div>
          <textarea 
            value={aiPrompt} 
            onChange={(e) => setAiPrompt(e.target.value)} 
            placeholder={t.ai_prompt || (lang === 'tr' ? 'Örn: 3 ayda 10 kilo vermek istiyorum, haftada 4 gün spor yapabilirim...' : 'E.g., I want to lose 10kg in 3 months, I can exercise 4 days a week...')}
            className="w-full h-40 p-5 bg-black/40 rounded-3xl border border-white/10 text-white focus:outline-none focus:border-purple-500/50 resize-none text-sm leading-relaxed placeholder-gray-600" 
          />
          <button 
            onClick={handleAiGenerate} 
            disabled={isGenerating || isSaving || !creditCheck.canUse} 
            className={`w-full py-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black rounded-2xl text-sm uppercase tracking-widest hover:scale-[1.02] transition-all shadow-lg flex items-center justify-center gap-3 disabled:opacity-70 ${!creditCheck.canUse ? 'cursor-not-allowed' : ''}`}
          >
            {(isGenerating || isSaving) ? <Loader2 className="animate-spin" /> : <Wand2 size={20} />}
            {isGenerating 
              ? (t.generating || (lang === 'tr' ? 'Oluşturuluyor...' : 'Generating...')) 
              : (t.generate_btn || (lang === 'tr' ? 'Program Oluştur' : 'Generate Program'))}
          </button>
          
          {/* Credit warning */}
          {!creditCheck.canUse && (
            <button 
              onClick={() => setShowCreditModal(true)}
              className="w-full py-3 text-amber-400 text-xs font-bold uppercase tracking-wider hover:text-amber-300 transition-colors"
            >
              {lang === 'tr' ? '⚠️ Kredin bitti - Premium\'a geç' : '⚠️ No credits - Upgrade to Premium'}
            </button>
          )}
        </GlassPanel>
      )}
      
      {/* Exercise Picker Modal */}
      <ExercisePicker 
        isOpen={showExercisePicker}
        onClose={() => setShowExercisePicker(false)}
        onSelect={handleSelectFromPicker}
        lang={lang}
      />
      
      {/* Credit Modal */}
      <CreditModal 
        isOpen={showCreditModal}
        onClose={() => setShowCreditModal(false)}
        lang={lang}
        onNavigateToPremium={onNavigateToPremium}
      />
    </div>
  );
};

export default ProgramBuilderView;
