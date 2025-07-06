import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/estportfolio', // Use relative paths for GitHub Pages
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          animations: ['framer-motion', '@tsparticles/react', '@tsparticles/engine', '@tsparticles/slim'],
          ui: ['lucide-react', 'react-countup', 'react-intersection-observer', 'react-type-animation']
        }
      }
    }
  },
  server: {
    host: true,
    port: 3000
  }
});