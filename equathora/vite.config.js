import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split heavy rarely-changing libraries into their own chunks.
          if (id.includes('/node_modules/mathlive/')) return 'mathlive';
          if (id.includes('/node_modules/react-icons/')) return 'react-icons';
          if (id.includes('/node_modules/framer-motion/')) return 'framer-motion';
          if (id.includes('/node_modules/@supabase/')) return 'supabase';
        },
      }
    },
    chunkSizeWarningLimit: 1500,
    sourcemap: true,
  },
  server: {}
});
