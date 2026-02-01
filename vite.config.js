import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],


  // ÖNEMLİ: Bu ayar, dosyaların relative path (./) ile yüklenmesini sağlar.
  // Electron ve Mobil için KRİTİK bir ayardır.
  base: './', 
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
})