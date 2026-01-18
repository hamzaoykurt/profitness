import React from 'react';

/**
 * GlassPanel Component
 * Reusable glassmorphism container with liquid glass variants
 * 
 * @param {string} variant - 'default' | 'liquid' | 'subtle' | 'dark'
 */
const GlassPanel = ({ children, className = '', variant = 'default', ...props }) => {
  const variants = {
    default: 'glass-panel',
    liquid: 'liquid-glass',
    subtle: 'liquid-glass-subtle',
    dark: 'liquid-glass-dark'
  };

  const baseClass = variants[variant] || variants.default;

  return (
    <div 
      className={`${baseClass} rounded-[24px] overflow-hidden ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassPanel;
