import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
