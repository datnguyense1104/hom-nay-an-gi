# Phase 1 — Modularize App.tsx + Types + Expand Dish Database

## Overview

- **Priority:** P1 (blocker for all other phases)
- **Status:** Complete ✅
- **Effort:** ~1d
- **Description:** Split 571-line monolithic App.tsx into focused modules, define extended Dish type, and expand dish database from 16 → 50+ entries.

## Key Insights

- App.tsx at 571 lines — must modularize before adding Phase 2 features
- DISHES array missing: `budget`, `dietary`, `region`, `shopeeFoodKeyword` fields
- localStorage hook logic (lines 54–120) and AI logic (lines 186–215) can be cleanly extracted
- Deduplication logic (48h + 2-meal window) lives inline — extract to `use-meal-history.ts`
- Current model `"gemini-3-flash-preview"` should upgrade to `"gemini-2.0-flash"` (per PRD)

## Requirements

**Functional:**
- All existing features work identically after refactor (no regressions)
- Dish interface has: `budget`, `dietary`, `region`, `shopeeFoodKeyword`
- 50+ dishes with full metadata

**Non-functional:**
- Each file ≤ 200 lines
- TypeScript strict mode compatible

## Target Architecture

```
src/
├── types/
│   └── dish-types.ts               # Dish interface + filter type unions
├── data/
│   └── dishes-data.ts              # 50+ Vietnamese dishes array
├── hooks/
│   ├── use-meal-history.ts         # localStorage + deduplication logic
│   └── use-preferences.ts          # budget + dietary prefs localStorage
├── components/
│   ├── filter-panel.tsx            # Mood/weather/region/budget/dietary
│   ├── suggestion-display.tsx      # Result card + action buttons
│   ├── meal-history-section.tsx    # Collapsible history pills
│   └── menu-list-view.tsx          # Full menu list + search
└── App.tsx                         # Orchestration ≤ 150 lines
```

## Related Code Files

**Create:**
- `src/types/dish-types.ts`
- `src/data/dishes-data.ts`
- `src/hooks/use-meal-history.ts`
- `src/hooks/use-preferences.ts`
- `src/components/filter-panel.tsx`
- `src/components/suggestion-display.tsx`
- `src/components/meal-history-section.tsx`
- `src/components/menu-list-view.tsx`

**Modify:**
- `src/App.tsx` — reduce to orchestration shell

## Implementation Steps

### Step 1: Define extended types (`src/types/dish-types.ts`)

```typescript
export type MealTime = "Sáng" | "Trưa" | "Tối" | "Khuya";
export type BudgetRange = "under-50k" | "50k-100k" | "over-100k";
export type DietaryTag = "chay" | "no-red-meat" | "no-seafood" | "no-spicy" | "halal";
export type Region = "Bắc" | "Trung" | "Nam" | "Mọi vùng";

export interface Dish {
  id: number;
  name: string;
  description: string;
  category: string;
  time: MealTime[];
  budget: BudgetRange;
  dietary: DietaryTag[];
  region: Region;
  shopeeFoodKeyword: string;
}
```

### Step 2: Expand dish database (`src/data/dishes-data.ts`)

Expand from 16 → 50+ dishes. Each dish needs all fields from the new Dish interface.

Include diverse coverage:
- All meal times (Sáng/Trưa/Tối/Khuya)
- All budget tiers (under-50k: ~20 dishes, 50k-100k: ~20 dishes, over-100k: ~10 dishes)
- All regions (Bắc/Trung/Nam/Mọi vùng)
- Vegetarian options (chay tag): ≥5 dishes
- Various dietary restrictions covered

Sample new dishes to add (beyond existing 16):
Sáng: Bánh Mì, Xôi Xéo, Bánh Cuốn, Cháo Lòng, Bún Bò, Hủ Tiếu, Bánh Ướt
Trưa/Tối: Cơm Tấm, Bún Riêu, Cơm Chiên, Gỏi Cuốn, Bánh Xèo, Lẩu Thái, Cá Kho Tộ, Thịt Kho Tàu, Canh Chua, Mì Quảng, Cao Lầu, Phở Gà, Hủ Tiếu Nam Vang, Bún Thịt Nướng, Cơm Niêu, Chả Cá Lã Vọng, Lẩu Mắm, Bánh Bèo, Nem Lụi, Bún Bò Huế
Khuya: Mì Tôm nấu, Cháo Gà, Chè, Bánh Mì Ốp La, Súp Cua, Hủ Tiếu Khô
Chay: Cơm Chay, Bún Riêu Chay, Bánh Mì Chay, Lẩu Chay, Phở Chay

### Step 3: Extract `use-meal-history.ts`

Move from App.tsx:
- `mealHistory` state + localStorage load (lines 54–58)
- localStorage save effect (line 59)
- Deduplication logic `getRecentlyEaten()` equivalent
- `addToHistory(dish)` function

```typescript
export function useMealHistory() {
  // returns: { mealHistory, addToHistory, getRecentlyEaten }
}
```

### Step 4: Extract `use-preferences.ts`

New hook (no existing code to extract — creates new state):
```typescript
export function usePreferences() {
  // budget: BudgetRange | "any"
  // dietaryPrefs: DietaryTag[]
  // city: string (for Shopee Food)
  // Persists to localStorage keys: user_budget_pref, user_dietary_prefs, user_city
}
```

### Step 5: Extract UI components

**`src/components/menu-list-view.tsx`** — Extract lines ~504–555 from App.tsx
- Search input + filtered dish list
- Props: `dishes: Dish[]`

**`src/components/meal-history-section.tsx`** — Extract lines ~473–500
- Props: `history: string[], show: boolean, onToggle: () => void`

**`src/components/filter-panel.tsx`** — Extract lines ~288–357
- Add budget + dietary filter UI (Phase 3 will populate logic)
- Props: `mood, weather, region, budget, dietaryPrefs, onChange handlers`

**`src/components/suggestion-display.tsx`** — Extract lines ~359–451
- Add placeholder slots for Phase 2 deep link buttons
- Props: `selectedDish, aiSuggestion, onLogCalendar, isLogged, calendarStatus`

### Step 6: Trim App.tsx to orchestration shell

App.tsx after refactor should:
- Import and compose the extracted components
- Hold only top-level state (activeTab, view, isSpinning, isAiLoading)
- Call hooks: `useMealHistory`, `usePreferences`
- Contain AI suggestion logic OR extract to `src/hooks/use-ai-suggestion.ts` if >50 lines

### Step 7: Upgrade Gemini model

In AI suggestion logic: change `"gemini-3-flash-preview"` → `"gemini-2.0-flash"`

## Todo List

- [ ] Create `src/types/dish-types.ts`
- [ ] Create `src/data/dishes-data.ts` with 50+ dishes
- [ ] Create `src/hooks/use-meal-history.ts`
- [ ] Create `src/hooks/use-preferences.ts`
- [ ] Create `src/components/menu-list-view.tsx`
- [ ] Create `src/components/meal-history-section.tsx`
- [ ] Create `src/components/filter-panel.tsx`
- [ ] Create `src/components/suggestion-display.tsx`
- [ ] Refactor `src/App.tsx` to orchestration shell
- [ ] Upgrade Gemini model string
- [ ] Run `npm run build` — verify no TypeScript errors

## Success Criteria

- `npm run build` passes with 0 errors
- All existing features work (random suggestion, AI suggestion, history, calendar, menu search)
- App.tsx ≤ 150 lines
- All new files ≤ 200 lines
- 50+ dishes in dishes-data.ts with all required fields

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| State prop-drilling complexity | Medium | Use hooks for shared state; avoid prop chains >2 levels |
| Regression in deduplication logic | High | Extract logic identically, test manually |
| TypeScript errors from interface change | Low | Fix existing dishes to match new interface immediately |

## Security Considerations

- No auth changes
- localStorage data is user-controlled, no server exposure
