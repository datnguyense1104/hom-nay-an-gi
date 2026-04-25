# Phase 2 — Deep Link Integration (Shopee Food + Google Maps)

## Overview

- **Priority:** P1 Critical
- **Status:** Complete ✅
- **Effort:** ~0.75d
- **Description:** Add "Đặt qua Shopee Food 🛵" and "Tìm quán gần đây 📍" buttons to suggestion result. Implement geolocation hook + URL builder utilities.

## Key Insights

- No Shopee Food public API → deep link only (URL pattern from PRD is authoritative)
- Google Maps deep link with lat/lng is more accurate; fallback works without coordinates
- City detection: geolocation → reverse-geocode city name → map to Shopee Food slug
- Reverse geocoding without a Maps SDK: parse `city/town` from Nominatim (free, no key) OR use simple lat/lng bounding boxes for 5 supported cities
- Bounding box approach is simpler/faster/offline-capable — preferred
- `navigator.geolocation` is async, needs loading + error states
- Buttons only show after a dish is suggested (same UX pattern as Calendar button)

## Requirements

**Functional:**
- "Đặt qua Shopee Food 🛵" opens Shopee Food search for the dish
- "Tìm quán gần đây 📍" opens Google Maps search near user location
- Geolocation requested on button tap (not on page load — avoids permission prompt on load)
- Fallback: if no geolocation permission, Shopee Food uses city from user settings or generic URL; Maps uses name-only search
- City setting persisted in localStorage via `usePreferences` hook (from Phase 1)

**Non-functional:**
- URL encoding handles Vietnamese characters (use `encodeURIComponent`)
- Links open in new tab (`target="_blank"` with `rel="noopener noreferrer"`)

## Shopee Food URL Spec

```
With city:    https://shopeefood.vn/{city-slug}/search?q={encoded-keyword}
Without city: https://shopeefood.vn/search?q={encoded-keyword}
```

City slug mapping:
```typescript
const CITY_SLUGS: Record<string, string> = {
  "ho-chi-minh": "ho-chi-minh",
  "ha-noi": "ha-noi",
  "da-nang": "da-nang",
  "can-tho": "can-tho",
  "hai-phong": "hai-phong",
};
```

City detection via bounding boxes (lat/lng ranges):
```typescript
// HCM: lat 10.5–11.2, lng 106.4–107.1
// HN:  lat 20.7–21.4, lng 105.6–106.1
// DN:  lat 15.9–16.2, lng 107.9–108.4
// CT:  lat 9.8–10.3,  lng 105.5–106.0
// HP:  lat 20.7–21.0, lng 106.5–107.0
```

## Google Maps URL Spec

```
With coords:    https://www.google.com/maps/search/{encoded}/@{lat},{lng},14z
Without coords: https://www.google.com/maps/search/{encoded}
```

Search query: `"{dish_name} gần đây"` → encoded

## Related Code Files

**Create:**
- `src/utils/deep-links.ts` — URL builders + city detection
- `src/hooks/use-geolocation.ts` — geolocation wrapper hook

**Modify:**
- `src/components/suggestion-display.tsx` — add action buttons (slots prepared in Phase 1)
- `src/hooks/use-preferences.ts` — already has `city` field (Phase 1)

## Implementation Steps

### Step 1: Create `src/utils/deep-links.ts`

```typescript
// City bounding box detection
export function detectCitySlug(lat: number, lng: number): string | null

// Shopee Food URL builder
// Uses dish.shopeeFoodKeyword if available, falls back to dish.name
export function buildShopeeFoodUrl(keyword: string, citySlug?: string | null): string

// Google Maps URL builder
export function buildGoogleMapsUrl(dishName: string, lat?: number | null, lng?: number | null): string
```

All functions pure/testable. No side effects.

### Step 2: Create `src/hooks/use-geolocation.ts`

```typescript
interface GeolocationState {
  lat: number | null;
  lng: number | null;
  citySlug: string | null;
  loading: boolean;
  error: string | null;
}

export function useGeolocation(): {
  location: GeolocationState;
  requestLocation: () => void;  // call on button tap
}
```

- Uses `navigator.geolocation.getCurrentPosition`
- On success: set lat/lng, detect city via `detectCitySlug`, cache in state
- On error: set error message (user denied / unavailable)
- Does NOT auto-request on mount — only when `requestLocation()` is called

### Step 3: Update `src/components/suggestion-display.tsx`

Add two buttons below the dish card (same row, below Calendar button):

```
[🛵 Đặt qua Shopee Food]  [📍 Tìm quán gần đây]
```

Button behavior:
1. User clicks → `requestLocation()` called → geolocation permission prompt (if not yet granted)
2. Once location resolved (or skipped after error) → build URL → `window.open(url, "_blank")`
3. If geolocation is already cached from earlier click → open immediately

Show loading spinner on button while `location.loading === true`.

City fallback priority:
1. Detected city from geolocation
2. User's saved `city` preference from `usePreferences`
3. No city (use generic Shopee Food URL)

Props needed:
```typescript
interface SuggestionDisplayProps {
  // ...existing props...
  dish: Dish | null;
  aiSuggestionName: string | null;  // for keyword lookup
  location: GeolocationState;
  onRequestLocation: () => void;
  preferredCity: string | null;
}
```

### Step 4: Wire geolocation into App.tsx

- Import `useGeolocation` hook
- Pass `location` and `requestLocation` down to `SuggestionDisplay`

## Todo List

- [ ] Create `src/utils/deep-links.ts` with URL builders + city detection
- [ ] Create `src/hooks/use-geolocation.ts`
- [ ] Add Shopee Food + Maps buttons to `suggestion-display.tsx`
- [ ] Handle loading state on buttons
- [ ] City fallback logic (geolocation → saved pref → generic)
- [ ] Wire in `App.tsx`
- [ ] Manual test: grant permission → correct Shopee Food URL with city slug
- [ ] Manual test: deny permission → generic URL fallback
- [ ] Verify Vietnamese text encoded correctly in URLs

## Success Criteria

- Shopee Food button opens `shopeefood.vn/ho-chi-minh/search?q=ph%E1%BB%9F+b%C3%B2` (or equivalent)
- Maps button opens Google Maps with dish name + "gần đây"
- Deny/unavailable geolocation → buttons still work with fallback URL
- No console errors on tap

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Shopee Food URL pattern changes | High | Centralize in `deep-links.ts`, easy to update one file |
| Geolocation blocked by browser | Medium | Fallback to saved city or generic URL |
| Vietnamese char encoding issues | Medium | Always use `encodeURIComponent` |
| City bounding boxes inaccurate | Low | Only affects which city slug is used; fallback to generic |

## Security Considerations

- All URLs opened via `window.open` with `rel="noopener noreferrer"` — prevents tab hijacking
- No user data sent to Shopee Food/Maps except dish name + approximate location (which user explicitly consented to via geolocation prompt)
