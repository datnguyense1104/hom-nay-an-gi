---title: "Phase 2 — Find & Order Integration"
description: "Add Shopee Food + Google Maps deep links, budget/dietary filters, expand dish DB, modularize App.tsx"
status: complete
priority: P1
effort: 3.5d
issue:
branch: feat/phase2-find-and-order
tags: [feature, frontend, refactor]
blockedBy: []
blocks: []
created: 2026-04-24
---

# Phase 2 — Find & Order Integration

## Overview

Implement all Phase 2 PRD features: Shopee Food + Google Maps deep links with geolocation, budget + dietary preference filters, expand dish database from 16 → 50+ dishes, and modularize the monolithic App.tsx (571 lines → 200-line max modules).

## Phases

| Phase | Name | Status |
|-------|------|--------|
| 1 | [Modularize + Types + Expand Dish DB](./phase-01-modularize-and-data.md) | Complete ✅ |
| 2 | [Deep Link Integration](./phase-02-deep-link-integration.md) | Complete ✅ |
| 3 | [Budget + Dietary Filters](./phase-03-filters-and-preferences.md) | Complete ✅ |
| 4 | [Integration + QA](./phase-04-integration-and-qa.md) | Complete ✅ |

## Dependencies

- React 19 + Vite 6 + TypeScript (existing)
- Browser Geolocation API (native)
- Google Gemini API (existing, model upgrade needed)
- No new npm packages required

## Key Constraints

- No backend — pure client-side
- localStorage only storage
- Shopee Food has no public API — deep link only
- Geolocation must have manual fallback
