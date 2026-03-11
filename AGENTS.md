# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

This is "Craigslist iOS" — a React + TypeScript + Vite design presentation and interactive prototype. It is a purely frontend, self-contained single-page application with no backend, no database, and no authentication. All data is hardcoded in `src/data/`.

### Services

| Service | Command | Port | Notes |
|---------|---------|------|-------|
| Vite dev server | `pnpm dev` | 8081 | The only service needed; serves the React app with HMR |

### Development commands

- **Dev server:** `pnpm dev` (port 8081, strict port)
- **Lint:** `pnpm lint` (ESLint)
- **Build:** `pnpm build` (runs `tsc -b && vite build`)

### Known caveats

- The codebase has pre-existing TypeScript errors (unused imports, type mismatches with `framer-motion` Variants, missing type `FavoritesScreenProps`) that cause `tsc -b` / `pnpm build` to fail. The Vite dev server runs independently of `tsc` and works fine.
- ESLint reports ~55 pre-existing errors (mostly `react-refresh/only-export-components` and `react-hooks/set-state-in-effect`). These are not blocking.
- On desktop browsers (viewport ≥1280px), the app renders in **presentation mode** (slide deck). On smaller viewports, it renders the **interactive mobile prototype**.
- External services (OpenStreetMap Nominatim geocoding, Carto map tiles, Google Fonts) are optional and degrade gracefully if unavailable.
- `pnpm-workspace.yaml` contains only `onlyBuiltDependencies: esbuild` — this is not a monorepo.
