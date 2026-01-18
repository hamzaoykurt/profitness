import React from 'react';
import { X, Crown, Sparkles } from 'lucide-react';

/**
 * CreditModal - Shows when user runs out of AI credits
 */
const CreditModal = ({ isOpen, onClose, lang, onNavigateToPremium }) => {
  if (!isOpen) return null;

  const handleUpgrade = () => {
    onClose();
    if (onNavigateToPremium) {
      onNavigateToPremium();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative liquid-glass-dark rounded-3xl p-8 max-w-sm w-full text-center">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
        
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 mx-auto mb-6 flex items-center justify-center shadow-lg shadow-amber-500/30">
          <Crown size={32} className="text-white" />
        </div>
        
        {/* Title */}
        <h2 className="text-xl font-bold text-white mb-2">
          {lang === 'tr' ? 'Deneme Hakların Bitti!' : 'Trial Credits Exhausted!'}
        </h2>
        
        {/* Description */}
        <p className="text-sm text-gray-400 mb-6">
          {lang === 'tr' 
            ? 'Ücretsiz AI kredilerin bitti. Sınırsız erişim için Premium üyeliğe geç.' 
            : 'Your free AI credits are used up. Upgrade to Premium for unlimited access.'}
        </p>
        
        {/* Features */}
        <div className="space-y-2 mb-6 text-left">
          {[
            lang === 'tr' ? 'Sınırsız AI Program Oluşturma' : 'Unlimited AI Program Creation',
            lang === 'tr' ? 'Öncelikli Destek' : 'Priority Support',
            lang === 'tr' ? 'Özel Antrenman Şablonları' : 'Exclusive Workout Templates'
          ].map((feature, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
              <Sparkles size={14} className="text-amber-400" />
              {feature}
            </div>
          ))}
        </div>
        
        {/* Premium Button */}
        <button 
          className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-sm uppercase tracking-wider shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-shadow"
          onClick={handleUpgrade}
        >
          {lang === 'tr' ? 'Premium\'a Geç' : 'Upgrade to Premium'}
        </button>
        
        {/* Manual option */}
        <p className="text-xs text-gray-500 mt-4">
          {lang === 'tr' 
            ? 'Veya manuel olarak program oluşturmaya devam et (ücretsiz)' 
            : 'Or continue creating programs manually (free)'}
        </p>
      </div>
    </div>
  );
};

export default CreditModal;
