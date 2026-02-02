// #import path from 'path';
// #import { defineConfig, loadEnv } from 'vite';
// #import react from '@vitejs/plugin-react';
// #
// #export default defineConfig(({ mode }) => {
// #  const env = loadEnv(mode, '.', '');
// #  return {
// #    server: {
// #      port: 3000,
// #      host: '0.0.0.0',
// #      proxy: {
// #        '/api': {
// #          target: 'http://localhost:3001',
// #          changeOrigin: true,
// #        }
// #      }
// #    },
// #    plugins: [react()],
// #    define: {
// #      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
// #      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
// #    },
// #    resolve: {
// #        '@': path.resolve(__dirname, '.'),
// #      }
// #   }
// #  };
// #});


import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')

  return {
    plugins: [react()],

    server: {
      port: 3000,
      host: true,

      allowedHosts: [
        'dell-inspiron.smelt-carob.ts.net'
      ],

      proxy: {
        '/api': {
          target: 'http://localhost:3001', // ✅ BACKEND
          changeOrigin: true,
        }
      }
    },

    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  }
})

   
