# Phase 4 — Integration + QA

## Overview

- **Priority:** P1
- **Status:** Complete ✅
- **Effort:** ~1d
- **Description:** Wire all Phase 1–3 components together in App.tsx, verify full UX flow end-to-end, test on mobile browsers, confirm no regressions.

## Key Insights

- App.tsx orchestrates all hooks + components — final wiring happens here
- Full filter pipeline must compose cleanly: time → budget → dietary → deduplication
- AI suggestion must respect dietary filter (double-check: if AI returns dish not in filtered pool, flag or re-prompt)
- City preference from `usePreferences` feeds into geolocation fallback in Phase 2
- Mobile browser testing critical: deep links behave differently on iOS Safari vs Android Chrome
- Calendar integration (existing) must still work after modularization

## Requirements

**Functional:**
- Complete UX flow per PRD §7: open → pick meal time → set context → suggest → Shopee Food / Maps / Calendar / re-roll
- All 5 Phase 2 features work together without conflicts
- Existing Phase 1 features (calendar, history, menu search) have zero regressions

**Non-functional:**
- `npm run build` passes with 0 TypeScript errors
- First meaningful paint < 2s (static hosting, no backend)
- Mobile: buttons tappable with thumb (≥44px hit area)

## Integration Checklist

### App.tsx Final State

```typescript
// Hooks
const { mealHistory, addToHistory, getRecentlyEaten } = useMealHistory();
const { budget, setBudget, dietaryPrefs, toggleDietary, city, setCity } = usePreferences();
const { location, requestLocation } = useGeolocation();

// Derived
const filteredDishes = useMemo(() =>
  DISHES
    .filter(d => d.time.includes(activeTab))
    .filter(d => budget === "any" || d.budget === budget)
    .filter(d => dietaryPrefs.length === 0 || dietaryPrefs.every(p => d.dietary.includes(p)))
    .filter(d => !getRecentlyEaten().has(d.id)),
  [activeTab, budget, dietaryPrefs, mealHistory]
);
```

### Component Prop Wiring

| Component | Props from App.tsx |
|-----------|-------------------|
| `FilterPanel` | mood, weather, region, budget, dietaryPrefs + all setters |
| `SuggestionDisplay` | selectedDish, aiSuggestion, location, onRequestLocation, preferredCity |
| `MealHistorySection` | history (last 5), show, onToggle |
| `MenuListView` | dishes (DISHES array, unfiltered for browse) |

### AI Suggestion Double-Check

After Gemini returns a suggestion:
1. Parse dish name from response
2. Check if that name exists in `filteredDishes` (case-insensitive partial match)
3. If not found: still show AI suggestion text (AI may suggest valid unlisted dish), but append dietary tags filter context in prompt to minimize mismatch

### City Preference Integration

- `usePreferences.city` → passed to `SuggestionDisplay` as `preferredCity`
- Add city selector to settings/filter panel (dropdown: HCM / Hà Nội / Đà Nẵng / Cần Thơ / Hải Phòng / Khác)
- City auto-updates when geolocation detects city → `setCity(detectedSlug)`

## Related Code Files

**Modify:**
- `src/App.tsx` — final hook wiring + derived state
- `src/components/filter-panel.tsx` — add city selector dropdown
- `src/components/suggestion-display.tsx` — verify all props connected

## Implementation Steps

### Step 1: Final App.tsx wiring

- Import all hooks and components
- Compose full filter pipeline with `useMemo`
- Pass correct props to each component
- Remove all inline logic that was extracted to hooks/components

### Step 2: Add city selector to FilterPanel

Simple `<select>` or pill group at bottom of filter panel:

```
Thành phố: [HCM ▼]  ← dropdown or pills
[TP. HCM] [Hà Nội] [Đà Nẵng] [Cần Thơ] [Hải Phòng]
```

- Controlled via `usePreferences.city` / `setCity`
- Only relevant for Shopee Food deep link
- Can be labeled as "Khu vực giao hàng"

### Step 3: Verify calendar integration

- `logToCalendar()` still works after modularization
- Confirm it receives correct dish name (from both random and AI paths)

### Step 4: Build verification

```bash
npm run build
```

Fix all TypeScript errors before proceeding to manual QA.

### Step 5: Manual QA — Desktop browser

Test each flow:

| Flow | Steps | Expected |
|------|-------|----------|
| Random suggestion | Pick Trưa, set budget 50k, click random | Only 50k dishes suggested |
| Dietary filter | Enable "Ăn chay", click random | Only chay dishes appear |
| Shopee Food | Get suggestion, click 🛵 | New tab opens shopeefood.vn with dish name |
| Google Maps | Get suggestion, click 📍 | New tab opens maps.google.com with search |
| History | Suggest 3 dishes | History pills show last 5 |
| Menu search | Go to menu, search "bún" | Filtered results |
| Calendar | Get suggestion, click 📅 | OAuth prompt → calendar event created |
| Preferences persist | Set chay + 50k, reload | Filters still active |

### Step 6: Manual QA — Mobile browser

On iOS Safari AND Android Chrome:

| Check | iOS Safari | Android Chrome |
|-------|-----------|----------------|
| Shopee Food deep link opens | ✓ | ✓ |
| Maps deep link opens Google Maps app | ✓ | ✓ |
| Geolocation permission prompt works | ✓ | ✓ |
| Filter panel usable on small screen | ✓ | ✓ |
| Buttons have adequate tap target (≥44px) | ✓ | ✓ |

### Step 7: Performance check

- Open DevTools → Lighthouse → Performance
- Confirm First Contentful Paint < 2s
- No large bundle issues (app is pure client-side, should be <500KB)

## Todo List

- [ ] Final App.tsx wiring — all hooks + components connected
- [ ] City selector added to FilterPanel
- [ ] Calendar integration verified post-modularization
- [ ] `npm run build` — 0 TypeScript errors
- [ ] Desktop QA: all 8 flows pass
- [ ] Mobile QA: Shopee Food + Maps deep links open correctly
- [ ] Geolocation grant + deny paths both tested
- [ ] Preferences persist across reload
- [ ] Empty-pool guard visible when all dishes filtered out
- [ ] Performance: FCP < 2s

## Success Criteria

- `npm run build` clean
- All Phase 2 PRD features functional
- Existing features (calendar, history, menu) unchanged
- Shopee Food + Maps links open correctly on mobile
- Preferences survive page reload
- No console errors in normal usage flow

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Prop drilling too deep | Medium | Max 2 levels; use hooks for shared state |
| Mobile deep link doesn't open app | Low | Links work as web URLs even without app installed |
| Calendar OAuth breaks after refactor | Medium | Test calendar flow explicitly in Step 3 |
| Bundle size regression | Low | Check Lighthouse; app has no heavy new dependencies |

## Security Considerations

- `window.open` with `rel="noopener noreferrer"` on all external links
- No new API keys or auth flows introduced
- Geolocation only requested on explicit user tap — no silent collection
