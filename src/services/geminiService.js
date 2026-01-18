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
  try {
    // Debug: Check if API key is loaded
    if (!GEMINI_API_KEY) {
      console.error('Gemini API key not found in environment');
      return { 
        success: false, 
        error: lang === 'tr' 
          ? 'API anahtarı bulunamadı. Lütfen .env dosyasını kontrol edin.' 
          : 'API key not found. Please check .env file.'
      };
    }

    const systemPrompt = lang === 'tr' 
      ? `Sen PRO VISION fitness uygulamasının yapay zeka antrenörüsün. 
         Türkçe cevap ver. Kısa, öz ve motive edici ol.
         Kullanıcının fitness hedeflerine ulaşmasına yardım et.
         Bilimsel temelli tavsiyeler ver ama sade bir dille açıkla.
         Emoji kullanabilirsin ama az kullan.`
      : `You are the AI coach of PRO VISION fitness app.
         Reply in English. Be concise, direct and motivating.
         Help users achieve their fitness goals.
         Give science-based advice in simple language.
         You can use emojis but sparingly.`;

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
      const errorData = await response.json().catch(() => ({}));
      console.error('Gemini API error:', response.status, errorData);
      throw new Error(`API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('Gemini response received:', data.candidates?.length > 0 ? 'success' : 'empty');
    
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('Empty response from AI');
    }

    return { success: true, response: text };
  } catch (error) {
    console.error('askCoach error:', error);
    return { 
      success: false, 
      error: lang === 'tr' 
        ? `AI hatası: ${error.message}` 
        : `AI error: ${error.message}`
    };
  }
};

/**
 * Summarize a news article with AI
 * @param {string} articleText - The article content
 * @param {string} targetLang - Target language ('tr' or 'en')
 * @returns {Promise<{success: boolean, summary?: string, error?: string}>}
 */
export const summarizeNews = async (articleText, targetLang = 'tr') => {
  try {
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
  try {
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
