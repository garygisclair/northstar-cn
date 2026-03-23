# NorthStar CN — Project Instructions

## What This Is

Portfolio rebuild of an enterprise analytics dashboard Gary designed over 15 years. Rebranded as NorthStar. Fresh repo using the **Card Model** architecture — everything is a Page made of Cards.

## Key Decisions

### shadcn/ui First
- **Always use shadcn blocks/components** — don't build custom layout components
- Blocks index: https://ui.shadcn.com/blocks
- Install: `npx shadcn@latest add <block-name> --overwrite`
- Currently using: **sidebar-07** (collapsible-to-icon sidebar)
- Customize DATA (nav items, user info, page content) not STYLING
- Keep Geist font (shadcn default) — don't override to Inter

### Card Model Architecture
- **Page** = a named canvas of Cards, optionally with tabs
- **Card** = atomic unit: KPI, chart, table, text — connected to a dataset + query
- **Tags** = how pages are organized: `curated`, `certified`, `mine`
- No separate Workbench/Catalog/Reports — one content model
- Types defined in `src/types.ts`

### Layout (Obsidian-inspired IDE)
1. **Utility Bar** (top, full-width) — sidebar toggle, page icon (home), search, saved toggle | ← → arrows + breadcrumb | alerts dropdown, fullscreen toggle
2. **Left Sidebar** — tree navigation with right-aligned chevrons
   - NorthStar branding in header (links to home)
   - Home (flat link)
   - Pages (collapsible: Curated / Certified / My Pages + New Page)
   - Footer: dark mode toggle + settings + logout (collapsed: settings only)
3. **Saved Sidebar** — alternate sidebar view toggled from utility bar bookmark icon, shows saved/bookmarked pages
4. **Main Content** — PageView (header, tabs, filters, card canvas) + StatusBar
5. **Right Panel** — independent, toggled by "Ask NorthStar" (AI chat, card config, SLA details)

### Responsive
- Minimum target: iPad Mini 1024×768
- Sidebar floats as overlay at ≤1024px (`use-mobile.ts` breakpoint: 1025)
- Sidebar desktop visibility uses `lg:` (≥1024px) in `sidebar.tsx`
- No mobile (<768px) support needed — this is an IDE, not a mobile app

### Design Tokens
- Monochrome palette (0 chroma oklch throughout) — intentionally grayscale
- Follows Few/Tufte visualization principles (zero baselines, sorted bars, direct labels)
- Dark mode via `.dark` class + localStorage

### Routing
- Hash-based (`createHashRouter`) for GitHub Pages compatibility
- Base path: `/northstar-cn/`
- Routes: `/`, `/p/:pageId`, `/p/:pageId/:tabId`, `/new-tab`, `/alerts`, `/alerts/:subPage`

## Data Sources (carry from original NorthStar)
- `src/data/pages.ts` — seed pages with Card arrays (replaces curatedReports + reportDefs)
- `src/data/mockMetricData.ts` — seeded PRNG mock data generator (NOT YET COPIED)
- Original NorthStar: `C:\Users\gary\Documents\GitHub\northstar\`

## What's Built (as of 2026-03-23)
- [x] Scaffold: React 19 + Vite + Tailwind v4 + shadcn/ui
- [x] Utility bar: sidebar toggle, home, search, saved, arrows, breadcrumb, alerts dropdown, fullscreen
- [x] Tree sidebar: Pages (Curated/Certified/My Pages), right-aligned chevrons, icon-mode expand
- [x] Saved sidebar view (toggled from utility bar)
- [x] Alerts dropdown with sub-routes (Alerts, Announcements, Articles)
- [x] Page + Card data model + types
- [x] 13 seed pages (3 with card definitions, 10 stubs)
- [x] KpiCard component with deterministic mock data
- [x] PageView route (tabs, filters, card canvas, bookmark toggle)
- [x] New tab empty state
- [x] Favorites store (localStorage persistence)
- [x] Dark mode toggle + persistence
- [x] Fullscreen toggle
- [x] Compass favicon
- [x] Responsive: sidebar floats at ≤1024px
- [x] Sidebar footer: name + dark mode/settings/logout icons

## What's Next
- [ ] Copy mockMetricData.ts from original NorthStar
- [ ] Build BarChartCard (Recharts horizontal bar)
- [ ] Build DataTableCard (tabular data grid)
- [ ] Wire real data to Buyer Insights Summary tab cards
- [ ] Arrow navigation (cycle through page categories)
- [ ] Search functionality (utility bar)
- [ ] New Page creation flow
- [ ] Wire Ask NorthStar as page/search recommender
- [ ] Deploy to GitHub Pages
- [ ] Clean up unused files (BrowseView.tsx, nav-user.tsx, nav-projects.tsx, favorites.tsx if unneeded)

## Commands
```bash
npm run dev          # Start dev server
npm run build        # Production build
npx tsc -b           # TypeScript check
```
