import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  base: './', // Ajustado para funcionar tanto localmente quanto no GitHub Pages
  server: {
    host: true,
    port: 5173,
  },
});