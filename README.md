# TheGreatWhiteApp
Track sharks throughout New Zealand and beyond with this interactive app!

## Dependencies

Before running this project, install the following global dependencies:

````yarn global add @ionic/cli @capacitor/cli concurrently typescript

For iOS development, ensure the following global dependencies are set up:

- Xcode
- Xcode command line tools
- Homebrew
- Cocoapods

## Environment Setup

This repo has two workspaces: `webapp` (Webpack) and `mobileapp` (Ionic + Vite). Both share core code in `core/` and require a Mapbox token at build/runtime.

- Token key: use `MAPBOX_TOKEN` in both apps. For Vite, `VITE_MAPBOX_TOKEN` is also supported.
- Build-time injection: both apps inject a unified `__MAPBOX_TOKEN__` used by core in [core/App.jsx](core/App.jsx#L1).
- Runtime fallback: core also checks `window.__MAPBOX_TOKEN` if present.

Create `.env.local` files in each workspace root:

```bash
# webapp/.env.local
MAPBOX_TOKEN=your_mapbox_access_token
```

```bash
# mobileapp/.env.local (either works)
VITE_MAPBOX_TOKEN=your_mapbox_access_token
# or
MAPBOX_TOKEN=your_mapbox_access_token
```

References:
- Vite define in [mobileapp/vite.config.ts](mobileapp/vite.config.ts#L1) injects `__MAPBOX_TOKEN__` from `VITE_MAPBOX_TOKEN || MAPBOX_TOKEN`.
- Webpack DefinePlugin in [webapp/webpack.config.js](webapp/webpack.config.js#L1) injects `__MAPBOX_TOKEN__` from `MAPBOX_TOKEN`.

### Debug Flags
- `GW_DEBUG`: enables lifecycle instrumentation and future debug features.
- Enable in `.env.local` per workspace:

```bash
# webapp/.env.local
GW_DEBUG=1

# mobileapp/.env.local
GW_DEBUG=1
```

- Default behavior:
- If `GW_DEBUG` is unset, debug is enabled in development and disabled in production.
- If `GW_DEBUG` is set, only `1` or `true` enables; `0` or `false` disables.
Both toolchains inject a build-time `__GW_DEBUG__` used by core.

References:
- Vite definition: see [mobileapp/vite.config.ts](mobileapp/vite.config.ts) (`define.__GW_DEBUG__`).
- Webpack definition: see [webapp/webpack.config.js](webapp/webpack.config.js) (`DefinePlugin` for `__GW_DEBUG__`).

## Scripts

From the repo root:

```bash
# Web app (Webpack)
yarn workspace webapp start

# Mobile app (Ionic + Vite)
yarn workspace mobileapp dev

# Build mobile app
yarn workspace mobileapp build
```

Note: installs are Yarn-only. Root `.npmrc` disables npm lockfiles.