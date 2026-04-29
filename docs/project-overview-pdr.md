# Project Overview & Product Development Requirements (PDR)

**Project Name:** Hôm Nay Ăn Gì? (What to Eat Today?)  
**Version:** 1.0  
**Status:** Phase 2 Complete  
**Last Updated:** April 2025

---

## Problem Statement

Vietnamese office workers (24–35) and students (18–24) face decision fatigue when choosing where to eat. The typical flow takes 3–5 minutes of browsing menus, comparing prices, and checking locations. This friction costs time and often results in suboptimal food choices.

**Vision:** "From decision to order in < 30 seconds"

---

## Target Users

### Primary (Office Workers)
- **Age:** 24–35 years old
- **Meal budget:** 50–120k VND per meal
- **Context:** Lunch breaks during work hours, occasional dinner
- **Pain point:** Indecision during limited break time

### Secondary (Students)
- **Age:** 18–24 years old
- **Meal budget:** 30–70k VND per meal
- **Context:** Between classes, casual dinners
- **Pain point:** Want variety without research overhead

---

## Product Features & Roadmap

### Phase 1 (COMPLETE)
**Random Dish Suggestion**
- Slot-machine spinner animation for engagement
- 55 Vietnamese dishes database with metadata
- Meal-time-aware filtering (Sáng / Trưa / Tối / Khuya)
- 48-hour deduplication + last-2-meals blocking (repeat prevention)
- localStorage-based meal history

**AI Suggestion (Gemini 2.0 Flash)**
- Context-aware: meal time, mood, weather, region, budget, dietary preferences
- Natural language response with reasoning
- Graceful fallbacks if API unavailable

**Google Calendar Integration (OAuth2)**
- Log suggested meals to Google Calendar
- Event includes meal name, time, description

**Menu List View**
- Browse all 55 dishes with descriptions
- Full-text search capability
- Filter by time, category, or scroll freely

---

### Phase 2 (COMPLETE)
**Find & Order Integration**
- Shopee Food deep links with city-aware search queries
- Google Maps integration for nearby restaurant discovery
- URL building utilities for seamless navigation

**Enhanced Filtering**
- Budget ranges: under-50k | 50k-100k | over-100k | any
- Dietary multi-select: vegetarian, no red meat, no seafood, no spicy, halal
- Automatic dish filtering during suggestion (randomize or AI)

**Geolocation & City Detection**
- Browser geolocation API integration (8s timeout)
- Bounding-box city detection (HCM, HN, Đà Nẵng, Cần Thơ, Hải Phòng)
- Fallback chain: geo → saved preference → generic URL
- All preferences persisted in localStorage

---

### Phase 3 (PLANNED)
- **Onboarding flow** — First-time user preferences setup
- **URL-based sharing** — Share specific suggestions with friends
- **"Long overdue" engine** — Suggest dishes not eaten in 7+ days
- **Group vote feature** — Multiple users vote on meal, winner chosen

### Phase 4 (FUTURE IDEAS)
- Loyalty program integration (point tracking)
- Real-time inventory checks (is this dish available today?)
- Nutritional info cards (calories, macros)
- Seasonal recommendations

---

## Key Metrics & Success Criteria

| Metric | Target | Notes |
|--------|--------|-------|
| Suggest → action rate | > 60% | Click Shopee Food or Maps link |
| Daily return rate | ≥ 3x/week | User opens app 3+ times per week |
| Re-roll rate | ≤ 2 per session | Suggests are good enough |
| First Contentful Paint | < 2s | Mobile-first performance |
| Dish variety | ≥ 80% no repeat in 7 days | History + filter prevents boredom |
| Time to suggestion | < 5s | Random instant; AI ~2–3s |

---

## Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | React | 19.0.0 |
| **Build Tool** | Vite | 6.2.0 |
| **Language** | TypeScript | ~5.8.2 |
| **Styling** | Tailwind CSS | 4.1.14 |
| **Animation** | motion/react (Framer Motion) | 12.23.24 |
| **AI** | Google Gemini 2.0 Flash | via @google/genai ^1.29.0 |
| **Icons** | lucide-react | 0.546.0 |
| **Data Storage** | localStorage only | Client-side only |
| **Geolocation** | Browser Geolocation API | Native |
| **Calendar** | Google Calendar API (OAuth2) | Native API |
| **Deploy** | Static hosting | Vercel / Netlify ready |

---

## Architecture Overview

```
┌─────────────────────────────────────┐
│  Browser (React 19 SPA)             │
├─────────────────────────────────────┤
│ Hooks                               │
│ ├─ useMealHistory (localStorage)    │
│ ├─ usePreferences (localStorage)    │
│ ├─ useGeolocation (Browser API)     │
│ ├─ useCalendar (OAuth2 + API)       │
│ └─ useAiSuggestion (Gemini Flash)   │
├─────────────────────────────────────┤
│ Components                          │
│ ├─ FilterPanel (mood/weather/budget)│
│ ├─ SuggestionDisplay (result card)  │
│ ├─ MenuListView (browse 55 dishes)  │
│ └─ MealHistorySection (last 5)      │
├─────────────────────────────────────┤
│ Utils                               │
│ └─ deepLinks (Shopee Food, Maps)    │
└─────────────────────────────────────┘
     ↓ External APIs ↓
┌─────────────────────────────────────┐
│ Google Gemini API (AI suggestions)  │
│ Google Calendar API (logging meals) │
│ Shopee Food (order search)          │
│ Google Maps (location discovery)    │
└─────────────────────────────────────┘
```

---

## Environment Variables

```bash
GEMINI_API_KEY=<your-gemini-api-key>  # Required for AI suggestions
VITE_GOOGLE_CLIENT_ID=<oauth-client>  # Required for Google Calendar OAuth
```

---

## Deployment

### Build & Deploy
```bash
npm run build           # Creates optimized dist/
npm run preview        # Test production build locally
```

### Hosting
- **Vercel:** Connect repo → auto-deploys on push
- **Netlify:** Connect repo → configure env vars
- **Static hosting:** Upload dist/ folder

### API Key Security
- Store `GEMINI_API_KEY` in `.env.local` (dev) or host env vars (prod)
- Restrict API key by **HTTP referrer** in Google Cloud Console
- Never commit `.env.local` to git

---

## Data Model

### Dish Interface
```typescript
interface Dish {
  id: number;
  name: string;                           // "Phở Bò"
  description: string;                    // "Nước dùng thanh ngọt..."
  category: string;                       // "Món Nước"
  time: MealTime[];                       // ["Sáng", "Trưa", "Tối"]
  budget: "under-50k" | "50k-100k" | "over-100k";
  dietary: DietaryTag[];                  // ["chay", "no-seafood"]
  region: "Bắc" | "Trung" | "Nam" | "Mọi vùng";
  shopeeFoodKeyword: string;              // "phở bò"
}
```

### localStorage Keys
| Key | Purpose | Example |
|-----|---------|---------|
| `meal_history_detailed` | Full meal history with timestamps | `[{"timestamp": 1234567890, "name": "Phở"}]` |
| `user_budget_pref` | Selected budget range | `"50k-100k"` |
| `user_dietary_prefs` | Array of dietary restrictions | `["chay", "no-seafood"]` |
| `user_city` | User's preferred city | `"ho-chi-minh"` |

---

## Out of Scope

- **Backend server** (Phase 2 client-side only)
- **User accounts / authentication** (localStorage only)
- **Real-time order integration** (deep links to Shopee Food only)
- **Inventory sync** (static dish data)
- **Payment processing** (Shopee Food handles payments)
- **Delivery tracking** (redirects to partner apps)

---

## Constraints & Assumptions

1. **Browser support:** Modern browsers with ES2022+ support
2. **Network:** Requires internet for Gemini API & Google Calendar
3. **Geolocation:** Users must grant browser permission (can deny)
4. **Google OAuth:** Calendar feature requires Google account
5. **Shopee Food availability:** City detection only works for 5 major cities; fallback to generic search
6. **Dish data:** Fixed 55-dish dataset; updates require code changes

---

## Success Definition

A suggestion is "successful" if the user:
1. Views the result (immediate)
2. Clicks "Shopee Food" or "Maps" link (primary action)
3. OR logs to Google Calendar (engagement signal)

Phase 1–2 complete. Phase 3 features will unlock sharing and group dynamics.

---

## Contact & Support

**For bug reports:** Check GitHub issues  
**For feature requests:** Create a GitHub discussion  
**For deployment issues:** See deployment-guide.md
