/// <reference types="vitest" />

import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'
import svgr from 'vite-plugin-svgr'
import { defineConfig } from 'vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy(),
    svgr({
      svgrOptions: {
        exportType: 'default',
      },
      include: ['**/*.svg?component', '**/*.svg?react'],
      exclude: '**/*.svg?url'
    })
  ],
  resolve: {
    alias: {
      '@core': path.resolve(__dirname, '../core'),
      '@components': path.resolve(__dirname, '../core/components'),
      '@buttons': path.resolve(__dirname, '../core/components/buttons'),
      '@assets': path.resolve(__dirname, '../core/assets'),
      '@images': path.resolve(__dirname, '../core/assets/images'),
      "@track-context": path.resolve(__dirname, "../core/context/TrackContext.js"),
    },
    dedupe: ['react', 'react-dom'],
  },
  server: {
    fs: {
      allow: [
        __dirname,
        path.resolve(__dirname, '../core'), // allow imports from core
      ],
    },
  },
})
