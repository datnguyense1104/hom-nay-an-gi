# Documentation Index

**Project:** Hôm Nay Ăn Gì? (What to Eat Today?)  
**Version:** 1.0 (Phase 2 Complete)  
**Last Updated:** April 2025

---

## Quick Navigation

### Start Here
- **[Project Overview & PDR](./project-overview-pdr.md)** (250 LOC) — Problem statement, features, success metrics, tech stack
- **[System Architecture](./system-architecture.md)** (810 LOC) — Component structure, data flow, API integrations, performance characteristics

### For Developers
- **[Codebase Summary](./codebase-summary.md)** (345 LOC) — File-by-file breakdown, module responsibilities, localStorage schema
- **[Code Standards](./code-standards.md)** (638 LOC) — TypeScript conventions, component patterns, styling guidelines, testing
- **[Design Guidelines](./design-guidelines.md)** (781 LOC) — Color palette, typography, spacing, animations, Vietnamese UX

### For Operations
- **[Deployment Guide](./deployment-guide.md)** (810 LOC) — Setup, environment variables, building, deploying to Vercel/Netlify, troubleshooting
- **[Project Roadmap](./project-roadmap.md)** (578 LOC) — Phase 1–4 plans, feature details, timelines, success metrics, risks

---

## Documentation Structure

```
docs/
├── README.md (this file)              # Navigation hub
├── project-overview-pdr.md            # Vision, features, PRD
├── system-architecture.md             # Technical design, APIs, data flow
├── codebase-summary.md                # Code organization, file breakdown
├── code-standards.md                  # Development rules, patterns
├── design-guidelines.md               # Design system, colors, typography
├── deployment-guide.md                # Setup, build, deploy, troubleshoot
└── project-roadmap.md                 # Phases, timelines, future plans
```

---

## By Role

### Product Manager
1. [Project Overview & PDR](./project-overview-pdr.md) — Features, metrics, roadmap
2. [Project Roadmap](./project-roadmap.md) — Timeline, Phase 3–4 planning
3. [Design Guidelines](./design-guidelines.md) — Brand, UX considerations

### Frontend Developer
1. [Codebase Summary](./codebase-summary.md) — File organization, entry points
2. [Code Standards](./code-standards.md) — Development rules, patterns to follow
3. [System Architecture](./system-architecture.md) — Data flow, hook dependencies
4. [Design Guidelines](./design-guidelines.md) — Component patterns, styling

### DevOps / Deployment
1. [Deployment Guide](./deployment-guide.md) — All deployment steps
2. [Project Overview & PDR](./project-overview-pdr.md) — Environment variables, constraints

### Designer / UI Specialist
1. [Design Guidelines](./design-guidelines.md) — Complete design system
2. [Project Overview & PDR](./project-overview-pdr.md) — Brand, target users
3. [System Architecture](./system-architecture.md) — UI flow diagrams

---

## Key Files & Locations

### Source Code Structure
```
src/
├── types/dish-types.ts              # TypeScript definitions
├── data/dishes-data.ts              # 55 Vietnamese dishes
├── hooks/                           # Custom React hooks
│   ├── use-meal-history.ts
│   ├── use-preferences.ts
│   ├── use-geolocation.ts
│   ├── use-calendar.ts
│   └── use-ai-suggestion.ts
├── components/                      # React components
│   ├── filter-panel.tsx
│   ├── suggestion-display.tsx
│   ├── meal-history-section.tsx
│   └── menu-list-view.tsx
├── utils/deep-links.ts              # URL builders
├── App.tsx                          # Root component
├── main.tsx                         # Entry point
└── index.css                        # Global styles
```

### Configuration Files
```
package.json                # Dependencies, build scripts
tsconfig.json              # TypeScript config
vite.config.ts             # Vite build config
tailwind.config.ts         # Tailwind CSS config
.env.local                 # Local env vars (git-ignored)
.gitignore                 # Git ignore rules
```

---

## Essential Commands

### Development
```bash
npm install              # Install dependencies
npm run dev              # Start dev server (http://localhost:3000)
npm run lint             # TypeScript check
npm run build            # Production build
npm run preview          # Preview production build
```

### Deployment
```bash
npm run build            # Create dist/ folder
# Then push to Vercel/Netlify (auto-deploys)
```

---

## Technology Stack Summary

| Layer | Tech | Version |
|-------|------|---------|
| Framework | React | 19.0.0 |
| Build | Vite | 6.2.0 |
| Language | TypeScript | ~5.8.2 |
| Styling | Tailwind CSS | 4.1.14 |
| Animation | motion/react | 12.23.24 |
| AI | Google Gemini 2.0 Flash | via @google/genai |
| Icons | lucide-react | 0.546.0 |
| Storage | localStorage | Browser only |

---

## Environment Variables Required

```bash
GEMINI_API_KEY=<your-gemini-api-key>              # For AI suggestions
VITE_GOOGLE_CLIENT_ID=<your-google-oauth-id>     # For Google Calendar
```

See [Deployment Guide](./deployment-guide.md) for detailed setup.

---

## Common Questions

### How do I add a new feature?
1. Check [Project Roadmap](./project-roadmap.md) for Phase 3–4 planned features
2. Review [Code Standards](./code-standards.md) for patterns
3. Follow [System Architecture](./system-architecture.md) for data flow
4. Use [Codebase Summary](./codebase-summary.md) as reference

### How do I deploy?
See [Deployment Guide](./deployment-guide.md) — covers Vercel, Netlify, and manual hosting.

### What's the design system?
See [Design Guidelines](./design-guidelines.md) — colors, typography, components, animations.

### How does the filter pipeline work?
See [System Architecture](./system-architecture.md) → "Filter Pipeline (Detailed)" section.

### What are the API integrations?
See [System Architecture](./system-architecture.md) → "External API Integrations" section.

### How do I test the app locally?
```bash
npm install
npm run dev
# Open http://localhost:3000
```

---

## Documentation Statistics

| File | Lines | Purpose |
|------|-------|---------|
| project-overview-pdr.md | 250 | Vision, features, PRD |
| system-architecture.md | 810 | Design, APIs, data flow |
| codebase-summary.md | 345 | File breakdown, organization |
| code-standards.md | 638 | Development rules, patterns |
| design-guidelines.md | 781 | Design system, branding |
| deployment-guide.md | 810 | Setup, build, deploy |
| project-roadmap.md | 578 | Phases, planning, timelines |
| **Total** | **4,212** | **Comprehensive project docs** |

---

## Maintenance

### Update Schedule
- **Monthly:** Review and update based on code changes
- **Per Release:** Update roadmap progress, add changelog entries
- **Quarterly:** Review completeness, fix outdated information

### How to Update Docs
1. Make code change
2. Update corresponding doc file
3. Verify links and cross-references
4. Commit with message: `docs: update {filename} for {feature}`

### Adding New Docs
If docs exceed 800 LOC, split into subdirectory:
```
docs/
├── advanced-features/
│   ├── index.md
│   ├── group-voting.md
│   └── onboarding-flow.md
```

---

## Contact & Support

### For Documentation Issues
- Found outdated information? Create a GitHub issue
- Want to improve docs? Submit a pull request
- Questions? Check the relevant document first, then ask in Discussions

### For Project Questions
- Features & priorities: See [Project Roadmap](./project-roadmap.md)
- Technical implementation: See [System Architecture](./system-architecture.md)
- Development rules: See [Code Standards](./code-standards.md)

---

## Related Links

- **GitHub Repository:** [Link to repo]
- **Live App:** https://hom-nay-an-gi.vercel.app
- **AI Studio:** https://ai.studio/apps/13d4d1bf-b6ec-4977-895d-9e4824e2b02b

---

**Last Updated:** April 25, 2025  
**Documentation Version:** 1.0  
**Project Status:** Phase 2 Complete, Phase 3 Planned
