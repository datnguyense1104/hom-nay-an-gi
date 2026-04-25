# Phase 3 — Budget Filter + Dietary Preferences

## Overview

- **Priority:** P1 High
- **Status:** Complete ✅
- **Effort:** ~0.75d
- **Description:** Add budget range filter and dietary preference multi-select. Persist to localStorage. Apply to dish pool for random suggestions. Inject into Gemini AI prompt.

## Key Insights

- Existing mood/weather/region only inject into AI prompt — they do NOT filter the DISHES pool. Budget + dietary MUST filter the pool (different behavior).
- `usePreferences` hook from Phase 1 already handles localStorage for budget/dietary.
- AI prompt needs richer context: add `"Ngân sách: ${budget}"` and `"Sở thích ăn: ${dietary.join(', ')}"` lines.
- Double-filter safety: if dietary filter reduces pool to 0 dishes → show toast "Không có món phù hợp, thử điều chỉnh bộ lọc" instead of error.
- Existing filter panel UI (Phase 1 `filter-panel.tsx`) has placeholder for budget/dietary — fill it here.
- Budget "Bất kỳ" = no filter (default); dietary = empty array = no filter.

## Requirements

**Functional:**
- Budget filter: 4 options — Dưới 50k | 50–100k | Trên 100k | Bất kỳ (default)
- Dietary multi-select: Ăn chay | Không thịt đỏ | Không hải sản | Không đồ cay | Halal
- Budget + dietary persisted in localStorage (via `usePreferences` hook)
- Random suggestion filters DISHES by activeTab + budget + dietary
- AI prompt includes budget + dietary context
- Empty-pool guard: show user feedback instead of crash

**Non-functional:**
- Dietary chips toggle on/off (multi-select UX)
- Budget is single-select (radio-style)
- Preferences survive page reload

## Data Model

```typescript
// In usePreferences hook (Phase 1):
budget: BudgetRange | "any"   // "any" = no filter
dietaryPrefs: DietaryTag[]    // empty = no filter

// Budget filter applied to DISHES:
const budgetFiltered = budget === "any"
  ? dishes
  : dishes.filter(d => d.budget === budget);

// Dietary filter:
const dietaryFiltered = dietaryPrefs.length === 0
  ? budgetFiltered
  : budgetFiltered.filter(d =>
      dietaryPrefs.every(pref => d.dietary.includes(pref))
    );
```

## Filter Pipeline (full stack)

```
DISHES array
  → filter by activeTab (time)         [existing]
  → filter by budget                   [NEW]
  → filter by dietaryPrefs             [NEW]
  → filter by recentlyEaten exclusion  [existing]
  → random pick OR send to AI
```

## AI Prompt Enhancement

Current prompt context lines:
```
Context: Mood={mood}, Weather={weather}, Region={region}
```

New prompt context lines:
```
Context: Mood={mood}, Weather={weather}, Region={region}
Budget: {budgetLabel} mỗi bữa
Dietary: {dietaryPrefs.length > 0 ? dietaryLabels.join(', ') : 'Không có yêu cầu đặc biệt'}
```

Budget label mapping:
```typescript
const BUDGET_LABELS = {
  "under-50k": "Dưới 50k",
  "50k-100k": "50–100k",
  "over-100k": "Trên 100k",
  "any": "Không giới hạn",
};
```

Dietary label mapping:
```typescript
const DIETARY_LABELS: Record<DietaryTag, string> = {
  "chay": "Ăn chay",
  "no-red-meat": "Không thịt đỏ",
  "no-seafood": "Không hải sản",
  "no-spicy": "Không đồ cay",
  "halal": "Halal",
};
```

## Related Code Files

**Modify:**
- `src/components/filter-panel.tsx` — add budget radio + dietary multi-select UI
- `src/hooks/use-preferences.ts` — already scaffolded in Phase 1 (implement storage logic)
- `src/App.tsx` — pass budget/dietary to filter pipeline + AI prompt builder

**No new files** — all slots were prepared in Phase 1.

## Implementation Steps

### Step 1: Implement `use-preferences.ts` storage logic

```typescript
export function usePreferences() {
  const [budget, setBudget] = useState<BudgetRange | "any">(() => {
    return (localStorage.getItem("user_budget_pref") as BudgetRange | "any") ?? "any";
  });

  const [dietaryPrefs, setDietaryPrefs] = useState<DietaryTag[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("user_dietary_prefs") ?? "[]");
    } catch { return []; }
  });

  const [city, setCity] = useState<string>(() => {
    return localStorage.getItem("user_city") ?? "";
  });

  useEffect(() => { localStorage.setItem("user_budget_pref", budget); }, [budget]);
  useEffect(() => { localStorage.setItem("user_dietary_prefs", JSON.stringify(dietaryPrefs)); }, [dietaryPrefs]);
  useEffect(() => { localStorage.setItem("user_city", city); }, [city]);

  const toggleDietary = (tag: DietaryTag) => {
    setDietaryPrefs(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return { budget, setBudget, dietaryPrefs, toggleDietary, city, setCity };
}
```

### Step 2: Add budget + dietary UI to `filter-panel.tsx`

**Budget section** (single-select pill row):
```
[Bất kỳ] [< 50k] [50–100k] [> 100k]
```
Active pill: filled primary color. Inactive: outlined.

**Dietary section** (multi-select chip grid, 2-3 per row):
```
[Ăn chay] [Không thịt đỏ] [Không hải sản]
[Không đồ cay] [Halal]
```
Active chip: filled accent color. Multiple can be selected simultaneously.

Place both sections below existing mood/weather/region in the collapsible filter panel.

### Step 3: Apply filter pipeline in App.tsx

Update the `randomize()` function:
```typescript
const filtered = DISHES
  .filter(d => d.time.includes(activeTab))
  .filter(d => budget === "any" || d.budget === budget)
  .filter(d => dietaryPrefs.length === 0 || dietaryPrefs.every(p => d.dietary.includes(p)))
  .filter(d => !recentlyEaten.has(d.id));

if (filtered.length === 0) {
  // Show "no dishes match" feedback, don't crash
  setSelectedDish(null);
  // TODO: show toast notification (Phase 4)
  return;
}
```

### Step 4: Enhance AI prompt in suggestion logic

Append budget and dietary lines to the Gemini prompt context string.

### Step 5: Empty-pool guard UX

When filtered pool is empty, show message in suggestion area:
```
"Không tìm thấy món phù hợp với bộ lọc hiện tại.
Thử điều chỉnh ngân sách hoặc sở thích ăn uống."
```
This replaces the suggestion card content when pool = 0.

## Todo List

- [ ] Implement `use-preferences.ts` with localStorage persistence
- [ ] Add budget pill row to `filter-panel.tsx`
- [ ] Add dietary multi-select chips to `filter-panel.tsx`
- [ ] Update filter pipeline in `App.tsx` randomize function
- [ ] Update AI prompt to include budget + dietary
- [ ] Implement empty-pool guard with user message
- [ ] Verify preferences survive page reload
- [ ] Test: chay filter → only vegetarian dishes suggested

## Success Criteria

- Select "Ăn chay" → random only returns dishes with `dietary.includes("chay")`
- Select "< 50k" → random only returns `budget === "under-50k"` dishes
- Preferences persist on reload
- AI prompt reflects budget + dietary in suggestion reasoning
- Empty filter result shows helpful message, no crash

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Dietary filter leaves 0 dishes | Medium | Empty-pool guard (Step 5) |
| AI ignores dietary in suggestion | Low | Double-check filter BEFORE showing AI suggestion result |
| localStorage parse error | Low | try/catch with fallback to defaults |

## Security Considerations

- localStorage values are user-controlled; validate/sanitize when reading (use try/catch + allowlist values)
