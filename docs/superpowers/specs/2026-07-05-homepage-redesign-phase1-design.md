# Smart Addis Homepage Redesign — Phase 1 Design

## Context

Smart Addis's current homepage (`src/pages/home.tsx`) reads as a generic template: flat gradient hero with no imagery, small sections, thin visual hierarchy. The goal is a premium "smart city discovery platform" feel (Apple-level polish, Airbnb-style discovery, organic nature-inspired design) without a template look.

The original brief specified Next.js, Mapbox, and GSAP, and described ~9 new homepage sections plus data (live weather, visitor counts, testimonials, historical timeline) that doesn't exist in the current API. Two scoping decisions were made before design:

1. **Stack**: stay on the existing Vite + React Router + Leaflet stack. Add Framer Motion and GSAP for animation. Do **not** migrate to Next.js or Mapbox — that would be a large separate effort with real regression risk (routing, deployment, SSR decisions) unjustified by a visual redesign.
2. **Scope**: split the full redesign into phases. This spec covers **Phase 1 only**:
   - Design system foundation (colors, type, animation infra)
   - Hero section rebuild
   - Featured Parks section
   - Upcoming Events section

   Phase 2 (not designed yet): Interactive City Explorer (map split-view), category tiles, "Why Smart Addis".
   Phase 3 (not designed yet): Timeline, Testimonials, Gallery, Footer redesign — these need mock/placeholder content decisions first.

## Data gaps and how Phase 1 handles them

The current API (`src/api/parks.api.ts`, `src/api/events.api.ts`) provides: park name/description/media/entryFee/openingHours/services/events/review count, and event title/description/dates/category/image/park. It does **not** provide: rating averages, visitor counts, tourist attraction counts, live weather, RSVP/attendance counts, or user favorites.

Decisions (confirmed with user):
- **Visitors / Tourist Attractions stats**: dropped. Only "Parks" and "Monthly Events" stats are shown, computed from real API data.
- **Live Weather glass card**: dropped for Phase 1 (no provider/API key yet).
- **Trending Destination glass card**: dropped (no data source).
- **Save/favorites button**: implemented as a local-only (localStorage) favorite, not synced to the backend or user account.
- **Distance on park cards**: computed client-side via browser geolocation + haversine formula against park lat/lng. If the user denies/lacks geolocation, the distance is simply omitted — no error state shown.
- **Attendance count on event cards**: dropped (no RSVP data). The existing park-name display in `EventCard` stays as the replacement content.
- **Rating average on park cards**: the list endpoint only returns a review *count*, not an average. Phase 1 keeps showing review count (as today) rather than fabricate a star average. This is a known gap, not silently faked.
- **Hero background imagery**: no real photo/video assets or stock library available. Phase 1 uses the real primary images already returned by `parksApi.list()` (the same call Home already makes) as a rotating crossfade collage, rather than generic stock photography.

## Foundation

### Design tokens (`tailwind.config.js`)

Add to `theme.extend.colors`:
```
primary-green: '#0F7A4A'
dark-forest:   '#0A4D30'
light-green:   '#22C55E'
off-white:     '#F8FAFC'
accent-gold:   '#F4B400'
```
These supplement (not replace) the existing Tailwind green/emerald scale already used throughout the app, so other pages aren't broken.

Add Inter as the default sans font (`theme.extend.fontFamily.sans`), loaded via a `<link>` in `index.html` (Google Fonts) — no new build dependency needed for font loading.

### New dependencies

- `framer-motion` — scroll-triggered reveals, fades, parallax, animated counters, floating card motion.
- `gsap` — used narrowly, for the hero's animated glowing SVG connector-line effect only. Everything else in Phase 1 uses Framer Motion so the GSAP footprint stays small and intentional.

### New shared modules

- `src/store/favorites.store.ts` — zustand store, `persist` middleware to localStorage (same pattern as `auth.store.ts`). Exposes `favoriteIds: string[]`, `toggleFavorite(parkId)`, `isFavorite(parkId)`.
- `src/utils/geo.ts` — `haversineKm(lat1, lng1, lat2, lng2)` pure function, plus `useUserLocation()` hook wrapping `navigator.geolocation.getCurrentPosition`, returning `{ lat, lng } | null` and never throwing (permission denial/unsupported both resolve to `null`).
- `src/components/AnimatedCounter.tsx` — takes a target number, count-up animates via `requestAnimationFrame`/Framer Motion when scrolled into view (`useInView`), renders once and doesn't re-trigger on re-scroll.

## Hero Section (`src/pages/home.tsx`)

- **Background**: full-bleed container cross-fading between primary images of the fetched parks (reuse the existing `parksApi.list()` call already made by Home — no new request). `AnimatePresence` handles the crossfade on an interval (~6s). A gradient overlay (Dark Forest → Primary Green → transparent) sits above the images for text legibility, replacing today's flat gradient.
- **Parallax**: background layer gets a subtle scale/translateY tied to scroll position (`useScroll` + `useTransform`), not a full parallax library.
- **Decorative layer**: a handful of floating pin markers (absolute-positioned, gentle float animation) connected by animated glowing SVG lines (GSAP-driven dash-offset). This is explicitly stylistic — not a literal geo-accurate map — since Phase 1 has no map-in-hero requirement.
- **Copy**: headline "Experience Addis Ababa Like Never Before", subhead "Discover parks, events, hidden gems, cultural experiences and nature across Ethiopia's capital." (verbatim from brief).
- **Search bar**: controlled input; submit (Enter or button) navigates to `/parks?q=<value>`. `Parks.tsx` is updated to read the `q` search param on mount as the initial `search` state (currently it only holds local state with no URL sync).
- **CTA row**: "Explore Parks" → `/parks`, "Explore Events" → `/events`, "Interactive Map" → `/map`. Primary CTA uses Accent Gold, secondary uses the existing glass-pill style.
- **Live stats row**: two `AnimatedCounter`s — Parks (total count from the API response, not the sliced-to-4 subset used for cards) and Monthly Events (count of events whose `startDate` falls in the current calendar month).
- **Floating glass cards**: two cards positioned over the hero on desktop (stacked below the fold or hidden on small screens to avoid clutter) —
  - "Upcoming Event": soonest event by `startDate`.
  - "Featured Park": the park with the highest review count from the fetched list.
  Both link to their respective detail pages.

## Featured Parks Section

- Grid drops from 4 columns to 3 on desktop, with larger card images and a stronger hover lift/zoom, keeping the existing rounded-3xl card language but scaled up.
- Card content: image, name, description (as today), review count (existing `_count.reviews`), today's opening hours (derived by looking up the current day-of-week key in the existing `openingHours` record), distance (via `useUserLocation()` + `haversineKm`; omitted entirely if location is unavailable), and a heart/save icon button wired to `favorites.store.ts` (toggles fill state, no page reload).
- `ParkCard.tsx` is extended (not replaced) to accept these additional display fields; its existing usage in `Parks.tsx` continues to work unchanged (new fields render conditionally where data/permissions allow).

## Upcoming Events Section

- Layout changes from a static 3-column grid to a horizontal scroll-snap carousel (CSS `scroll-snap-type`, no new dependency) with left/right arrow controls.
- Card content is unchanged from the existing `EventCard.tsx` (image, date badge, category badge, park name) — attendance count was requested in the original brief but is dropped for lack of data, and the park-name slot already serves as its replacement.

## Out of scope (Phase 1)

- Interactive City Explorer (split map/list layout), category explorer tiles, animated icon "Why Smart Addis" cards — Phase 2.
- Historical timeline, testimonials, Pinterest-style gallery, footer redesign — Phase 3 (need placeholder-content decisions first).
- Any Next.js or Mapbox migration.
- Live weather, visitor/attraction counts, event attendance counts, backend-synced favorites.

## Files touched

- `tailwind.config.js` — color tokens, font family
- `index.html` — Inter font link
- `package.json` — add `framer-motion`, `gsap`
- `src/pages/home.tsx` — hero + Featured Parks + Upcoming Events rebuild
- `src/pages/Parks.tsx` — read initial `q` search param from URL
- `src/components/ParkCard.tsx` — extended with hours/distance/save
- `src/components/EventCard.tsx` — minor carousel-context adjustments (no attendance field to remove; already absent)
- New: `src/store/favorites.store.ts`
- New: `src/utils/geo.ts`
- New: `src/components/AnimatedCounter.tsx`
