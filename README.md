# Esmeralda Weather App

A mobile-first weather forecast web app built for the **Coherent Solutions** senior frontend take-home assessment.

The product answers a deliberately open requirement — *get a weather forecast for a selected location* — as an independent SPA: search a city, check the forecast, optionally save favorites, with preferences stored client-side in LocalStorage. No accounts, no backend, no cloud database.

The companion **Engineering Review** at `/artifacts` tells the story of how that requirement became a complete application: scope, audience, research, architecture, design, AI collaboration, delivery, deployment, feedback, and reflection.

| Surface | Path |
| ------- | ---- |
| Landing | `/` |
| Weather app | `/app` |
| Engineering Review | `/artifacts` |

## Product scope

**In scope**

- Current conditions, hourly and daily forecast
- Location search and geolocation
- Favorites and recent searches (LocalStorage)
- Light / dark appearance
- Loading, empty, offline, and error states

**Out of scope**

- User accounts, authentication, or session management
- Cloud databases or sync
- Radar maps, weather news, ads, or advanced meteorological metrics
- City-image APIs (hero imagery is condition-based and local)

## Tech stack

- **Vue 3** (`<script setup>`, Composition API)
- **TypeScript**
- **Vite 7**
- **Vue Router 5** (lazy-loaded routes)
- **Pinia 3**
- **Tailwind CSS 4**
- **Vitest 4** + **@vue/test-utils** (unit/component)
- **Playwright** (end-to-end smoke)
- **Open-Meteo** — forecast, geocoding, and air quality (called from the browser)
- **Vercel** — static hosting, preview URLs, HTTPS, CDN

## Getting started

Requires Node.js **20.19+** (or **22.12+**). `.nvmrc` pins Node 22 for Vercel.

```bash
npm install
npm run dev
```

Open the printed local URL (typically `http://localhost:5173`).

| Script | Purpose |
| ------ | ------- |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview the production build |
| `npm run typecheck` | Project-wide `vue-tsc` check |
| `npm run test` | Run the unit test suite once |
| `npm run test:watch` | Unit tests in watch mode |
| `npm run test:ui` | Vitest UI |
| `npm run test:e2e:install` | Download Chromium for Playwright (run once) |
| `npm run test:e2e` | Playwright smoke (requires a prior `npm run build`) |
| `npm run test:e2e:ui` | Playwright UI mode |
| `npm run test:e2e:report` | Open the last Playwright HTML report |

### End-to-end tests (Playwright)

Smoke tests live in `e2e/` and run against the production build via `vite preview` (desktop + mobile Chromium).

First time on a machine, install the browser binaries:

```bash
npm run test:e2e:install
```

Then build and run:

```bash
npm run build
npm run test:e2e
```

Interactive UI mode (after a build):

```bash
npm run test:e2e:ui
```

If tests fail with `Executable doesn't exist` / `browserType.launch`, Chromium is missing — run `npm run test:e2e:install` again.

CI runs typecheck, unit tests, and Playwright smoke on every push/PR (see `.github/workflows/ci.yml`). Playwright browsers are installed in the workflow with `npx playwright install --with-deps chromium`.

## Architecture

Frontend SPA organized into four layers so the UI never depends directly on a weather provider:

| Layer | Responsibility |
| ----- | -------------- |
| **Presentation** | Pages, components, layout |
| **Application** | Stores, composables, user actions |
| **Domain** | Types and mapping into clean entities |
| **Infrastructure** | Open-Meteo adapters, LocalStorage, alerts |

```
src/
  app/             # Router, AppShell, providers
  pages/           # Landing, Home, Search, Favorites, Settings, Artifacts
  features/        # forecast, search, favorites, settings, geolocation, recent-searches
  entities/        # Domain types (weather, location, settings, …)
  infrastructure/  # Open-Meteo, air quality, storage, alerts, images
  content/         # Engineering Review narrative content
  shared/          # UI primitives, composables, design system, engineering-review UI
```

**Rules**

- UI never calls external APIs directly — only through application state and repositories.
- Features depend on infrastructure through interfaces, so Open-Meteo (or a future backend) can be swapped without rewriting the app.
- `entities/*` are pure data shapes.
- Pages stay thin; they compose features and shared UI.

The architecture diagram and layer explorer live in the Engineering Review under **Technical Direction**.

## Routes

| Path | Page |
| ---- | ---- |
| `/` | Landing |
| `/app` | Weather dashboard (home) |
| `/app/search` | Location search |
| `/app/favorites` | Saved locations |
| `/app/settings` | Preferences |
| `/artifacts` | Engineering Review |
| `/journey` | Redirect → `/artifacts` |

Legacy paths `/search`, `/favorites`, and `/settings` redirect into `/app/...`. Artifact deep links like `/artifacts/architecture` redirect to the matching hash on `/artifacts`.

## Engineering Review

The review is a case-study portal (not a document dump). Sections include:

1. **Starting Point** — scope and assumptions  
2. **Audience** — persona (Sofia) and product framing  
3. **Research** — competitor keep / leave-out  
4. **AI Collaboration** — workflow and tool links (ChatGPT, Cursor, Stitch, Eraser, Vercel, …)  
5. **Architecture** — goal, Eraser diagram, four layers  
6. **Design** — Stitch mockups and condition-based imagery  
7. **Delivery** — milestone-based implementation with Cursor  
8. **Deployment** — Vercel pipeline  
9. **Feedback** — validation questions  
10. **Reflection** — what went well, what to improve, what next  

Narrative content lives in `src/content/artifacts/`. UI lives in `src/shared/components/engineering-review/`.

## Deploy to Vercel

Static Vue SPA — no server, no environment variables. Settings are in `vercel.json`.

### Option A — Dashboard

1. Push the repository to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new).
3. Confirm: **Build** `npm run build`, **Output** `dist`, **Install** `npm install`.
4. Deploy. Open-Meteo is called from the browser.

### Option B — CLI

```bash
npm i -g vercel
vercel          # first deploy
vercel --prod   # production
```

SPA routes are rewritten to `index.html` via `vercel.json` so `/app`, `/artifacts`, and nested paths work on refresh.

## Author

**Esmeralda Magdaleno** — Frontend Engineer  
Coherent Solutions take-away task
