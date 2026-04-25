# Phase 2 Planning: Location-Based Ordering & Budget/Dietary Filters

**Date**: 2026-04-24 22:51
**Severity**: Medium
**Component**: App architecture, Dish domain, Feature planning
**Status**: Planning Complete → Ready for Phase 1 Implementation

## What Happened

Conducted full planning session for Phase 2 features: Shopee Food integration, Google Maps deep linking, geolocation detection, budget constraints, and dietary filtering. Read PRD, analyzed current monolithic codebase (App.tsx at 571 lines), explored existing dish dataset (16 dishes, no budget/dietary metadata), ran scope challenge with user (resulted in HOLD SCOPE decision), and created 4-phase implementation plan.

## The Brutal Truth

The current codebase is a single-file mess. App.tsx contains all logic—component definition, dish data, rendering, and state management. This isn't inherently broken, but Phase 2 requirements (geolocation, Shopee integration, advanced filtering) will explode complexity if we don't modularize first. The dish database is also anemic: 16 items with no region, budget-suitability, or dietary markers. We either expand data now or the feature filters become theatrics with no real filtering power.

The scope conversation was crucial. User held firm on features rather than cutting. That's fine—we have a realistic plan, but it requires disciplined execution across 4 phases.

## Technical Details

**Current State:**
- App.tsx: 571 lines (single file, all responsibility)
- Dish schema: `{ id, name, description, imageUrl, mood }` (no extended metadata)
- Dish pool: 16 items
- Gemini model: gemini-1.5-flash

**Planned Artifacts (Phase 1):**
- App.tsx modularized to ~150 lines (extract components, contexts, hooks)
- Extended Dish interface: `{ ...existing, budget, dietary[], region, shopeeFoodKeyword }`
- Expanded dish DB: 50+ items with complete metadata
- Upgraded Gemini: gemini-2.0-flash (better reasoning for prompt engineering)

**Architecture Decisions:**
- Geolocation: Native browser Geolocation API (no external package)
- City detection: Bounding-box matching against hardcoded city coords (offline-capable, simpler than Nominatim)
- Deep links: Standard URL builders for Shopee Food and Google Maps (no packages)
- Dietary filtering: Applied to dish pool BEFORE random selection (hard constraint, not soft AI suggestion like mood/weather)

## What We Tried

- **Nominatim reverse-geocoding** vs. **bounding-box detection**: Rejected Nominatim (external API dependency, latency, no offline fallback). Chose bounding-box: O(1) lookup, offline-safe, good enough for Vietnam's major cities.
- **Dietary filtering at prompt level** vs. **in code before random pick**: Rejected AI-only approach (unreliable, expensive API calls). Chose hard filter in code: deterministic, fast, user-friendly error handling.
- **New npm packages for geolocation/mapping**: None needed. Native Geolocation API + URL string builders sufficient.

## Root Cause Analysis

Why this plan emerged:
1. **Monolithic App.tsx** became obvious during code exploration—571 lines is the inflection point where debugging becomes painful.
2. **Missing dish metadata** (budget, dietary, region) meant Phase 3 filters would have nothing to filter. Data-first thinking required.
3. **Scope challenge** could have resulted in cut features, but user commitment to all features forced us to design a realistic phased approach instead of shipping broken.

The 4-phase structure addresses natural dependency chains: modularize first (enables clean feature additions), then location + ordering (external integrations), then advanced filtering (requires extended Dish schema), finally integration + QA.

## Lessons Learned

1. **Metadata first, features second**: Extended Dish schema should have been part of initial design. Now we know: always design data structures to support foreseeable filtering/sorting needs.
2. **User scope commitment is a feature, not a bug**: Scope pressure forced us to think phased and realistic. Would have been easier to cut corners; instead we built a real plan.
3. **Offline-first wins over external APIs**: Bounding-box city detection is slower to write once, faster at runtime, and resilient to network. Worth it.
4. **Empty-pool edge case matters**: All filtering pipelines need a guard. "No dishes match your filters" is better than a crash.

## Next Steps

**Immediate (Phase 1):**
1. Modularize App.tsx: extract DishCard, DishGrid, FilterPanel, MoodWeatherSelector into separate files
2. Extract contexts: DishContext (state), FilterContext (budget/dietary/region state)
3. Extract custom hooks: useGeolocation, useCity, useFilteredDishes
4. Extend Dish TypeScript interface
5. Expand dish.json to 50+ items with complete metadata
6. Upgrade Gemini model reference to gemini-2.0-flash
7. Add empty-pool guard in random-pick logic

**Owner**: Implementation team (Phase 1 delegated to next agent chain)
**Blockers**: None
**Timeline**: Phase 1 estimated 1-2 sessions; Phases 2-4 follow sequentially

---

**Plan Reference**: `plans/260424-2251-phase2-find-and-order/plan.md`
