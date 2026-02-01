/**
 * Gemini AI Service
 * Handles all AI-related operations via Google's Gemini API
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

/**
 * Send a message to Gemini AI Coach
 * @param {string} prompt - User's question or message
 * @param {string} lang - Language ('tr' or 'en')
 * @param {object} context - Optional context (user profile, workout data)
 * @returns {Promise<{success: boolean, response?: string, error?: string}>}
 */
    export const askCoach = async (prompt, lang = 'tr', context = {}) => {
      // Mock Data Fallback for Demo Mode (No API Key or API Error)
      const mockFallback = async () => {
        console.log("Using Mock AI Response...");
        await new Promise(r => setTimeout(r, 800)); // Simulate delay (reduced for speed)
    
        const isProgramRequest = prompt.includes('JSON') || prompt.toLowerCase().includes('program');
        
        if (isProgramRequest) {
          if (lang === 'tr') {
            return {
              success: true,
              response: JSON.stringify([
                { id: 1, label: "PZT", title: "Göğüs & Triceps", exercises: [{name: "Bench Press", sets: 4, reps: 10, note: "Omuzları geri çek."}, {name: "Tricep Pushdown", sets: 3, reps: 12, note: "Dirsekleri sabitle."}] },
                { id: 2, label: "SAL", title: "Sırt & Biceps", exercises: [{name: "Lat Pulldown", sets: 4, reps: 12, note: "Göğsüne kadar çek."}, {name: "Barbell Curl", sets: 3, reps: 10, note: "Belden güç alma."}] },
                { id: 3, label: "ÇAR", title: "Dinlenme", isRestDay: true, exercises: [] },
                { id: 4, label: "PER", title: "Bacak", exercises: [{name: "Squat", sets: 4, reps: 10, note: "Topuklara bas."}, {name: "Leg Extension", sets: 4, reps: 15, note: "Üst noktada sık."}] },
                { id: 5, label: "CUM", title: "Omuz & Karın", exercises: [{name: "Overhead Press", sets: 4, reps: 8, note: "Karın kaslarını sık."}, {name: "Plank", sets: 3, reps: 60, note: "Düz dur."}] },
                { id: 6, label: "CMT", title: "Aktif Dinlenme", isRestDay: true, exercises: [] },
                { id: 7, label: "PAZ", title: "Full Body", exercises: [{name: "Burpee", sets: 3, reps: 15, note: "Patlayıcı ol."}] }
              ])
            };
          } else {
             return {
              success: true,
              response: JSON.stringify([
                { id: 1, label: "MON", title: "Chest & Triceps", exercises: [{name: "Bench Press", sets: 4, reps: 10, note: "Retract shoulders."}, {name: "Tricep Pushdown", sets: 3, reps: 12, note: "Lock elbows."}] },
                { id: 2, label: "WED", title: "Back & Biceps", exercises: [{name: "Lat Pulldown", sets: 4, reps: 12, note: "Pull to chest."}, {name: "Barbell Curl", sets: 3, reps: 10, note: "Strict form."}] },
                { id: 3, label: "FRI", title: "Legs & Shoulders", exercises: [{name: "Squat", sets: 4, reps: 10, note: "Drive through heels."}, {name: "Overhead Press", sets: 4, reps: 8, note: "Tight core."}] },
                { id: 4, label: "SUN", title: "Active Rest", isRestDay: true, exercises: [] }
              ])
            };
          }
        }
        
        // Regular Chat Mock
        return {
          success: true,
          response: lang === 'tr' 
            ? "Harika bir hedef! Sana bu konuda yardımcı olabilirim. Programını oluşturmak için 'Program oluştur' diyebilirsin veya spesifik sorular sorabilirsin." 
            : "Great goal! I can help you with that. You can say 'Create program' to start building your routine or ask specific questions."
        };
      };
    
      try {
        // Debug: Check if API key is loaded
        if (!GEMINI_API_KEY) {
          console.warn('Gemini API key not found. Using Mock Mode.');
          return await mockFallback();
        }
    
        const systemPrompt = lang === 'tr' 
          ? `Sen PRO VISION fitness uygulamasının yapay zeka antrenörüsün. 
             Türkçe cevap ver. Kısa, öz ve motive edici ol.
             ASLA CÜMLE İÇİNDE YAN YANA YILDIZ (*) KULLANMA.
             Sadece çok önemli kelimeleri **kalın** yap.
             Maddeler için her zaman yeni satır ve tek bir yıldız (*) kullan.
             Kullanıcının fitness hedeflerine ulaşmasına yardım et.`
          : `You are the AI coach of PRO VISION fitness app.
             Reply in English. Be concise, direct and motivating.
             NEVER USE RAW ASTERISKS (*) INSIDE SENTENCES.
             Only use **bold** for major emphasis.
             For lists, always use a new line and a single asterisk (*).`;
    
        const fullPrompt = `${systemPrompt}
    
    User Level: ${context.level || 1}
    Active Days: ${context.activeDays || 0}
    
    User Message: ${prompt}`;
    
        console.log('Calling Gemini API...');
        
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: fullPrompt
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 2048,
              topP: 0.9,
            }
          })
        });
    
        if (!response.ok) {
           console.warn('Gemini API Error, falling back to mock.');
           return await mockFallback();
        }
    
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
        if (!text) throw new Error('Empty response from AI');
    
        return { success: true, response: text };
      } catch (error) {
        console.error('askCoach error:', error);
        return await mockFallback();
      }
    };

/**
 * Summarize a news article with AI
 * @param {string} articleText - The article content
 * @param {string} targetLang - Target language ('tr' or 'en')
 * @returns {Promise<{success: boolean, summary?: string, error?: string}>}
 */
export const summarizeNews = async (articleText, targetLang = 'tr') => {
  const mockSummarize = () => {
    return targetLang === 'tr'
      ? "Bu araştırma, düzenli egzersizin metabolik sağlığı iyileştirdiğini ve uzun ömürlülüğü artırdığını gösteriyor. Özellikle direnç antrenmanları kas kütlesini korumak için kritik öneme sahip."
      : "This research shows that regular exercise improves metabolic health and increases longevity. Resistance training specifically is critical for maintaining muscle mass.";
  };

  try {
    if (!GEMINI_API_KEY) return { success: true, summary: mockSummarize() };

    const langPrompt = targetLang === 'tr'
      ? 'Bu haber makalesini Türkçe olarak 2-3 cümlede özetle. Fitness veya sağlıkla ilgili en önemli noktaları vurgula:'
      : 'Summarize this news article in 2-3 sentences in English. Highlight the most important fitness or health points:';

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${langPrompt}\n\n${articleText}`
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 150,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const summary = data.candidates?.[0]?.content?.parts?.[0]?.text;

    return { success: true, summary: summary || '' };
  } catch (error) {
    console.error('summarizeNews error:', error);
    return { success: false, error: 'Could not summarize article' };
  }
};

/**
 * Translate text to target language
 * @param {string} text - Text to translate
 * @param {string} targetLang - Target language ('tr' or 'en')
 * @returns {Promise<{success: boolean, translation?: string, error?: string}>}
 */
export const translateText = async (text, targetLang = 'tr') => {
  const mockTranslate = (txt) => {
    if (targetLang === 'en') return txt;
    // Simple mock translations for news titles if they match common patterns
    if (txt.toLowerCase().includes('fitness')) return "Fitness Dünyasında Yeni Gelişmeler";
    if (txt.toLowerCase().includes('health')) return "Sağlıklı Yaşam Rehberi";
    if (txt.toLowerCase().includes('nutrition')) return "Beslenme Uzmanlarından Tavsiyeler";
    return "Spor ve Sağlık Haberi"; // Generic fallback for mock
  };

  try {
    if (!GEMINI_API_KEY) return { success: true, translation: mockTranslate(text) };

    const prompt = targetLang === 'tr'
      ? `Translate this text to Turkish. Only output the translation, nothing else:\n\n${text}`
      : `Translate this text to English. Only output the translation, nothing else:\n\n${text}`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 500,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const translation = data.candidates?.[0]?.content?.parts?.[0]?.text;

    return { success: true, translation: translation || text };
  } catch (error) {
    console.error('translateText error:', error);
    return { success: false, error: 'Translation failed', translation: text };
  }
};
