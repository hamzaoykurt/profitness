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
  // Returns local path for exercise images
  // Images should be placed in public/exercises/ directory
  export const getExerciseImage = (name) => {
    const n = (name || '').toLowerCase();
    
    // Map varied user inputs to canonical filenames
    // keys: lowercase search terms
    // values: filename in /exercises/ folder (without extension if using helper, but here we specify full path)
    const imageMap = {
      // Chest (Exact matches from user's folder)
      // Note: bench_press file is MISSING, using incline as fallback
      "bench press": "/exercises/incline_bench_press_guide_1769369743130.jpg",
      "incline bench": "/exercises/incline_bench_press_guide_1769369743130.jpg",
      "decline bench": "/exercises/incline_bench_press_guide_1769369743130.jpg", // decline file also missing
      "dumbbell press": "/exercises/dumbbell_press_guide_1769369771987.jpg",
      "incline dumbbell press": "/exercises/incline_dumbbell_press_guide_1769369968978.jpg",
      
      "push-up": "/exercises/push_up_guide_1769369999163.jpg",
      "pushup": "/exercises/push_up_guide_1769369999163.jpg",
      "diamond push": "/exercises/diamond_push_up_guide_1769370013507.jpg",
      "wide push": "/exercises/wide_push_up_guide_1769370028888.jpg",
      "decline push": "/exercises/decline_push_up_guide_1769370042710.jpg",
      
      "dips": "/exercises/dips_chest_guide_1769370057475.jpg", 
      "dip": "/exercises/dips_chest_guide_1769370057475.jpg",

      "fly": "/exercises/dumbbell_fly_guide_1769370070637.jpg",
      "cable fly": "/exercises/cable_fly_guide_1769370099387.jpg",
      "pec deck": "/exercises/pec_deck_guide_1769370113721.jpg",
      "pullover": "/exercises/pullover_guide_1769370128094.jpg",
      
      // Back & Lats
      "deadlift": "/exercises/deadlift_guide_1769370163713.jpg",
      "row": "/exercises/deadlift_guide_1769370163713.jpg", // TEMPORARY FALLBACK
      "barfiks": "/exercises/deadlift_guide_1769370163713.jpg", // TEMPORARY FALLBACK
      "pull-up": "/exercises/deadlift_guide_1769370163713.jpg", // TEMPORARY FALLBACK
      
      // Shoulders
      "lateral": "/exercises/dumbbell_press_guide_1769369771987.jpg", // TEMPORARY FALLBACK
      "shoulder": "/exercises/dumbbell_press_guide_1769369771987.jpg", // TEMPORARY FALLBACK
      "thruster": "/exercises/dumbbell_press_guide_1769369771987.jpg", // TEMPORARY FALLBACK
      "overhead": "/exercises/dumbbell_press_guide_1769369771987.jpg", // TEMPORARY FALLBACK

      // Legs
      "squat": "/exercises/deadlift_guide_1769370163713.jpg", // TEMPORARY FALLBACK
      "lunge": "/exercises/deadlift_guide_1769370163713.jpg", // TEMPORARY FALLBACK
      "glute": "/exercises/deadlift_guide_1769370163713.jpg", // TEMPORARY FALLBACK
      "leg": "/exercises/deadlift_guide_1769370163713.jpg", // TEMPORARY FALLBACK
      "walk": "/exercises/deadlift_guide_1769370163713.jpg", // TEMPORARY FALLBACK
      "koşu": "/exercises/deadlift_guide_1769370163713.jpg", // TEMPORARY FALLBACK

      // Core
      "plank": "/exercises/push_up_guide_1769369999163.jpg", // TEMPORARY FALLBACK
      "mountain": "/exercises/push_up_guide_1769369999163.jpg", // TEMPORARY FALLBACK
      "dead bug": "/exercises/push_up_guide_1769369999163.jpg", // TEMPORARY FALLBACK
      "core": "/exercises/push_up_guide_1769369999163.jpg", // TEMPORARY FALLBACK
      
      // Yoga/Stretch
      "yoga": "/exercises/deadlift_guide_1769370163713.jpg", // TEMPORARY FALLBACK
      "stretch": "/exercises/deadlift_guide_1769370163713.jpg", // TEMPORARY FALLBACK
      
      // Fallbacks (generic keywords)
      "bench": "/exercises/incline_bench_press_guide_1769369743130.jpg",
      "press": "/exercises/incline_bench_press_guide_1769369743130.jpg", 
      "şınav": "/exercises/push_up_guide_1769369999163.jpg",
      "incline": "/exercises/incline_bench_press_guide_1769369743130.jpg",
    };
    
    // Find matching image
    // Sort keys by length (descending) to match specific names before generic keywords
    const keys = Object.keys(imageMap).sort((a, b) => b.length - a.length);
    const key = keys.find(k => n.includes(k));
    
    // Return mapped image or a default fallback if absolutely nothing matches
    return imageMap[key] || "/exercises/dumbbell_press_guide_1769369771987.jpg"; // Default to dumbbell press
  };

  // --- MUSCLEWIKI TUTORIAL LINKS ---
  // Maps exercise names to MuscleWiki URLs for detailed form tutorials
  export const getMuscleWikiUrl = (name) => {
    const n = (name || '').toLowerCase();
    
    const muscleWikiLinks = {
      // Chest
      "bench press": "https://musclewiki.com/barbell/male/chest/barbell-bench-press",
      "chest press": "https://musclewiki.com/machine/male/chest/machine-chest-press",
      "push-up": "https://musclewiki.com/bodyweight/male/chest/push-up",
      "pushup": "https://musclewiki.com/bodyweight/male/chest/push-up",
      "şınav": "https://musclewiki.com/bodyweight/male/chest/push-up",
      "dumbbell fly": "https://musclewiki.com/dumbbells/male/chest/dumbbell-fly",
      "incline press": "https://musclewiki.com/dumbbells/male/chest/dumbbell-incline-press",
      
      // Back
      "pull-up": "https://musclewiki.com/bodyweight/male/lats/pull-up",
      "pullup": "https://musclewiki.com/bodyweight/male/lats/pull-up",
      "barfiks": "https://musclewiki.com/bodyweight/male/lats/pull-up",
      "lat pulldown": "https://musclewiki.com/cables/male/lats/lat-pulldown",
      "row": "https://musclewiki.com/barbell/male/lats/barbell-row",
      "bent over row": "https://musclewiki.com/barbell/male/lats/barbell-row",
      "kürek": "https://musclewiki.com/barbell/male/lats/barbell-row",
      "seated row": "https://musclewiki.com/cables/male/lats/seated-cable-row",
      "deadlift": "https://musclewiki.com/barbell/male/hamstrings/barbell-deadlift",
      
      // Shoulders
      "shoulder press": "https://musclewiki.com/dumbbells/male/shoulders/dumbbell-shoulder-press",
      "overhead press": "https://musclewiki.com/barbell/male/shoulders/barbell-overhead-press",
      "military press": "https://musclewiki.com/barbell/male/shoulders/barbell-overhead-press",
      "lateral raise": "https://musclewiki.com/dumbbells/male/shoulders/dumbbell-lateral-raise",
      "front raise": "https://musclewiki.com/dumbbells/male/shoulders/dumbbell-front-raise",
      
      // Arms
      "bicep curl": "https://musclewiki.com/dumbbells/male/biceps/dumbbell-curl",
      "curl": "https://musclewiki.com/dumbbells/male/biceps/dumbbell-curl",
      "hammer curl": "https://musclewiki.com/dumbbells/male/biceps/dumbbell-hammer-curl",
      "tricep dip": "https://musclewiki.com/bodyweight/male/triceps/tricep-dip",
      "dip": "https://musclewiki.com/bodyweight/male/triceps/tricep-dip",
      "tricep extension": "https://musclewiki.com/cables/male/triceps/cable-push-down",
      "skull crusher": "https://musclewiki.com/barbell/male/triceps/barbell-skull-crusher",
      
      // Legs
      "squat": "https://musclewiki.com/barbell/male/glutes/barbell-squat",
      "leg press": "https://musclewiki.com/machine/male/quads/leg-press",
      "lunge": "https://musclewiki.com/bodyweight/male/glutes/bodyweight-lunge",
      "leg curl": "https://musclewiki.com/machine/male/hamstrings/leg-curl",
      "leg extension": "https://musclewiki.com/machine/male/quads/leg-extension",
      "calf raise": "https://musclewiki.com/machine/male/calves/calf-raise",
      
      // Core
      "plank": "https://musclewiki.com/bodyweight/male/abdominals/plank",
      "crunch": "https://musclewiki.com/bodyweight/male/abdominals/crunch",
      "sit-up": "https://musclewiki.com/bodyweight/male/abdominals/sit-up",
      "leg raise": "https://musclewiki.com/bodyweight/male/abdominals/leg-raise",
      
      // Cardio
      "burpee": "https://musclewiki.com/bodyweight/male/cardio/burpee",
    };
    
    // Find matching link
    const key = Object.keys(muscleWikiLinks).find(k => n.includes(k));
    
    // Fallback to MuscleWiki search
    if (!key) {
      const searchTerm = encodeURIComponent(name);
      return `https://musclewiki.com/directory?q=${searchTerm}`;
    }
    
    return muscleWikiLinks[key];
  };
