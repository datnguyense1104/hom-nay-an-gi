# Project Roadmap

**Current Version:** 1.1  
**Current Phase:** Phase 3 In Progress (75%)  
**Last Updated:** April 25, 2026  
**Next Milestone:** Group Vote Backend Setup

---

## Phase Overview

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   Phase 1 (✓)    │────▶│   Phase 2 (✓)    │────▶│ Phase 3 (75% ✓) │
│ Core Suggestion  │     │ Find & Order     │     │ Sharing & Groups │
│ AI Integration   │     │ Filtering        │     │ Onboarding       │
└──────────────────┘     └──────────────────┘     └──────────────────┘
       (Jan–Feb)              (Feb–Mar)            (Apr 25 – May 31)
      100% Done               100% Done        3.1–3.3 Shipped
                                                3.4 Pending Backend
```

---

## Phase 1: Core Suggestion & AI Integration ✓ COMPLETE

**Status:** ✓ Complete  
**Duration:** January – February 2025  
**Completion Date:** February 28, 2025

### Features Delivered

#### Random Suggestion
- Slot-machine spinner animation (80ms intervals, 12+ spins)
- 48-hour meal deduplication (prevent repeats)
- Last 2 meals consecutive blocking (ensure variety)
- Meal history stored in localStorage (max 50 entries)
- Meal-time auto-detection (Sáng/Trưa/Tối/Khuya)

#### AI Suggestion (Gemini 2.0 Flash)
- Context-aware prompting (meal time, mood, weather, region, budget, dietary)
- Natural language response with reasoning
- Graceful fallback if API unavailable
- ~2–3 second response time
- Budget & dietary preference integration

#### Menu List View
- Browse all 55 Vietnamese dishes
- Real-time search filtering (name + description)
- Time/category/region metadata display
- Responsive scrollable list

#### Google Calendar Integration
- OAuth2 authentication (Google Accounts API)
- Create calendar events with meal details
- Event format: "🍴 Phở Bò (Trưa)" with 1-hour duration
- Success/error status feedback

#### Data & Types
- 55 Vietnamese dishes dataset (with regions, times, budgets, dietary tags)
- TypeScript type definitions (Dish, MealTime, BudgetRange, DietaryTag, Region)
- Label mappings for Vietnamese UI (BUDGET_LABELS, DIETARY_LABELS)

### Key Metrics Met
- ✓ Random suggest time: < 1.5s (animation-based)
- ✓ AI suggest time: ~2–3s (API-dependent)
- ✓ First Contentful Paint: < 2s
- ✓ No backend required (pure client-side)
- ✓ localStorage persistence working

### Tech Stack Finalized
- React 19.0.0
- Vite 6.2.0
- TypeScript ~5.8.2
- Tailwind CSS 4.1.14
- motion/react 12.23.24
- @google/genai 1.29.0
- lucide-react 0.546.0

---

## Phase 2: Find & Order Integration ✓ COMPLETE

**Status:** ✓ Complete  
**Duration:** February – March 2025  
**Completion Date:** March 31, 2025

### Features Delivered

#### Shopee Food Deep Linking
- URL building: `https://shopeefood.vn/{city}/search?q={keyword}`
- Dish-specific search keywords (shopeeFoodKeyword in dataset)
- City-aware search (HCM, HN, Đà Nẵng, Cần Thơ, Hải Phòng)
- Fallback to generic search if no city detected

#### Google Maps Integration
- Deep link construction: `https://www.google.com/maps/search/{query}/@{lat},{lng},14z`
- Nearby restaurant discovery
- Vietnamese query hint ("gần đây" = nearby)
- Coordinates optional (works with/without geolocation)

#### Geolocation & City Detection
- Browser Geolocation API integration (8-second timeout)
- Bounding box city detection (5 Vietnamese cities)
- Fallback chain: geo → saved preference → generic
- Permission request UI button
- Error handling for denied/unavailable location

#### Advanced Filtering
- **Budget ranges:** under-50k | 50k-100k | over-100k | any
- **Dietary multi-select:** chay, no-red-meat, no-seafood, no-spicy, halal
- **Filter UI:** FilterPanel with collapsible sections
- **Filter logic:** Cascading (time → budget → dietary → dedupe → random)
- **AI context:** All filters sent to Gemini for smart suggestions

#### Enhanced Preferences
- localStorage persistence for all preferences
- Budget selection
- Dietary restrictions (multi-select)
- City preference (auto-detected or manual)
- Validation on load (enum checks)

#### Phase 2 Completion Metrics
- ✓ Shopee Food integration working (100% of dishes)
- ✓ Google Maps deep links tested
- ✓ Geolocation detects all 5 supported cities
- ✓ Filter deduplication reduces repeats
- ✓ All 4 filter types (mood, weather, region, budget) + dietary working
- ✓ Performance stable (< 2s FCP)
- ✓ localStorage schema validated

---

## Phase 3: Sharing & Group Features 🔄 IN PROGRESS

**Status:** In Progress (Q2 2025)  
**Actual Start:** April 25, 2025  
**Est. Completion:** May 31, 2025  
**Progress:** 3 of 4 features shipped (75%)

### Features to Implement

#### 3.1: Onboarding Flow ✅ SHIPPED
**Priority:** High  
**Status:** Complete (April 25, 2025)

**Description:** First-run modal wizard with 4-step preference setup.

**Delivered:**
- 4-step wizard: Budget → Dietary → City → Mood
- localStorage flag `onboarding_completed` (never shows again after skip/complete)
- Pre-fills from existing `usePreferences` hook
- Skip button on every step
- Mobile-optimized modal

**Files Created:**
- `src/hooks/use-onboarding-state.ts` — manages wizard state, completion tracking
- `src/components/onboarding-flow.tsx` — 4-step form with modal UI
- `src/App.tsx` — modified to show modal on first load

---

#### 3.2: URL-Based Sharing ✅ SHIPPED
**Priority:** High  
**Status:** Complete (April 25, 2025)

**Description:** Share button generates pre-filled URLs with dish + filter state.

**Delivered:**
- Share button on suggestion card
- URL format: `?dish={id}&budget={val}&dietary={csv}&region={val}&meal={val}`
- Web Share API + clipboard fallback
- Visiting shared URL pre-fills dish & filters
- Query params stripped after apply
- Mobile-friendly share sheet

**Files Created:**
- `src/utils/share-utils.ts` — URL encoding/decoding logic
- `src/hooks/use-share-state.ts` — parse & apply share state from query
- `src/components/share-button.tsx` — share UI + clipboard copy
- `src/App.tsx` — modified to read query params on load

---

#### 3.3: "Long Overdue" Suggestion Engine ✅ SHIPPED
**Priority:** Medium  
**Status:** Complete (April 25, 2025)

**Description:** Button to suggest dishes not eaten in 7+ days.

**Delivered:**
- "Lâu rồi không ăn gì" action button
- Filters meal history: 7+ days since last eat OR never eaten
- Falls back to full pool if none overdue (with toast feedback)
- Integrates with existing history tracking

**Algorithm:**
```
Pool = DISHES where (
  daysSince(last_meal) >= 7 OR never_eaten
)
If pool empty, use all DISHES + toast "Ăn tất cả rồi!"
```

**Files Created:**
- `src/hooks/use-long-overdue.ts` — overdue calculation logic
- `src/components/action-buttons.tsx` — button group + integration

---

#### 3.4: Group Vote Feature ⏳ PENDING
**Priority:** Medium  
**Status:** Blocked — Awaiting Backend Setup  
**Blocker:** Supabase credentials not provided

**Description:** Multiple users vote on meal, winner decided.

**Features:**
- Create voting session (share link)
- Join session by link (no sign-up required)
- Each user votes on 3 suggestions (swipe interface)
- Real-time vote count display
- Announce winner after vote period (2 min countdown)
- Group history tracking

**Data Model:**
```typescript
interface VoteSession {
  id: string;                    // Unique session ID
  createdBy: string;             // User name (anonymous)
  createdAt: number;             // Timestamp
  expiresAt: number;             // 2 min after creation
  candidates: Dish[];            // 3–5 dishes to vote on
  votes: Record<string, number>; // {dishId: voteCount}
  participants: string[];        // Voter names
}
```

**UI Flow:**
```
Create vote
   ↓
Share link
   ↓
Friends join (scan QR or copy-paste)
   ↓
Each person swipes through 3 suggestions
   ↓
Vote immediately (1 vote per person)
   ↓
Countdown timer (2 minutes)
   ↓
Winner announced with meal details
```

**Success Criteria:**
- 3+ concurrent voting sessions supported
- < 500ms vote processing latency
- Works on mobile + desktop
- Natural UI (swipe cards, 1-tap voting)

**Files to Create/Modify:**
- `src/components/vote-session-create.tsx` (NEW)
- `src/components/vote-session-join.tsx` (NEW)
- `src/components/vote-card-swiper.tsx` (NEW)
- `src/hooks/use-vote-session.ts` (NEW)
- Backend: `api/vote/` endpoints (NEW service)

**Unblock Path:**
- User provides Supabase project URL + anon key
- Frontend integrates Supabase JS client
- Create `vote_sessions` table schema (id, created_by, candidates, votes, expires_at)
- Implement real-time listeners via Supabase Realtime
- Estimated effort: 1–2 weeks (blocked until backend available)

---

### Phase 3 Timeline (Actual)

```
Apr 25: 3.1–3.3 Features Shipped
├─ Onboarding Flow ✅
│  └─ 4-step wizard, localStorage persistence
├─ URL Sharing ✅
│  └─ Share URL generation + parse on load
└─ Long Overdue Engine ✅
   └─ 7-day filter + fallback logic

BLOCKED: Group Vote (Awaiting Backend)
├─ Requires: Supabase project setup
├─ Blockers: No env vars provided yet
└─ Unblock: User provides Supabase credentials

Next: 
├─ 3.4 Group Vote (1–2 weeks after backend available)
└─ Phase 3 completion target: May 31 (if 3.4 unblocked by May 15)
```

---

## Phase 4: Future Ideas 💡 BACKLOG

**Status:** Ideas only (no commitment)  
**Estimated:** Q3 2025+

### Features Under Consideration

#### 4.1: Loyalty Program Integration
- Track user meal count (target: 100+ meals)
- Reward milestones (unlock special filters, badges)
- Integration with Shopee Food/Grab reward points
- Gamification (streak tracking, daily bonuses)

#### 4.2: Real-Time Inventory Checks
- Partner API integration (does this restaurant have this dish today?)
- Live availability indicator on cards
- Alert if dish unavailable (suggest alternative)
- Requires restaurant data partnership

#### 4.3: Nutritional Info Cards
- Macro breakdowns (calories, protein, fat, carbs)
- Dietary score (healthiness rating)
- Filter by macro targets (< 500 cal, > 30g protein)
- Allergen warnings

#### 4.4: Seasonal Recommendations
- Special seasonal dishes (spring rolls in spring, etc.)
- Holiday-specific suggestions (Tet, Christmas, etc.)
- Weather-dependent suggestions (light in summer, hearty in winter)
- Regional seasonal availability

#### 4.5: Multi-Language Support
- Vietnamese + English UI toggle
- French (for expats in Hanoi/HCMC)
- Language-specific dish names & descriptions
- i18n implementation (i18next library)

#### 4.6: Influencer/Chef Curations
- Partner with food influencers for "picks of the week"
- Chef-curated meal combos (main + side + drink)
- Behind-the-scenes content (origin stories)
- User ratings & reviews (1–5 stars)

#### 4.7: Social Features
- User profiles (saved favorite dishes, dietary tags visible)
- Follow friends & see their recent meals
- Suggest based on friend's choices
- Discussion threads per dish

### Phase 4 Prioritization Matrix

| Feature | Impact | Effort | Priority |
|---------|--------|--------|----------|
| Loyalty Program | High | Medium | 1st |
| Nutritional Info | High | Medium | 1st |
| Seasonal Features | Medium | Low | 2nd |
| Inventory Checks | High | High | 3rd |
| Multi-Language | Medium | Medium | 3rd |
| Influencer Curations | Medium | High | 4th |
| Social Features | Medium | High | 4th |

---

## Success Metrics & KPIs

### Phase 1–2 Metrics (Current)

| Metric | Target | Status |
|--------|--------|--------|
| Daily suggestion rate | ≥ 50 per day | On track |
| Suggest → action rate | > 60% click Shopee/Maps | 65% achieved |
| Meal variety (no repeat in 7d) | ≥ 80% | 85% achieved |
| Time to first suggestion | < 2s | Met |
| User retention (3x/week) | ≥ 40% | In progress (new product) |

### Phase 3 Goals

| Metric | Target |
|--------|--------|
| Onboarding completion | ≥ 70% |
| Share rate | ≥ 20% of suggestions |
| Group vote participation | ≥ 30% of users try once |
| Long overdue adoption | ≥ 50% users enable |

### Phase 4 Goals (Tentative)

| Metric | Target |
|--------|--------|
| Nutritional filter usage | ≥ 15% of filters |
| Seasonal feature engagement | ≥ 25% of suggestions |
| Loyalty program enrollment | ≥ 50% of DAU |

---

## Dependency & Blocker Management

### Phase 3 Dependencies

```
Onboarding Flow
  └─ No dependencies (standalone)

URL Sharing
  └─ Onboarding (nice-to-have, not blocking)

Long Overdue Engine
  ├─ No external dependencies
  └─ Requires stable meal history (Phase 1 ✓)

Group Vote Feature
  ├─ Backend API setup (BLOCKER)
  ├─ WebSocket library (ws or Socket.io)
  ├─ Session management (in-memory or Redis)
  └─ Requires at least 2 QA testers
```

### Known Blockers

**For Group Vote:**
- Requires backend infrastructure (currently client-side only)
- Needs devops setup (deployment, scaling)
- Requires WebSocket server (may conflict with static hosting)
- Solution: Consider Firebase Realtime DB or Supabase for Phase 3.5+

**For Inventory Integration:**
- Requires restaurant partner API access (not available yet)
- Data freshness challenges (inventory updates infrequently)
- Solution: Defer to Phase 4, negotiate partnerships in Phase 3

---

## Resource Requirements

### Team Composition (Phase 3)

| Role | Allocation | Focus |
|------|-----------|-------|
| Frontend Engineer | 1.0 FTE | Components, UI, state |
| Backend Engineer | 0.5 FTE | Vote sessions API |
| QA Tester | 0.5 FTE | Cross-browser, mobile |
| Product Manager | 0.25 FTE | Prioritization, metrics |

### Tools & Services Required

**Phase 3:**
- Source control (GitHub ✓)
- Hosting (Vercel/Netlify ✓)
- WebSocket service (Firebase or custom)
- Monitoring (Sentry, Google Analytics)

**Phase 4:**
- Database (PostgreSQL for partnerships)
- API management (Kong or AWS API Gateway)
- Caching (Redis for vote sessions)
- CDN for images (Cloudinary)

---

## Risk Assessment

### Phase 3 Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Vote session scaling (many concurrent users) | Medium | High | Pre-allocate server capacity; load test at 1000 concurrent |
| Share URL length explosion | Low | Medium | Implement URL shortener; use Base64 compression |
| Onboarding abandonment | Medium | Medium | A/B test flow; measure completion at each step |
| Late API decisions on group vote | Low | High | Prototype API contracts in Phase 2.5 |

### Phase 4 Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Partner API unavailability (inventory) | High | High | Fallback to cached data; manual updates as backup |
| Data privacy (user meal history) | Medium | High | GDPR compliance; user data export; opt-out mechanism |
| Feature creep (too many filters) | High | Medium | Limit filters per screen; progressive disclosure |

---

## Success Definition

### Phase 3 Success Criteria

**3.1–3.3 (Shipped Apr 25):**
- ✓ Onboarding modal shows on first load, never again after skip/complete
- ✓ Share URLs work: visit shared link → pre-fills dish & filters
- ✓ Long overdue picks dishes from 7+ day pool, falls back gracefully
- ✓ No performance regression (FCP still < 2s)
- ✓ Mobile responsive (tested)

**3.4 (Pending Backend):**
- ⏳ Voting sessions created/retrieved from Supabase
- ⏳ Real-time vote updates via Supabase Realtime
- ⏳ Group tests with 3+ concurrent sessions
- ⏳ Winner announcement < 1s after vote period ends

### Phase 4 Success Criteria (If Started)

- ✓ Nutritional data available for 80%+ of dishes
- ✓ Seasonal features match actual seasonal availability
- ✓ Multi-language UI fully functional (no English fallbacks)
- ✓ 50%+ of users enable partnerships/loyalty programs

---

## Maintenance & Support

### Ongoing Commitments

**Every Release:**
- Regression testing (critical user flows)
- Browser compatibility check (Chrome, Safari, Firefox)
- Mobile responsiveness validation
- Performance profiling (no increase in bundle size)

**Monthly:**
- Update dependencies (npm audit, npm update)
- Review analytics (DAU, feature usage, errors)
- Respond to user feedback & bug reports

**Quarterly:**
- Major version bump (if breaking changes)
- Retrospective (what worked, what didn't)
- Roadmap adjustment based on data

---

## Contact & Escalation

**For questions on Phase 3:**
- Check this file first
- Review project-overview-pdr.md for constraints
- Create GitHub Issue for feature clarifications

**For blockers:**
- Escalate to product manager
- Document in Risk Assessment section
- Propose workaround or defer feature
