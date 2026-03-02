import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'
import svgr from 'vite-plugin-svgr'
import { defineConfig, loadEnv } from 'vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const token = env.VITE_MAPBOX_TOKEN
    || process.env.VITE_MAPBOX_TOKEN
    || env.MAPBOX_TOKEN
    || process.env.MAPBOX_TOKEN
    || ''
  const rawDebug = env.GW_DEBUG ?? process.env.GW_DEBUG ?? undefined
  const hasRaw = rawDebug !== undefined && rawDebug !== ''
  const norm = hasRaw ? String(rawDebug).toLowerCase().trim() : undefined
  const debugFlag = hasRaw ? (norm === '1' || norm === 'true') : (mode === 'development')

  const appVariant =
    env.REACT_APP_VARIANT ||
    env.APP_VARIANT ||
    process.env.REACT_APP_VARIANT ||
    process.env.APP_VARIANT ||
    'mobile'

  return {
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
  define: {
    __MAPBOX_TOKEN__: JSON.stringify(token),
    __GW_DEBUG__: JSON.stringify(!!debugFlag),
    __REACT_APP_VARIANT__: JSON.stringify(appVariant),
  },
  resolve: {
    alias: {
      '@core': path.resolve(__dirname, '../core'),
      '@components': path.resolve(__dirname, '../core/components'),
      '@buttons': path.resolve(__dirname, '../core/components/buttons'),
      '@assets': path.resolve(__dirname, '../core/assets'),
      '@images': path.resolve(__dirname, '../core/assets/images'),
      "@track-context": path.resolve(__dirname, "../core/contexts/TrackContext.js"),
      "@contexts": path.resolve(__dirname, "../core/contexts/"),
      "@utils": path.resolve(__dirname, "../core/utils/"),
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
}})
