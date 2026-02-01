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
    svgr()
  ],
  resolve: {
    alias: {
      '@core': path.resolve(__dirname, '../core'),
      '@assets': path.resolve(__dirname, '../core/assets'),
      '@track-context': path.resolve(__dirname, '../core/context/TrackContext.js'),
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
