/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Outfit"', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
      },
      colors: {
        // Primary brand colors
        primary: {
          DEFAULT: '#10b981', // emerald-500
          light: '#34d399',   // emerald-400
          dark: '#059669',    // emerald-600
        },
        // Accent colors
        accent: {
          cyan: '#06b6d4',
          orange: '#f97316',
          purple: '#a855f7',
          amber: '#f59e0b',
        },
        // Surface colors (same as current design)
        surface: {
          DEFAULT: 'rgba(20, 20, 20, 0.7)',
          dark: 'rgba(10, 10, 10, 0.85)',
          light: 'rgba(255, 255, 255, 0.03)',
          hover: 'rgba(255, 255, 255, 0.08)',
        },
        // Keep default emerald for backward compatibility
        emerald: {
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        },
        cyan: {
          500: '#06b6d4',
          900: 'rgba(6, 182, 212, 0.2)',
        },
      },
      boxShadow: {
        'glow': '0 0 30px rgba(16, 185, 129, 0.3)',
        'glow-lg': '0 0 40px rgba(16, 185, 129, 0.4)',
        'neon': '0 0 20px rgba(255, 255, 255, 0.3)',
      },
      borderRadius: {
        'card': '40px',
        'panel': '32px',
        'button': '24px',
      },
    },
  },
  plugins: [],
}
