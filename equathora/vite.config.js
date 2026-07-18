import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(projectRoot, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Vite 8's Rolldown build accepts the function form of manualChunks.
        manualChunks(id) {
          if (id.includes('/node_modules/mathlive/')) return 'mathlive';
          if (id.includes('/node_modules/react-icons/')) return 'react-icons';
          if (id.includes('/node_modules/framer-motion/')) return 'framer-motion';
          if (id.includes('/node_modules/@supabase/')) return 'supabase';
          return undefined;
        }
      }
    },
    chunkSizeWarningLimit: 1500,
    sourcemap: true,
  },
  server: {}
});
