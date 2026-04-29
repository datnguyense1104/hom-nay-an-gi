# Code Standards & Development Guidelines

**Target Audience:** Contributors to "Hôm Nay Ăn Gì?"  
**Last Updated:** April 2025  
**Enforced:** TypeScript compiler + manual review

---

## Codebase Principles

1. **YAGNI** (You Aren't Gonna Need It) — No premature features
2. **KISS** (Keep It Simple, Stupid) — Clarity over cleverness
3. **DRY** (Don't Repeat Yourself) — Reuse utilities and hooks
4. **Clarity first** — Self-documenting code beats comments

---

## File Organization & Naming

### Directory Structure
```
src/
├── components/          # React components (.tsx)
├── hooks/              # Custom React hooks (.ts)
├── types/              # TypeScript definitions (.ts)
├── data/               # Static data files (.ts)
├── utils/              # Utility functions (.ts)
├── App.tsx             # Root component
├── main.tsx            # Entry point
└── index.css           # Global styles
```

### Naming Conventions

**Files:**
- Components: `PascalCase.tsx` (e.g., `FilterPanel.tsx`)
- Hooks: `kebab-case.ts` (e.g., `use-meal-history.ts`)
- Utilities: `kebab-case.ts` (e.g., `deep-links.ts`)
- Data: `kebab-case.ts` (e.g., `dishes-data.ts`)
- Types: `kebab-case.ts` (e.g., `dish-types.ts`)

**Variables & Functions:**
- Constants: `UPPER_SNAKE_CASE` (e.g., `MAX_ENTRIES`, `STORAGE_KEY`)
- Functions: `camelCase` (e.g., `buildShopeeFoodUrl`, `detectCitySlug`)
- Variables: `camelCase` (e.g., `mealHistory`, `selectedDish`)
- Components: `PascalCase` (e.g., `FilterPanel`, `SuggestionDisplay`)
- Types/Interfaces: `PascalCase` (e.g., `Dish`, `MealTime`, `GeolocationState`)

---

## File Size Limits

- **Maximum:** 200 lines of code per file
- **Components:** Aim for < 150 LOC (split complex UIs into subcomponents)
- **Hooks:** < 100 LOC (extract logic into utilities if needed)
- **Utils:** < 100 LOC (split into focused modules)
- **Exception:** Main App.tsx allowed ~210 LOC due to orchestration needs

**When to split:**
- Component > 150 LOC → extract sub-components
- Hook > 100 LOC → move business logic to utils
- File becomes hard to understand → split by responsibility

---

## TypeScript Conventions

### Strict Mode (Enforced)
```typescript
// ✓ Good: explicit types
interface Props {
  show: boolean;
  onToggle: () => void;
  mood: string;
}

export function FilterPanel(props: Props) { ... }

// ✗ Bad: implicit any
function handleClick(event: any) { ... }
```

### Type Definitions
- Define types in `src/types/` for reusable schemas
- Use interfaces for object shapes
- Use type aliases for unions
- Avoid `any` — use `unknown` + type guards if needed

```typescript
// ✓ Good: union type in dish-types.ts
export type MealTime = "Sáng" | "Trưa" | "Tối" | "Khuya";
export interface Dish { id: number; name: string; ... }

// ✓ Good: type guard in consumer
function filterByTime(dish: Dish, time: MealTime): boolean {
  return dish.time.includes(time);
}
```

### Null Handling
```typescript
// ✓ Good: explicit null checks
if (selectedDish !== null && selectedDish.id > 0) { ... }

// ✓ Good: optional chaining + nullish coalescing
const name = selectedDish?.name ?? "Bữa ăn";

// ✗ Bad: falsy checks (0 or "" can be falsy but valid)
if (dish.budget) { ... }  // Breaks if budget is empty string
```

---

## Component Patterns

### Functional Components Only
Use React 19 functional components with hooks — no class components.

```typescript
// ✓ Good: functional component
interface Props {
  dishes: Dish[];
  onSelect: (dish: Dish) => void;
}

export function MenuListView({ dishes, onSelect }: Props) {
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => 
    dishes.filter(d => d.name.toLowerCase().includes(search.toLowerCase())),
    [dishes, search]
  );
  return (
    <div>
      <input value={search} onChange={e => setSearch(e.target.value)} />
      {filtered.map(d => <button key={d.id} onClick={() => onSelect(d)}>{d.name}</button>)}
    </div>
  );
}
```

### Props Interface Pattern
Always define Props interface for components:

```typescript
interface FilterPanelProps {
  show: boolean;
  onToggle: () => void;
  budget: BudgetRange | "any";
  onBudgetChange: (b: BudgetRange | "any") => void;
}

export function FilterPanel(props: FilterPanelProps) { ... }
```

### Memoization
Use `useMemo` for expensive calculations, `useCallback` for event handlers passed to children:

```typescript
// ✓ Good: memoize filter results
const basePool = useMemo(() =>
  DISHES
    .filter(d => d.time.includes(activeTab))
    .filter(d => budget === "any" || d.budget === budget),
  [activeTab, budget]
);

// ✓ Good: memoize callbacks
const randomize = useCallback(() => {
  if (isSpinning) return;
  // ...
}, [isSpinning, basePool]);
```

### Conditional Rendering
```typescript
// ✓ Good: early returns
if (emptyPool) return <div>No matches</div>;

// ✓ Good: logical AND for simple toggles
{selectedDish && <SuggestionDisplay dish={selectedDish} />}

// ✓ Good: AnimatePresence for animations
<AnimatePresence>
  {show && <motion.div>...</motion.div>}
</AnimatePresence>
```

---

## Hook Patterns

### Custom Hook Structure
```typescript
// ✓ Good: clear state + return shape
export function useCustom() {
  const [state, setState] = useState(initialValue);

  const action = useCallback(() => {
    // Implementation
    setState(newValue);
  }, [dependencies]);

  return { state, action };  // Named return for clarity
}

// ✗ Bad: implicit array return (harder to use)
return [state, setState];  // User must remember order
```

### localStorage Integration
Wrap localStorage access in try-catch:

```typescript
// ✓ Good: safe localStorage
function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

// Persist with useEffect
useEffect(() => {
  localStorage.setItem("user_pref", JSON.stringify(value));
}, [value]);
```

### Side Effect Dependencies
Always specify dependencies in useEffect/useCallback:

```typescript
// ✓ Good: all dependencies listed
const handler = useCallback(() => {
  console.log(userId, mood);
}, [userId, mood]);  // ← Dependencies

// ✗ Bad: missing dependency (stale closure)
const handler = useCallback(() => {
  console.log(userId, mood);
}, [userId]);  // ← mood missing
```

---

## Styling Standards

### Tailwind CSS v4 Only
Use Tailwind utility classes — no custom CSS except `index.css`:

```typescript
// ✓ Good: Tailwind utilities
<button className="bg-[#FF6321] hover:bg-[#E5551A] text-white py-4 rounded-2xl transition-all">
  Action
</button>

// ✗ Bad: inline styles or extra CSS
<button style={{ backgroundColor: "#FF6321" }}>Action</button>
```

### Color Palette
Use these exact colors as Tailwind arbitrary values:

| Color | Value | Usage |
|-------|-------|-------|
| Primary Orange | `#FF6321` | Buttons, highlights, accents |
| Dark | `#1A1A1A` | Text, dark UI elements |
| Light BG | `#FFF9F5` | Page background |
| Border | `#FFE7D6` | Card borders, dividers |
| Text Muted | `#A6998F` | Secondary text, labels |
| Success | Green (TBD) | Confirmations |
| Error | Red (TBD) | Warnings, errors |

```typescript
// ✓ Good: use exact color values
<div className="bg-[#FFF9F5] border border-[#FFE7D6] rounded-2xl">
  <h1 className="text-[#1A1A1A]">Title</h1>
  <p className="text-[#A6998F]">Subtitle</p>
</div>
```

### Responsive Design
Mobile-first approach:

```typescript
// ✓ Good: base mobile, then tablet/desktop
<div className="w-full md:w-1/2 lg:w-1/3">
  <button className="py-2 md:py-4">Button</button>
</div>

// ✗ Bad: desktop-first
<div className="w-1/3 sm:w-1/2 mobile:w-full">
```

### Animation with motion/react
Use motion/react (Framer Motion v12) for all animations:

```typescript
// ✓ Good: motion components
import { motion, AnimatePresence } from "motion/react";

<AnimatePresence mode="wait">
  {show && (
    <motion.div
      key="card"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      Content
    </motion.div>
  )}
</AnimatePresence>

// ✗ Bad: CSS animations mixed with Tailwind
<div className="animate-spin">Spinning</div>
```

---

## Filter Pipeline Pattern

The filter pipeline is the app's core logic. Follow this pattern strictly:

```typescript
// In App.tsx
const basePool = useMemo(() =>
  DISHES
    .filter(d => d.time.includes(activeTab))           // Step 1: Time
    .filter(d => budget === "any" || d.budget === budget)  // Step 2: Budget
    .filter(d => 
      dietaryPrefs.length === 0 || 
      dietaryPrefs.every(p => d.dietary.includes(p))   // Step 3: Dietary (AND logic)
    ),
  [activeTab, budget, dietaryPrefs]
);

// When randomizing, dedupe history
const recentlyEaten = getRecentlyEaten();  // Returns Set<string>
const deduped = basePool.filter(d => !recentlyEaten.has(d.name));
const pool = deduped.length > 0 ? deduped : basePool;

// Then random pick
const final = pool[Math.floor(Math.random() * pool.length)];
```

**Order matters:**
1. Time (required)
2. Budget (OR operation)
3. Dietary (AND operation)
4. History dedup (before random pick)

---

## Error Handling

### Try-Catch Pattern
Wrap async operations and risky operations:

```typescript
// ✓ Good: catch and fallback
try {
  const token = await getAccessToken();
  // Use token
} catch (err) {
  console.error("Failed to get token:", err);
  setError("Could not authenticate");
}

// ✓ Good: localStorage with fallback
try {
  const data = JSON.parse(localStorage.getItem(key) || "null");
  return data ?? fallback;
} catch {
  return fallback;
}
```

### API Error Handling
Graceful fallback for Gemini API:

```typescript
// In useAiSuggestion.ts
try {
  const response = await ai.models.generateContent({ model, contents });
  setAiSuggestion(response.text);
} catch {
  setAiSuggestion("Bún Chả: Thịt nướng thơm lừng cho ngày mới năng động!");
}
```

### User Feedback
Always inform user of errors via UI state, not console logs:

```typescript
// ✓ Good: state-based error UI
const [error, setError] = useState<string | null>(null);

{error && <div className="bg-red-100 text-red-800 p-4">{error}</div>}
```

---

## Environment Variables

### Required Vars (Must be set)
```bash
GEMINI_API_KEY=<google-gemini-api-key>
VITE_GOOGLE_CLIENT_ID=<oauth-client-id>
```

### Access Pattern
```typescript
// ✓ Good: check at initialization
const API_KEY = import.meta.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("GEMINI_API_KEY not set");
}

// ✓ Good: use in env-dependent logic
const shouldUseAi = !!import.meta.env.GEMINI_API_KEY;
```

### Never Commit
- `.env.local` — local overrides
- `.env.*.local` — any local env files
- Credentials or API keys in code

---

## Testing Approach

### Unit Tests (Recommended)
Test pure functions in utils and hooks:

```typescript
// Example: test detectCitySlug
describe("detectCitySlug", () => {
  it("should detect HCM for coordinates in HCM bounds", () => {
    expect(detectCitySlug(10.8, 106.7)).toBe("ho-chi-minh");
  });
  it("should return null for unknown coordinates", () => {
    expect(detectCitySlug(0, 0)).toBeNull();
  });
});
```

### Integration Tests (Optional)
Test component behavior with mocked APIs:

```typescript
// Example: test FilterPanel with props
it("should call onBudgetChange when budget pill clicked", () => {
  const onBudgetChange = jest.fn();
  render(<FilterPanel budget="any" onBudgetChange={onBudgetChange} ... />);
  const pill = screen.getByText("50–100k");
  fireEvent.click(pill);
  expect(onBudgetChange).toHaveBeenCalledWith("50k-100k");
});
```

### No Manual Console Logs
Remove all `console.log` before committing — use debugger or error states instead.

---

## Accessibility Standards

### ARIA & Semantics
Use semantic HTML where possible:

```typescript
// ✓ Good: semantic elements
<button onClick={handleClick}>Click me</button>
<label htmlFor="mood">Tâm trạng</label>
<input id="mood" value={mood} onChange={handleMoodChange} />

// ✗ Bad: divs as buttons
<div onClick={handleClick}>Click me</div>
```

### Keyboard Navigation
All interactive elements must be keyboard accessible:

```typescript
// ✓ Good: button is keyboard-accessible by default
<button onClick={randomize}>Randomize</button>

// Consider: tab order for complex UIs
<div tabIndex={0} role="button" onKeyDown={handleKeydown}>
```

---

## Performance Checklist

Before committing:
- [ ] No unnecessary re-renders (check useCallback/useMemo)
- [ ] No console.logs in production code
- [ ] localStorage calls wrapped in try-catch
- [ ] Event handlers memoized if passed to children
- [ ] Images optimized or use icon library
- [ ] No large libraries imported unnecessarily
- [ ] Build output < 500 KB gzipped

Run:
```bash
npm run build
npm run lint
```

---

## Common Patterns & Anti-Patterns

| Do | Don't |
|----|-------|
| `const name = dish?.name ?? "Unknown"` | `const name = dish?.name \|\| "Unknown"` (empty string fails) |
| Define Props interface | Inline prop types in function signature |
| Memoize expensive filters | Recalculate on every render |
| Use Tailwind classes | Mix Tailwind + inline CSS |
| Try-catch async operations | Unhandled promise rejections |
| Return named objects from hooks | Return implicit arrays |
| Validate localStorage data | Assume localStorage is valid |
| Use motion/react for animations | CSS animations + Tailwind |
| Define constants in ALL_CAPS | Magic strings in code |

---

## Commit Message Guidelines

Follow conventional commits:

```
feat: add geolocation city detection
fix: prevent duplicate suggestions in 48h window
refactor: extract meal history logic to custom hook
docs: update README with API key setup
test: add unit tests for detectCitySlug
```

**Format:** `{type}: {description}`

**Types:**
- `feat` — new feature
- `fix` — bug fix
- `refactor` — code reorganization
- `docs` — documentation changes
- `test` — test additions/changes
- `perf` — performance improvements
- `chore` — dependencies, config, build

---

## Code Review Checklist

Before approving PRs, verify:
- [ ] TypeScript compiles without errors (`npm run lint`)
- [ ] No `any` types unless justified
- [ ] File size < 200 LOC (or documented exception)
- [ ] Props interface defined for components
- [ ] useCallback/useMemo used appropriately
- [ ] localStorage wrapped in try-catch
- [ ] No console.logs left in code
- [ ] Consistent naming (camelCase, PascalCase)
- [ ] Tailwind classes used, no inline styles
- [ ] Commit message follows conventional format
- [ ] Tests pass (manual or automated)

---

## Documentation Standards

### Inline Comments
Use sparingly — code should be self-documenting:

```typescript
// ✓ Good: explains *why*, not *what*
const DEDUPE_WINDOW_MS = 48 * 60 * 60 * 1000; // 48 hours to prevent meal fatigue

// ✗ Bad: explains *what* (code already says that)
const MAX = 50;  // Maximum entries
```

### Function Documentation
Document public functions with JSDoc if complex:

```typescript
/**
 * Build Shopee Food search URL for a dish
 * @param keyword - Vietnamese dish name to search
 * @param citySlug - Optional city slug (ho-chi-minh, ha-noi, etc.)
 * @returns Full Shopee Food search URL
 */
export function buildShopeeFoodUrl(keyword: string, citySlug?: string | null): string {
  // Implementation
}
```

### README Sections
Keep updated:
- Setup instructions
- Required env vars
- Build/dev commands
- Known limitations
- Contributing guidelines

---

## Version & Dependency Management

- **React:** 19.0.0+ (use latest)
- **TypeScript:** ~5.8.2 (stay compatible)
- **Tailwind:** 4.1.14+ (use latest)
- **motion/react:** 12.23.24+ (use latest)
- **Vite:** 6.2.0+ (use latest)

Check for updates quarterly:
```bash
npm outdated
npm update
```

---

## Questions & Clarifications

If code intent is unclear:
1. Refactor for clarity
2. Add minimal inline comment (1 line max)
3. Document in code-standards.md if pattern repeats

If pattern isn't documented here:
1. Propose pattern
2. Update this file
3. Revert to established patterns in codebase
