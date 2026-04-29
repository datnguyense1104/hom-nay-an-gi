# Codebase Summary

**Total Files:** 24 source files (Phase 3 additions)  
**Total LOC (src/):** ~1,800 lines  
**Language:** TypeScript + React JSX  
**Build:** Vite + Tailwind CSS + motion/react  
**Last Updated:** 2026-04-25

---

## Directory Structure & File Breakdown

### Core Application

#### `src/main.tsx` (10 LOC)
**Purpose:** React entry point  
Mounts React app to DOM element with React 19 strict mode.

#### `src/App.tsx` (285 LOC) [Updated Phase 3]
**Purpose:** Main orchestration component  
**Responsibilities:**
- View state management (random vs menu)
- Tab switching (Sáng / Trưa / Tối / Khuya)
- Filter state (mood, weather, region, budget, dietary)
- Component wiring and callback coordination
- Meal time detection on app load
- First-run onboarding flow integration
- Share state parsing from URL query params
- Long-overdue dish suggestions

**Key logic:**
- `basePool` memoization: cascading filters (time → budget → dietary)
- `randomize()`: slot-machine animation + history deduplication
- `handleAiSuggest()`: invokes AI hook with full context
- Calendar logging integration
- `useOnboardingState`: manages onboarding modal visibility
- `useShareState`: parses URLSearchParams for shared suggestions
- `useLongOverdue`: filters dishes not eaten in 7+ days
- `ActionButtons` component rendering (Ngẫu nhiên, AI Gợi ý, Lâu rồi)

#### `src/index.css` (21 LOC)
**Purpose:** Global Tailwind styles  
Sets document base styles, focus states, and utility resets.

---

### Type Definitions

#### `src/types/dish-types.ts` (52 LOC) [Updated Phase 3]
**Purpose:** Central type definitions and label mappings  
**Exports:**
- `MealTime` — union type: "Sáng" | "Trưa" | "Tối" | "Khuya"
- `BudgetRange` — union type: "under-50k" | "50k-100k" | "over-100k"
- `DietaryTag` — union type: "chay" | "no-red-meat" | "no-seafood" | "no-spicy" | "halal"
- `Region` — union type: "Bắc" | "Trung" | "Nam" | "Mọi vùng"
- `Dish` interface — full dish schema with id, name, description, time, budget, dietary, region, shopeeFoodKeyword
- `BUDGET_LABELS` — mapping to Vietnamese display names
- `DIETARY_LABELS` — mapping to Vietnamese display names
- `CITY_OPTIONS` — 5 cities: HCM, HN, Đà Nẵng, Cần Thơ, Hải Phòng
- `MOOD_OPTIONS` — 5 moods: "happy" | "tired" | "stressed" | "romantic" | "neutral" with Vietnamese labels

---

### Data Layer

#### `src/data/dishes-data.ts` (278 LOC)
**Purpose:** Static dish dataset  
**Content:** 55 Vietnamese dishes with full metadata
- Each dish has: id, name, description (Vietnamese), category, time array, budget, dietary tags, region, shopeeFoodKeyword
- Dishes span all meal times and budget ranges
- Categories: Món Nước, Món Khô/Bún, Ăn Nhanh, Món Cơm, Đặc Sản, Đồ Chiên, Khai Vị, Ăn Sáng, etc.
- Regions distributed across North, Central, South, and nationwide

---

### Hooks (Custom Hooks)

#### `src/hooks/use-meal-history.ts` (50 LOC)
**Purpose:** Manage meal history with deduplication  
**Key features:**
- Persists to localStorage (`meal_history_detailed`)
- Max 50 entries stored
- 48-hour deduplication window
- Consecutive blocking (excludes last 2 meals)
- `addToHistory(name)` — adds meal to history
- `getRecentlyEaten()` — returns Set of dish names to exclude
- `recentDisplayHistory` — last 5 meals for UI display

---

#### `src/hooks/use-preferences.ts` (46 LOC)
**Purpose:** Manage user preferences with validation  
**Persisted data:**
- `user_budget_pref` — selected budget or "any"
- `user_dietary_prefs` — array of dietary restrictions
- `user_city` — user's chosen city slug

**Functions:**
- `setBudget(val)` — validates against allowed budgets
- `toggleDietary(tag)` — add/remove dietary preference
- `setCity(val)` — update city preference
- Input validation prevents invalid localStorage values

---

#### `src/hooks/use-geolocation.ts` (52 LOC)
**Purpose:** Browser geolocation + city detection  
**Key features:**
- `detectCitySlug(lat, lng)` — exported utility for city matching
- Bounding boxes for 5 Vietnamese cities (hardcoded coordinates)
- 8-second timeout on geolocation request
- State: `{lat, lng, citySlug, loading, error}`
- `requestLocation()` — triggers browser permission dialog + detection

**City bounds:**
```
HCM: 10.5–11.2°N, 106.4–107.1°E
HN:  20.7–21.4°N, 105.6–106.1°E
Đà Nẵng: 15.9–16.2°N, 107.9–108.4°E
Cần Thơ: 9.8–10.3°N, 105.5–106.0°E
Hải Phòng: 20.7–21.0°N, 106.5–107.0°E
```

---

#### `src/hooks/use-calendar.ts` (67 LOC)
**Purpose:** Google Calendar OAuth2 + event creation  
**Key features:**
- OAuth2 token flow via Google Accounts API
- Requires `VITE_GOOGLE_CLIENT_ID` env var
- Event format: "🍴 {Phở Bò} (Trưa)" — includes emoji, name, meal time
- 1-hour duration events starting at current time
- State: `{isLogged, calendarStatus: "idle"|"loading"|"success"|"error"}`
- `resetCalendar()` — clears state (called before new suggestion)

---

#### `src/hooks/use-ai-suggestion.ts` (56 LOC)
**Purpose:** Gemini 2.0 Flash AI suggestions  
**AI integration:**
- Requires `GEMINI_API_KEY` env var
- Model: `gemini-2.0-flash`
- Context passed to prompt: meal time, mood, weather, region, budget, dietary preferences
- Response format: "{Dish Name}: {Reasoning (15–20 words)}"
- Graceful fallback if API fails: "Bún Chả: Thịt nướng thơm lừng..."
- State: `{isAiLoading, aiSuggestion: string | null}`

---

#### `src/hooks/use-onboarding-state.ts` (28 LOC) [NEW Phase 3]
**Purpose:** Manage first-run modal state and completion tracking  
**Key features:**
- Persists to localStorage (`onboarding_completed`)
- State: `{showOnboarding: boolean, completeOnboarding: () => void}`
- Auto-hides modal on app load if user completed before
- Used by App.tsx to show 4-step wizard on first visit

---

#### `src/hooks/use-share-state.ts` (35 LOC) [NEW Phase 3]
**Purpose:** Parse shared URL parameters and suggestions  
**Key features:**
- Reads URLSearchParams from `window.location.search` on mount
- Extracts `dish` and optional `mood`, `budget`, `city` params
- Validates against whitelist (security)
- Auto-strips query params after reading (clean URL)
- State: `{sharedDish: string | null, suggestedFilters: {mood?, budget?, city?}}`
- Used to restore suggestions from shared links

---

#### `src/hooks/use-long-overdue.ts` (32 LOC) [NEW Phase 3]
**Purpose:** Derive pool of dishes not eaten in 7+ days  
**Key features:**
- Analyzes meal history from `useMealHistory`
- Filters DISHES list to exclude recently eaten items
- Threshold: 7 days (604,800,000 ms)
- Returns: `{longOverdueDishes: Dish[], poolSize: number}`
- Memoized to avoid recalculation
- Supports empty pool warning

---

### Components (React)

#### `src/components/filter-panel.tsx` (123 LOC)
**Purpose:** Collapsible filter UI with all preference controls  
**Sections:**
1. **Tâm trạng (Mood):** 5 buttons — Vui vẻ, Mệt mỏi, Căng thẳng, Đang yêu, Bình thường
2. **Thời tiết (Weather):** 4 buttons — Nóng nực, Lạnh, Mưa, Mát mẻ
3. **Vùng miền (Region):** 3 buttons — Miền Bắc, Miền Trung, Miền Nam
4. **Ngân sách (Budget):** 4 pills — Bất kỳ, <50k, 50–100k, >100k
5. **Sở thích ăn uống (Dietary):** 5 multi-select — Ăn chay, Không thịt đỏ, Không hải sản, Không cay, Halal
6. **Thành phố (City):** 5 options dropdown

**UI Pattern:** Toggle-open header with animated expand/collapse.

---

#### `src/components/suggestion-display.tsx` (180 LOC) [Updated Phase 3]
**Purpose:** Display meal suggestion result card + action buttons  
**Features:**
- Shows selected dish OR AI suggestion text
- Empty pool warning if no matches
- 3 action buttons:
  1. **Shopee Food** — deep link to city-aware search
  2. **Google Maps** — nearby restaurant search
  3. **Google Calendar** — log meal to calendar (if user is authorized)
- Calendar status indicator (success/error)
- Location request button (geolocation permission)
- Responsive to dish type (random vs AI)
- `onGetShareUrl` prop: optional callback to get shareable link
- **ShareButton** integration: Web Share API + clipboard fallback with toast notification

---

#### `src/components/onboarding-flow.tsx` (125 LOC) [NEW Phase 3]
**Purpose:** First-run wizard modal with 4-step setup flow  
**Steps:**
1. **Budget Selection** — Choose budget range (Bất kỳ, <50k, 50–100k, >100k)
2. **Dietary Preferences** — Select dietary restrictions (Ăn chay, No red meat, No seafood, No spicy, Halal)
3. **City Selection** — Pick city (HCM, HN, Đà Nẵng, Cần Thơ, Hải Phòng)
4. **Mood Selection** — Choose mood (Vui vẻ, Mệt mỏi, Căng thẳng, Đang yêu, Bình thường)

**Features:**
- Modal overlay with dark background
- Sequential step navigation (Next/Back buttons)
- Step indicator (1/4, 2/4, etc.)
- Auto-saves preferences to localStorage via hooks
- Completion callback triggers onboarding state update

---

#### `src/components/share-button.tsx` (48 LOC) [NEW Phase 3]
**Purpose:** Shareable suggestion link generation with copy-to-clipboard fallback  
**Features:**
- Web Share API: delegates to native OS share if available
- Clipboard fallback: copies URL for manual paste
- Toast notification on copy success
- Accessible: ARIA labels and keyboard support
- Props: `{dishName: string, mood?: string, budget?: string, city?: string}`
- Returns: Web share sheet (mobile) or tooltip feedback (desktop)

---

#### `src/components/action-buttons.tsx` (76 LOC) [NEW Phase 3]
**Purpose:** Extracted button row for suggestion actions  
**Buttons:**
1. **Ngẫu nhiên** (Random) — Triggers random suggestion with spin animation
2. **AI Gợi ý** (AI Suggest) — Invokes Gemini API for context-aware suggestion
3. **Lâu rồi không ăn** (Long Overdue) — Shows dishes not eaten in 7+ days

**Features:**
- Loading states (disabled during API calls)
- Responsive layout (stacked on mobile, row on desktop)
- Props: `{onRandomize, onAiSuggest, onLongOverdue, isAiLoading, isRandomizing}`
- Button icons from lucide-react
- Conditional rendering based on availability

---

#### `src/components/meal-history-section.tsx` (41 LOC)
**Purpose:** Collapsible recent meals display  
**Features:**
- Shows last 5 meals as clickable pills
- Toggleable collapse/expand
- Visual feedback on hover
- Simple list for session context

---

#### `src/components/menu-list-view.tsx` (67 LOC)
**Purpose:** Browse all 55 dishes with search  
**Features:**
- Text search input (full-text on name + description)
- Grid of dish cards showing: name, description, time, budget, category
- Real-time filtering as user types
- Scrollable list view
- No pagination

---

### Utilities

#### `src/utils/deep-links.ts` (31 LOC)
**Purpose:** URL building for external integrations  
**Functions:**
- `buildShopeeFoodUrl(keyword, citySlug?)` — Returns Shopee Food search URL
  - Format: `https://shopeefood.vn/{citySlug}/search?q={encoded}`
  - Falls back to `https://shopeefood.vn/search?q={encoded}` if no city
- `buildGoogleMapsUrl(dishName, lat?, lng?)` — Returns Google Maps search URL
  - Format: `https://www.google.com/maps/search/{query}/@{lat},{lng},14z`
  - Query includes "gần đây" (nearby)
  - Falls back to search-only if no coordinates
- `resolveCitySlug(geoLat, geoLng, savedCity)` — Fallback chain for city resolution
  - Priority: geolocation detection → saved preference → null

---

#### `src/utils/share-utils.ts` (42 LOC) [NEW Phase 3]
**Purpose:** URL building and parsing for sharing suggestions  
**Functions:**
- `buildShareUrl(dishName, mood?, budget?, city?)` — Creates shareable link
  - Format: `{baseURL}?dish={encoded}&mood={mood}&budget={budget}&city={city}`
  - Only includes non-null filters in query string
  - Returns full absolute URL with current origin
- `parseShareUrl(searchParams: URLSearchParams)` — Parses shared parameters
  - Extracts: `dish`, `mood`, `budget`, `city`
  - Whitelist validation (rejects invalid mood/budget/city values)
  - Returns: `{dish: string | null, filters: {mood?, budget?, city?}}`
  - Security: Prevents injection attacks via whitelist checking

---

## Data Flow Overview (Phase 3+)

```
┌──────────────────────────────────────┐
│ User Opens App (App.tsx)             │
├──────────────────────────────────────┤
│ 1. Check onboarding status (NEW)     │
│ 2. Parse share URL params (NEW)      │
│ 3. Detect meal time (5–11h = Sáng)   │
│ 4. Load preferences (localStorage)   │
│ 5. Load meal history (localStorage)  │
└─────────────┬────────────────────────┘
              │
    ┌─────────┴──────────────────┐
    │ THREE PATHS:               │
    ├────────┬────────┬──────────┤
    ↓        ↓        ↓          ↓
┌──────────┐ ┌──────────┐ ┌──────────────┐
│ RANDOM   │ │ AI       │ │ LONG OVERDUE │
│ SUGGEST  │ │ SUGGEST  │ │ (NEW)        │
├──────────┤ ├──────────┤ ├──────────────┤
│ 1. Filter│ │ 1. Send  │ │ 1. Filter    │
│ basePool │ │ context  │ │ dishes not   │
│ 2. Dedupe│ │ to API   │ │ eaten 7 days │
│ 3. Pick  │ │ 2. Parse │ │ 2. Random    │
│ 4. Spin  │ │ response │ │ from pool    │
│ 5. Log   │ │ 3. Add   │ │ 3. Log hist  │
│          │ │ to hist  │ │              │
└──────────┘ └──────────┘ └──────────────┘
   │
   └────────────────┬───────────────────────┐
                    │ USER ACTIONS          │
                    ├──────┬────────┬───┬───┤
                    ↓      ↓        ↓   ↓
            ┌──────────┐ ┌────┐ ┌─────┐ ┌──────┐
            │ Shopee   │ │Maps│ │Share│ │Cal  │
            │ Food     │ │    │ │(NEW)│ │     │
            │ (delink) │ │    │ │     │ │     │
            └──────────┘ └────┘ └─────┘ └──────┘
```

---

## localStorage Keys Reference

| Key | Type | Max Size | Refresh | Phase |
|-----|------|----------|---------|-------|
| `meal_history_detailed` | JSON array | 50 entries | Per randomize | 1 |
| `user_budget_pref` | String | Enum | Per preference change | 2 |
| `user_dietary_prefs` | JSON array | 5 items max | Per toggle | 2 |
| `user_city` | String | ~20 chars | Per selection | 2 |
| `onboarding_completed` | Boolean | 1 byte | On first complete | 3 |

**Total estimated localStorage:** < 60 KB

---

## Component Hierarchy

```
App
├─ OnboardingFlow (first-run modal)
├─ FilterPanel
├─ ActionButtons (NEW)
│  ├─ Random button
│  ├─ AI Suggest button
│  └─ Long Overdue button
├─ SuggestionDisplay
│  ├─ ShareButton (NEW)
│  ├─ (Shopee Food button)
│  ├─ (Maps button)
│  └─ (Calendar button)
├─ MealHistorySection
└─ MenuListView (view="menu" mode)
   └─ (Search input + dish list)
```

---

## Hook Dependencies

```
App.tsx
├─ useMealHistory
│  └─ [mealHistory, addToHistory, getRecentlyEaten, recentDisplayHistory]
├─ usePreferences
│  └─ [budget, setBudget, dietaryPrefs, toggleDietary, city, setCity]
├─ useGeolocation
│  └─ [location {lat, lng, citySlug, loading, error}, requestLocation]
├─ useCalendar
│  └─ [isLogged, calendarStatus, logToCalendar, resetCalendar]
├─ useAiSuggestion
│  └─ [isAiLoading, aiSuggestion, getSmartSuggestion, clearSuggestion]
├─ useOnboardingState (NEW)
│  └─ [showOnboarding, completeOnboarding]
├─ useShareState (NEW)
│  └─ [sharedDish, suggestedFilters]
└─ useLongOverdue (NEW)
   └─ [longOverdueDishes, poolSize]
```

---

## Filter Pipeline Algorithm

```typescript
// In App.tsx, useMemo for basePool:
1. Start: DISHES (55 items)
2. Filter by activeTab (time): [Sáng, Trưa, Tối, Khuya]
3. Filter by budget: OR operation (if "any", skip)
4. Filter by dietaryPrefs: AND operation (all must match)
5. Result: filtered pool ready for randomize or AI context

// When randomizing:
6. Get recentlyEaten from history
7. Dedupe: pool - recent (48h + last 2 meals)
8. If dedupe empty, use full pool
9. Random pick from final pool
10. Add to history
```

---

## Build Configuration

**Vite config:** Standard React + Tailwind plugin  
**TypeScript:** ~5.8.2, strict mode  
**Output:** ES2022 to modern browsers  
**Bundle:** Single-page app (dist/index.html)

---

## Performance Notes

- **Lazy loading:** None needed (small app, all components loaded)
- **Code splitting:** Vite handles automatically
- **Image optimization:** No images (icon library only)
- **API caching:** localStorage persists prefs (no refetches)
- **First load:** ~2s on 4G, includes Gemini API if triggered

---

## Testing Coverage

**Current:** Manual testing only  
**Recommended:** Unit tests for:
- `detectCitySlug()` edge cases
- Filter pipeline deduplication
- localStorage validation
- Gemini fallback behavior
- Share URL encoding/decoding (`share-utils.ts`)
- Long overdue pool calculation (`use-long-overdue.ts`)

---

## Phase 3 Summary (Apr 25, 2026)

### New Files Added
- `src/hooks/use-onboarding-state.ts` — First-run modal state management
- `src/hooks/use-share-state.ts` — URL share parameter parsing
- `src/hooks/use-long-overdue.ts` — Overdue dish pool calculation
- `src/components/onboarding-flow.tsx` — 4-step setup wizard
- `src/components/share-button.tsx` — Share URL generation + clipboard
- `src/components/action-buttons.tsx` — Button group (Random, AI, Overdue)
- `src/utils/share-utils.ts` — URL encoding/parsing utilities

### Modified Files
- `src/App.tsx` — Added onboarding modal, share state parsing, long overdue button
- `src/types/dish-types.ts` — Added mood options
- `src/components/suggestion-display.tsx` — Integrated ShareButton component

### Key Features Shipped (3.1–3.3)
- **Onboarding:** 4-step preference wizard (Budget → Dietary → City → Mood)
- **Sharing:** URL-based suggestions with Web Share API + clipboard fallback
- **Long Overdue:** "Lâu rồi không ăn gì" button for 7+ day dishes

### Pending (3.4)
- Group Vote feature blocked waiting for Supabase backend setup
