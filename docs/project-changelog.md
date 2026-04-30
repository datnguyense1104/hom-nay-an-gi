# Project Changelog

## [2026-04-30] Personalization System Fix & Upgrade

### Bug Fixes
- **Mood preference not persisted**: Moved `mood` from isolated `App.tsx` local state into `usePreferences` hook. Mood now reads/writes `default_mood` localStorage key consistently and flows correctly to AI suggestion prompt.
- **City selection ignored by AI**: Added `CITY_TO_REGION` mapping (`ha-noi`/`hai-phong` → Miền Bắc, `da-nang` → Miền Trung, `ho-chi-minh`/`can-tho` → Miền Nam). City chosen in onboarding now auto-initializes the AI region context.

### New Features
- **Personalization badges**: After randomize or AI suggest, active preferences (mood, budget, dietary) appear as badge pills on the result card so users can see their settings are being applied.
- **Re-open preferences button**: Settings icon (⚙) added to the header — tapping it reopens the onboarding wizard with current values pre-selected.
- **Onboarding final step summary**: Step 4 (mood) now shows a summary card listing budget, dietary, and city choices made in prior steps.

### Changed
- `use-preferences.ts`: Added `mood`, `setMood`, `defaultRegion` exports; added `CITY_TO_REGION` map.
- `use-onboarding-state.ts`: Added `open()` method for re-opening wizard from main UI.
- `suggestion-display.tsx`: Added `mood`, `budget`, `dietaryPrefs` props; renders `<PersonalizationBadges>`.
- `onboarding-flow.tsx`: Step 3 now renders a pre-completion summary; adaptive min-height.
- `App.tsx`: Removed local `mood` state + `setDefaultMood`; wired from `usePreferences`; added Settings button; region initialized from `defaultRegion`.
- New file: `src/components/personalization-badges.tsx`
