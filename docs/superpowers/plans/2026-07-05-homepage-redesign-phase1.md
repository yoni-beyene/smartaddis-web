# Homepage Redesign Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild Smart Addis's homepage (design tokens, hero, Featured Parks, Upcoming Events) into a premium, imagery-rich, animated experience while staying on the existing Vite + React Router + Leaflet stack.

**Architecture:** Extend Tailwind's theme with the brand palette and Inter font; add Framer Motion (primary animation library) and GSAP (narrowly, for one SVG effect). Extract the hero into its own component (`Hero.tsx`) and the events carousel into its own component (`UpcomingEventsCarousel.tsx`); extend `ParkCard.tsx` in place. `home.tsx` becomes a thin composition of these plus the unchanged Features/CTA sections. New pure-logic modules (`geo.ts`, `hours.ts`, `favorites.store.ts`) get real unit tests via a newly-added Vitest setup; UI/animation code is verified by `npm run build` plus manual browser checks (see Global Constraints).

**Tech Stack:** Vite, React 19, TypeScript, Tailwind CSS 3, React Router 7, Zustand, Framer Motion (new), GSAP (new), Vitest + jsdom (new, dev-only).

**Reference spec:** `docs/superpowers/specs/2026-07-05-homepage-redesign-phase1-design.md`

## Global Constraints

- Color tokens (exact hex, from spec): Primary Green `#0F7A4A`, Dark Forest `#0A4D30`, Light Green `#22C55E`, Off White `#F8FAFC`, Accent Gold `#F4B400`. Add as Tailwind colors named `primary-green`, `dark-forest`, `light-green`, `off-white`, `accent-gold` — do not replace the existing green/emerald scale already used elsewhere in the app.
- Font: Inter, loaded via Google Fonts `<link>` in `index.html`, set as the Tailwind default `sans` font family.
- Stay on Vite + React Router + Leaflet. Do not introduce Next.js or Mapbox.
- No backend/API changes. Any data not returned by the existing API (visitor counts, tourist attraction counts, live weather, event attendance, rating averages, backend-synced favorites) is out of scope — do not fabricate it.
- Distance and opening-hours fields must degrade gracefully to "not shown" (never an error state) when data/permission is unavailable.
- This repo currently has **no test runner**. Task 2 introduces Vitest (with `jsdom`) for **pure-logic modules only** (`geo.ts`, `favorites.store.ts`, `hours.ts`). Do not write React Testing Library tests or otherwise attempt automated tests for animation/visual components (`Hero.tsx`, `AnimatedCounter.tsx`, `UpcomingEventsCarousel.tsx`, `ParkCard.tsx`'s JSX) — those are verified by `npm run build` succeeding plus the manual browser check described in that task's steps.
- Every task ends with `npm run build` passing (this runs `tsc -b && vite build`, the project's only existing verification gate) in addition to any task-specific check.
- Commit after every task with a focused, single-purpose commit message.

---

### Task 1: Design tokens, Inter font, and animation dependencies

**Files:**
- Modify: `tailwind.config.js`
- Modify: `index.html`
- Modify: `package.json` (via `npm install`, not hand-editing)

**Interfaces:**
- Produces: Tailwind color utilities `bg-primary-green`, `text-primary-green`, `bg-dark-forest`, `text-dark-forest`, `bg-light-green`, `text-light-green`, `bg-off-white`, `text-off-white`, `bg-accent-gold`, `text-accent-gold` (and their `/opacity` and hover variants). Default `font-sans` now resolves to Inter. `framer-motion` and `gsap` importable from any file.

- [ ] **Step 1: Add color tokens and font family to Tailwind config**

Edit `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary-green': '#0F7A4A',
        'dark-forest': '#0A4D30',
        'light-green': '#22C55E',
        'off-white': '#F8FAFC',
        'accent-gold': '#F4B400',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 2: Load Inter in `index.html`**

Edit `index.html`, adding these lines inside `<head>` right after the favicon `<link>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
  rel="stylesheet"
/>
```

- [ ] **Step 3: Install Framer Motion and GSAP**

Run:
```bash
npm install framer-motion gsap
```

- [ ] **Step 4: Verify the build and confirm Inter is in the compiled CSS**

Run:
```bash
npm run build
grep -l "Inter" dist/assets/*.css
```
Expected: `npm run build` exits 0, and the `grep` command prints a matching CSS filename (confirms Tailwind picked up the new `font-sans` and the font is referenced).

- [ ] **Step 5: Commit**

```bash
git add tailwind.config.js index.html package.json package-lock.json
git commit -m "Add brand color tokens, Inter font, and animation dependencies"
```

---

### Task 2: Vitest setup + geo utilities (distance calculation, user location)

**Files:**
- Modify: `vite.config.ts`
- Modify: `package.json` (via `npm install -D`, plus one manual script line)
- Create: `src/utils/geo.ts`
- Create: `src/utils/geo.test.ts`

**Interfaces:**
- Produces:
  - `haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number`
  - `interface UserLocation { lat: number; lng: number }`
  - `useUserLocation(): UserLocation | null` (React hook; resolves to `null` if geolocation is unsupported or denied, never throws)

- [ ] **Step 1: Install Vitest and jsdom, wire up the test script**

Run:
```bash
npm install -D vitest jsdom
```

Edit `vite.config.ts`:
```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
  },
})
```

Edit `package.json` `scripts` block to add:
```json
"test": "vitest run"
```

- [ ] **Step 2: Write the failing test**

Create `src/utils/geo.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { haversineKm } from './geo';

describe('haversineKm', () => {
  it('returns 0 for identical coordinates', () => {
    expect(haversineKm(9.03, 38.74, 9.03, 38.74)).toBe(0);
  });

  it('returns ~111.19km for one degree of latitude difference', () => {
    expect(haversineKm(0, 0, 1, 0)).toBeCloseTo(111.19, 1);
  });
});
```

- [ ] **Step 3: Run the test and confirm it fails**

Run:
```bash
npx vitest run src/utils/geo.test.ts
```
Expected: FAIL — cannot resolve `./geo` (module doesn't exist yet).

- [ ] **Step 4: Implement `geo.ts`**

Create `src/utils/geo.ts`:
```ts
import { useEffect, useState } from 'react';

const EARTH_RADIUS_KM = 6371;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

export interface UserLocation {
  lat: number;
  lng: number;
}

export function useUserLocation(): UserLocation | null {
  const [location, setLocation] = useState<UserLocation | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
      },
      () => setLocation(null),
    );
  }, []);

  return location;
}
```

- [ ] **Step 5: Run the test and confirm it passes**

Run:
```bash
npx vitest run src/utils/geo.test.ts
```
Expected: PASS (2 tests).

- [ ] **Step 6: Verify the full build**

Run:
```bash
npm run build
```
Expected: exits 0.

- [ ] **Step 7: Commit**

```bash
git add vite.config.ts package.json package-lock.json src/utils/geo.ts src/utils/geo.test.ts
git commit -m "Add Vitest setup and geo distance utilities"
```

---

### Task 3: Local favorites store (save-for-later parks)

**Files:**
- Create: `src/store/favorites.store.ts`
- Create: `src/store/favorites.store.test.ts`

**Interfaces:**
- Consumes: none (self-contained, follows the same `create`/`persist` pattern as `src/store/auth.store.ts`)
- Produces: `useFavoritesStore` — zustand hook exposing `favoriteIds: string[]`, `toggleFavorite(parkId: string): void`, `isFavorite(parkId: string): boolean`

- [ ] **Step 1: Write the failing test**

Create `src/store/favorites.store.test.ts`:
```ts
import { beforeEach, describe, it, expect } from 'vitest';
import { useFavoritesStore } from './favorites.store';

describe('useFavoritesStore', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ favoriteIds: [] });
    localStorage.clear();
  });

  it('starts with no favorites', () => {
    expect(useFavoritesStore.getState().isFavorite('park-1')).toBe(false);
  });

  it('adds a park id on toggle when not already favorited', () => {
    useFavoritesStore.getState().toggleFavorite('park-1');
    expect(useFavoritesStore.getState().favoriteIds).toEqual(['park-1']);
    expect(useFavoritesStore.getState().isFavorite('park-1')).toBe(true);
  });

  it('removes a park id on toggle when already favorited', () => {
    useFavoritesStore.getState().toggleFavorite('park-1');
    useFavoritesStore.getState().toggleFavorite('park-1');
    expect(useFavoritesStore.getState().favoriteIds).toEqual([]);
    expect(useFavoritesStore.getState().isFavorite('park-1')).toBe(false);
  });
});
```

- [ ] **Step 2: Run the test and confirm it fails**

Run:
```bash
npx vitest run src/store/favorites.store.test.ts
```
Expected: FAIL — cannot resolve `./favorites.store`.

- [ ] **Step 3: Implement the store**

Create `src/store/favorites.store.ts`:
```ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesState {
  favoriteIds: string[];
  toggleFavorite: (parkId: string) => void;
  isFavorite: (parkId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],
      toggleFavorite: (parkId) => {
        const { favoriteIds } = get();
        set({
          favoriteIds: favoriteIds.includes(parkId)
            ? favoriteIds.filter((id) => id !== parkId)
            : [...favoriteIds, parkId],
        });
      },
      isFavorite: (parkId) => get().favoriteIds.includes(parkId),
    }),
    { name: 'smart-parks-web-favorites' },
  ),
);
```

- [ ] **Step 4: Run the test and confirm it passes**

Run:
```bash
npx vitest run src/store/favorites.store.test.ts
```
Expected: PASS (3 tests).

- [ ] **Step 5: Verify the full build**

Run:
```bash
npm run build
```
Expected: exits 0.

- [ ] **Step 6: Commit**

```bash
git add src/store/favorites.store.ts src/store/favorites.store.test.ts
git commit -m "Add local-only favorites store for saved parks"
```

---

### Task 4: Today's-opening-hours utility

**Files:**
- Create: `src/utils/hours.ts`
- Create: `src/utils/hours.test.ts`

**Interfaces:**
- Produces:
  - `DAY_NAMES: readonly ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']`
  - `getTodayHours(openingHours: Record<string, string> | undefined, date?: Date): string | null`

- [ ] **Step 1: Write the failing test**

Create `src/utils/hours.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { getTodayHours, DAY_NAMES } from './hours';

describe('getTodayHours', () => {
  it('returns the hours for the given date\'s weekday, case-insensitively', () => {
    const date = new Date(2026, 6, 6);
    const dayName = DAY_NAMES[date.getDay()];
    const openingHours = { [dayName.toUpperCase()]: '8:00 AM - 6:00 PM' };
    expect(getTodayHours(openingHours, date)).toBe('8:00 AM - 6:00 PM');
  });

  it('returns null when the day is missing from the map', () => {
    const date = new Date(2026, 6, 6);
    const otherDay = DAY_NAMES[(date.getDay() + 1) % 7];
    const openingHours = { [otherDay]: '8:00 AM - 6:00 PM' };
    expect(getTodayHours(openingHours, date)).toBeNull();
  });

  it('returns null when openingHours is undefined', () => {
    expect(getTodayHours(undefined)).toBeNull();
  });
});
```

- [ ] **Step 2: Run the test and confirm it fails**

Run:
```bash
npx vitest run src/utils/hours.test.ts
```
Expected: FAIL — cannot resolve `./hours`.

- [ ] **Step 3: Implement `hours.ts`**

Create `src/utils/hours.ts`:
```ts
export const DAY_NAMES = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
] as const;

export function getTodayHours(
  openingHours: Record<string, string> | undefined,
  date: Date = new Date(),
): string | null {
  if (!openingHours) return null;
  const dayName = DAY_NAMES[date.getDay()];
  const entry = Object.entries(openingHours).find(([key]) => key.toLowerCase() === dayName);
  return entry ? entry[1] : null;
}
```

- [ ] **Step 4: Run the test and confirm it passes**

Run:
```bash
npx vitest run src/utils/hours.test.ts
```
Expected: PASS (3 tests).

- [ ] **Step 5: Verify the full build**

Run:
```bash
npm run build
```
Expected: exits 0.

- [ ] **Step 6: Commit**

```bash
git add src/utils/hours.ts src/utils/hours.test.ts
git commit -m "Add today's-opening-hours lookup utility"
```

---

### Task 5: Extend `ParkCard` with hours, distance, and save button

**Files:**
- Modify: `src/components/ParkCard.tsx`

**Interfaces:**
- Consumes:
  - `haversineKm`, `UserLocation` from `src/utils/geo.ts` (Task 2)
  - `getTodayHours` from `src/utils/hours.ts` (Task 4)
  - `useFavoritesStore` from `src/store/favorites.store.ts` (Task 3)
- Produces: `ParkCard(props: { park: Park; userLocation?: UserLocation | null })` — `userLocation` is optional and backwards compatible; existing callers (`Parks.tsx`) that don't pass it keep working unchanged, simply without a distance shown.

- [ ] **Step 1: Replace `src/components/ParkCard.tsx` with the extended version**

```tsx
import { Link } from 'react-router-dom';
import { Star, ChevronRight, Heart, Clock, MapPinned } from 'lucide-react';
import type { Park } from '../api/parks.api';
import { mediaUrl } from '../api/parks.api';
import { useTranslation } from 'react-i18next';
import { useFavoritesStore } from '../store/favorites.store';
import { haversineKm, type UserLocation } from '../utils/geo';
import { getTodayHours } from '../utils/hours';

interface ParkCardProps {
  park: Park;
  userLocation?: UserLocation | null;
}

export default function ParkCard({ park, userLocation }: ParkCardProps) {
  const { t } = useTranslation();
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const primaryImage = park.media?.find((m) => m.isPrimary && m.type === 'IMAGE');
  const todayHours = getTodayHours(park.openingHours);
  const distanceKm = userLocation
    ? haversineKm(userLocation.lat, userLocation.lng, park.latitude, park.longitude)
    : null;
  const saved = isFavorite(park.id);

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(park.id);
  };

  return (
    <Link
      to={`/parks/${park.slug}`}
      className="group block bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 border border-gray-100 transition-all duration-300"
    >
      <div className="relative h-64 bg-gradient-to-br from-green-100 to-emerald-200 overflow-hidden">
        {primaryImage ? (
          <img
            src={mediaUrl(primaryImage.url)}
            alt={park.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-green-300 text-6xl select-none">
            🌳
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <button
          type="button"
          onClick={handleSaveClick}
          aria-label={saved ? 'Remove from saved parks' : 'Save park'}
          className="absolute top-3 left-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
        >
          <Heart size={16} className={saved ? 'text-red-500 fill-red-500' : 'text-gray-500'} />
        </button>
        <div className="absolute top-3 right-3">
          <span className="bg-white/90 backdrop-blur-sm text-green-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            {park.entryFee || t('parks.free')}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-bold text-gray-900 text-base mb-1 group-hover:text-green-700 transition-colors">
          {park.name}
        </h3>
        <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed mb-3">{park.description}</p>

        {(todayHours || distanceKm !== null) && (
          <div className="flex items-center gap-4 mb-3 text-xs text-gray-500">
            {todayHours && (
              <span className="flex items-center gap-1">
                <Clock size={12} /> {todayHours}
              </span>
            )}
            {distanceKm !== null && (
              <span className="flex items-center gap-1">
                <MapPinned size={12} /> {distanceKm.toFixed(1)} km away
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Star size={13} className="text-amber-400 fill-amber-400" />
            <span className="text-xs text-gray-500 font-medium">
              {park._count?.reviews ?? 0} {t('parks.reviews')}
            </span>
          </div>
          <span className="flex items-center gap-0.5 text-xs font-semibold text-green-600 group-hover:gap-1.5 transition-all">
            View Park <ChevronRight size={13} />
          </span>
        </div>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Verify the build**

Run:
```bash
npm run build
```
Expected: exits 0.

- [ ] **Step 3: Manual browser verification**

Run:
```bash
npm run dev
```
Open the printed local URL, go to `/parks`. Confirm: (a) cards render with today's opening hours where the park has one, (b) clicking the heart icon toggles it red/gray without navigating to the park detail page, (c) refreshing the page keeps the heart state (check via browser devtools Application tab, key `smart-parks-web-favorites` in Local Storage). Stop the dev server (Ctrl+C) when done.

- [ ] **Step 4: Commit**

```bash
git add src/components/ParkCard.tsx
git commit -m "Add opening hours, distance, and save button to ParkCard"
```

---

### Task 6: Upcoming Events horizontal carousel

**Files:**
- Create: `src/components/UpcomingEventsCarousel.tsx`

**Interfaces:**
- Consumes: existing `EventCard` (`src/components/EventCard.tsx`, unchanged) and `Event` type from `src/api/events.api.ts`
- Produces: `UpcomingEventsCarousel(props: { events: Event[] })`

- [ ] **Step 1: Create the carousel component**

Create `src/components/UpcomingEventsCarousel.tsx`:
```tsx
import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import EventCard from './EventCard';
import type { Event } from '../api/events.api';

export default function UpcomingEventsCarousel({ events }: { events: Event[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8 * (direction === 'left' ? -1 : 1);
    el.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {events.map((event) => (
          <div key={event.id} className="snap-start shrink-0 w-[300px] sm:w-[340px]">
            <EventCard event={event} />
          </div>
        ))}
      </div>

      {events.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => scrollByCard('left')}
            aria-label="Scroll to previous events"
            className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft size={18} className="text-gray-600" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard('right')}
            aria-label="Scroll to next events"
            className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ChevronRight size={18} className="text-gray-600" />
          </button>
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify the build**

Run:
```bash
npm run build
```
Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/UpcomingEventsCarousel.tsx
git commit -m "Add horizontal scroll-snap carousel for upcoming events"
```

(This component isn't wired into a page yet — that happens in Task 8. Manual verification happens there.)

---

### Task 7: Hero section (`Hero.tsx` + `AnimatedCounter.tsx`)

**Files:**
- Create: `src/components/AnimatedCounter.tsx`
- Create: `src/components/Hero.tsx`

**Interfaces:**
- Consumes: `Park` type (`src/api/parks.api.ts`), `mediaUrl` (`src/api/parks.api.ts`), `Event` type (`src/api/events.api.ts`)
- Produces:
  - `AnimatedCounter(props: { target: number; suffix?: string })`
  - `Hero(props: { parks: Park[]; totalParkCount: number; monthlyEventCount: number; featuredPark: Park | null; upcomingEvent: Event | null })`

- [ ] **Step 1: Create `AnimatedCounter.tsx`**

Create `src/components/AnimatedCounter.tsx`:
```tsx
import { useEffect, useRef, useState } from 'react';
import { useInView, animate } from 'framer-motion';

export default function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, target, {
      duration: 1.5,
      ease: 'easeOut',
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}
```

- [ ] **Step 2: Create `Hero.tsx`**

Create `src/components/Hero.tsx`:
```tsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ArrowRight, MapPin, Search } from 'lucide-react';
import type { Park } from '../api/parks.api';
import { mediaUrl } from '../api/parks.api';
import type { Event } from '../api/events.api';
import AnimatedCounter from './AnimatedCounter';

interface HeroProps {
  parks: Park[];
  totalParkCount: number;
  monthlyEventCount: number;
  featuredPark: Park | null;
  upcomingEvent: Event | null;
}

const CROSSFADE_INTERVAL_MS = 6000;

const MARKERS = [
  { top: '20%', left: '15%', delay: 0 },
  { top: '65%', left: '25%', delay: 0.6 },
  { top: '35%', left: '80%', delay: 1.2 },
  { top: '75%', left: '70%', delay: 1.8 },
];

export default function Hero({
  parks,
  totalParkCount,
  monthlyEventCount,
  featuredPark,
  upcomingEvent,
}: HeroProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);

  const backgroundImages = useMemo(
    () =>
      parks
        .map((park) => park.media?.find((m) => m.isPrimary && m.type === 'IMAGE'))
        .filter((media): media is NonNullable<typeof media> => Boolean(media))
        .map((media) => mediaUrl(media.url)),
    [parks],
  );

  useEffect(() => {
    if (backgroundImages.length < 2) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % backgroundImages.length);
    }, CROSSFADE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [backgroundImages.length]);

  useEffect(() => {
    pathRefs.current.forEach((path, i) => {
      if (!path) return;
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 2.5,
        delay: i * 0.3,
        ease: 'power2.inOut',
        repeat: -1,
        yoyo: true,
        repeatDelay: 3,
      });
    });
  }, []);

  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 600], [0, 120]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(query.trim() ? `/parks?q=${encodeURIComponent(query.trim())}` : '/parks');
  };

  return (
    <section className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden bg-dark-forest">
      <motion.div className="absolute inset-0" style={{ y: backgroundY }}>
        <AnimatePresence mode="sync">
          {backgroundImages.length > 0 && (
            <motion.img
              key={backgroundImages[activeIndex]}
              src={backgroundImages[activeIndex]}
              alt=""
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-dark-forest/90 via-primary-green/70 to-dark-forest/95" />
      </motion.div>

      <div className="absolute inset-0 pointer-events-none">
        {MARKERS.map((marker, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ top: marker.top, left: marker.left }}
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: marker.delay, ease: 'easeInOut' }}
          >
            <MapPin size={20} className="text-accent-gold drop-shadow-lg" />
          </motion.div>
        ))}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path
            ref={(el) => { pathRefs.current[0] = el; }}
            d="M15,20 Q45,10 80,35"
            stroke="#22C55E"
            strokeWidth="0.3"
            fill="none"
            opacity="0.6"
          />
          <path
            ref={(el) => { pathRefs.current[1] = el; }}
            d="M25,65 Q50,55 70,75"
            stroke="#F4B400"
            strokeWidth="0.3"
            fill="none"
            opacity="0.6"
          />
        </svg>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white pt-12 pb-16">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-8 text-sm font-medium">
          <MapPin size={14} className="text-light-green" />
          <span className="text-off-white/90">Addis Ababa, Ethiopia 🇪🇹</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.07] mb-6 tracking-tight">
          Experience Addis Ababa
          <br />
          Like Never Before
        </h1>

        <p className="text-off-white/80 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
          Discover parks, events, hidden gems, cultural experiences and nature across Ethiopia's capital.
        </p>

        <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto mb-8">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/25 rounded-full px-5 py-3">
            <Search size={18} className="text-off-white/70 shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search parks, events, and places..."
              className="flex-1 bg-transparent outline-none text-white placeholder:text-off-white/50 text-sm"
            />
            <button
              type="submit"
              className="bg-accent-gold text-dark-forest text-sm font-bold px-5 py-2 rounded-full hover:brightness-105 transition-all shrink-0"
            >
              Search
            </button>
          </div>
        </form>

        <div className="flex items-center justify-center gap-4 flex-wrap mb-14">
          <Link
            to="/parks"
            className="inline-flex items-center gap-2 bg-accent-gold text-dark-forest px-8 py-4 rounded-full font-bold text-base hover:brightness-105 active:scale-95 transition-all shadow-2xl"
          >
            Explore Parks <ArrowRight size={18} />
          </Link>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-full font-semibold text-base hover:bg-white/20 active:scale-95 transition-all"
          >
            Explore Events
          </Link>
          <Link
            to="/map"
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-full font-semibold text-base hover:bg-white/20 active:scale-95 transition-all"
          >
            Interactive Map
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl py-5 px-3">
            <div className="text-3xl font-extrabold text-light-green">
              <AnimatedCounter target={totalParkCount} suffix="+" />
            </div>
            <div className="text-xs text-off-white/70 mt-1">Parks</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl py-5 px-3">
            <div className="text-3xl font-extrabold text-light-green">
              <AnimatedCounter target={monthlyEventCount} suffix="+" />
            </div>
            <div className="text-xs text-off-white/70 mt-1">Monthly Events</div>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex absolute bottom-10 left-0 right-0 justify-between px-10 z-10 pointer-events-none">
        {upcomingEvent && (
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="pointer-events-auto"
          >
            <Link
              to={`/parks/${upcomingEvent.park.slug}`}
              className="flex items-center gap-3 bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-3 max-w-xs hover:bg-white/20 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-accent-gold/20 flex items-center justify-center text-xl shrink-0">
                🎉
              </div>
              <div className="min-w-0 text-left">
                <div className="text-[10px] uppercase tracking-wide text-off-white/60 font-bold">
                  Upcoming Event
                </div>
                <div className="text-sm font-semibold text-white truncate">{upcomingEvent.title}</div>
              </div>
            </Link>
          </motion.div>
        )}

        {featuredPark && (
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="pointer-events-auto"
          >
            <Link
              to={`/parks/${featuredPark.slug}`}
              className="flex items-center gap-3 bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-3 max-w-xs hover:bg-white/20 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-light-green/20 flex items-center justify-center text-xl shrink-0">
                🌳
              </div>
              <div className="min-w-0 text-left">
                <div className="text-[10px] uppercase tracking-wide text-off-white/60 font-bold">
                  Featured Park
                </div>
                <div className="text-sm font-semibold text-white truncate">{featuredPark.name}</div>
              </div>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Verify the build**

Run:
```bash
npm run build
```
Expected: exits 0.

- [ ] **Step 4: Commit**

```bash
git add src/components/Hero.tsx src/components/AnimatedCounter.tsx
git commit -m "Add Hero component with crossfading imagery, search, and animated stats"
```

(Not wired into a page yet — that happens in Task 8. Manual verification happens there.)

---

### Task 8: Wire `Hero`, updated `ParkCard`, and `UpcomingEventsCarousel` into `home.tsx`

**Files:**
- Modify: `src/pages/home.tsx`

**Interfaces:**
- Consumes: `Hero` (Task 7), `ParkCard` with `userLocation` prop (Task 5), `UpcomingEventsCarousel` (Task 6), `useUserLocation` (Task 2)

- [ ] **Step 1: Replace `src/pages/home.tsx`**

```tsx
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { parksApi } from '../api/parks.api';
import type { Park } from '../api/parks.api';
import { eventsApi } from '../api/events.api';
import type { Event } from '../api/events.api';
import ParkCard from '../components/ParkCard';
import UpcomingEventsCarousel from '../components/UpcomingEventsCarousel';
import Hero from '../components/Hero';
import { useUserLocation } from '../utils/geo';
import { ArrowRight, MapPin, QrCode, Bell } from 'lucide-react';

const FEATURES = [
  {
    icon: <MapPin size={26} className="text-green-600" />,
    iconBg: 'bg-green-50 border-green-100',
    title: 'Interactive Map',
    desc: 'Find parks near you with our GPS-powered map. Get directions and explore facilities before you arrive.',
  },
  {
    icon: <QrCode size={26} className="text-blue-600" />,
    iconBg: 'bg-blue-50 border-blue-100',
    title: 'QR Check-In',
    desc: "Scan QR codes at park entrances to instantly access park info, services, and what's happening today.",
  },
  {
    icon: <Bell size={26} className="text-amber-600" />,
    iconBg: 'bg-amber-50 border-amber-100',
    title: 'Live Updates',
    desc: 'Get real-time notifications for upcoming events, park alerts, and community announcements.',
  },
];

function isSameMonth(date: Date, reference: Date): boolean {
  return date.getFullYear() === reference.getFullYear() && date.getMonth() === reference.getMonth();
}

export default function Home() {
  const [parks, setParks] = useState<Park[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const userLocation = useUserLocation();

  useEffect(() => {
    Promise.all([
      parksApi.list().then((r) => setParks(r.data)),
      eventsApi.list().then((r) => setEvents(r.data)),
    ]).finally(() => setLoading(false));
  }, []);

  const monthlyEventCount = useMemo(() => {
    const now = new Date();
    return events.filter((event) => isSameMonth(new Date(event.startDate), now)).length;
  }, [events]);

  const featuredPark = useMemo(
    () =>
      parks.length
        ? [...parks].sort((a, b) => (b._count?.reviews ?? 0) - (a._count?.reviews ?? 0))[0]
        : null,
    [parks],
  );

  const upcomingEvent = useMemo(
    () =>
      events.length
        ? [...events].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())[0]
        : null,
    [events],
  );

  const featuredParks = parks.slice(0, 3);
  const carouselEvents = events.slice(0, 8);

  return (
    <div className="overflow-x-hidden">
      <Hero
        parks={parks}
        totalParkCount={parks.length}
        monthlyEventCount={monthlyEventCount}
        featuredPark={featuredPark}
        upcomingEvent={upcomingEvent}
      />

      {/* ── FEATURES ───────────────────────────────────────────── */}
      <section className="py-20 bg-off-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-xs font-bold tracking-widest text-primary-green uppercase mb-3">
              Why Smart Parks
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Explore Smarter</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-base leading-relaxed">
              Plan your perfect park visit with real-time info, interactive maps, and seamless check-in.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map(({ icon, iconBg, title, desc }) => (
              <div
                key={title}
                className="group p-8 rounded-3xl border border-gray-100 hover:border-green-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default"
              >
                <div className={`w-14 h-14 ${iconBg} border rounded-2xl flex items-center justify-center mb-5`}>
                  {icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PARKS ─────────────────────────────────────── */}
      <section className="py-20 bg-gray-50/70">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-bold tracking-widest text-primary-green uppercase mb-2">
                Green Spaces
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Featured Parks</h2>
            </div>
            <Link
              to="/parks"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-primary-green hover:text-dark-forest border border-green-200 hover:border-green-400 px-5 py-2.5 rounded-full transition-all"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-96 rounded-3xl bg-gray-200 animate-pulse" />
                ))
              : featuredParks.map((park) => (
                  <ParkCard key={park.id} park={park} userLocation={userLocation} />
                ))}
          </div>

          <div className="text-center mt-8 sm:hidden">
            <Link
              to="/parks"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary-green border border-green-200 px-5 py-2.5 rounded-full"
            >
              View all parks <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── UPCOMING EVENTS ────────────────────────────────────── */}
      {!loading && carouselEvents.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs font-bold tracking-widest text-primary-green uppercase mb-2">
                  What's On
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Upcoming Events</h2>
              </div>
              <Link
                to="/events"
                className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-primary-green hover:text-dark-forest border border-green-200 hover:border-green-400 px-5 py-2.5 rounded-full transition-all"
              >
                View all <ArrowRight size={14} />
              </Link>
            </div>

            <UpcomingEventsCarousel events={carouselEvents} />
          </div>
        </section>
      )}

      {/* ── CTA BANNER ─────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-green-700 to-emerald-600 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="relative max-w-2xl mx-auto px-4 text-center text-white">
          <div className="text-5xl mb-5 select-none">🌿</div>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">Ready to Explore?</h2>
          <p className="text-green-100 text-lg mb-8 leading-relaxed">
            Join thousands of Addis Ababa residents discovering their city's beautiful green spaces.
          </p>
          <Link
            to="/parks"
            className="inline-flex items-center gap-2 bg-white text-green-700 px-8 py-4 rounded-full font-bold text-base hover:bg-green-50 active:scale-95 transition-all shadow-xl shadow-green-900/30"
          >
            Start Exploring <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Verify the build**

Run:
```bash
npm run build
```
Expected: exits 0.

- [ ] **Step 3: Manual browser verification**

Run:
```bash
npm run dev
```
Open the printed local URL at `/`. Confirm: (a) hero background cross-fades between real park photos (or shows just the gradient if no park has a primary image yet — not an error state), (b) floating pin markers gently float and the two SVG connector lines animate in, (c) the two stat counters count up when scrolled into view, (d) typing into the search bar and submitting navigates to `/parks?q=<value>`, (e) "Featured Park" and "Upcoming Event" floating glass cards appear on desktop widths and link correctly, (f) Featured Parks grid shows 3 larger cards, (g) Upcoming Events section scrolls horizontally with working arrow buttons. Stop the dev server (Ctrl+C) when done.

- [ ] **Step 4: Commit**

```bash
git add src/pages/home.tsx
git commit -m "Rebuild homepage with new Hero, Featured Parks, and Events carousel"
```

---

### Task 9: Make the Parks page read the `q` search param from the hero search

**Files:**
- Modify: `src/pages/Parks.tsx`

**Interfaces:**
- Consumes: existing `parksApi.list(search?: string)` (unchanged)

- [ ] **Step 1: Read the initial search query from the URL**

Edit `src/pages/Parks.tsx`. Add the import and change the `search` state initializer:

```tsx
import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { parksApi } from '../api/parks.api';
import type { Park } from '../api/parks.api';
import ParkCard from '../components/ParkCard';

export default function Parks() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [parks, setParks] = useState<Park[]>([]);
  const [search, setSearch] = useState(searchParams.get('q') ?? '');

  const load = useCallback(() => {
    parksApi.list(search || undefined).then((r) => setParks(r.data));
  }, [search]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('nav.parks')}</h1>
      <p className="text-gray-500 mb-6">Explore Addis Ababa's parks and green spaces</p>
      <div className="relative mb-8 max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('parks.search_placeholder')}
          className="pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm w-full focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      {parks.length === 0 ? (
        <p className="text-center text-gray-400 py-12">{t('parks.no_results')}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {parks.map((park) => <ParkCard key={park.id} park={park} />)}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify the build**

Run:
```bash
npm run build
```
Expected: exits 0.

- [ ] **Step 3: Manual browser verification**

Run:
```bash
npm run dev
```
Open `/parks?q=<some-existing-park-name-fragment>` directly in the browser. Confirm the search input is pre-filled with that value and the grid shows only matching parks. Then open `/parks` with no query param and confirm all parks show as before. Stop the dev server (Ctrl+C) when done.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Parks.tsx
git commit -m "Read initial park search query from URL for hero search integration"
```

---

## Self-Review Notes

- **Spec coverage:** design tokens/fonts/deps (Task 1), hero rebuild incl. crossfade imagery/parallax/markers/search/CTAs/stats/floating cards (Tasks 2, 7, 8), Featured Parks hours/distance/save (Tasks 2–5), Upcoming Events carousel (Tasks 6, 8), hero search wiring to Parks page (Task 9). All "out of scope" items from the spec (weather, visitor/attraction counts, attendance, Phase 2/3 sections, Next.js/Mapbox) are intentionally absent — matches spec.
- **Type consistency checked:** `UserLocation` (Task 2) used identically in `ParkCard.tsx` (Task 5) and passed from `home.tsx` (Task 8) via `useUserLocation()`. `Park`/`Event` types used consistently from the existing API modules across `Hero.tsx`, `ParkCard.tsx`, `UpcomingEventsCarousel.tsx`, and `home.tsx`. `getTodayHours`/`DAY_NAMES` signatures match between `hours.ts` (Task 4) and its test and consumer (Task 5).
- **No placeholders:** every step has complete, runnable code; no TBDs.
