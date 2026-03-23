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
- **Tags** = how pages are organized: `home`, `curated`, `certified`, `mine`
- No separate Workbench/Catalog/Reports — one content model
- Types defined in `src/types.ts`

### Layout (3 zones)
1. **Left Sidebar** — shadcn sidebar-07 with `collapsible="icon"`
   - TeamSwitcher (NorthStar branding) in header
   - NavMain (Home → favorites, Browse → all pages, Alerts) with collapsible accordion
   - Ask NorthStar + theme toggle + NavUser in footer
2. **Main Content** — header (SidebarTrigger + breadcrumbs) + PageCanvas + StatusBar
3. **Right Panel** — independent, toggled by "Ask NorthStar" (AI chat, card config, SLA details)

### Design Tokens
- Monochrome palette (0 chroma oklch throughout) — intentionally grayscale
- Follows Few/Tufte visualization principles (zero baselines, sorted bars, direct labels)
- Dark mode via `.dark` class + localStorage

### Routing
- Hash-based (`createHashRouter`) for GitHub Pages compatibility
- Base path: `/northstar-cn/`
- 4 routes: `/`, `/p/:pageId`, `/p/:pageId/:tabId`, `/browse`

## Data Sources (carry from original NorthStar)
- `src/data/pages.ts` — seed pages with Card arrays (replaces curatedReports + reportDefs)
- `src/data/mockMetricData.ts` — seeded PRNG mock data generator (NOT YET COPIED)
- Original NorthStar: `C:\Users\gary\Documents\GitHub\northstar\`

## What's Built (as of 2026-03-23)
- [x] Scaffold: React 19 + Vite + Tailwind v4 + shadcn/ui
- [x] Layout shell: sidebar-07 + right panel + status bar
- [x] Page + Card data model + types
- [x] 13 seed pages (3 with card definitions, 10 stubs)
- [x] KpiCard component with deterministic mock data
- [x] PageView route (tabs, filters, card canvas)
- [x] BrowseView route (table with search, category filter, favorites)
- [x] Dark mode toggle + persistence
- [x] Breadcrumb navigation from route
- [x] Ask NorthStar right panel shell (AI chat UI)

## What's Next
- [ ] Copy mockMetricData.ts from original NorthStar
- [ ] Build BarChartCard (Recharts horizontal bar)
- [ ] Build DataTableCard (tabular data grid)
- [ ] Wire real data to Buyer Insights Summary tab cards
- [ ] Favorites persistence
- [ ] Responsive testing (mobile/tablet/desktop)
- [ ] Deploy to GitHub Pages

## Commands
```bash
npm run dev          # Start dev server
npm run build        # Production build
npx tsc -b           # TypeScript check
```
