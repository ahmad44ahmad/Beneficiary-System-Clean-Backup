import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: env.VITE_BASE_URL || '/',
    envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
    server: {
      port: 5173,
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    build: {
      chunkSizeWarningLimit: 900,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('lucide-react')) return 'vendor-icons';
              if (id.includes('recharts')) return 'vendor-charts';
              if (id.includes('@tanstack/react-query')) return 'vendor-query';
              if (id.includes('framer-motion')) return 'vendor-motion';

              if (id.includes('react-hook-form')) return 'vendor-forms';
              if (id.includes('/zod/')) return 'vendor-forms';
              if (id.includes('react-router-dom')) return 'vendor-react';
              if (id.includes('react-dom')) return 'vendor-react';
              if (/[/\\]node_modules[/\\]react[/\\]/.test(id)) return 'vendor-react';
            }
            if (id.includes('src/data/')) return 'data-local';
          }
        }
      }
    }
  };
});
