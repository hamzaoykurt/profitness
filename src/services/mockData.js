/**
 * Application Data - Translations & Utilities
 * This file contains UI translations and image utilities
 * Note: Program data is now stored in Firestore, not here
 */

// --- TRANSLATIONS ---
export const TRANSLATIONS = {
    tr: {
      login_title: "PRO VISION",
      login_subtitle: "Elit atletlerin dijital karargahı.",
      email: "KULLANICI ADI / E-POSTA",
      password: "ŞİFRE",
      login_btn: "GİRİŞ YAP",
      register_btn: "KAYIT OL",
      google_login: "GOOGLE İLE BAĞLAN",
      welcome: "Hoşgeldin",
      logging_in: "Sisteme bağlanılıyor...",
      error_auth: "Kimlik doğrulama başarısız.",
      nav_workout: "ANTRENMAN",
      nav_news: "AKIS",
      nav_profile: "PROFİL",
      nav_create: "YARAT",
      ai_coach_title: "AI KOÇ",
      coach_typing: "Analiz ediliyor...",
      coach_placeholder: "Koça danış...",
      live_news: "CANLI AKIŞ",
      live_news_sub: "Global Fitness İstihbaratı",
      active_day: "Aktif Gün",
      weekly_activity: "Haftalık Performans",
      level_progress: "Seviye İlerlemesi",
      level: "Seviye",
      manual_mode: "MANUEL KURGULA",
      ai_mode: "AI MİMARI",
      day_name: "GÜN ETİKETİ (ÖRN: PZT)",
      day_title: "GÜN BAŞLIĞI (ÖRN: GÖĞÜS)",
      add_exercise: "HAREKET EKLE",
      save_program: "PROGRAMI KAYDET",
      ai_prompt: "Hedefini yaz, yapay zeka programını oluştursun...",
      generate_btn: "OLUŞTUR",
      generating: "MİMARİ TASARLANIYOR...",
      set: "SET",
      rep: "TEKRAR",
      pro_tip: "PRO İPUCU",
      complete: "TAMAMLANDI",
      finish_set: "SETİ BİTİR"
    },
    en: {
      login_title: "PRO VISION",
      login_subtitle: "Digital HQ for elite athletes.",
      email: "USERNAME / EMAIL",
      password: "PASSWORD",
      login_btn: "LOGIN",
      register_btn: "REGISTER",
      google_login: "CONNECT WITH GOOGLE",
      welcome: "Welcome",
      logging_in: "Connecting to system...",
      error_auth: "Authentication failed.",
      nav_workout: "WORKOUT",
      nav_news: "FEED",
      nav_profile: "PROFILE",
      nav_create: "CREATE",
      ai_coach_title: "AI COACH",
      coach_typing: "Analyzing...",
      coach_placeholder: "Consult coach...",
      live_news: "LIVE FEED",
      live_news_sub: "Global Fitness Intelligence",
      active_day: "Active Days",
      weekly_activity: "Weekly Performance",
      level_progress: "Level Progress",
      level: "Level",
      manual_mode: "MANUAL BUILD",
      ai_mode: "AI ARCHITECT",
      day_name: "DAY TAG (E.G. MON)",
      day_title: "DAY TITLE (E.G. CHEST)",
      add_exercise: "ADD EXERCISE",
      save_program: "SAVE PROGRAM",
      ai_prompt: "Describe your goal...",
      generate_btn: "GENERATE",
      generating: "ARCHITECTING...",
      set: "SET",
      rep: "REPS",
      pro_tip: "PRO TIP",
      complete: "COMPLETED",
      finish_set: "FINISH SET"
    }
  };
  
  // --- EXERCISE IMAGE LIBRARY ---
  // Maps exercise names to high-quality Unsplash images
  export const getExerciseImage = (name) => {
    const n = (name || '').toLowerCase();
    const library = {
      "barfiks": "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=1200&auto=format&fit=crop", 
      "pull-up": "https://images.unsplash.com/photo-1598971639058-211a74a96ddc?q=80&w=1200&auto=format&fit=crop",
      "press": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1200&auto=format&fit=crop", 
      "bench": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1200&auto=format&fit=crop",
      "row": "https://images.unsplash.com/photo-1598971639058-211a74a96ddc?q=80&w=1200&auto=format&fit=crop", 
      "push-up": "https://images.unsplash.com/photo-1598971457999-e56ddb68b030?q=80&w=1200&auto=format&fit=crop",
      "şınav": "https://images.unsplash.com/photo-1598971457999-e56ddb68b030?q=80&w=1200&auto=format&fit=crop",
      "squat": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1200&auto=format&fit=crop",
      "deadlift": "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=1200&auto=format&fit=crop",
      "lunge": "https://images.unsplash.com/photo-1434608519344-49d77a699ded?q=80&w=1200&auto=format&fit=crop",
      "plank": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200&auto=format&fit=crop",
      "run": "https://images.unsplash.com/photo-1552674605-5d28c4e1902c?q=80&w=1200&auto=format&fit=crop",
      "koşu": "https://images.unsplash.com/photo-1552674605-5d28c4e1902c?q=80&w=1200&auto=format&fit=crop",
      "swim": "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?q=80&w=1200&auto=format&fit=crop",
      "yüzme": "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?q=80&w=1200&auto=format&fit=crop",
      "yoga": "https://images.unsplash.com/photo-1544367563-121955375564?q=80&w=1200&auto=format&fit=crop",
      "curl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1200&auto=format&fit=crop",
      "tricep": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1200&auto=format&fit=crop",
      "shoulder": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1200&auto=format&fit=crop",
      "dumbbell": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1200&auto=format&fit=crop",
      "kb": "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?q=80&w=1200&auto=format&fit=crop",
      "kettlebell": "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?q=80&w=1200&auto=format&fit=crop",
      "thruster": "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?q=80&w=1200&auto=format&fit=crop",
      "default": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200&auto=format&fit=crop"
    };
    const key = Object.keys(library).find(k => n.includes(k));
    return library[key] || library["default"];
  };
