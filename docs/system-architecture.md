# System Architecture

**Version:** 1.0 (Phase 2)  
**Architecture Type:** Client-side SPA (Single Page Application)  
**Framework:** React 19 + Vite  
**Last Updated:** April 2025

---

## High-Level Overview

"Hôm Nay Ăn Gì?" is a **pure client-side PWA** (Progressive Web App) with no backend server. All state persists to browser localStorage; external integrations are read-only or OAuth-based.

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser (React 19 SPA)                   │
│  ┌─────────────────────────────────────────────────────────┤
│  │                      App.tsx (Root)                      │
│  │                   State: view, activeTab,                │
│  │                  filters, mood, weather                  │
│  ├─────────────────────────────────────────────────────────┤
│  │  Hooks Layer                                            │
│  │  ├─ useMealHistory (localStorage: meal_history_detailed)│
│  │  ├─ usePreferences (localStorage: user_*_pref)          │
│  │  ├─ useGeolocation (Browser Geolocation API)            │
│  │  ├─ useCalendar (Google OAuth2 + Calendar API)          │
│  │  └─ useAiSuggestion (Gemini 2.0 Flash API)              │
│  ├─────────────────────────────────────────────────────────┤
│  │  Component Layer                                        │
│  │  ├─ FilterPanel (mood/weather/region/budget/dietary)   │
│  │  ├─ SuggestionDisplay (result + action buttons)         │
│  │  ├─ MenuListView (browse 55 dishes)                     │
│  │  └─ MealHistorySection (last 5 meals)                   │
│  ├─────────────────────────────────────────────────────────┤
│  │  Data & Utils                                           │
│  │  ├─ data/dishes-data.ts (55 Vietnamese dishes)          │
│  │  ├─ utils/deep-links.ts (URL building)                  │
│  │  └─ types/dish-types.ts (TypeScript definitions)        │
│  └─────────────────────────────────────────────────────────┘
└─────────────────────────────────────────────────────────────┘
        ↓ (External APIs)
┌─────────────────────────────────────────────────────────────┐
│  Google Cloud                    Shopee Food   Google Maps   │
│  ├─ Gemini 2.0 Flash API        https://      https://      │
│  └─ Calendar API (OAuth2)        shopeefood    google.com/   │
│                                   .vn           maps          │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Architecture

### Component Tree

```
App.tsx (207 LOC)
│
├─ Header
│  ├─ Logo/Icon
│  └─ View Toggle (Random ↔ Menu)
│
├─ Main Content (AnimatePresence)
│  │
│  ├─ Random View (view === "random")
│  │  ├─ FilterPanel (collapsible)
│  │  │  ├─ Mood pills (5 options)
│  │  │  ├─ Weather pills (4 options)
│  │  │  ├─ Region pills (3 options)
│  │  │  ├─ Budget pills (4 options)
│  │  │  ├─ Dietary multi-select (5 tags)
│  │  │  └─ City dropdown (5 cities)
│  │  │
│  │  ├─ SuggestionDisplay (result card)
│  │  │  ├─ Dish name + description
│  │  │  ├─ AI suggestion text (if AI mode)
│  │  │  ├─ Empty pool warning
│  │  │  ├─ Action buttons:
│  │  │  │  ├─ Shopee Food deep link
│  │  │  │  ├─ Google Maps link
│  │  │  │  └─ Google Calendar log
│  │  │  └─ Calendar status indicator
│  │  │
│  │  ├─ Action Buttons (grid)
│  │  │  ├─ Randomize button (slot-machine spinner)
│  │  │  └─ AI Suggest button (pulse on loading)
│  │  │
│  │  └─ MealHistorySection (collapsible)
│  │     └─ Last 5 meals as pill buttons
│  │
│  └─ Menu View (view === "menu")
│     └─ MenuListView
│        ├─ Search input
│        └─ Dish grid (55 dishes, real-time filtered)
│
└─ Footer
   └─ Copyright + year
```

---

## Data Flow Architecture

### State Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│  App.tsx Local State                                    │
├─────────────────────────────────────────────────────────┤
│ view: "random" | "menu"                                 │
│ activeTab: "Sáng" | "Trưa" | "Tối" | "Khuya"           │
│ selectedDish: Dish | null                               │
│ isSpinning: boolean (animation state)                   │
│ emptyPool: boolean (no matches warning)                 │
│ showHistory: boolean (toggle)                           │
│ showFilters: boolean (toggle)                           │
│ mood: string (user's selected mood)                     │
│ weather: string (user's selected weather)              │
│ region: string (user's selected region)                │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  Hook State (Persistent & Derived)                      │
├─────────────────────────────────────────────────────────┤
│ useMealHistory                                          │
│ ├─ mealHistory: MealEntry[] (localStorage)              │
│ ├─ recentDisplayHistory: string[] (last 5)              │
│ └─ getRecentlyEaten(): Set<string>                      │
│
│ usePreferences                                          │
│ ├─ budget: "any" | BudgetRange (localStorage)           │
│ ├─ dietaryPrefs: DietaryTag[] (localStorage)            │
│ └─ city: string (localStorage)                          │
│
│ useGeolocation                                          │
│ ├─ location: GeolocationState                           │
│ │  ├─ lat: number | null                                │
│ │  ├─ lng: number | null                                │
│ │  ├─ citySlug: string | null                           │
│ │  └─ loading: boolean                                  │
│ └─ requestLocation(): Promise                           │
│
│ useCalendar                                             │
│ ├─ isLogged: boolean                                    │
│ ├─ calendarStatus: "idle"|"loading"|"success"|"error"   │
│ ├─ logToCalendar(name, mealTime): Promise               │
│ └─ resetCalendar(): void                                │
│
│ useAiSuggestion                                         │
│ ├─ isAiLoading: boolean                                 │
│ ├─ aiSuggestion: string | null                          │
│ └─ getSmartSuggestion(context): Promise                 │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  Computed State (useMemo)                               │
├─────────────────────────────────────────────────────────┤
│ basePool: Dish[]                                        │
│ = DISHES                                                │
│   .filter(time)                                         │
│   .filter(budget)                                       │
│   .filter(dietary)                                      │
│ Dependencies: [activeTab, budget, dietaryPrefs]        │
└─────────────────────────────────────────────────────────┘
```

### User Action → Result Flow

```
┌─ Random Suggestion ─────────────────────────────────┐
│                                                     │
│ 1. User clicks "Ngẫu nhiên"                         │
│    ├─ setIsSpinning(true)                           │
│    ├─ Clear previous suggestion                     │
│    └─ Disable buttons                               │
│                                                     │
│ 2. Calculate pool                                   │
│    ├─ basePool (from memoized filter)              │
│    ├─ Deduplicate history (48h + last 2)           │
│    └─ Use deduplicated pool (or full if empty)    │
│                                                     │
│ 3. Animate slot-machine                             │
│    ├─ setInterval every 80ms                        │
│    ├─ Random pick from pool                         │
│    └─ Update selectedDish 12+ times                 │
│                                                     │
│ 4. Final result                                     │
│    ├─ setIsSpinning(false)                          │
│    ├─ Show final dish                               │
│    └─ Add to meal history (localStorage)            │
│                                                     │
└─────────────────────────────────────────────────────┘

┌─ AI Suggestion ─────────────────────────────────────┐
│                                                     │
│ 1. User clicks "AI Gợi ý"                           │
│    ├─ Build context object:                         │
│    │  ├─ mealTime: activeTab                        │
│    │  ├─ mood, weather, region (if set)             │
│    │  ├─ budget, dietaryPrefs                       │
│    │  └─ basePool (for filtering)                   │
│    └─ Call getSmartSuggestion()                     │
│                                                     │
│ 2. Send prompt to Gemini 2.0 Flash                  │
│    ├─ API key: env.GEMINI_API_KEY                   │
│    ├─ Prompt includes: context + time + mood + ...  │
│    └─ setIsAiLoading(true)                          │
│                                                     │
│ 3. Parse response                                   │
│    ├─ Expected format: "Phở Bò: Lý do gợi ý..."    │
│    ├─ Graceful fallback if API fails                │
│    └─ setAiSuggestion(text)                         │
│                                                     │
│ 4. User sees suggestion                             │
│    ├─ SuggestionDisplay renders aiSuggestion       │
│    ├─ Action buttons active (Shopee, Maps, Cal)     │
│    └─ setIsAiLoading(false)                         │
│                                                     │
└─────────────────────────────────────────────────────┘

┌─ Order Workflow ────────────────────────────────────┐
│                                                     │
│ 1. User clicks "Shopee Food"                        │
│    ├─ Resolve city (geo → pref → null)              │
│    ├─ Build URL: buildShopeeFoodUrl(name, city)    │
│    └─ Open in new tab                               │
│                                                     │
│ 2. User clicks "Google Maps"                        │
│    ├─ Get coordinates (geo if available)            │
│    ├─ Build URL: buildGoogleMapsUrl(name, lat, lng) │
│    └─ Open in new tab                               │
│                                                     │
│ 3. User clicks "Ghi vào lịch"                       │
│    ├─ Trigger OAuth2 token request                  │
│    ├─ User sees Google login popup                  │
│    ├─ Grant calendar.events scope                   │
│    ├─ Create event with meal name                   │
│    └─ Show success/error status                     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Hook Dependency Map

```
App.tsx (root)
│
├─ useMealHistory
│  ├─ State: mealHistory (loaded from localStorage)
│  ├─ Effect: write to localStorage on change
│  └─ Exports: addToHistory, getRecentlyEaten, recentDisplayHistory
│
├─ usePreferences
│  ├─ State: budget, dietaryPrefs, city (from localStorage)
│  ├─ Effects: sync to localStorage
│  └─ Exports: setBudget, toggleDietary, setCity
│
├─ useGeolocation
│  ├─ State: location {lat, lng, citySlug, loading, error}
│  ├─ Action: requestLocation() triggers navigator.geolocation
│  └─ Export: location, requestLocation
│
├─ useCalendar
│  ├─ State: isLogged, calendarStatus
│  ├─ Action: logToCalendar() initiates OAuth2 + API call
│  └─ Export: isLogged, calendarStatus, logToCalendar, resetCalendar
│
└─ useAiSuggestion
   ├─ State: isAiLoading, aiSuggestion
   ├─ Action: getSmartSuggestion(context) calls Gemini API
   └─ Export: isAiLoading, aiSuggestion, getSmartSuggestion, clearSuggestion
```

---

## Filter Pipeline (Detailed)

The core algorithm for suggestion generation:

```
INPUT: DISHES (55 items)

STEP 1: Time Filter
├─ Filter by activeTab: "Sáng" | "Trưa" | "Tối" | "Khuya"
├─ Each dish has time: MealTime[]
└─ Result: ~15–25 dishes per meal time

STEP 2: Budget Filter
├─ IF budget === "any": skip (include all)
├─ ELSE: filter d.budget === selected
├─ Budget values: "under-50k" | "50k-100k" | "over-100k"
└─ Result: ~5–15 dishes per budget

STEP 3: Dietary Filter
├─ IF dietaryPrefs.length === 0: skip (no restrictions)
├─ ELSE: filter dietaryPrefs.every(p => d.dietary.includes(p))
│  ├─ AND logic: all selected tags must be in dish.dietary
│  ├─ Example: [chay, no-seafood] → dish must satisfy BOTH
│  └─ Most dishes have [] (no restrictions)
└─ Result: ~2–10 dishes (often empty if very restrictive)

STEP 4: History Deduplication (on randomize only)
├─ getRecentlyEaten() returns Set<string>
│  ├─ Include: meals in last 48 hours
│  ├─ Include: last 2 meals (consecutive block)
│  └─ Example: {"Phở Bò", "Bún Chả"}
├─ deduped = pool.filter(d => !recentlyEaten.has(d.name))
├─ IF deduped.length === 0: use full pool (break dedup)
└─ Result: filtered pool without recent meals

STEP 5: Random Pick
├─ final = pool[Math.floor(Math.random() * pool.length)]
├─ selectedDish = final
└─ addToHistory(final.name)

OUTPUT: Suggested Dish
```

**Example execution:**

```
TIME FILTER
  Sáng (5–11h) → ["Phở Bò", "Bánh Mì", "Xôi Xéo", ...]

BUDGET FILTER
  50k-100k → ["Phở Bò", "Bún Chả", "Cơm Tấm", ...]

DIETARY FILTER
  [chay] (vegetarian) → ["Xôi Xéo", "Canh Rau Cải", ...]
  (Most dishes removed because they contain meat)

DEDUP FILTER
  Recent: ["Phở Bò"] (eaten 2 hours ago)
  → ["Canh Rau Cải", ...] (Phở removed)

RANDOM
  Pick: "Canh Rau Cải"
  Add to history, show to user
```

---

## Geolocation & City Detection

### Bounding Box Approach

```
CITY DETECTION LOGIC
│
├─ User clicks "Yêu cầu vị trí" button
├─ Call navigator.geolocation.getCurrentPosition()
├─ Browser shows permission dialog
│  ├─ IF User allows:
│  │  ├─ Get {latitude, longitude}
│  │  ├─ Call detectCitySlug(lat, lng)
│  │  ├─ Check against 5 hardcoded bounding boxes
│  │  ├─ Return matched city slug or null
│  │  └─ Store in location state (not persistent)
│  │
│  └─ IF User denies:
│     ├─ Catch error
│     ├─ Show error message
│     └─ Fall back to saved city preference
│
├─ Fallback Chain (for deep links):
│  resolveCitySlug(lat, lng, savedCity)
│  ├─ 1st: Use geo-detected city (if available)
│  ├─ 2nd: Use saved preference (from localStorage)
│  └─ 3rd: Return null (generic URL)
│
└─ URL Building:
   ├─ Shopee Food: "https://shopeefood.vn/{slug}/search?q={keyword}"
   ├─ Generic: "https://shopeefood.vn/search?q={keyword}"
   └─ Reason: Shopee Food city-specific URLs improve UX

CITY BOUNDS DATA
│
├─ HCM: 10.5–11.2°N, 106.4–107.1°E
├─ HN:  20.7–21.4°N, 105.6–106.1°E
├─ Đà Nẵng: 15.9–16.2°N, 107.9–108.4°E
├─ Cần Thơ: 9.8–10.3°N, 105.5–106.0°E
└─ Hải Phòng: 20.7–21.0°N, 106.5–107.0°E
```

### Fallback Chain Diagram

```
User wants to order

┌─ Check geolocation permission ─┐
│                                │
├─ Granted         │             Denied
│   │               │
│   ├─ Get coords   │
│   │   │           │
│   │   ├─ Detect   │
│   │   │ city      │
│   │   │   │       │
│   │   │   ├─Found │ Not found  │
│   │   │   │   │   │    │       │
│   │   │   │   ↓    ↓    │       │
│   │   │   │  Use   Use   │       │
│   │   │   │ geo    saved  │       │
│   │   │   │ city   pref   │       │
│   │   │   │  │      │     │       │
│   │   └───┼──┴──┬───┘     │       │
│   │       │     │         │       │
│   │       ├─────┴─────────┼───────┤
│   │       │               │       │
│   │       ↓               ↓       │
│   │   URL with city   Generic URL │
│   │       │               │       │
│   └───────┴───────────────┴───────┘
        │
        ↓
    Deep link opened in new tab
```

---

## localStorage Schema

### Data Structure

```javascript
// meal_history_detailed
[
  { timestamp: 1713897600000, name: "Phở Bò" },
  { timestamp: 1713811200000, name: "Bún Chả" },
  { timestamp: 1713724800000, name: "Cơm Tấm" },
  // ... up to 50 entries
]

// user_budget_pref
"50k-100k"  // or "any", "under-50k", "over-100k"

// user_dietary_prefs
["chay", "no-seafood"]  // or []

// user_city
"ho-chi-minh"  // or "ha-noi", "da-nang", "can-tho", "hai-phong", ""
```

### Persistence Flow

```
Component State Change
         │
         ↓
    useEffect
    (dependency array)
         │
         ↓
localStorage.setItem(key, JSON.stringify(value))
         │
         ↓
Persisted in IndexedDB-backed storage
(survives browser restart)
         │
         ↓
App restart
         │
         ├─ Read from localStorage
         ├─ Parse JSON
         ├─ Validate against schema
         └─ Restore to useState
```

---

## External API Integrations

### Google Gemini API (Suggestion)

```
REQUEST
├─ Endpoint: https://generativelanguage.googleapis.com/...
├─ Model: gemini-2.0-flash
├─ Auth: Bearer token (process.env.GEMINI_API_KEY)
├─ Method: POST /v1beta/models/gemini-2.0-flash:generateContent
│
└─ Payload:
   {
     "contents": [
       {
         "parts": [
           {
             "text": "Bạn là chuyên gia ẩm thực...
                      Tôi tìm món cho bữa Trưa.
                      Tâm trạng: Mệt mỏi
                      ..."
           }
         ]
       }
     ]
   }

RESPONSE
├─ Success (200):
│  └─ { text: "Phở Bò: Nước dùng thanh ngọt giúp..." }
│
└─ Error (any):
   └─ Fallback: "Bún Chả: Thịt nướng thơm lừng..."
```

### Google Calendar API (Log Meal)

```
FLOW
1. User clicks "Ghi vào lịch"
2. Call google.accounts.oauth2.initTokenClient()
3. User sees Google login popup
4. Grant scope: https://www.googleapis.com/auth/calendar.events
5. Receive access_token

REQUEST
├─ Endpoint: https://www.googleapis.com/calendar/v3/calendars/primary/events
├─ Method: POST
├─ Headers: Authorization: Bearer {access_token}
│
└─ Payload:
   {
     "summary": "🍴 Phở Bò (Trưa)",
     "description": "Bữa Trưa được gợi ý từ Hôm Nay Ăn Gì",
     "start": { "dateTime": "2025-04-25T12:30:00.000Z" },
     "end": { "dateTime": "2025-04-25T13:30:00.000Z" }
   }

RESPONSE
├─ Success (200):
│  └─ Event created in user's Google Calendar
│
└─ Error (any):
   └─ Show error message in UI
```

### Shopee Food & Google Maps (Deep Links)

```
Not API calls — simple URL construction + navigation

SHOPEE FOOD
├─ Base: https://shopeefood.vn/{city-slug}/search?q={keyword}
├─ City slug from: geolocation OR saved preference
├─ Keyword: dish name URL-encoded
└─ Action: window.open(url, "_blank")

GOOGLE MAPS
├─ Base: https://www.google.com/maps/search/{query}/@{lat},{lng},14z
├─ Query: "{dish name} gần đây" (with Vietnamese)
├─ Coordinates: from geolocation
├─ Zoom: 14x (city level)
└─ Action: window.open(url, "_blank")
```

---

## Performance Characteristics

### Initial Load
```
1. Parse HTML + CSS             ~200ms
2. Download JS bundle           ~500ms (gzipped: 150KB)
3. React hydration               ~100ms
4. Load localStorage             ~50ms
5. Render components             ~100ms
────────────────────────────────────
TOTAL FCP (First Contentful Paint) ~500–1000ms
TOTAL TTI (Time to Interactive)    ~1000–1500ms
```

### Suggestion Timing
```
RANDOM SUGGESTION
├─ Calculate basePool            ~5ms (useMemo cached)
├─ Deduplicate history           ~2ms
├─ Slot-machine animation        ~1000ms (12 spins × 80ms)
└─ Add to localStorage            ~5ms
TOTAL: ~1000ms (animation-dominated)

AI SUGGESTION
├─ Validate context              ~2ms
├─ Send to Gemini API            ~0ms (async)
├─ Wait for response             ~2000–3000ms (network)
├─ Parse and display             ~50ms
└─ Update state                  ~5ms
TOTAL: ~2000–3000ms (API-dominated)
```

### Memory Usage
```
Data in memory:
├─ DISHES array (55 items)       ~20KB
├─ mealHistory (up to 50)         ~15KB
├─ React component tree           ~50KB
├─ Hooks & closures               ~30KB
└─ Cached selectors/memoization   ~20KB
────────────────────────────────────
TOTAL: ~135KB (minimal, no large assets)
```

---

## Scalability Considerations

### Phase 3+ Needs

**If adding features, consider:**

1. **Dish count grows (55 → 500+)**
   - Implement pagination in MenuListView
   - Add search indexing
   - Category-based lazy loading

2. **User accounts (Phase 4)**
   - Migrate localStorage → backend database
   - Implement user authentication
   - Sync preferences across devices

3. **Group voting (Phase 3)**
   - Introduce simple backend API
   - WebSocket for real-time voting
   - Group session management

4. **Nutritional info (Phase 4)**
   - Add nutrition DB schema
   - Filter by macro targets
   - Display on cards

### Current Limitations

- **No persistence across browsers** (localStorage is device-specific)
- **No offline support** (requires network for Gemini API & Maps)
- **Fixed dish dataset** (requires code change to update)
- **Single-user only** (no multi-user sync)

---

## Security Architecture

### API Key Management
```
GEMINI_API_KEY
├─ Stored: .env.local (dev) OR env var (production)
├─ Access: import.meta.env.GEMINI_API_KEY
├─ Risk: Client-side exposure (visible in network tab)
├─ Mitigation: Restrict by HTTP referrer in Google Cloud Console
└─ Consider: Move to backend proxy in production

GOOGLE_CLIENT_ID
├─ Stored: .env.local (dev) OR env var (production)
├─ Access: import.meta.env.VITE_GOOGLE_CLIENT_ID
├─ Risk: Low (public client ID for OAuth2)
├─ Mitigation: Restrict redirect URIs in Google Cloud Console
└─ Never: Commit secrets to git
```

### localStorage Security
```
ASSUMPTIONS
├─ User is sole device operator
├─ No sensitive data in localStorage (only preferences)
├─ XSS vulnerabilities mitigated by React (no eval())
└─ CSRF not applicable (client-side only, no mutations on server)

VALIDATION
├─ All localStorage reads wrapped in try-catch
├─ JSON.parse validated against expected types
├─ Enum values checked against ALLOWED_BUDGETS/DIETARY sets
└─ City slug validated against CITY_OPTIONS
```

### OAuth2 Flow
```
GOOGLE CALENDAR OAUTH2
├─ Scope: https://www.googleapis.com/auth/calendar.events
├─ Only permission: Create calendar events (read-only calendar access)
├─ No access to: Email, Drive, other Google services
├─ Token lifetime: ~1 hour (browser session only)
├─ Revocation: Auto-revoked on browser close
└─ No token storage: Discarded after use (stateless)
```

---

## Deployment Architecture

### Build Pipeline
```
Development
    ↓
npm run build (Vite)
    ↓
Optimization:
├─ Tree-shaking (unused code removed)
├─ Minification (variable names shortened)
├─ CSS purging (unused Tailwind removed)
└─ Code splitting (if needed)
    ↓
Output:
├─ dist/index.html (~5KB)
├─ dist/assets/main-[hash].js (~150KB gzipped)
└─ dist/assets/style-[hash].css (~30KB gzipped)
    ↓
Deployment (Vercel/Netlify):
├─ Upload to CDN
├─ Set HTTP headers (cache-control, CSP)
├─ Enable gzip compression
└─ Redirect env vars to production values
    ↓
Production
├─ Edge caching (Vercel/Netlify edge network)
├─ Instant deploy (no build on server)
└─ Environment variables injected at runtime
```

### Environment Variable Resolution
```
Development (.env.local)
    ↓
npm run dev
    ↓
Vite loads: import.meta.env.GEMINI_API_KEY
    ↓
Replaced at build time (or runtime in preview)

Production (Vercel/Netlify)
    ↓
Set via platform dashboard (never in code)
    ↓
build: npm run build
    ↓
deploy: upload dist/
    ↓
Runtime injection of env vars
```

---

## Monitoring & Debugging

### Error Tracking (Recommended)
```
Currently: console.error() only
Future: Sentry integration

EVENTS TO TRACK
├─ Gemini API failures (fallback used)
├─ Calendar OAuth errors
├─ Geolocation denials
├─ localStorage corruption
└─ Network timeouts
```

### Performance Monitoring (Recommended)
```
Currently: None
Future: Web Vitals integration

METRICS
├─ Largest Contentful Paint (LCP)
├─ Cumulative Layout Shift (CLS)
├─ First Input Delay (FID)
└─ Time to Interactive (TTI)
```

---

## Testing Architecture

### Unit Tests (Recommended)
```
Pure functions to test:
├─ detectCitySlug(lat, lng)
├─ buildShopeeFoodUrl(keyword, city)
├─ buildGoogleMapsUrl(name, lat, lng)
├─ Filter pipeline deduplication
└─ localStorage validation
```

### Integration Tests (Optional)
```
Component interactions:
├─ FilterPanel changes → basePool recalculates
├─ Toggle dietary → suggestions update
├─ Randomize twice → different results
└─ Calendar button → OAuth flow initiates
```

### E2E Tests (Nice-to-have)
```
Full user flows:
├─ Random suggest → Shopee Food → Order
├─ Set filters → AI suggest → Calendar log
├─ Browse menu → Search → View details
└─ Geolocation → City detection → Deep link
```

---

## Conclusion

"Hôm Nay Ăn Gì?" is a clean, client-side SPA optimized for fast decisions (< 30s). Its modular hook-based architecture scales to Phase 3–4 features without major refactors. The filter pipeline and fallback chains ensure resilience to API failures and user preference gaps.

For more implementation details, see:
- `codebase-summary.md` — File-by-file breakdown
- `code-standards.md` — Naming, patterns, and conventions
- `deployment-guide.md` — Setup and deploy instructions
