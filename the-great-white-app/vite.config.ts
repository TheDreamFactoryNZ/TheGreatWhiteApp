/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy()
  ],
  resolve: {
    alias: [
      { find: '@core', replacement: path.resolve(__dirname, '../core') },
      { find: '@track-context', replacement: path.resolve(__dirname, '../core/context/TrackContext.js') },
    ]
  }
})
