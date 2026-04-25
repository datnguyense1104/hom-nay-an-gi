# React 19 + Vite 6 + TypeScript Validation Report

**Date:** 2026-04-24  
**Project:** Hôm Nay Ăn Gì (What to Eat Today)  
**Status:** **BLOCKED** - TypeScript compilation errors must be fixed before merge

---

## Executive Summary

Build passes cleanly with Vite, but **TypeScript strict checking fails** with 6 type errors in `filter-panel.tsx`. All required files exist with correct exports, but needs immediate type fix before validation complete. App.tsx exceeds 200-line guideline (208 lines).

---

## 1. Build Status

| Check | Result | Details |
|-------|--------|---------|
| `npm run build` | **PASS** | Vite build successful in 5.49s (dist: 651KB bundle) |
| Build warnings | Minor | CSS minify warning (non-blocking), chunk size >500KB warning (expected for this app size) |
| Output artifacts | ✓ | HTML + CSS + JS chunks generated correctly |

**Note:** Build succeeds because TypeScript checking is NOT run during Vite build. Only `tsc --noEmit` enforces strict typing.

---

## 2. TypeScript Strict Mode Check

| Check | Result | Details |
|-------|--------|---------|
| `npx tsc --noEmit` | **FAIL** | 6 errors in src/components/filter-panel.tsx |

### TypeScript Errors (BLOCKING)

**File:** `src/components/filter-panel.tsx`

```
error TS2503: Cannot find namespace 'React'  [Line 31]
error TS2322: Property 'key' does not exist on type (5 instances)  [Lines 78, 88, 98, 108, 118]
```

**Root Cause:** Component uses `React.ReactNode` type annotation on line 31 without importing React. In React 19 JSX transform, no React import is needed for JSX, but TypeScript still requires the type import.

**Current Code (line 31):**
```typescript
function PillButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
```

**Fix Required:** Add import at top of file:
```typescript
import type React from 'react';
```

**Secondary Issue:** Lines 78, 88, 98, 108, 118 pass `key` prop directly to `<PillButton>`. React doesn't accept `key` as a component prop - it's for list reconciliation only. Keys should not appear in mapped JSX when passing them to custom components.

---

## 3. Key Files Validation

### 3.1 Types & Data

| File | Exports | Count | Status |
|------|---------|-------|--------|
| `src/types/dish-types.ts` | ✓ All required | 7 types/constants | **PASS** |
| `src/data/dishes-data.ts` | ✓ DISHES array | 54 dishes | **PASS** |

**Exports Verified:**
- `Dish` (interface)
- `BudgetRange` (type)
- `DietaryTag` (type)
- `MealTime` (type)
- `Region` (type)
- `BUDGET_LABELS` (const Record)
- `DIETARY_LABELS` (const Record)
- `CITY_OPTIONS` (const array)

**Dish Count:** 54 entries (exceeds 50+ requirement) ✓

---

### 3.2 Hooks

| File | Export | Status | Notes |
|------|--------|--------|-------|
| `src/hooks/use-meal-history.ts` | ✓ useMealHistory | PASS | localStorage dedup, 48h window, consecutive block logic |
| `src/hooks/use-preferences.ts` | ✓ usePreferences | PASS | Budget + dietary storage, validation |
| `src/hooks/use-geolocation.ts` | ✓ useGeolocation, detectCitySlug, GeolocationState | PASS | 5 city bounds, navigator.geolocation integration |
| `src/hooks/use-calendar.ts` | ✓ useCalendar | PASS | OAuth2 token, Google Calendar API integration |
| `src/hooks/use-ai-suggestion.ts` | ✓ useAiSuggestion | PASS | Gemini 2.0 Flash, fallback logic |

**All hooks properly export expected functions/types.** ✓

---

### 3.3 Utilities

| File | Exports | Status | Notes |
|------|---------|--------|-------|
| `src/utils/deep-links.ts` | buildShopeeFoodUrl, buildGoogleMapsUrl, resolveCitySlug | PASS | 3 exported functions, city detection integration |

---

### 3.4 Components

| File | Export | Status | TypeScript Issues |
|------|--------|--------|-------------------|
| `src/components/filter-panel.tsx` | ✓ FilterPanel | **FAIL** | 6 TS errors (see Section 2) |
| `src/components/suggestion-display.tsx` | ✓ SuggestionDisplay | PASS | Proper deep-link button integration |
| `src/components/meal-history-section.tsx` | ✓ MealHistorySection | PASS | Motion animation, history display |
| `src/components/menu-list-view.tsx` | ✓ MenuListView | PASS | Search filter, meal time badges |

---

### 3.5 App.tsx

| Metric | Value | Status |
|--------|-------|--------|
| Line count | 208 lines | **EXCEEDS 200-line limit** |
| Proper imports | ✓ All 5 hooks, 4 components imported | PASS |
| Main logic | ✓ Randomizer + AI suggestion + state mgmt | PASS |
| View switching | ✓ Random vs Menu modes | PASS |

**Concern:** App.tsx at 208 lines exceeds project guideline (max 200 lines). Consider extracting view components or state hooks into custom composites.

---

## 4. Export Chain Validation

### Verified Exports (all present)

- `types/dish-types.ts`: 7 exports (types + constants) ✓
- `data/dishes-data.ts`: 54-dish array ✓
- 5 hooks with expected signatures ✓
- 4 components with correct interfaces ✓
- 1 utility with 3 functions ✓

**No missing exports detected.**

---

## 5. Test Framework Status

| Item | Status | Note |
|------|--------|------|
| Unit test framework | ❌ Not configured | No vitest/jest found in package.json |
| Integration tests | ❌ Not configured | No test setup |
| E2E tests | ❌ Not configured | No playwright/cypress |
| Test coverage | 0% | Not measurable without test files |

**Recommendation:** Consider adding a test suite in next phase. Current setup has 0 test coverage.

---

## 6. Build Warnings

| Warning | Severity | Action |
|---------|----------|--------|
| CSS `file` property unrecognized (esbuild) | Low | Non-breaking; Tailwind edge case |
| Chunk size > 500KB | Medium | Normal for this app; consider dynamic imports if growth continues |

---

## Critical Issues Summary

| Issue | Severity | Impact | Action |
|-------|----------|--------|--------|
| TypeScript errors in filter-panel.tsx | **CRITICAL** | Build fails strict checking | Add `import type React from 'react'` + remove `key` props from PillButton calls |
| App.tsx exceeds 200 lines | Medium | Code organization concern | Refactor into smaller composable units (optional but recommended) |
| No test framework | Low | Zero test coverage | Add Jest/Vitest when ready for testing phase |

---

## Unresolved Questions

1. **Should `key` props be removed from `<PillButton>` component calls?** React custom components ignore `key` - only list items need keys. Lines 78, 88, 98, 108, 118 pass keys that have no effect. Recommend removing them or understand if intentional for future ref-forwarding.

2. **App.tsx modularization:** At 208 lines, should the random view be extracted into a separate component to respect 200-line guideline, or is this acceptable as a main container?

3. **Test framework:** Is vitest/jest planned for this project? Currently 0% test coverage - no unit, integration, or e2e tests exist.

---

## Next Steps

1. **BLOCKING:** Fix TypeScript errors in `filter-panel.tsx`
   - Add: `import type React from 'react';`
   - Resolve key prop usage (6 instances)

2. **Recommended:** Refactor App.tsx to stay under 200 lines
   - Extract random view into separate `<RandomizerView>` component
   - Extract menu view into separate component if not already done

3. **Optional:** Plan test framework integration for future CI/CD

---

## Files Reviewed

- `package.json` — dependencies, build scripts
- `src/App.tsx` — main entry (208 lines)
- `src/types/dish-types.ts` — type definitions
- `src/data/dishes-data.ts` — 54 dishes
- `src/hooks/*.ts` — 5 custom hooks
- `src/utils/deep-links.ts` — URL builders
- `src/components/*.tsx` — 4 components

**Total files analyzed:** 15 source files

---

## Status

**Status:** BLOCKED  
**Summary:** Vite build passes, but TypeScript strict mode has 6 critical errors in filter-panel.tsx blocking compilation. App.tsx exceeds 200-line guideline. All expected exports present and correctly typed (except filter-panel type issues). No test framework configured.  
**Concerns/Blockers:** Must fix `React.ReactNode` import + key prop usage in filter-panel.tsx before validation passes.
