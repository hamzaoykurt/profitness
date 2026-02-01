/**
 * News Service
 * Fetches news from multiple RSS feeds via rss2json proxy
 * Includes AI translation support
 */

const RSS2JSON_API = 'https://api.rss2json.com/v1/api.json';

// Expanded RSS Feed Sources - more variety
const RSS_FEEDS = {
  fitness: [
    'https://www.bodybuilding.com/rss/articles',
    'https://breakingmuscle.com/feed/',
    'https://www.t-nation.com/feed/',
    'https://www.muscleandfitness.com/feed/'
  ],
  health: [
    'https://rss.nytimes.com/services/xml/rss/nyt/Health.xml',
    'https://www.medicalnewstoday.com/rss/rss.xml',
    'https://www.health.harvard.edu/blog/feed',
    'https://feeds.webmd.com/rss/rss.aspx?RSSSource=RSS_PUBLIC'
  ],
  nutrition: [
    'https://www.healthline.com/rss/nutrition',
    'https://www.eatingwell.com/feed/',
    'https://www.nutritioninsight.com/rss-feeds/all-news.xml'
  ]
};

// Category placeholder images
const CATEGORY_IMAGES = {
  fitness: [
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800&auto=format&fit=crop'
  ],
  health: [
    'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop'
  ],
  nutrition: [
    'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=800&auto=format&fit=crop'
  ]
};

// Expanded static fallback news - 20 articles
const FALLBACK_NEWS = {
  tr: [
    { title: "2025: Cold Fitness Trendi", desc: "Soğuk antrenmanlar zirvede.", image: CATEGORY_IMAGES.fitness[0], category: 'fitness', aiSummary: "Soğuk şok proteinleri kas onarımını %40 hızlandırıyor.", link: 'https://google.com/search?q=cold+fitness' },
    { title: "Biohacking Zirvesi", desc: "Yeni nesil giyilebilir teknolojiler.", image: CATEGORY_IMAGES.health[0], category: 'health', aiSummary: "Sürekli glikoz takibi ile enerji yönetimini optimize et.", link: 'https://google.com/search?q=biohacking' },
    { title: "Neuro-Training", desc: "Zihin ve kas bağlantısı.", image: CATEGORY_IMAGES.fitness[1], category: 'fitness', aiSummary: "Nöro-feedback antrenmanları popülerleşiyor.", link: 'https://google.com/search?q=neuro+training' },
    { title: "Protein Timing Miti", desc: "Anabolik pencere sorgulanıyor.", image: CATEGORY_IMAGES.nutrition[0], category: 'nutrition', aiSummary: "Günlük toplam protein alımı daha önemli.", link: 'https://google.com/search?q=protein+timing' },
    { title: "HIIT vs Steady State", desc: "Kardio savaşlarında yeni bulgular.", image: CATEGORY_IMAGES.fitness[2], category: 'fitness', aiSummary: "HIIT yağ yakımında %25 daha etkili.", link: 'https://google.com/search?q=hiit+vs+steady+state' },
    { title: "Creatine: Bilimin Suplementi", desc: "Kreatin hakkında her şey.", image: CATEGORY_IMAGES.nutrition[1], category: 'nutrition', aiSummary: "Günlük 5g kreatin kas gücünü %15 artırıyor.", link: 'https://google.com/search?q=creatine+benefits' },
    { title: "Uyku Optimizasyonu", desc: "Uyku kalitesi nasıl artırılır?", image: CATEGORY_IMAGES.health[1], category: 'health', aiSummary: "7-9 saat uyku testosteron için kritik.", link: 'https://google.com/search?q=sleep+optimization' },
    { title: "Zone 2 Cardio", desc: "Düşük yoğunluklu kardiyonun faydaları.", image: CATEGORY_IMAGES.fitness[0], category: 'fitness', aiSummary: "Haftada 3 saat Zone 2 mitokondri artırır.", link: 'https://google.com/search?q=zone+2+cardio' },
    { title: "Gut-Brain Bağlantısı", desc: "Bağırsak ve mental performans.", image: CATEGORY_IMAGES.health[2], category: 'health', aiSummary: "Probiyotikler ruh hali ve odaklanmayı etkiliyor.", link: 'https://google.com/search?q=gut+brain+connection' },
    { title: "Mobility > Flexibility", desc: "Fonksiyonel hareket kabiliyeti.", image: CATEGORY_IMAGES.fitness[1], category: 'fitness', aiSummary: "Dinamik mobility sakatlık riskini %50 azaltıyor.", link: 'https://google.com/search?q=mobility+training' },
    { title: "Ketojenik Diyet 2025", desc: "Keto diet yeni araştırmalar.", image: CATEGORY_IMAGES.nutrition[2], category: 'nutrition', aiSummary: "Beyin sağlığı için ketojenik beslenme araştırılıyor.", link: 'https://google.com/search?q=keto+diet+2025' },
    { title: "Mindfulness ve Kas Gelişimi", desc: "Meditasyon antrenmanı geliştirir.", image: CATEGORY_IMAGES.health[0], category: 'health', aiSummary: "10 dakika meditasyon kortizolü %25 düşürüyor.", link: 'https://google.com/search?q=mindfulness+muscle' },
    { title: "Compound vs Isolation", desc: "Hangi hareketler daha etkili?", image: CATEGORY_IMAGES.fitness[2], category: 'fitness', aiSummary: "Compound hareketler hormon yanıtını artırıyor.", link: 'https://google.com/search?q=compound+vs+isolation' },
    { title: "Omega-3 Yeniden Gündemde", desc: "Balık yağı faydaları.", image: CATEGORY_IMAGES.nutrition[0], category: 'nutrition', aiSummary: "Günlük 2g omega-3 iltihabı azaltıyor.", link: 'https://google.com/search?q=omega+3+benefits' },
    { title: "Deload Haftası Neden Önemli?", desc: "Dinlenme dönemleri.", image: CATEGORY_IMAGES.fitness[0], category: 'fitness', aiSummary: "4-6 haftada bir deload aşırı antrenmanı önlüyor.", link: 'https://google.com/search?q=deload+week' },
    { title: "İntermittent Fasting Gerçekleri", desc: "IF doğrular ve yanlışlar.", image: CATEGORY_IMAGES.nutrition[1], category: 'nutrition', aiSummary: "16:8 IF insülin duyarlılığını artırıyor.", link: 'https://google.com/search?q=intermittent+fasting' },
    { title: "Stretching: Önce mi Sonra mı?", desc: "Esneme zamanlaması.", image: CATEGORY_IMAGES.fitness[1], category: 'fitness', aiSummary: "Dinamik stretching antrenmandan önce, statik sonra.", link: 'https://google.com/search?q=stretching+before+after' },
    { title: "Vitamin D Eksikliği", desc: "Güneş vitamini önemi.", image: CATEGORY_IMAGES.health[1], category: 'health', aiSummary: "Vitamin D eksikliği kas gücünü %20 azaltıyor.", link: 'https://google.com/search?q=vitamin+d+deficiency' },
    { title: "Pre-Workout Gerçekleri", desc: "Kafein ve performans.", image: CATEGORY_IMAGES.nutrition[2], category: 'nutrition', aiSummary: "200mg kafein egzersiz performansını %10 artırıyor.", link: 'https://google.com/search?q=pre+workout+supplements' },
    { title: "Recovery Teknikleri 2025", desc: "Modern toparlanma yöntemleri.", image: CATEGORY_IMAGES.health[2], category: 'health', aiSummary: "Kontrast duşlar DOMS'u %30 azaltıyor.", link: 'https://google.com/search?q=recovery+techniques' }
  ],
  en: [
    { title: "2025: Cold Fitness Trend", desc: "Cold training at the peak.", image: CATEGORY_IMAGES.fitness[0], category: 'fitness', aiSummary: "Cold shock proteins accelerate muscle repair by 40%.", link: 'https://google.com/search?q=cold+fitness' },
    { title: "Biohacking Summit", desc: "Next-gen wearable technologies.", image: CATEGORY_IMAGES.health[0], category: 'health', aiSummary: "Optimize energy with continuous glucose monitoring.", link: 'https://google.com/search?q=biohacking' },
    { title: "Neuro-Training", desc: "Mind and muscle connection.", image: CATEGORY_IMAGES.fitness[1], category: 'fitness', aiSummary: "Neuro-feedback training gaining popularity.", link: 'https://google.com/search?q=neuro+training' },
    { title: "Protein Timing Myth", desc: "Anabolic window questioned.", image: CATEGORY_IMAGES.nutrition[0], category: 'nutrition', aiSummary: "Daily total protein intake matters more.", link: 'https://google.com/search?q=protein+timing' },
    { title: "HIIT vs Steady State", desc: "New findings in cardio wars.", image: CATEGORY_IMAGES.fitness[2], category: 'fitness', aiSummary: "HIIT is 25% more effective for fat burning.", link: 'https://google.com/search?q=hiit+vs+steady+state' },
    { title: "Creatine: The Proven One", desc: "Everything about creatine.", image: CATEGORY_IMAGES.nutrition[1], category: 'nutrition', aiSummary: "5g daily creatine increases strength by 15%.", link: 'https://google.com/search?q=creatine+benefits' },
    { title: "Sleep Optimization", desc: "How to improve sleep quality?", image: CATEGORY_IMAGES.health[1], category: 'health', aiSummary: "7-9 hours critical for testosterone.", link: 'https://google.com/search?q=sleep+optimization' },
    { title: "Zone 2 Cardio Revolution", desc: "Benefits of low-intensity cardio.", image: CATEGORY_IMAGES.fitness[0], category: 'fitness', aiSummary: "3 hours weekly Zone 2 increases mitochondria.", link: 'https://google.com/search?q=zone+2+cardio' },
    { title: "Gut-Brain Connection", desc: "Microbiome and mental performance.", image: CATEGORY_IMAGES.health[2], category: 'health', aiSummary: "Probiotics affect mood and focus.", link: 'https://google.com/search?q=gut+brain+connection' },
    { title: "Mobility > Flexibility", desc: "Functional movement capability.", image: CATEGORY_IMAGES.fitness[1], category: 'fitness', aiSummary: "Dynamic mobility reduces injury risk by 50%.", link: 'https://google.com/search?q=mobility+training' },
    { title: "Ketogenic Diet 2025", desc: "Keto diet new research.", image: CATEGORY_IMAGES.nutrition[2], category: 'nutrition', aiSummary: "Ketogenic nutrition studied for brain health.", link: 'https://google.com/search?q=keto+diet+2025' },
    { title: "Mindfulness and Muscle", desc: "Meditation improves training.", image: CATEGORY_IMAGES.health[0], category: 'health', aiSummary: "10 minutes meditation reduces cortisol by 25%.", link: 'https://google.com/search?q=mindfulness+muscle' },
    { title: "Compound vs Isolation", desc: "Which exercises are more effective?", image: CATEGORY_IMAGES.fitness[2], category: 'fitness', aiSummary: "Compound movements increase hormonal response.", link: 'https://google.com/search?q=compound+vs+isolation' },
    { title: "Omega-3 Back in Focus", desc: "Fish oil benefits.", image: CATEGORY_IMAGES.nutrition[0], category: 'nutrition', aiSummary: "2g daily omega-3 reduces inflammation.", link: 'https://google.com/search?q=omega+3+benefits' },
    { title: "Why Deload Week Matters", desc: "Rest periods importance.", image: CATEGORY_IMAGES.fitness[0], category: 'fitness', aiSummary: "Deload every 4-6 weeks prevents overtraining.", link: 'https://google.com/search?q=deload+week' },
    { title: "Intermittent Fasting Facts", desc: "IF truths and myths.", image: CATEGORY_IMAGES.nutrition[1], category: 'nutrition', aiSummary: "16:8 IF improves insulin sensitivity.", link: 'https://google.com/search?q=intermittent+fasting' },
    { title: "Stretching: Before or After?", desc: "Flexibility timing.", image: CATEGORY_IMAGES.fitness[1], category: 'fitness', aiSummary: "Dynamic before workout, static after.", link: 'https://google.com/search?q=stretching+before+after' },
    { title: "Vitamin D Deficiency", desc: "Sunshine vitamin importance.", image: CATEGORY_IMAGES.health[1], category: 'health', aiSummary: "Vitamin D deficiency reduces muscle strength by 20%.", link: 'https://google.com/search?q=vitamin+d+deficiency' },
    { title: "Pre-Workout Facts", desc: "Caffeine and performance.", image: CATEGORY_IMAGES.nutrition[2], category: 'nutrition', aiSummary: "200mg caffeine boosts exercise performance by 10%.", link: 'https://google.com/search?q=pre+workout+supplements' },
    { title: "Recovery Techniques 2025", desc: "Modern recovery methods.", image: CATEGORY_IMAGES.health[2], category: 'health', aiSummary: "Contrast showers reduce DOMS by 30%.", link: 'https://google.com/search?q=recovery+techniques' }
  ]
};

// Category definitions
export const NEWS_CATEGORIES = {
  all: { label: { tr: 'Tümü', en: 'All' }, icon: 'Grid' },
  fitness: { label: { tr: 'Fitness', en: 'Fitness' }, icon: 'Dumbbell' },
  health: { label: { tr: 'Sağlık', en: 'Health' }, icon: 'Heart' },
  nutrition: { label: { tr: 'Beslenme', en: 'Nutrition' }, icon: 'Apple' }
};

/**
 * Detect category from text
 */
const detectCategory = (text) => {
  const lowerText = (text || '').toLowerCase();
  if (lowerText.includes('nutrition') || lowerText.includes('diet') || lowerText.includes('food') || lowerText.includes('protein') || lowerText.includes('vitamin') || lowerText.includes('supplement')) {
    return 'nutrition';
  }
  if (lowerText.includes('health') || lowerText.includes('medical') || lowerText.includes('sleep') || lowerText.includes('mental') || lowerText.includes('recovery') || lowerText.includes('wellness')) {
    return 'health';
  }
  return 'fitness';
};

/**
 * Get random image for category
 */
const getRandomCategoryImage = (category) => {
  const images = CATEGORY_IMAGES[category] || CATEGORY_IMAGES.fitness;
  return images[Math.floor(Math.random() * images.length)];
};

/**
 * Fetch RSS feed via rss2json proxy
 */
const fetchRSSFeed = async (feedUrl) => {
  try {
    const response = await fetch(`${RSS2JSON_API}?rss_url=${encodeURIComponent(feedUrl)}&count=10`);
    if (!response.ok) throw new Error('RSS fetch failed');
    
    const data = await response.json();
    
    if (data.status !== 'ok' || !data.items) {
      throw new Error('Invalid RSS response');
    }
    
    return data.items.map(item => {
      const category = detectCategory(item.title + ' ' + (item.description || ''));
      return {
        title: item.title || 'Untitled',
        desc: item.description?.replace(/<[^>]*>/g, '').slice(0, 120) + '...' || '',
        image: item.enclosure?.link || item.thumbnail || getRandomCategoryImage(category),
        pubDate: item.pubDate || new Date().toISOString(),
        category: category,
        aiSummary: item.description?.replace(/<[^>]*>/g, '').slice(0, 150) || 'No summary available.',
        link: item.link || '#'
      };
    });
  } catch (error) {
    console.error(`RSS fetch error for ${feedUrl}:`, error.message);
    return [];
  }
};

import { translateText, summarizeNews } from './geminiService';

/**
 * Fetch news from multiple RSS feeds by category
 */
export const fetchNews = async (category = 'all', lang = 'tr') => {
  try {
    let feeds = [];
    
    // Select feeds based on category
    if (category === 'all') {
      feeds = [...RSS_FEEDS.fitness, ...RSS_FEEDS.health, ...RSS_FEEDS.nutrition];
    } else {
      feeds = RSS_FEEDS[category] || RSS_FEEDS.fitness;
    }
    
    // Fetch from all selected feeds (limit to 3 for speed when translating)
    const selectedFeeds = feeds.slice(0, 3);
    const allResults = await Promise.all(
      selectedFeeds.map(feed => fetchRSSFeed(feed))
    );
    
    // Flatten and combine results
    let news = allResults.flat();
    
    // Remove duplicates by title
    const seen = new Set();
    news = news.filter(item => {
      const key = item.title.toLowerCase().slice(0, 30);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // If RSS failed or returned too few, use fallback
    if (news.length < 3) {
      let fallback = FALLBACK_NEWS[lang] || FALLBACK_NEWS.tr;
      if (category !== 'all') {
        fallback = fallback.filter(n => n.category === category);
      }
      news = [...news, ...fallback];
    }
    
    // Sort by date (newest first)
    news.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
    
    // Take top 12
    let finalNews = news.slice(0, 12);

    // AI Translation & Summarization (Only if TR and not already fallback)
    if (lang === 'tr') {
      finalNews = await Promise.all(finalNews.map(async (item) => {
        // Skip if it looks like Turkish already (fallback items)
        const isTurkish = /[çğıöşü]/i.test(item.title);
        if (isTurkish) return item;

        // Translate Title
        const transResult = await translateText(item.title, 'tr');
        // Generate AI Analysis
        const summaryResult = await summarizeNews(item.desc, 'tr');

        return {
          ...item,
          title: transResult.success ? transResult.translation : item.title,
          aiSummary: summaryResult.success ? summaryResult.summary : item.aiSummary
        };
      }));
    }
    
    return finalNews;
  } catch (error) {
    console.error('fetchNews error:', error);
    return FALLBACK_NEWS[lang] || FALLBACK_NEWS.tr;
  }
};

/**
 * Open news link in new tab
 */
export const openNewsLink = (url) => {
  if (url && url !== '#') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
};
