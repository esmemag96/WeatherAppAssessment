# Esmeralda Weather App Design System

Source of truth: the approved Stitch mockups in
`stitch_nimbus_weather_experience_design/` (`weather_dashboard_hi_fi`,
`search_discovery_hi_fi`, `favorites_hi_fi`, `settings_hi_fi`,
`error_state_hi_fi`, `loading_state_hi_fi`, `desktop_dashboard_hi_fi`), plus
the `nimbus_high_fidelity/DESIGN.md` token spec, which is the variant the
mockups were actually generated against (their embedded Tailwind configs
and color hexes match it exactly).

This document is the catalogue for the Vue component library implemented
under `src/shared/ui/` (primitives) and `src/shared/components/` (composed
blocks). Full Purpose/Props/Slots/Events/Usage docs also live as comment
blocks at the top of each `.vue` file - this doc summarizes them in one
place and records the design decisions behind the translation.

## 1. Design tokens (`src/style.css`)

All tokens are defined once via Tailwind v4's CSS-first `@theme`, using the
**exact token names from the mockups' own Tailwind config** (`background`,
`on-surface-variant`, `headline-lg`, `container-padding`, ...). That means
the mockup HTML and our Vue templates can share literal class names -
there is no naming/translation layer to keep in sync.

| Category | Tokens |
|---|---|
| Color | 40 Material3-style roles: `background`/`surface*`, `on-surface*`, `primary*`, `secondary*`, `tertiary*`, `error*`, `outline*` - see `@theme` block for the full set. |
| Typography | `display-metrics` (80/88, -0.04em, 700), `display-metrics-sm` (56/60, mobile), `headline-lg` (32/40), `headline-md` (24/32), `title-lg` (18/24), `body-lg` (16/24), `body-md` (14/20), `label-caps` (12/16, +0.05em, uppercase labels), `numeric-data` (14/20, tabular metrics). Font: **Manrope** (400-800), loaded in `index.html`. |
| Spacing | `container-padding` (24px), `gutter` (16px), `row-height-sm` (40px), `row-height-md` (56px) - layered on top of Tailwind's default 4px scale. |
| Radius | **Not overridden** - Tailwind's default scale (`rounded`=4px, `lg`=8px, `xl`=12px, `2xl`=16px, `3xl`=24px, `full`=pill) already matches every radius used in the mockups exactly (verified against the mockups' own `borderRadius` config + literal class usage). |
| Elevation | `shadow-glass`, `shadow-nav`, `shadow-modal`, `shadow-glow-primary`, `shadow-glow-secondary`. The composite "glass" surface (translucent fill + blurred backdrop + brighter top border) is expressed as a Tailwind utility *combination* on `Card`, not a bespoke CSS class - see §3. |
| Motion | `ease-swift` (`cubic-bezier(0.4,0,0.2,1)`), `animate-shimmer` (skeleton loading sweep). Standard Tailwind `duration-*` utilities cover everything else. |
| Containers | `container-app` (28rem / 448px, the mobile shell width), `container-app-wide` (72rem, reserved for the desktop dashboard). |
| Breakpoints | Tailwind defaults (`sm`/`md`/`lg`) - unchanged, matches the mockups' own bare use of `md:`. |
| Icons | Google **Material Symbols Outlined** (variable font: weight + FILL axis), the exact icon set used in every mockup. Loaded in `index.html`, wrapped by `Icon`. |

## 2. Component hierarchy

```
shared/ui/            (primitives - one visual/interaction concern, no composition)
├─ Icon                Material Symbol wrapper
├─ Avatar               ← Icon (fallback)
├─ Button
├─ IconButton
├─ Badge
├─ Chip
├─ Card                 (base "glass" surface - composed by nearly everything below)
├─ Divider
├─ LoadingSkeleton
├─ SearchInput          ← Icon
└─ FavoriteButton        ← Icon

shared/components/     (composed blocks - assembled from ui/ primitives)
├─ PageContainer
├─ PageHeader
├─ SectionHeader
├─ BottomNavigation      ← Icon
├─ SearchBar             ← SearchInput, Button, Icon
├─ SearchSuggestion      ← Card, Icon
├─ WeatherHeroCard       ← Badge, Icon
├─ ForecastHourlyCard    ← Card, Icon
├─ ForecastDailyRow      ← Icon
├─ WeatherMetricCard     ← Card, Icon
├─ EmptyState            ← Icon
├─ ErrorState            ← Badge, Button, Icon
├─ OfflineBanner         ← Icon
├─ Toast                 ← Icon
└─ Modal                 ← IconButton, Icon

app/layouts/
└─ AppShell               ← Icon, IconButton, BottomNavigation  (app chrome only)
```

`AppShell` intentionally stays in `app/layouts/` (established in the
project-foundation step) rather than moving into `shared/`: it's a
singleton piece of app wiring (reads the router, decides the active tab),
not a generic, reusable-in-isolation UI atom. What *is* reusable about it
- the bottom tab bar - is extracted into `shared/components/BottomNavigation`,
which only takes `items`/`activeName` props and knows nothing about routes
beyond what it's handed.

## 3. Reusability decisions

- **`Card` is the single source of the "glass" elevation effect.** The
  mockups implement it as a bespoke `.glass-card` CSS class (translucent
  fill + `backdrop-filter: blur()` + a brighter top border to fake a light
  source from above) because that combination can't be expressed as one
  Tailwind utility. Rather than reintroducing a parallel hand-written CSS
  class, `Card` builds the same effect from ordinary Tailwind utilities
  (`bg-surface-container-low/80 backdrop-blur-md border border-white/8
  border-t-white/15 shadow-glass`) so every "elevated surface" component
  (`SearchSuggestion`, `ForecastHourlyCard`, `WeatherMetricCard`, `Modal`,
  `Toast`) composes `Card` (or the same class list) instead of duplicating
  it. Change the glass recipe once, everything updates.
- **Metric visualization is a slot, not a prop.** `WeatherMetricCard` shows
  a UV progress bar, a humidity bar chart, and a wind compass in the
  mockups - three unrelated visualizations. Rather than teaching the card
  component about every metric type (business logic creeping into the
  design system), the bottom visualization is a `#visual` slot filled in
  by whoever renders the metric.
- **`SearchInput` vs. `SearchBar` vs. `SearchSuggestion`.** `SearchInput`
  (ui/) is the bare styled text field - reusable anywhere a search box is
  needed (e.g. a future desktop header search). `SearchBar` (components/)
  composes it with the "Use Current Location" quick action shown
  specifically on the Search page. `SearchSuggestion` (components/) is one
  selectable location row, reused identically for both "Recent Searches"
  and live geocoding results, because the mockups render them with the
  exact same visual treatment.
- **Controlled, stateless components throughout.** `FavoriteButton`,
  `Chip`, `Toast`, `Modal`, `OfflineBanner` all take their state as props
  and emit intent (`update:modelValue`, `toggle`, `retry`, `close`,
  `dismiss`) rather than owning it. This is what makes "do not implement
  business logic" possible: a later feature step wires these to
  `useFavoritesStore`, `useSettingsStore`, etc. without touching the
  design system.
- **`Icon` centralizes the icon system.** Every icon in the mockups comes
  from Material Symbols Outlined with the same two axes in play (`FILL`
  for active/emphasis states, weight for thin decorative icons on the
  error screen). One wrapper means the icon set can be swapped later
  (e.g. for a custom SVG set) by changing a single file.

## 4. Deviations from the mockups (and why)

1. **Single AppShell header for every page**, instead of the Settings
   screen's one-off "back arrow + title" app bar. Introducing a
   per-route header variant is a routing concern, not a design-system
   concern, and would require deciding *which* routes get a back button -
   that's a product/IA decision explicitly out of scope for this step.
   The branded header (location pin + "Esmeralda Weather App" + search action)
   used on every other screen is the default; a `back` header variant can
   be added to `AppShell` later without changing any shared component.
2. **Favorites keeps its own bottom-nav tab.** The mockups' bottom nav only
   ever shows 3 slots (Weather/Search/Settings) per screen, even on the
   `favorites_hi_fi` screen itself (its nav bar re-highlights "Settings"
   with a code comment admitting it's mapping "Favorites... to closest
   intent"). Since Favorites is a real, distinct page in the hand-off and
   the instructions say not to change the information architecture, the
   4-tab bar (Weather/Search/Favorites/Settings) established in the
   project-foundation step was kept instead of silently dropping the tab.
3. **`display-metrics` scales down to `56px` below the `sm` breakpoint**
   (`WeatherHeroCard`'s big temperature reading), rather than using the
   literal `80px` baked into every mockup screenshot. This isn't actually
   a deviation from the spec - it's applying the mobile-scaling rule the
   `nimbus_high_fidelity/DESIGN.md` itself documents ("On mobile devices,
   `display-metrics` should scale down to `56px`") - the Stitch exports
   are static single-viewport renders and don't demonstrate it.
4. **Border radius tokens were not redeclared** even though the mockups'
   own Tailwind config explicitly lists a `borderRadius` override. Tailwind
   v4's *default* scale already produces the same pixel values the
   mockups use (`rounded`=4px, `lg`=8px, `xl`=12px, `2xl`=16px, `3xl`=24px),
   so redeclaring them would be a no-op. Documented in §1 instead of
   silently duplicated in `@theme`.
5. **No literal `.glass-card` CSS class.** See §3 - the same visual result
   is produced compositionally via `Card`, which is more idiomatic
   Tailwind v4 and keeps the "avoid page-specific/bespoke styling inside
   shared components" rule intact.
6. **Micro-interactions deferred**: the mockups' JS-driven "count-up"
   number animation and canvas particle background are cosmetic flourishes
   layered on top of static demo HTML, not structural to the design
   system's components or tokens. Implementing them now would mean adding
   animation *behavior* (timers, RAF loops) to otherwise-presentational
   components before there's real data to animate. `Toast`'s auto-dismiss
   timer and `LoadingSkeleton`'s shimmer were kept because they're
   intrinsic to what those two components *are*.
7. **Desktop dashboard is documented, not built.** `desktop_dashboard_hi_fi`
   informed the `container-app-wide` token and confirms every primitive
   (`Card`, `WeatherMetricCard`, `ForecastDailyRow`) already scales to that
   layout, but no desktop-specific page/sidebar component was built - the
   take-home's approved route set is mobile-first single-column, and
   building an unused `NavigationDrawer` would be speculative scope.

## 5. Component reference

Each entry below is intentionally short; the full contract (Props / Slots
/ Events / Usage example) lives as a doc-comment at the top of the
component file.

### `shared/ui/` (primitives)

| Component | Purpose |
|---|---|
| `Icon` | Material Symbols Outlined wrapper (name, size, filled, weight). |
| `Avatar` | Circular profile/location image with initials/icon fallback. |
| `Button` | Primary/secondary/ghost/danger action button, with loading state. |
| `IconButton` | Circular icon-only tap target with required a11y label. |
| `Card` | Base glass/solid/outline surface - the elevation primitive. |
| `Badge` | Small pill status indicator (Live dot, diagnostic codes). |
| `Chip` | Controlled segmented-toggle / label chip (°C/°F, km/h/mph). |
| `Divider` | Hairline separator, horizontal or vertical. |
| `LoadingSkeleton` | Shimmering placeholder block (rect/circle/pill). |
| `SearchInput` | Glass pill text input with leading icon + clear button. |
| `FavoriteButton` | Star toggle, `v-model="isFavorite"`. |

### `shared/components/` (composed blocks)

| Component | Purpose |
|---|---|
| `PageContainer` | Per-page width/padding wrapper (mobile shell or wide). |
| `PageHeader` | Large page title + optional subtitle/actions. |
| `SectionHeader` | Section title + optional action/icon, plain or `label-caps`. |
| `BottomNavigation` | Persistent glass bottom tab bar. |
| `SearchBar` | `SearchInput` + "Use Current Location" quick action. |
| `SearchSuggestion` | One selectable location row (recents + live results). |
| `WeatherHeroCard` | Hero current-conditions card (photo, temp, condition). |
| `ForecastHourlyCard` | One tile in the hourly-forecast horizontal scroller. |
| `ForecastDailyRow` | One row in the 7-day forecast list, with range bar. |
| `WeatherMetricCard` | Bento-grid metric tile with a `#visual` slot. |
| `EmptyState` | Neutral "nothing here yet" placeholder. |
| `ErrorState` | Full-page failure state with retry/secondary actions. |
| `OfflineBanner` | Slim persistent connectivity banner. |
| `Toast` | Bottom-anchored transient notification, optional auto-dismiss. |
| `Modal` | Overlay dialog with backdrop, Escape-to-close, footer slot. |
