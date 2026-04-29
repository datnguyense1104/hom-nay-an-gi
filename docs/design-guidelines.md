# Design Guidelines

**Version:** 1.0  
**Style System:** Tailwind CSS v4  
**Brand:** Vietnamese Food Decision Making  
**Last Updated:** April 2025

---

## Brand & Vision

### Brand Statement
"From decision fatigue to food discovery in 30 seconds"

**Personality:** Friendly, decisive, energetic, Vietnamese-centric  
**Tone:** Casual, encouraging, supportive  
**Core Values:**
- Speed (decisions matter during work breaks)
- Serendipity (discovery, not overthinking)
- Cultural pride (celebration of Vietnamese food)
- Inclusivity (all budgets, all dietary needs)

---

## Color Palette

### Primary Colors

| Color | Value | Usage | Notes |
|-------|-------|-------|-------|
| **Primary Orange** | `#FF6321` | CTA buttons, highlights, active states | Warm, energetic, food-related |
| **Dark Text** | `#1A1A1A` | Headlines, body text, UI text | High contrast, readable |
| **Light Background** | `#FFF9F5` | App background, card surfaces | Warm, not pure white |

### Secondary Colors

| Color | Value | Usage | Notes |
|-------|-------|-------|-------|
| **Border** | `#FFE7D6` | Card borders, dividers, subtle lines | Peachy, warm tone |
| **Text Muted** | `#A6998F` | Secondary text, labels, disabled states | Softer, less prominent |
| **Text Medium** | `#8C7A6B` | Tertiary text, hints, captions | Between muted and primary |
| **Hover State** | `#E5551A` | Button hover, interactive feedback | Slightly darker orange |

### Semantic Colors (Future)

```css
/* Success (for future features) */
--color-success: #10B981;      /* Green for confirmations */

/* Error (for future features) */
--color-error: #EF4444;        /* Red for warnings/errors */

/* Warning (for future features) */
--color-warning: #F59E0B;      /* Amber for cautions */

/* Info (for future features) */
--color-info: #3B82F6;         /* Blue for information */
```

### Color Combinations

**Don't combine:**
- Dark text (#1A1A1A) on dark backgrounds (unreadable)
- Two oranges together (confusing for active/hover states)
- Orange on orange (no contrast)

**Good combinations:**
```
Dark on Light BG:    #1A1A1A on #FFF9F5 ✓ (7.1:1 contrast)
Muted on Light BG:   #A6998F on #FFF9F5 ✓ (4.5:1 contrast)
Orange on Light BG:  #FF6321 on #FFF9F5 ✓ (6.2:1 contrast)
White on Orange:     #FFFFFF on #FF6321 ✓ (7.4:1 contrast)
```

### Color Usage in Code

```tsx
// ✓ Good: Use arbitrary Tailwind values with exact hex
<button className="bg-[#FF6321] hover:bg-[#E5551A] text-white">
  Click me
</button>

// ✗ Bad: Using Tailwind built-in colors (doesn't match brand)
<button className="bg-orange-500 hover:bg-orange-600">
  Click me
</button>

// ✗ Bad: Hardcoded inline styles (maintenance nightmare)
<button style={{ backgroundColor: "#FF6321" }}>
  Click me
</button>
```

---

## Typography

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
/* System fonts for performance + familiarity */
```

### Font Sizes

| Size | Pixels | Usage | Notes |
|------|--------|-------|-------|
| **XL** | 28–32px | Main title "Hôm nay ăn gì?" | Bold, eye-catching |
| **LG** | 20–24px | Section headers, card titles | Prominent |
| **Base** | 14–16px | Body text, descriptions | Default reading size |
| **Small** | 12–14px | Labels, captions, hints | Secondary info |
| **XS** | 10–12px | Tags, pills, badges | Tiny, compact |

### Font Weights

| Weight | Value | Usage |
|--------|-------|-------|
| **Normal** | 400 | Body text, descriptions |
| **Semi-bold** | 600 | Secondary headings |
| **Bold** | 700 | Primary headings, buttons |
| **Black** | 900 | Brand text, top-level headers |

### Line Heights

| Context | Value | Notes |
|---------|-------|-------|
| Headings | 1.2 | Tight, impactful |
| Body text | 1.5 | Comfortable reading |
| Labels | 1.0 | Compact, no extra space |

### Text Examples

```tsx
// ✓ Main title (28px, black, bold)
<h1 className="text-2xl font-black text-[#1A1A1A]">
  Hôm nay ăn gì?
</h1>

// ✓ Card title (16px, dark, bold)
<h2 className="text-base font-bold text-[#1A1A1A]">
  Phở Bò
</h2>

// ✓ Body text (14px, dark, normal)
<p className="text-sm text-[#1A1A1A]">
  Nước dùng thanh ngọt, thịt bò mềm
</p>

// ✓ Label (10px, muted, bold, uppercase)
<label className="text-[10px] font-bold text-[#A6998F] uppercase">
  Tâm trạng
</label>

// ✓ Muted text (12px, muted, normal)
<span className="text-xs text-[#A6998F]">
  Lâu không ăn
</span>
```

---

## Spacing System

### Base Unit: 4px

All spacing uses multiples of 4px for consistency.

| Name | Value | Tailwind | Usage |
|------|-------|----------|-------|
| **xs** | 4px | p-1 | Tiny gaps, internal element spacing |
| **sm** | 8px | p-2 | Small padding, button gaps |
| **md** | 12px | p-3 | Standard padding, card spacing |
| **lg** | 16px | p-4 | Comfortable spacing between sections |
| **xl** | 24px | p-6 | Large gaps, major section separation |
| **2xl** | 32px | p-8 | App padding, header/footer spacing |
| **3xl** | 48px | p-12 | Full-screen spacing |

### Padding vs. Margin

- **Use padding** for internal spacing (inside elements)
- **Use margin** for external spacing (between elements)
- **Avoid both** on same element (use one or the other)

```tsx
// ✓ Good: padding inside, margin outside
<div className="p-4 mb-6">
  <h2>Title</h2>
</div>

// ✗ Bad: both padding and margin
<div className="p-4 m-4">
  Too much space
</div>
```

### Common Spacing Patterns

```tsx
// ✓ Section spacing
<section className="space-y-6">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</section>

// ✓ Button group spacing
<div className="grid grid-cols-2 gap-3">
  <button>Button 1</button>
  <button>Button 2</button>
</div>

// ✓ Card padding
<div className="bg-white p-4 rounded-2xl">
  Content
</div>
```

---

## Component Patterns

### Buttons

#### Primary Button (CTA)
```tsx
<button className="bg-[#FF6321] hover:bg-[#E5551A] text-white font-bold py-4 rounded-2xl transition-all active:scale-[0.98]">
  Ngẫu nhiên
</button>
```

**Usage:** Main actions (Randomize, AI Suggest, Submit)  
**States:**
- Normal: Orange background, white text
- Hover: Darker orange
- Active: Slightly scaled down (98%)
- Disabled: 50% opacity

#### Secondary Button
```tsx
<button className="bg-white border border-[#FFE7D6] text-[#1A1A1A] font-bold py-3 rounded-xl hover:bg-[#FFF9F5] transition-colors">
  Cancel
</button>
```

**Usage:** Non-critical actions, alternatives  
**States:**
- Normal: White background, dark text, border
- Hover: Very light orange background
- Active: Border gets darker

#### Tertiary Button / Text Link
```tsx
<button className="text-[#FF6321] hover:text-[#E5551A] font-semibold transition-colors">
  Learn more
</button>
```

**Usage:** Secondary navigation, info links  
**States:**
- Normal: Orange text
- Hover: Darker orange
- No background, no border

#### Pill Button (Filter / Tag)
```tsx
<button className="px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all bg-white text-[#8C7A6B] border border-[#FFE7D6] hover:bg-[#FF6321] hover:text-white">
  Tâm trạng
</button>

// When active:
<button className="px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all bg-[#FF6321] text-white">
  Vui vẻ
</button>
```

**Usage:** Filters, tags, category selection  
**States:**
- Inactive: White bg, muted text, border
- Active: Orange bg, white text, no border

### Cards

#### Suggestion Card
```tsx
<div className="bg-white rounded-2xl border border-[#FFE7D6] p-6 shadow-sm">
  <h2 className="text-base font-bold text-[#1A1A1A] mb-2">
    Phở Bò
  </h2>
  <p className="text-sm text-[#A6998F] mb-4">
    Nước dùng thanh ngọt
  </p>
  <div className="flex gap-2">
    <button className="flex-1 ...">Shopee Food</button>
    <button className="flex-1 ...">Maps</button>
  </div>
</div>
```

**Pattern:**
- White background
- Subtle border (#FFE7D6)
- Rounded corners (2.5rem / 40px)
- Light shadow (optional)
- Padding: 1.5–2rem

#### History Pill
```tsx
<button className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#FFF9F5] border border-[#FFE7D6] text-[#1A1A1A] hover:bg-[#FFE7D6] transition-colors">
  Phở Bò
</button>
```

**Pattern:**
- Small, compact
- Light background
- Border (not filled)
- Hover: darker background

### Input Fields

#### Text Input / Search
```tsx
<input 
  type="text"
  placeholder="Tìm kiếm..."
  className="w-full px-4 py-2 border border-[#FFE7D6] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6321]"
/>
```

**Pattern:**
- Border on default
- Orange ring on focus (not outline)
- Rounded corners (xl = 0.75rem)
- Padding: 0.5rem–1rem

### Collapsible Sections

```tsx
<div className="bg-[#FFF9F5] border border-[#FFE7D6] rounded-2xl p-4">
  <button
    onClick={onToggle}
    className="w-full flex items-center justify-between text-[10px] font-bold uppercase"
  >
    <span>Lọc tìm</span>
    <motion.div animate={{ rotate: show ? 45 : 0 }}>
      <X className="w-3 h-3" />
    </motion.div>
  </button>

  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="overflow-hidden pt-4"
      >
        Content
      </motion.div>
    )}
  </AnimatePresence>
</div>
```

**Pattern:**
- Toggle header with icon rotation
- Animated expand/collapse (motion/react)
- Content hidden when collapsed
- Smooth 0.2s–0.3s transitions

---

## Layout & Structure

### Container Sizing

```tsx
// Main app container (max width)
<div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(255,99,33,0.15)]">
  {/* Content */}
</div>
```

**Breakpoints (Tailwind default):**
- Mobile: < 640px
- Tablet: 640px–1024px
- Desktop: > 1024px

**Strategy:** Mobile-first (design for small, enhance for large)

### Grid & Flexbox

```tsx
// ✓ Two-column button layout
<div className="grid grid-cols-2 gap-3">
  <button>Button 1</button>
  <button>Button 2</button>
</div>

// ✓ Centered vertical stack
<div className="flex flex-col items-center gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

// ✓ Header with spacing
<div className="flex items-center justify-between">
  <h1>Title</h1>
  <button>Action</button>
</div>
```

### Responsive Padding

```tsx
// Padding scales with screen size
<div className="p-4 md:p-6 lg:p-8">
  Content
</div>

// Often: desktop has more padding than mobile
```

---

## Animation & Motion

### Framework: motion/react (Framer Motion v12)

All animations use `motion/react` — no CSS animations.

### Common Animations

#### Page Transitions
```tsx
<AnimatePresence mode="wait">
  {view === "random" ? (
    <motion.div
      key="randomizer"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
    >
      Random View
    </motion.div>
  ) : (
    <motion.div
      key="menu"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
    >
      Menu View
    </motion.div>
  )}
</AnimatePresence>
```

**Usage:** View switches (Random ↔ Menu)  
**Timing:** 200ms, easing: ease-out

#### Expand/Collapse
```tsx
<motion.div
  initial={{ height: 0, opacity: 0 }}
  animate={{ height: "auto", opacity: 1 }}
  exit={{ height: 0, opacity: 0 }}
  transition={{ duration: 0.3 }}
  className="overflow-hidden"
>
  {children}
</motion.div>
```

**Usage:** Collapsible sections (filters, history)  
**Timing:** 300ms

#### Button Scale (Press)
```tsx
<motion.button
  whileTap={{ scale: 0.98 }}
  className="bg-[#FF6321] ..."
>
  Click me
</motion.button>
```

**Usage:** CTA buttons for tactile feedback  
**Timing:** Instant (tap-time = ~50ms)

#### Spin Animation (Slot Machine)
```tsx
// In App.tsx
<RefreshCw className={`w-5 h-5 ${isSpinning ? "animate-spin" : ""}`} />
```

**Usage:** Randomize button during suggestion  
**Timing:** Continuous (until stopped)

#### Icon Rotation (Toggle)
```tsx
<motion.div animate={{ rotate: show ? 45 : 0 }} transition={{ duration: 0.2 }}>
  <X className="w-3 h-3" />
</motion.div>
```

**Usage:** Expand/collapse toggle icons  
**Timing:** 200ms

### Animation Guidelines

**Do:**
- Keep animations brief (200–400ms)
- Use scale & opacity (hardware-accelerated)
- Animate on user interaction (button click)
- Provide visual feedback for all actions

**Don't:**
- Animate on page load (feels slow)
- Stack multiple animations (confusing)
- Use animations > 1 second (feels sluggish)
- Ignore accessibility (provide skip/reduce option)

---

## Vietnamese UX Considerations

### Language & Tone

**Vietnamese text characteristics:**
- Often longer than English (20–30% more characters)
- Uses tone marks (à, á, ả, ã, ạ) — ensure font supports them
- Reads naturally when slightly larger font

**Recommendations:**
- Don't truncate text — wrap instead
- Use 14–16px for body text (not 12px)
- Test with Vietnamese speakers

### Cultural Sensitivities

**Food categories:**
- Honor regional distinctions (Miền Bắc, Miền Trung, Miền Nam)
- Respect "Mọi vùng" (nationwide) for non-regional dishes
- Avoid stereotyping (every region has diverse foods)

**Meal times:**
- Sáng (morning, 5–11 AM) — breakfast & light food
- Trưa (midday, 11 AM–4 PM) — main lunch
- Tối (evening, 4–10 PM) — dinner
- Khuya (night, 10 PM–5 AM) — late-night/snacks

**Dietary terms:**
- "Ăn chay" (vegetarian/vegan) — respected choice
- "Halal" — important for Muslim users
- Use Vietnamese medical terms for allergies

### Mobile-First Design

Vietnam has high smartphone adoption but lower desktop usage:
- Design for 375px minimum width (iPhone SE)
- Touch targets: 48px minimum (fingertip size)
- Avoid hover-only interactions (no mouse)
- Test on actual Vietnamese devices (Oppo, Samsung, Xiaomi popular)

---

## Accessibility (WCAG 2.1 AA)

### Color Contrast

All text must meet WCAG AA standards (4.5:1 for body, 3:1 for large text).

```
✓ Dark on Light:   #1A1A1A on #FFF9F5 = 7.1:1 (pass)
✓ Orange on Light: #FF6321 on #FFF9F5 = 6.2:1 (pass)
✓ Muted on Light:  #A6998F on #FFF9F5 = 4.5:1 (pass, barely)
✗ Orange on White: #FF6321 on #FFFFFF = 5.9:1 (fail for normal text)
```

### Button States

Always provide visible focus states:

```tsx
<button className="... focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6321]">
  Accessible button
</button>
```

### Semantic HTML

Use proper semantic elements:

```tsx
// ✓ Good: semantic button
<button onClick={handleClick}>Click me</button>

// ✗ Bad: div as button (requires role + keyboard handling)
<div onClick={handleClick} role="button">
  Click me
</div>
```

### ARIA Labels

Use ARIA for non-obvious elements:

```tsx
// ✓ Good: label for input
<label htmlFor="mood">Tâm trạng</label>
<input id="mood" type="text" />

// ✓ Good: ARIA label for icon button
<button aria-label="Close filters">
  <X />
</button>
```

### Keyboard Navigation

All interactive elements must be keyboard-accessible:

```tsx
// ✓ Good: button is naturally keyboard-accessible
<button onClick={handleClick}>Action</button>

// ✓ If using div, make it accessible
<div
  role="button"
  tabIndex={0}
  onKeyDown={e => e.key === "Enter" && handleClick()}
  onClick={handleClick}
>
  Action
</div>
```

---

## Dark Mode (Future)

Design is currently light mode only. Dark mode support can be added in Phase 4.

**Proposed dark palette:**
```css
--dark-bg: #0F0F0F;        /* Card background */
--dark-surface: #1A1A1A;   /* App background */
--dark-text: #F5F5F5;      /* Primary text */
--dark-muted: #A0A0A0;     /* Secondary text */
--dark-orange: #FF8C42;    /* Slightly brighter for contrast */
```

**To implement:** Use Tailwind's `dark:` prefix when ready.

---

## Component Library Expansion (Future)

Currently using:
- Tailwind CSS (utility-first)
- motion/react (animations)
- lucide-react (icons)

**If expanding component library:**
- Use Storybook for component documentation
- Create `.stories.tsx` files alongside components
- Export reusable components to npm (if needed)
- Maintain design consistency across all components

---

## Icons

### Icon Library: lucide-react

```tsx
import { Utensils, RefreshCw, Sparkles, ArrowLeft, LayoutList, X } from "lucide-react";

<Utensils className="w-5 h-5 text-white" />
```

**Icon sizes (consistent):**
- 3x3: `w-3 h-3` (12px) — small icons, labels
- 4x4: `w-4 h-4` (16px) — inline icons
- 5x5: `w-5 h-5` (20px) — button icons, standard
- 6x6: `w-6 h-6` (24px) — large buttons, prominent

**Color:**
- Use text color utilities: `text-white`, `text-[#FF6321]`
- Match surrounding text color when possible
- Ensure contrast against background

---

## Print & Export (Future)

Currently no print support needed. If adding in Phase 4:
- Hide interactive elements (buttons, filters)
- Use black text on white (better for printing)
- Scale images for paper size
- Include metadata (dish name, date)

---

## Testing Design Changes

Before deploying design updates:

1. **Contrast Check:** Use WebAIM Contrast Checker
2. **Mobile Preview:** Test on actual phone (iPhone + Android)
3. **Cross-browser:** Chrome, Safari, Firefox, Edge
4. **Accessibility:** WAVE tool, axe DevTools
5. **Performance:** Lighthouse report
6. **User Testing:** Ask Vietnamese speakers for feedback

---

## Design Tools & Handoff

### Figma / Design Files
Currently none — design lives in code.  
Consider creating Figma file in Phase 4 for team collaboration.

### Component Documentation
Add JSDoc comments to components:

```tsx
/**
 * Button component for primary actions
 *
 * @example
 * <Button onClick={handleClick}>Click me</Button>
 */
export function Button({ children, onClick }: Props) {
  // ...
}
```

### Design Specs
Keep specs in this file (source of truth).  
Update whenever design changes.

---

## Troubleshooting Design Issues

### Text Too Small
- Increase font size by one level (text-sm → text-base)
- Ensure device is not zoomed out

### Colors Look Different
- Check color accuracy in browser DevTools
- Test on multiple monitors
- Ensure display is calibrated

### Animations Feel Slow
- Reduce duration by 100ms
- Check browser performance (DevTools Performance tab)
- Test on slower devices

### Layout Breaks on Mobile
- Add responsive breakpoints (md:, lg:)
- Test on actual phones (not just browser resize)
- Use max-width container

---

## Summary

This design system ensures:
- ✓ Consistent visual language
- ✓ Fast decision-making (orange = action)
- ✓ Vietnamese cultural respect
- ✓ Mobile-first usability
- ✓ Accessibility compliance
- ✓ Performance optimization

For questions on design decisions, see `project-overview-pdr.md` and `code-standards.md`.
