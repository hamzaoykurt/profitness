/**
 * Exercise Library - Pre-defined exercises with muscle groups
 * Used for visual exercise picker in manual program builder
 * 100+ exercises organized by muscle group
 */

// Exercise categories with muscle group info
export const EXERCISE_LIBRARY = {
  tr: {
    categories: [
      { id: 'chest', name: 'Göğüs', icon: '💪', color: 'rose' },
      { id: 'back', name: 'Sırt', icon: '🔙', color: 'blue' },
      { id: 'shoulders', name: 'Omuz', icon: '🎯', color: 'amber' },
      { id: 'arms', name: 'Kol', icon: '💪', color: 'purple' },
      { id: 'legs', name: 'Bacak', icon: '🦵', color: 'emerald' },
      { id: 'core', name: 'Karın', icon: '🔥', color: 'orange' },
      { id: 'cardio', name: 'Kardiyo', icon: '❤️', color: 'red' },
    ],
    exercises: {
      chest: [
        // Bileşik Hareketler
        { name: 'Bench Press', muscles: 'Göğüs, Triceps, Ön Omuz', defaultSets: 4, defaultReps: 10, image: 'bench-press' },
        { name: 'Incline Bench Press', muscles: 'Üst Göğüs, Ön Omuz', defaultSets: 4, defaultReps: 10, image: 'incline-press' },
        { name: 'Decline Bench Press', muscles: 'Alt Göğüs, Triceps', defaultSets: 3, defaultReps: 10, image: 'decline-press' },
        { name: 'Dumbbell Press', muscles: 'Göğüs, Triceps', defaultSets: 4, defaultReps: 10, image: 'dumbbell-press' },
        { name: 'Incline Dumbbell Press', muscles: 'Üst Göğüs, Ön Omuz', defaultSets: 3, defaultReps: 12, image: 'incline-press' },
        { name: 'Decline Dumbbell Press', muscles: 'Alt Göğüs', defaultSets: 3, defaultReps: 12, image: 'decline-press' },
        // Vücut Ağırlığı
        { name: 'Push-up (Şınav)', muscles: 'Göğüs, Triceps, Core', defaultSets: 3, defaultReps: 15, image: 'push-up' },
        { name: 'Diamond Push-up', muscles: 'İç Göğüs, Triceps', defaultSets: 3, defaultReps: 12, image: 'push-up' },
        { name: 'Wide Push-up', muscles: 'Dış Göğüs', defaultSets: 3, defaultReps: 15, image: 'push-up' },
        { name: 'Decline Push-up', muscles: 'Üst Göğüs', defaultSets: 3, defaultReps: 12, image: 'push-up' },
        { name: 'Dips (Göğüs)', muscles: 'Alt Göğüs, Triceps', defaultSets: 3, defaultReps: 10, image: 'tricep-dip' },
        // İzolasyon
        { name: 'Dumbbell Fly', muscles: 'Göğüs (İç)', defaultSets: 3, defaultReps: 12, image: 'dumbbell-fly' },
        { name: 'Incline Dumbbell Fly', muscles: 'Üst Göğüs (İç)', defaultSets: 3, defaultReps: 12, image: 'dumbbell-fly' },
        { name: 'Cable Fly', muscles: 'Göğüs (İç)', defaultSets: 3, defaultReps: 15, image: 'cable-fly' },
        { name: 'Cable Crossover', muscles: 'Göğüs (Alt/Üst)', defaultSets: 3, defaultReps: 15, image: 'cable-fly' },
        { name: 'Pec Deck', muscles: 'Göğüs (İç)', defaultSets: 3, defaultReps: 12, image: 'pec-deck' },
        { name: 'Machine Chest Press', muscles: 'Göğüs, Triceps', defaultSets: 3, defaultReps: 12, image: 'chest-press' },
        { name: 'Pullover', muscles: 'Göğüs, Lat', defaultSets: 3, defaultReps: 12, image: 'pullover' },
      ],
      back: [
        // Bileşik Hareketler
        { name: 'Deadlift', muscles: 'Tüm Sırt, Bacak, Core', defaultSets: 4, defaultReps: 6, image: 'deadlift' },
        { name: 'Sumo Deadlift', muscles: 'İç Bacak, Sırt', defaultSets: 4, defaultReps: 6, image: 'deadlift' },
        { name: 'Barbell Row', muscles: 'Orta Sırt, Biceps', defaultSets: 4, defaultReps: 10, image: 'barbell-row' },
        { name: 'Pendlay Row', muscles: 'Orta Sırt, Biceps', defaultSets: 4, defaultReps: 8, image: 'barbell-row' },
        { name: 'T-Bar Row', muscles: 'Orta Sırt, Lat', defaultSets: 3, defaultReps: 10, image: 't-bar-row' },
        { name: 'Dumbbell Row', muscles: 'Lat, Biceps', defaultSets: 3, defaultReps: 10, image: 'dumbbell-row' },
        { name: 'Kroc Row', muscles: 'Lat, Grip', defaultSets: 3, defaultReps: 15, image: 'dumbbell-row' },
        // Vücut Ağırlığı / Kablo
        { name: 'Pull-up (Barfiks)', muscles: 'Lat, Biceps', defaultSets: 3, defaultReps: 8, image: 'pull-up' },
        { name: 'Chin-up', muscles: 'Biceps, Lat', defaultSets: 3, defaultReps: 8, image: 'pull-up' },
        { name: 'Wide Grip Pull-up', muscles: 'Lat (Dış)', defaultSets: 3, defaultReps: 8, image: 'pull-up' },
        { name: 'Lat Pulldown', muscles: 'Lat, Biceps', defaultSets: 3, defaultReps: 12, image: 'lat-pulldown' },
        { name: 'Close Grip Pulldown', muscles: 'Alt Lat, Biceps', defaultSets: 3, defaultReps: 12, image: 'lat-pulldown' },
        { name: 'Seated Cable Row', muscles: 'Orta Sırt, Biceps', defaultSets: 3, defaultReps: 12, image: 'seated-row' },
        { name: 'Face Pull', muscles: 'Arka Omuz, Trapez', defaultSets: 3, defaultReps: 15, image: 'face-pull' },
        { name: 'Straight Arm Pulldown', muscles: 'Lat', defaultSets: 3, defaultReps: 15, image: 'straight-arm-pulldown' },
        // Makine
        { name: 'Machine Row', muscles: 'Orta Sırt', defaultSets: 3, defaultReps: 12, image: 'machine-row' },
        { name: 'Hyperextension', muscles: 'Alt Sırt, Glutes', defaultSets: 3, defaultReps: 15, image: 'hyperextension' },
        { name: 'Good Morning', muscles: 'Alt Sırt, Hamstring', defaultSets: 3, defaultReps: 10, image: 'good-morning' },
      ],
      shoulders: [
        // Bileşik Press
        { name: 'Overhead Press', muscles: 'Ön/Yan Omuz, Triceps', defaultSets: 4, defaultReps: 8, image: 'shoulder-press' },
        { name: 'Military Press', muscles: 'Ön Omuz, Triceps', defaultSets: 4, defaultReps: 8, image: 'shoulder-press' },
        { name: 'Dumbbell Shoulder Press', muscles: 'Ön/Yan Omuz', defaultSets: 4, defaultReps: 10, image: 'shoulder-press' },
        { name: 'Arnold Press', muscles: 'Tüm Omuz', defaultSets: 3, defaultReps: 10, image: 'arnold-press' },
        { name: 'Push Press', muscles: 'Omuz, Triceps, Bacak', defaultSets: 4, defaultReps: 6, image: 'push-press' },
        { name: 'Behind Neck Press', muscles: 'Yan/Arka Omuz', defaultSets: 3, defaultReps: 10, image: 'shoulder-press' },
        { name: 'Machine Shoulder Press', muscles: 'Ön/Yan Omuz', defaultSets: 3, defaultReps: 12, image: 'shoulder-press' },
        // İzolasyon - Yan
        { name: 'Lateral Raise', muscles: 'Yan Omuz', defaultSets: 3, defaultReps: 15, image: 'lateral-raise' },
        { name: 'Cable Lateral Raise', muscles: 'Yan Omuz', defaultSets: 3, defaultReps: 15, image: 'lateral-raise' },
        { name: 'Machine Lateral Raise', muscles: 'Yan Omuz', defaultSets: 3, defaultReps: 15, image: 'lateral-raise' },
        // İzolasyon - Ön
        { name: 'Front Raise', muscles: 'Ön Omuz', defaultSets: 3, defaultReps: 12, image: 'front-raise' },
        { name: 'Plate Front Raise', muscles: 'Ön Omuz', defaultSets: 3, defaultReps: 12, image: 'front-raise' },
        // İzolasyon - Arka
        { name: 'Rear Delt Fly', muscles: 'Arka Omuz', defaultSets: 3, defaultReps: 15, image: 'rear-delt-fly' },
        { name: 'Reverse Pec Deck', muscles: 'Arka Omuz', defaultSets: 3, defaultReps: 15, image: 'rear-delt-fly' },
        { name: 'Bent Over Lateral Raise', muscles: 'Arka Omuz', defaultSets: 3, defaultReps: 15, image: 'rear-delt-fly' },
        // Trapez
        { name: 'Barbell Shrug', muscles: 'Üst Trapez', defaultSets: 4, defaultReps: 12, image: 'shrug' },
        { name: 'Dumbbell Shrug', muscles: 'Üst Trapez', defaultSets: 3, defaultReps: 15, image: 'shrug' },
        { name: 'Upright Row', muscles: 'Yan Omuz, Trapez', defaultSets: 3, defaultReps: 12, image: 'upright-row' },
      ],
      arms: [
        // Biceps - Bileşik
        { name: 'Barbell Curl', muscles: 'Biceps', defaultSets: 3, defaultReps: 10, image: 'bicep-curl' },
        { name: 'EZ Bar Curl', muscles: 'Biceps', defaultSets: 3, defaultReps: 12, image: 'bicep-curl' },
        { name: 'Dumbbell Curl', muscles: 'Biceps', defaultSets: 3, defaultReps: 12, image: 'bicep-curl' },
        { name: 'Hammer Curl', muscles: 'Biceps, Ön Kol', defaultSets: 3, defaultReps: 12, image: 'hammer-curl' },
        { name: 'Preacher Curl', muscles: 'Biceps (Alt)', defaultSets: 3, defaultReps: 12, image: 'preacher-curl' },
        { name: 'Incline Dumbbell Curl', muscles: 'Biceps (Uzun Baş)', defaultSets: 3, defaultReps: 12, image: 'incline-curl' },
        { name: 'Concentration Curl', muscles: 'Biceps (Tepe)', defaultSets: 3, defaultReps: 12, image: 'concentration-curl' },
        { name: 'Cable Curl', muscles: 'Biceps', defaultSets: 3, defaultReps: 15, image: 'cable-curl' },
        { name: 'Spider Curl', muscles: 'Biceps (Kısa Baş)', defaultSets: 3, defaultReps: 12, image: 'spider-curl' },
        { name: 'Reverse Curl', muscles: 'Ön Kol, Biceps', defaultSets: 3, defaultReps: 12, image: 'reverse-curl' },
        // Triceps
        { name: 'Close Grip Bench Press', muscles: 'Triceps, Göğüs', defaultSets: 4, defaultReps: 10, image: 'close-grip-bench' },
        { name: 'Tricep Dip', muscles: 'Triceps, Göğüs', defaultSets: 3, defaultReps: 12, image: 'tricep-dip' },
        { name: 'Skull Crusher', muscles: 'Triceps', defaultSets: 3, defaultReps: 10, image: 'skull-crusher' },
        { name: 'Tricep Pushdown', muscles: 'Triceps', defaultSets: 3, defaultReps: 15, image: 'tricep-pushdown' },
        { name: 'Rope Pushdown', muscles: 'Triceps (Lateral)', defaultSets: 3, defaultReps: 15, image: 'rope-pushdown' },
        { name: 'Overhead Tricep Extension', muscles: 'Triceps (Uzun Baş)', defaultSets: 3, defaultReps: 12, image: 'overhead-extension' },
        { name: 'Dumbbell Kickback', muscles: 'Triceps', defaultSets: 3, defaultReps: 12, image: 'tricep-kickback' },
        { name: 'Diamond Push-up', muscles: 'Triceps, Göğüs', defaultSets: 3, defaultReps: 12, image: 'push-up' },
        // Ön Kol
        { name: 'Wrist Curl', muscles: 'Ön Kol (Flexor)', defaultSets: 3, defaultReps: 15, image: 'wrist-curl' },
        { name: 'Reverse Wrist Curl', muscles: 'Ön Kol (Extensor)', defaultSets: 3, defaultReps: 15, image: 'wrist-curl' },
        { name: 'Farmer Walk', muscles: 'Grip, Core, Trapez', defaultSets: 3, defaultReps: 30, note: '30 metre', image: 'farmer-walk' },
      ],
      legs: [
        // Bileşik - Quad Dominant
        { name: 'Barbell Squat', muscles: 'Quadriceps, Glutes', defaultSets: 4, defaultReps: 8, image: 'squat' },
        { name: 'Front Squat', muscles: 'Quadriceps, Core', defaultSets: 4, defaultReps: 8, image: 'front-squat' },
        { name: 'Goblet Squat', muscles: 'Quadriceps, Glutes', defaultSets: 3, defaultReps: 12, image: 'goblet-squat' },
        { name: 'Hack Squat', muscles: 'Quadriceps', defaultSets: 3, defaultReps: 12, image: 'hack-squat' },
        { name: 'Leg Press', muscles: 'Quadriceps, Glutes', defaultSets: 4, defaultReps: 12, image: 'leg-press' },
        { name: 'Smith Machine Squat', muscles: 'Quadriceps, Glutes', defaultSets: 3, defaultReps: 10, image: 'smith-squat' },
        // Bileşik - Hip Dominant
        { name: 'Romanian Deadlift', muscles: 'Hamstring, Glutes', defaultSets: 3, defaultReps: 10, image: 'rdl' },
        { name: 'Stiff Leg Deadlift', muscles: 'Hamstring, Alt Sırt', defaultSets: 3, defaultReps: 10, image: 'rdl' },
        { name: 'Hip Thrust', muscles: 'Glutes', defaultSets: 4, defaultReps: 12, image: 'hip-thrust' },
        { name: 'Glute Bridge', muscles: 'Glutes', defaultSets: 3, defaultReps: 15, image: 'glute-bridge' },
        { name: 'Cable Pull Through', muscles: 'Glutes, Hamstring', defaultSets: 3, defaultReps: 15, image: 'pull-through' },
        // Tek Bacak
        { name: 'Walking Lunge', muscles: 'Quadriceps, Glutes', defaultSets: 3, defaultReps: 12, image: 'lunge' },
        { name: 'Reverse Lunge', muscles: 'Quadriceps, Glutes', defaultSets: 3, defaultReps: 12, image: 'lunge' },
        { name: 'Bulgarian Split Squat', muscles: 'Quadriceps, Glutes', defaultSets: 3, defaultReps: 10, image: 'bulgarian-squat' },
        { name: 'Step Up', muscles: 'Quadriceps, Glutes', defaultSets: 3, defaultReps: 12, image: 'step-up' },
        { name: 'Single Leg RDL', muscles: 'Hamstring, Denge', defaultSets: 3, defaultReps: 10, image: 'single-leg-rdl' },
        // İzolasyon
        { name: 'Leg Extension', muscles: 'Quadriceps', defaultSets: 3, defaultReps: 15, image: 'leg-extension' },
        { name: 'Lying Leg Curl', muscles: 'Hamstring', defaultSets: 3, defaultReps: 12, image: 'leg-curl' },
        { name: 'Seated Leg Curl', muscles: 'Hamstring', defaultSets: 3, defaultReps: 12, image: 'leg-curl' },
        { name: 'Hip Abduction', muscles: 'Dış Kalça', defaultSets: 3, defaultReps: 15, image: 'hip-abduction' },
        { name: 'Hip Adduction', muscles: 'İç Bacak', defaultSets: 3, defaultReps: 15, image: 'hip-adduction' },
        // Baldır
        { name: 'Standing Calf Raise', muscles: 'Baldır (Gastrocnemius)', defaultSets: 4, defaultReps: 15, image: 'calf-raise' },
        { name: 'Seated Calf Raise', muscles: 'Baldır (Soleus)', defaultSets: 4, defaultReps: 20, image: 'seated-calf' },
        { name: 'Donkey Calf Raise', muscles: 'Baldır', defaultSets: 3, defaultReps: 15, image: 'calf-raise' },
      ],
      core: [
        // Plank Varyasyonları
        { name: 'Plank', muscles: 'Core, Omuz', defaultSets: 3, defaultReps: 60, note: '60 saniye', image: 'plank' },
        { name: 'Side Plank', muscles: 'Obliques, Core', defaultSets: 3, defaultReps: 30, note: 'Her taraf 30sn', image: 'side-plank' },
        { name: 'Plank with Leg Lift', muscles: 'Core, Glutes', defaultSets: 3, defaultReps: 10, image: 'plank' },
        // Üst Karın
        { name: 'Crunch', muscles: 'Üst Karın', defaultSets: 3, defaultReps: 20, image: 'crunch' },
        { name: 'Cable Crunch', muscles: 'Üst Karın', defaultSets: 3, defaultReps: 15, image: 'cable-crunch' },
        { name: 'Machine Crunch', muscles: 'Üst Karın', defaultSets: 3, defaultReps: 15, image: 'machine-crunch' },
        { name: 'Sit-up', muscles: 'Karın, Hip Flexor', defaultSets: 3, defaultReps: 20, image: 'sit-up' },
        // Alt Karın
        { name: 'Leg Raise', muscles: 'Alt Karın', defaultSets: 3, defaultReps: 15, image: 'leg-raise' },
        { name: 'Hanging Leg Raise', muscles: 'Alt Karın, Grip', defaultSets: 3, defaultReps: 12, image: 'hanging-leg-raise' },
        { name: 'Reverse Crunch', muscles: 'Alt Karın', defaultSets: 3, defaultReps: 15, image: 'reverse-crunch' },
        { name: 'Knee Raise', muscles: 'Alt Karın', defaultSets: 3, defaultReps: 15, image: 'knee-raise' },
        // Obliques
        { name: 'Russian Twist', muscles: 'Obliques', defaultSets: 3, defaultReps: 20, image: 'russian-twist' },
        { name: 'Bicycle Crunch', muscles: 'Obliques, Karın', defaultSets: 3, defaultReps: 20, image: 'bicycle-crunch' },
        { name: 'Woodchop', muscles: 'Obliques, Core', defaultSets: 3, defaultReps: 12, image: 'woodchop' },
        { name: 'Pallof Press', muscles: 'Core Stabilizasyon', defaultSets: 3, defaultReps: 10, image: 'pallof-press' },
        // Dinamik
        { name: 'Mountain Climber', muscles: 'Core, Kardiyo', defaultSets: 3, defaultReps: 30, image: 'mountain-climber' },
        { name: 'Dead Bug', muscles: 'Core Stabilizasyon', defaultSets: 3, defaultReps: 10, image: 'dead-bug' },
        { name: 'Bird Dog', muscles: 'Alt Sırt, Core', defaultSets: 3, defaultReps: 10, image: 'bird-dog' },
        { name: 'Ab Wheel Rollout', muscles: 'Tüm Core', defaultSets: 3, defaultReps: 10, image: 'ab-wheel' },
        { name: 'V-Up', muscles: 'Tüm Karın', defaultSets: 3, defaultReps: 15, image: 'v-up' },
      ],
      cardio: [
        // Düşük Yoğunluk
        { name: 'Yürüyüş', muscles: 'Bacak, Kardiyo', defaultSets: 1, defaultReps: 30, note: '30 dakika', image: 'walking' },
        { name: 'Koşu Bandı Yürüyüş', muscles: 'Bacak, Kardiyo', defaultSets: 1, defaultReps: 20, note: '20 dakika eğimli', image: 'treadmill' },
        { name: 'Bisiklet', muscles: 'Bacak, Kardiyo', defaultSets: 1, defaultReps: 30, note: '30 dakika', image: 'bike' },
        { name: 'Eliptik', muscles: 'Tüm Vücut', defaultSets: 1, defaultReps: 20, note: '20 dakika', image: 'elliptical' },
        // Orta Yoğunluk
        { name: 'Koşu', muscles: 'Bacak, Kardiyo', defaultSets: 1, defaultReps: 20, note: '20 dakika', image: 'run' },
        { name: 'Kürek Makinesi', muscles: 'Sırt, Bacak, Kardiyo', defaultSets: 1, defaultReps: 15, note: '15 dakika', image: 'rowing' },
        { name: 'Merdiven Tırmanma', muscles: 'Bacak, Glutes', defaultSets: 1, defaultReps: 15, note: '15 dakika', image: 'stair-climber' },
        // Yüksek Yoğunluk (HIIT)
        { name: 'Burpee', muscles: 'Tüm Vücut', defaultSets: 4, defaultReps: 10, image: 'burpee' },
        { name: 'Box Jump', muscles: 'Bacak, Patlayıcı Güç', defaultSets: 4, defaultReps: 10, image: 'box-jump' },
        { name: 'Jumping Jack', muscles: 'Kardiyo', defaultSets: 3, defaultReps: 30, image: 'jumping-jack' },
        { name: 'High Knees', muscles: 'Bacak, Kardiyo', defaultSets: 3, defaultReps: 30, image: 'high-knees' },
        { name: 'Jump Squat', muscles: 'Bacak, Patlayıcı Güç', defaultSets: 3, defaultReps: 15, image: 'jump-squat' },
        { name: 'Jump Lunge', muscles: 'Bacak, Denge', defaultSets: 3, defaultReps: 20, image: 'jump-lunge' },
        { name: 'Kettlebell Swing', muscles: 'Glutes, Kalça, Kardiyo', defaultSets: 4, defaultReps: 15, image: 'kb-swing' },
        { name: 'Battle Rope', muscles: 'Kol, Core, Kardiyo', defaultSets: 4, defaultReps: 30, note: '30 saniye', image: 'battle-rope' },
        { name: 'Sprint', muscles: 'Bacak, Kardiyo', defaultSets: 8, defaultReps: 20, note: '20sn sprint, 40sn dinlen', image: 'sprint' },
        { name: 'Sled Push', muscles: 'Bacak, Core', defaultSets: 4, defaultReps: 20, note: '20 metre', image: 'sled-push' },
        { name: 'Jump Rope', muscles: 'Baldır, Kardiyo', defaultSets: 3, defaultReps: 100, image: 'jump-rope' },
      ],
    }
  },
  en: {
    categories: [
      { id: 'chest', name: 'Chest', icon: '💪', color: 'rose' },
      { id: 'back', name: 'Back', icon: '🔙', color: 'blue' },
      { id: 'shoulders', name: 'Shoulders', icon: '🎯', color: 'amber' },
      { id: 'arms', name: 'Arms', icon: '💪', color: 'purple' },
      { id: 'legs', name: 'Legs', icon: '🦵', color: 'emerald' },
      { id: 'core', name: 'Core', icon: '🔥', color: 'orange' },
      { id: 'cardio', name: 'Cardio', icon: '❤️', color: 'red' },
    ],
    exercises: {
      chest: [
        { name: 'Bench Press', muscles: 'Chest, Triceps, Front Delts', defaultSets: 4, defaultReps: 10, image: 'bench-press' },
        { name: 'Incline Bench Press', muscles: 'Upper Chest, Delts', defaultSets: 4, defaultReps: 10, image: 'incline-press' },
        { name: 'Decline Bench Press', muscles: 'Lower Chest, Triceps', defaultSets: 3, defaultReps: 10, image: 'decline-press' },
        { name: 'Dumbbell Press', muscles: 'Chest, Triceps', defaultSets: 4, defaultReps: 10, image: 'dumbbell-press' },
        { name: 'Incline Dumbbell Press', muscles: 'Upper Chest, Delts', defaultSets: 3, defaultReps: 12, image: 'incline-press' },
        { name: 'Push-up', muscles: 'Chest, Triceps, Core', defaultSets: 3, defaultReps: 15, image: 'push-up' },
        { name: 'Diamond Push-up', muscles: 'Inner Chest, Triceps', defaultSets: 3, defaultReps: 12, image: 'push-up' },
        { name: 'Dips', muscles: 'Lower Chest, Triceps', defaultSets: 3, defaultReps: 10, image: 'tricep-dip' },
        { name: 'Dumbbell Fly', muscles: 'Chest (Inner)', defaultSets: 3, defaultReps: 12, image: 'dumbbell-fly' },
        { name: 'Cable Fly', muscles: 'Chest (Inner)', defaultSets: 3, defaultReps: 15, image: 'cable-fly' },
        { name: 'Cable Crossover', muscles: 'Chest (Upper/Lower)', defaultSets: 3, defaultReps: 15, image: 'cable-fly' },
        { name: 'Pec Deck', muscles: 'Chest (Inner)', defaultSets: 3, defaultReps: 12, image: 'pec-deck' },
        { name: 'Machine Chest Press', muscles: 'Chest, Triceps', defaultSets: 3, defaultReps: 12, image: 'chest-press' },
        { name: 'Pullover', muscles: 'Chest, Lats', defaultSets: 3, defaultReps: 12, image: 'pullover' },
      ],
      back: [
        { name: 'Deadlift', muscles: 'Full Back, Legs, Core', defaultSets: 4, defaultReps: 6, image: 'deadlift' },
        { name: 'Sumo Deadlift', muscles: 'Inner Thighs, Back', defaultSets: 4, defaultReps: 6, image: 'deadlift' },
        { name: 'Barbell Row', muscles: 'Mid Back, Biceps', defaultSets: 4, defaultReps: 10, image: 'barbell-row' },
        { name: 'Pendlay Row', muscles: 'Mid Back, Biceps', defaultSets: 4, defaultReps: 8, image: 'barbell-row' },
        { name: 'T-Bar Row', muscles: 'Mid Back, Lats', defaultSets: 3, defaultReps: 10, image: 't-bar-row' },
        { name: 'Dumbbell Row', muscles: 'Lats, Biceps', defaultSets: 3, defaultReps: 10, image: 'dumbbell-row' },
        { name: 'Pull-up', muscles: 'Lats, Biceps', defaultSets: 3, defaultReps: 8, image: 'pull-up' },
        { name: 'Chin-up', muscles: 'Biceps, Lats', defaultSets: 3, defaultReps: 8, image: 'pull-up' },
        { name: 'Lat Pulldown', muscles: 'Lats, Biceps', defaultSets: 3, defaultReps: 12, image: 'lat-pulldown' },
        { name: 'Close Grip Pulldown', muscles: 'Lower Lats, Biceps', defaultSets: 3, defaultReps: 12, image: 'lat-pulldown' },
        { name: 'Seated Cable Row', muscles: 'Mid Back, Biceps', defaultSets: 3, defaultReps: 12, image: 'seated-row' },
        { name: 'Face Pull', muscles: 'Rear Delts, Traps', defaultSets: 3, defaultReps: 15, image: 'face-pull' },
        { name: 'Hyperextension', muscles: 'Lower Back, Glutes', defaultSets: 3, defaultReps: 15, image: 'hyperextension' },
        { name: 'Good Morning', muscles: 'Lower Back, Hamstrings', defaultSets: 3, defaultReps: 10, image: 'good-morning' },
      ],
      shoulders: [
        { name: 'Overhead Press', muscles: 'Front/Side Delts, Triceps', defaultSets: 4, defaultReps: 8, image: 'shoulder-press' },
        { name: 'Military Press', muscles: 'Front Delts, Triceps', defaultSets: 4, defaultReps: 8, image: 'shoulder-press' },
        { name: 'Dumbbell Shoulder Press', muscles: 'Front/Side Delts', defaultSets: 4, defaultReps: 10, image: 'shoulder-press' },
        { name: 'Arnold Press', muscles: 'All Delts', defaultSets: 3, defaultReps: 10, image: 'arnold-press' },
        { name: 'Push Press', muscles: 'Shoulders, Triceps, Legs', defaultSets: 4, defaultReps: 6, image: 'push-press' },
        { name: 'Lateral Raise', muscles: 'Side Delts', defaultSets: 3, defaultReps: 15, image: 'lateral-raise' },
        { name: 'Cable Lateral Raise', muscles: 'Side Delts', defaultSets: 3, defaultReps: 15, image: 'lateral-raise' },
        { name: 'Front Raise', muscles: 'Front Delts', defaultSets: 3, defaultReps: 12, image: 'front-raise' },
        { name: 'Rear Delt Fly', muscles: 'Rear Delts', defaultSets: 3, defaultReps: 15, image: 'rear-delt-fly' },
        { name: 'Reverse Pec Deck', muscles: 'Rear Delts', defaultSets: 3, defaultReps: 15, image: 'rear-delt-fly' },
        { name: 'Barbell Shrug', muscles: 'Upper Traps', defaultSets: 4, defaultReps: 12, image: 'shrug' },
        { name: 'Upright Row', muscles: 'Side Delts, Traps', defaultSets: 3, defaultReps: 12, image: 'upright-row' },
      ],
      arms: [
        { name: 'Barbell Curl', muscles: 'Biceps', defaultSets: 3, defaultReps: 10, image: 'bicep-curl' },
        { name: 'EZ Bar Curl', muscles: 'Biceps', defaultSets: 3, defaultReps: 12, image: 'bicep-curl' },
        { name: 'Dumbbell Curl', muscles: 'Biceps', defaultSets: 3, defaultReps: 12, image: 'bicep-curl' },
        { name: 'Hammer Curl', muscles: 'Biceps, Forearms', defaultSets: 3, defaultReps: 12, image: 'hammer-curl' },
        { name: 'Preacher Curl', muscles: 'Biceps (Lower)', defaultSets: 3, defaultReps: 12, image: 'preacher-curl' },
        { name: 'Incline Dumbbell Curl', muscles: 'Biceps (Long Head)', defaultSets: 3, defaultReps: 12, image: 'incline-curl' },
        { name: 'Concentration Curl', muscles: 'Biceps (Peak)', defaultSets: 3, defaultReps: 12, image: 'concentration-curl' },
        { name: 'Cable Curl', muscles: 'Biceps', defaultSets: 3, defaultReps: 15, image: 'cable-curl' },
        { name: 'Close Grip Bench Press', muscles: 'Triceps, Chest', defaultSets: 4, defaultReps: 10, image: 'close-grip-bench' },
        { name: 'Tricep Dip', muscles: 'Triceps, Chest', defaultSets: 3, defaultReps: 12, image: 'tricep-dip' },
        { name: 'Skull Crusher', muscles: 'Triceps', defaultSets: 3, defaultReps: 10, image: 'skull-crusher' },
        { name: 'Tricep Pushdown', muscles: 'Triceps', defaultSets: 3, defaultReps: 15, image: 'tricep-pushdown' },
        { name: 'Rope Pushdown', muscles: 'Triceps (Lateral)', defaultSets: 3, defaultReps: 15, image: 'rope-pushdown' },
        { name: 'Overhead Tricep Extension', muscles: 'Triceps (Long Head)', defaultSets: 3, defaultReps: 12, image: 'overhead-extension' },
        { name: 'Wrist Curl', muscles: 'Forearms (Flexor)', defaultSets: 3, defaultReps: 15, image: 'wrist-curl' },
        { name: 'Farmer Walk', muscles: 'Grip, Core, Traps', defaultSets: 3, defaultReps: 30, note: '30 meters', image: 'farmer-walk' },
      ],
      legs: [
        { name: 'Barbell Squat', muscles: 'Quads, Glutes', defaultSets: 4, defaultReps: 8, image: 'squat' },
        { name: 'Front Squat', muscles: 'Quads, Core', defaultSets: 4, defaultReps: 8, image: 'front-squat' },
        { name: 'Goblet Squat', muscles: 'Quads, Glutes', defaultSets: 3, defaultReps: 12, image: 'goblet-squat' },
        { name: 'Hack Squat', muscles: 'Quads', defaultSets: 3, defaultReps: 12, image: 'hack-squat' },
        { name: 'Leg Press', muscles: 'Quads, Glutes', defaultSets: 4, defaultReps: 12, image: 'leg-press' },
        { name: 'Romanian Deadlift', muscles: 'Hamstrings, Glutes', defaultSets: 3, defaultReps: 10, image: 'rdl' },
        { name: 'Stiff Leg Deadlift', muscles: 'Hamstrings, Lower Back', defaultSets: 3, defaultReps: 10, image: 'rdl' },
        { name: 'Hip Thrust', muscles: 'Glutes', defaultSets: 4, defaultReps: 12, image: 'hip-thrust' },
        { name: 'Glute Bridge', muscles: 'Glutes', defaultSets: 3, defaultReps: 15, image: 'glute-bridge' },
        { name: 'Walking Lunge', muscles: 'Quads, Glutes', defaultSets: 3, defaultReps: 12, image: 'lunge' },
        { name: 'Bulgarian Split Squat', muscles: 'Quads, Glutes', defaultSets: 3, defaultReps: 10, image: 'bulgarian-squat' },
        { name: 'Step Up', muscles: 'Quads, Glutes', defaultSets: 3, defaultReps: 12, image: 'step-up' },
        { name: 'Leg Extension', muscles: 'Quads', defaultSets: 3, defaultReps: 15, image: 'leg-extension' },
        { name: 'Lying Leg Curl', muscles: 'Hamstrings', defaultSets: 3, defaultReps: 12, image: 'leg-curl' },
        { name: 'Hip Abduction', muscles: 'Outer Glutes', defaultSets: 3, defaultReps: 15, image: 'hip-abduction' },
        { name: 'Hip Adduction', muscles: 'Inner Thighs', defaultSets: 3, defaultReps: 15, image: 'hip-adduction' },
        { name: 'Standing Calf Raise', muscles: 'Calves', defaultSets: 4, defaultReps: 15, image: 'calf-raise' },
        { name: 'Seated Calf Raise', muscles: 'Calves (Soleus)', defaultSets: 4, defaultReps: 20, image: 'seated-calf' },
      ],
      core: [
        { name: 'Plank', muscles: 'Core, Shoulders', defaultSets: 3, defaultReps: 60, note: '60 seconds', image: 'plank' },
        { name: 'Side Plank', muscles: 'Obliques, Core', defaultSets: 3, defaultReps: 30, note: '30s each side', image: 'side-plank' },
        { name: 'Crunch', muscles: 'Upper Abs', defaultSets: 3, defaultReps: 20, image: 'crunch' },
        { name: 'Cable Crunch', muscles: 'Upper Abs', defaultSets: 3, defaultReps: 15, image: 'cable-crunch' },
        { name: 'Sit-up', muscles: 'Abs, Hip Flexors', defaultSets: 3, defaultReps: 20, image: 'sit-up' },
        { name: 'Leg Raise', muscles: 'Lower Abs', defaultSets: 3, defaultReps: 15, image: 'leg-raise' },
        { name: 'Hanging Leg Raise', muscles: 'Lower Abs, Grip', defaultSets: 3, defaultReps: 12, image: 'hanging-leg-raise' },
        { name: 'Reverse Crunch', muscles: 'Lower Abs', defaultSets: 3, defaultReps: 15, image: 'reverse-crunch' },
        { name: 'Russian Twist', muscles: 'Obliques', defaultSets: 3, defaultReps: 20, image: 'russian-twist' },
        { name: 'Bicycle Crunch', muscles: 'Obliques, Abs', defaultSets: 3, defaultReps: 20, image: 'bicycle-crunch' },
        { name: 'Woodchop', muscles: 'Obliques, Core', defaultSets: 3, defaultReps: 12, image: 'woodchop' },
        { name: 'Pallof Press', muscles: 'Core Stability', defaultSets: 3, defaultReps: 10, image: 'pallof-press' },
        { name: 'Mountain Climber', muscles: 'Core, Cardio', defaultSets: 3, defaultReps: 30, image: 'mountain-climber' },
        { name: 'Dead Bug', muscles: 'Core Stability', defaultSets: 3, defaultReps: 10, image: 'dead-bug' },
        { name: 'Ab Wheel Rollout', muscles: 'Full Core', defaultSets: 3, defaultReps: 10, image: 'ab-wheel' },
        { name: 'V-Up', muscles: 'Full Abs', defaultSets: 3, defaultReps: 15, image: 'v-up' },
      ],
      cardio: [
        { name: 'Walking', muscles: 'Legs, Cardio', defaultSets: 1, defaultReps: 30, note: '30 minutes', image: 'walking' },
        { name: 'Treadmill Incline Walk', muscles: 'Legs, Cardio', defaultSets: 1, defaultReps: 20, note: '20min incline', image: 'treadmill' },
        { name: 'Cycling', muscles: 'Legs, Cardio', defaultSets: 1, defaultReps: 30, note: '30 minutes', image: 'bike' },
        { name: 'Elliptical', muscles: 'Full Body', defaultSets: 1, defaultReps: 20, note: '20 minutes', image: 'elliptical' },
        { name: 'Running', muscles: 'Legs, Cardio', defaultSets: 1, defaultReps: 20, note: '20 minutes', image: 'run' },
        { name: 'Rowing Machine', muscles: 'Back, Legs, Cardio', defaultSets: 1, defaultReps: 15, note: '15 minutes', image: 'rowing' },
        { name: 'Stair Climber', muscles: 'Legs, Glutes', defaultSets: 1, defaultReps: 15, note: '15 minutes', image: 'stair-climber' },
        { name: 'Burpee', muscles: 'Full Body', defaultSets: 4, defaultReps: 10, image: 'burpee' },
        { name: 'Box Jump', muscles: 'Legs, Power', defaultSets: 4, defaultReps: 10, image: 'box-jump' },
        { name: 'Jumping Jack', muscles: 'Cardio', defaultSets: 3, defaultReps: 30, image: 'jumping-jack' },
        { name: 'High Knees', muscles: 'Legs, Cardio', defaultSets: 3, defaultReps: 30, image: 'high-knees' },
        { name: 'Jump Squat', muscles: 'Legs, Power', defaultSets: 3, defaultReps: 15, image: 'jump-squat' },
        { name: 'Kettlebell Swing', muscles: 'Glutes, Hips, Cardio', defaultSets: 4, defaultReps: 15, image: 'kb-swing' },
        { name: 'Battle Rope', muscles: 'Arms, Core, Cardio', defaultSets: 4, defaultReps: 30, note: '30 seconds', image: 'battle-rope' },
        { name: 'Sprint', muscles: 'Legs, Cardio', defaultSets: 8, defaultReps: 20, note: '20s sprint, 40s rest', image: 'sprint' },
        { name: 'Jump Rope', muscles: 'Calves, Cardio', defaultSets: 3, defaultReps: 100, image: 'jump-rope' },
      ],
    }
  }
};

// Get all exercises flat (for search)
export const getAllExercises = (lang = 'tr') => {
  const lib = EXERCISE_LIBRARY[lang] || EXERCISE_LIBRARY.tr;
  const all = [];
  Object.entries(lib.exercises).forEach(([categoryId, exercises]) => {
    const category = lib.categories.find(c => c.id === categoryId);
    exercises.forEach(ex => {
      all.push({
        ...ex,
        categoryId,
        categoryName: category?.name || categoryId,
        categoryColor: category?.color || 'gray'
      });
    });
  });
  return all;
};

// Search exercises by name
export const searchExercises = (query, lang = 'tr') => {
  if (!query || query.length < 2) return [];
  const all = getAllExercises(lang);
  const q = query.toLowerCase();
  return all.filter(ex => 
    ex.name.toLowerCase().includes(q) || 
    ex.muscles.toLowerCase().includes(q)
  );
};
