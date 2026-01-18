import React, { useState } from 'react';
import { Crown, Zap, Check, Sparkles, ArrowLeft, CreditCard, Gift } from 'lucide-react';
import GlassPanel from '../components/ui/GlassPanel';

const CREDIT_PACKAGES = [
  { id: 'credits_5', credits: 5, price: 9.99, popular: false },
  { id: 'credits_15', credits: 15, price: 24.99, popular: true, savings: '17%' },
  { id: 'credits_30', credits: 30, price: 44.99, popular: false, savings: '25%' },
];

const SUBSCRIPTION_PLANS = [
  { 
    id: 'daily', 
    name: { tr: 'Günlük', en: 'Daily' },
    price: 2.99,
    period: { tr: 'gün', en: 'day' },
    features: ['unlimited_ai', 'priority_support'],
    color: 'from-blue-500 to-cyan-500'
  },
  { 
    id: 'weekly', 
    name: { tr: 'Haftalık', en: 'Weekly' },
    price: 14.99,
    period: { tr: 'hafta', en: 'week' },
    features: ['unlimited_ai', 'priority_support', 'exclusive_templates'],
    popular: true,
    savings: '28%',
    color: 'from-purple-500 to-pink-500'
  },
  { 
    id: 'monthly', 
    name: { tr: 'Aylık', en: 'Monthly' },
    price: 39.99,
    period: { tr: 'ay', en: 'month' },
    features: ['unlimited_ai', 'priority_support', 'exclusive_templates', 'early_access'],
    savings: '55%',
    color: 'from-amber-500 to-orange-500'
  },
];

const FEATURES = {
  unlimited_ai: { tr: 'Sınırsız AI Program Oluşturma', en: 'Unlimited AI Program Creation' },
  priority_support: { tr: 'Öncelikli Destek', en: 'Priority Support' },
  exclusive_templates: { tr: 'Özel Antrenman Şablonları', en: 'Exclusive Workout Templates' },
  early_access: { tr: 'Yeni Özelliklere Erken Erişim', en: 'Early Access to New Features' },
};

const PremiumView = ({ t, lang, profile, onBack }) => {
  const [selectedTab, setSelectedTab] = useState('subscription'); // 'subscription' or 'credits'
  const credits = profile?.credits ?? 0;
  const isPremium = profile?.isPremium || false;

  const handlePurchase = (item, type) => {
    // Placeholder for payment integration
    alert(lang === 'tr' 
      ? `Ödeme entegrasyonu yakında! ${type === 'subscription' ? item.name[lang] : item.credits + ' Kredi'} seçildi.`
      : `Payment integration coming soon! Selected: ${type === 'subscription' ? item.name[lang] : item.credits + ' Credits'}`
    );
  };

  return (
    <div className="px-4 pt-24 pb-32 animate-enter max-w-lg lg:max-w-2xl mx-auto min-h-screen">
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        <span className="text-sm font-bold">{lang === 'tr' ? 'Geri' : 'Back'}</span>
      </button>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 mx-auto mb-4 flex items-center justify-center shadow-lg shadow-amber-500/30">
          <Crown size={32} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">
          {lang === 'tr' ? 'Premium\'a Yükselt' : 'Upgrade to Premium'}
        </h1>
        <p className="text-sm text-gray-400">
          {lang === 'tr' 
            ? 'Sınırsız AI özellikleri ve özel avantajlar' 
            : 'Unlimited AI features and exclusive benefits'}
        </p>
        
        {/* Current Credits */}
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
          <Zap size={16} className={credits > 0 ? 'text-emerald-400' : 'text-gray-500'} />
          <span className="text-sm font-bold text-white">
            {lang === 'tr' ? `Mevcut Kredin: ${credits}` : `Current Credits: ${credits}`}
          </span>
        </div>
      </div>

      {/* Tab Selector */}
      <div className="flex justify-center mb-8">
        <div className="liquid-glass-dark p-1.5 rounded-2xl flex">
          <button 
            onClick={() => setSelectedTab('subscription')} 
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              selectedTab === 'subscription' ? 'bg-white text-black' : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Crown size={14} /> {lang === 'tr' ? 'Abonelik' : 'Subscription'}
          </button>
          <button 
            onClick={() => setSelectedTab('credits')} 
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              selectedTab === 'credits' ? 'bg-white text-black' : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Zap size={14} /> {lang === 'tr' ? 'Kredi Satın Al' : 'Buy Credits'}
          </button>
        </div>
      </div>

      {/* Content */}
      {selectedTab === 'subscription' ? (
        <div className="space-y-4">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <GlassPanel 
              key={plan.id}
              className={`p-5 rounded-2xl relative overflow-hidden ${plan.popular ? 'border-2 border-purple-500/50' : ''}`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[9px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl">
                  {lang === 'tr' ? 'En Popüler' : 'Most Popular'}
                </div>
              )}
              
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    {plan.name[lang]}
                    {plan.savings && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                        -{plan.savings}
                      </span>
                    )}
                  </h3>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-bold text-white">${plan.price}</span>
                    <span className="text-xs text-gray-500">/ {plan.period[lang]}</span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center`}>
                  <Sparkles size={20} className="text-white" />
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2 mb-4">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm text-gray-300">
                    <Check size={14} className="text-emerald-400" />
                    {FEATURES[feature][lang]}
                  </div>
                ))}
              </div>

              {/* Buy Button */}
              <button 
                onClick={() => handlePurchase(plan, 'subscription')}
                className={`w-full py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all ${
                  plan.popular 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {lang === 'tr' ? 'Satın Al' : 'Subscribe'}
              </button>
            </GlassPanel>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Credits Info */}
          <div className="text-center mb-6">
            <p className="text-xs text-gray-500">
              {lang === 'tr' 
                ? '1 Kredi = 1 AI Program Oluşturma' 
                : '1 Credit = 1 AI Program Generation'}
            </p>
          </div>

          {CREDIT_PACKAGES.map((pkg) => (
            <GlassPanel 
              key={pkg.id}
              className={`p-5 rounded-2xl relative ${pkg.popular ? 'border-2 border-emerald-500/50' : ''}`}
            >
              {/* Popular Badge */}
              {pkg.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-[9px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl">
                  {lang === 'tr' ? 'En Değerli' : 'Best Value'}
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center border border-amber-500/30">
                    <div className="text-center">
                      <Zap size={18} className="text-amber-400 mx-auto" />
                      <span className="text-lg font-bold text-white">{pkg.credits}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      {pkg.credits} {lang === 'tr' ? 'Kredi' : 'Credits'}
                      {pkg.savings && (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                          -{pkg.savings}
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-gray-500">
                      ${(pkg.price / pkg.credits).toFixed(2)} / {lang === 'tr' ? 'kredi' : 'credit'}
                    </p>
                  </div>
                </div>
                
                <button 
                  onClick={() => handlePurchase(pkg, 'credits')}
                  className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                    pkg.popular 
                      ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/30' 
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  ${pkg.price}
                </button>
              </div>
            </GlassPanel>
          ))}

          {/* Gift Banner */}
          <GlassPanel className="p-4 rounded-2xl mt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Gift size={20} className="text-purple-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-white">
                  {lang === 'tr' ? 'Arkadaşına Hediye Et!' : 'Gift to a Friend!'}
                </h4>
                <p className="text-xs text-gray-500">
                  {lang === 'tr' ? 'Yakında...' : 'Coming soon...'}
                </p>
              </div>
            </div>
          </GlassPanel>
        </div>
      )}

      {/* Footer Note */}
      <div className="mt-8 text-center">
        <p className="text-[10px] text-gray-600">
          {lang === 'tr' 
            ? 'Tüm ödemeler güvenli şekilde işlenir. İstediğiniz zaman iptal edebilirsiniz.' 
            : 'All payments are processed securely. Cancel anytime.'}
        </p>
      </div>
    </div>
  );
};

export default PremiumView;
