import React, { useRef, useEffect } from 'react';

/**
 * SilkBackground Component
 * Smooth animated gradient background
 */
const SilkBackground = ({
  speed = 3,
  scale = 1,
  color = '#065f46',
  className = ''
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let time = 0;

    // Parse color to RGB
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 6, g: 95, b: 70 };
    };

    const rgb = hexToRgb(color);

    // Resize handler
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Smooth animation loop
    const animate = () => {
      time += speed * 0.0008;
      
      const width = canvas.width;
      const height = canvas.height;
      
      // Clear canvas
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);
      
      // Draw multiple smooth radial gradients
      const drawGradientBlob = (x, y, radius, opacity) => {
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`);
        gradient.addColorStop(0.4, `rgba(${rgb.r}, ${rgb.g + 20}, ${rgb.b + 10}, ${opacity * 0.6})`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      };
      
      // Main blob - slow movement
      const mainX = width * 0.3 + Math.sin(time * 0.5) * width * 0.15 * scale;
      const mainY = height * 0.4 + Math.cos(time * 0.4) * height * 0.15 * scale;
      const mainRadius = Math.max(width, height) * 0.6 * scale;
      drawGradientBlob(mainX, mainY, mainRadius, 0.5);
      
      // Secondary blob - offset movement
      const secX = width * 0.7 + Math.sin(time * 0.3 + 2) * width * 0.1 * scale;
      const secY = height * 0.6 + Math.cos(time * 0.5 + 1) * height * 0.1 * scale;
      const secRadius = Math.max(width, height) * 0.4 * scale;
      drawGradientBlob(secX, secY, secRadius, 0.3);
      
      // Third blob - subtle accent
      const thirdX = width * 0.5 + Math.sin(time * 0.7 + 3) * width * 0.2 * scale;
      const thirdY = height * 0.3 + Math.cos(time * 0.6 + 2) * height * 0.15 * scale;
      const thirdRadius = Math.max(width, height) * 0.35 * scale;
      drawGradientBlob(thirdX, thirdY, thirdRadius, 0.25);

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [speed, scale, color]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 ${className}`}
      style={{ 
        pointerEvents: 'none',
        zIndex: 0
      }}
    />
  );
};

export default SilkBackground;
