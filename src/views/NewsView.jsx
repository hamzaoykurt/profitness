import React, { useState, useEffect } from 'react';
import { BrainCircuit, Dumbbell, Heart, Apple, Grid, ExternalLink, Loader2, X } from 'lucide-react';
import { fetchNews, NEWS_CATEGORIES, openNewsLink } from '../services/newsService';
import { summarizeNews } from '../services/geminiService';

const CategoryIcon = ({ name, size = 14 }) => {
  const icons = {
    Grid: <Grid size={size} />,
    Dumbbell: <Dumbbell size={size} />,
    Heart: <Heart size={size} />,
    Apple: <Apple size={size} />
  };
  return icons[name] || <Grid size={size} />;
};

const NewsView = ({ t, lang }) => {
  const [activeNewsIndex, setActiveNewsIndex] = useState(0);
  const [news, setNews] = useState([]);
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  
  // AI Analysis State
  const [expandedNews, setExpandedNews] = useState({}); // { [id]: { loading: boolean, summary: string } }

  // Fetch news on mount and when category/lang changes
  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);
      const data = await fetchNews(category, lang);
      setNews(data);
      setActiveNewsIndex(0);
      setLoading(false);
    };
    loadNews();
  }, [category, lang]);

  // Auto-rotate news every 6 seconds
  useEffect(() => {
    if (news.length === 0) return;
    
    const interval = setInterval(() => {
      setActiveNewsIndex((prev) => (prev + 1) % Math.min(news.length, 8));
    }, 6000);
    
    return () => clearInterval(interval);
  }, [news.length]);

  const handleReadMore = (e, link) => {
    e.stopPropagation();
    openNewsLink(link);
  };

  const handleToggleAnalysis = async (e, newsItem, index) => {
    e.stopPropagation();
    
    // If already open, close it
    if (expandedNews[index]) {
      setExpandedNews(prev => {
        const newState = { ...prev };
        delete newState[index];
        return newState;
      });
      return;
    }

    // Open and load
    setExpandedNews(prev => ({
      ...prev,
      [index]: { loading: true, summary: '' }
    }));

    const result = await summarizeNews(newsItem.desc + ' ' + newsItem.title, lang);
    
    setExpandedNews(prev => ({
      ...prev,
      [index]: {
        loading: false,
        summary: result.success ? result.summary : (lang === 'tr' ? 'Analiz yüklenemedi.' : 'Could not load analysis.')
      }
    }));
  };

  return (
    <div className="px-3 sm:px-4 pt-28 sm:pt-32 pb-28 sm:pb-32 animate-enter max-w-lg lg:max-w-4xl xl:max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6 px-2">
        <div className="flex items-center justify-between">
          <h2 className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em] mb-2 animate-pulse">
            {t.live_news}
          </h2>
          <div className="flex items-center gap-3">
            {!loading && (
              <span className="text-[10px] text-gray-500">
                {news.length} {lang === 'tr' ? 'haber' : 'articles'}
              </span>
            )}
            <span className="text-[10px] text-gray-500 font-mono flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              LIVE
            </span>
          </div>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight font-display">
          {t.live_news_sub}
        </h1>
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar px-2">
        {Object.entries(NEWS_CATEGORIES).map(([key, cat]) => (
          <button
            key={key}
            onClick={() => setCategory(key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
              category === key
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'
            }`}
          >
            <CategoryIcon name={cat.icon} size={14} />
            {cat.label[lang]}
          </button>
        ))}
      </div>
      
      {/* News Cards */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <Loader2 size={32} className="text-emerald-400 animate-spin" />
          <span className="text-sm text-gray-500">
            {lang === 'tr' ? 'Haberler yükleniyor...' : 'Loading news...'}
          </span>
        </div>
      ) : news.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          {lang === 'tr' ? 'Haber bulunamadı' : 'No news found'}
        </div>
      ) : (
        <div className="space-y-6 lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-6 lg:space-y-0">
          {news.slice(0, 12).map((n, i) => {
            const isExpanded = !!expandedNews[i];
            const analysis = expandedNews[i];

            return (
              <div 
                key={i} 
                className={`group relative w-full rounded-[32px] overflow-hidden cursor-pointer border border-white/5 transition-all duration-500 ${
                  i === activeNewsIndex 
                    ? 'ring-2 ring-emerald-500/40 shadow-2xl shadow-emerald-500/10' 
                    : 'hover:ring-1 hover:ring-white/20'
                } ${isExpanded ? 'h-auto min-h-[400px]' : 'h-[340px] lg:h-[380px]'}`}
                onClick={() => setActiveNewsIndex(i)}
              >
                {/* Background Image & Gradient */}
                <div className="absolute inset-0">
                  <img 
                    src={n.image} 
                    alt={n.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                </div>

                {/* Content Container (Flex) */}
                <div className="relative z-10 flex flex-col h-full justify-between pointer-events-none">
                  
                  {/* Top Header */}
                  <div className="p-5 flex justify-between items-start">
                    {/* Category Badge */}
                    <span className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white border border-white/10 flex items-center gap-1.5">
                      <CategoryIcon name={NEWS_CATEGORIES[n.category]?.icon || 'Grid'} size={12} />
                      <span>{NEWS_CATEGORIES[n.category]?.label[lang] || n.category}</span>
                    </span>

                    {/* Read More Button */}
                    {n.link && n.link !== '#' && (
                      <button
                        onClick={(e) => handleReadMore(e, n.link)}
                        className="bg-white/10 backdrop-blur-md p-2.5 rounded-full text-white border border-white/10 hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100 pointer-events-auto"
                        title={lang === 'tr' ? 'Haberi Oku' : 'Read Article'}
                      >
                        <ExternalLink size={16} />
                      </button>
                    )}
                  </div>

                  {/* Bottom Content */}
                  <div className={`p-6 lg:p-7 transform transition-transform duration-500 ${!isExpanded && 'group-hover:translate-y-[-8px]'}`}>
                    <h3 className="text-xl lg:text-2xl font-black text-white mb-2 font-display line-clamp-2">{n.title}</h3>
                    <p className={`text-sm text-gray-300 mb-4 ${isExpanded ? '' : 'line-clamp-2'}`}>{n.desc}</p>
                    
                    {/* AI Analysis Section */}
                    <div className="pointer-events-auto">
                      <button
                        onClick={(e) => handleToggleAnalysis(e, n, i)}
                        className={`w-full py-3 backdrop-blur-md rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all border ${
                          isExpanded 
                            ? 'bg-emerald-500 text-black border-emerald-500' 
                            : 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-400 border-emerald-500/30 hover:border-emerald-500/50'
                        }`}
                      >
                        <BrainCircuit size={16} />
                        {lang === 'tr' ? (isExpanded ? 'Analizi Kapat' : 'AI Analiz') : (isExpanded ? 'Close Analysis' : 'AI Analysis')}
                      </button>
                      
                      {isExpanded && (
                        <div className="mt-3 bg-black/60 backdrop-blur-xl rounded-xl p-4 border border-emerald-500/20 text-left animate-in fade-in slide-in-from-top-2">
                          <div className="flex items-center gap-2 mb-2 text-emerald-400">
                             <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_5px_currentColor]"></span>
                             <span className="text-[10px] font-bold uppercase tracking-wider">{lang === 'tr' ? 'GEMINI ANALİZİ' : 'GEMINI ANALYSIS'}</span>
                          </div>
                          {analysis.loading ? (
                            <div className="flex justify-center py-4">
                              <Loader2 size={24} className="text-emerald-400 animate-spin" />
                            </div>
                          ) : (
                            <p className="text-xs text-gray-200 leading-relaxed font-medium">
                              {analysis.summary}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NewsView;
