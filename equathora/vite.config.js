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
          // Separate node_modules into vendor chunks
          if (id.includes('node_modules')) {
            // Large libraries get their own chunks
            if (id.includes('mathlive')) {
              return 'mathlive';
            }
            if (id.includes('framer-motion')) {
              return 'motion';
            }
            if (id.includes('react-icons')) {
              return 'icons';
            }
            if (id.includes('@supabase')) {
              return 'supabase';
            }
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            // Everything else from node_modules goes to vendor
            return 'vendor';
          }
          
          // Split app code by route/feature
          if (id.includes('/src/pages/Leaderboards/')) {
            return 'leaderboards';
          }
          if (id.includes('/src/pages/Achievements/')) {
            return 'achievements';
          }
          if (id.includes('/src/components/Landing/')) {
            return 'landing';
          }
          if (id.includes('/src/pages/Blog') || id.includes('blogPosts')) {
            return 'blog';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000, // Increase to 1MB - this is just a warning, not an error
    sourcemap: false,
  },
  server: {
    proxy: {
      // Proxy the math problem endpoint to your backend
      '/mathproblem': {
        target: 'http://localhost:5104', // your backend URL and port
        changeOrigin: true,
        secure: false
      },
      // optionally proxy everything under /api if you have other endpoints
      '/api': {
        target: 'http://localhost:5104',
        changeOrigin: true,
        secure: false
      }
    }
  }
});
