# Weather Forecast App

A mobile-first, dark-themed weather forecast app built with Vue 3, TypeScript, and Vite, for a senior-level take-home assessment.

> **Status:** Project foundation only. Routing, layout, and folder structure are in place; weather/search/favorites features are not implemented yet.

## Tech stack

- **Vue 3** (`<script setup>`, Composition API)
- **TypeScript**
- **Vite 7**
- **Vue Router 5** (lazy-loaded routes)
- **Pinia 3** (state management, wired up but no stores yet)
- **Tailwind CSS 4** (CSS-first config, dark theme by default)
- **Vitest 4** + **@vue/test-utils** (unit/component testing)

## Getting started

Requires Node.js 20.19+ (or 22.12+). Then:

```bash
npm install
npm run dev
```

Open the printed local URL (typically `http://localhost:5173`).

### Other scripts

```bash
npm run build       # type-check + production build
npm run preview     # preview the production build locally
npm run typecheck   # vue-tsc project-wide type check
npm run test         # run the test suite once
npm run test:watch   # run tests in watch mode
npm run test:ui      # run tests with the Vitest UI
```

## Deploy to Vercel

This is a static Vue SPA (no backend, no environment variables required). Vercel settings are defined in `vercel.json`.

### Option A — Vercel Dashboard

1. Push the repository to GitHub.
2. In [vercel.com/new](https://vercel.com/new), import the repository.
3. Vercel auto-detects Vite. Confirm:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
4. Deploy. No environment variables are needed — Open-Meteo is called directly from the browser.

### Option B — Vercel CLI

```bash
npm i -g vercel
vercel          # first deploy (follow prompts)
vercel --prod   # production deploy
```

### SPA routing

Client-side routes (`/app`, `/artifacts`, `/app/search`, etc.) are handled by the rewrite rule in `vercel.json`, which serves `index.html` for paths without a file extension.

Requires Node.js **20.19+** (or **22.12+**). `.nvmrc` pins Node 22 for Vercel.

## Architecture

The codebase follows a layered, feature-oriented structure so UI never talks to external services directly:

```
src/
  app/            # App wiring: router, layouts, provider installation
    router/        # Route definitions (lazy-loaded page components)
    layouts/        # AppShell (header + bottom nav + <RouterView>)
    providers/       # installAppProviders(app) - wires Pinia + router
  pages/          # One folder per route. Thin - compose features/shared UI.
    Home/
    Search/
    Favorites/
    Settings/
    EngineeringJourney/
  features/       # Vertical slices of app behavior (state + UI + logic)
    search/          # (placeholder - see README in folder)
    forecast/
    favorites/
    recent-searches/
    settings/
    geolocation/
  entities/       # Pure domain types, no behavior
    weather/         # WeatherSnapshot, DailyForecast, etc.
    location/        # GeoLocation
  infrastructure/ # Adapters/repositories - the ONLY layer allowed to
                  # talk to browser APIs or external services
    weather/         # WeatherRepository interface + placeholder impl
    storage/         # StorageAdapter interface + LocalStorageAdapter
    images/          # Maps domain data (condition codes) to icons
  shared/         # Reusable, feature-agnostic building blocks
    ui/              # Low-level primitives (BaseButton, BaseCard)
    components/      # Composed, still generic (PageHeader, EmptyState)
    composables/     # useDarkMode, etc.
    utils/           # cn() class helper, etc.
    constants/       # ROUTE_NAMES / ROUTE_PATHS
    types/           # Generic helper types (Nullable, AsyncState, ...)
```

### Rules this structure enforces

- **UI never calls APIs directly.** Pages and components only import from `shared/*`, `entities/*`, and `features/*`. Any real network/browser API call is hidden behind an interface in `infrastructure/*` (e.g. `WeatherRepository`, `StorageAdapter`).
- **Features depend on infrastructure through interfaces**, not concrete clients - so swapping the weather provider or storage mechanism later won't touch feature code.
- **`entities/*` are dumb data shapes** - no fetching, no persistence, just TypeScript types describing the domain.
- **Pages stay thin.** They compose `shared/components` and (eventually) `features/*` - they shouldn't contain business logic.
- Each `features/*` folder currently has a `README.md` describing what it will own; implementation lands in a later step.

## Current routes

| Path         | Page                  |
| ------------ | --------------------- |
| `/`          | Home                  |
| `/search`    | Search                |
| `/favorites` | Favorites             |
| `/settings`  | Settings              |
| `/journey`   | Engineering Journey   |

All pages are placeholders (`PageHeader` + `EmptyState`) until their respective features are implemented.
