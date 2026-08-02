import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'url';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Rewrite manualChunks as a function
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('mathlive')) return 'mathlive';
            if (id.includes('react-icons')) return 'react-icons';
            if (id.includes('framer-motion')) return 'framer-motion';
            if (id.includes('@supabase/supabase-js')) return 'supabase';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1500,
    sourcemap: true,
  },
  server: {},
});