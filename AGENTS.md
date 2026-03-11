# AGENTS.md

## Cursor Cloud specific instructions

This is a **frontend-only** React/Vite/TypeScript project (Craigslist mobile app redesign prototype). There is no backend, database, or Docker dependency.

### Services

| Service | Command | Port | Notes |
|---------|---------|------|-------|
| Vite dev server | `pnpm dev` | 8081 | The only service. `strictPort: true` in `vite.config.ts`. |

### Key commands

Standard scripts are in `package.json`:
- **Dev server:** `pnpm dev` (port 8081)
- **Lint:** `pnpm lint` (ESLint 9)
- **Build:** `pnpm build` (runs `tsc -b && vite build`)
- **Preview:** `pnpm preview`

### Gotchas

- `pnpm build` currently fails due to pre-existing TypeScript errors (unused imports, type mismatches in framer-motion variants and ref types). The dev server (`pnpm dev`) works fine regardless since Vite does not enforce TS compilation during development.
- `pnpm lint` reports pre-existing ESLint warnings/errors (react-refresh, react-hooks). These are not blocking for development.
- The app has two modes: presentation deck (viewport >= 1280px) and interactive mobile prototype (viewport < 1280px). Use Chrome DevTools device toolbar to test mobile mode.
- All data is hardcoded mock data in `src/data/`. No API keys or `.env` file needed.
- Path alias `@` maps to `./src` (configured in `vite.config.ts`).
