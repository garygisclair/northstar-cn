# Status — 2026-03-23

## Current State

- **Live site**: https://garygisclair.github.io/northstar-cn/
- **Deploys**: GitHub Actions on push to `master`
- **Dev server**: `npm run dev` → `localhost:5173/northstar-cn/`

### What's Built
- Obsidian-inspired IDE layout: utility bar, tree sidebar, breadcrumb navigation
- KPI Home Page ported from original NorthStar (20 KPIs, customize/save mode, add metric modal, live clock)
- Interactive MiniBarChart on each KPI card (hover tooltips, trend-colored last bar)
- SLA Modal with 5 datasets, status table, notes (opened from status bar "Data as of" link)
- Ask NorthStar gradient button in utility bar → right panel toggle
- Page system with tabs, filters, card canvas, bookmark toggle
- Saved sidebar view (toggled from utility bar)
- Alerts dropdown with sub-routes (Alerts, Announcements, Articles)
- Dark mode default with toggle, fullscreen toggle
- Responsive: sidebar floats at ≤1024px, 4-column KPI grid at ≥1920px
- 13 seed pages (3 with card definitions, 10 stubs)

### What's Next
1. Copy mockMetricData.ts from original NorthStar — seeded PRNG data engine
2. Build BarChartCard — Recharts horizontal bar
3. Build DataTableCard — tabular data grid
4. Wire real data to Buyer Insights Summary tab cards
5. Arrow navigation (cycle through page categories)
6. Search functionality (utility bar)
7. New Page creation flow
8. Wire Ask NorthStar right panel as page/search recommender
9. Clean up unused files (BrowseView.tsx, nav-user.tsx, nav-projects.tsx)

### Key Files
- `CLAUDE.md` — project instructions for Claude
- `ARCHITECTURE.md` — Card Model design and data structures
- `src/types.ts` — TypeScript interfaces (Card, Page, PageTab)
- `src/data/pages.ts` — seed page data (used by PageView)
- `src/routes/HomePage.tsx` — KPI home page with ALL_KPIS data
- `src/components/SlaModal.tsx` — SLA status modal
- `src/components/layout/AppShell.tsx` — utility bar, sidebar provider, right panel
- `src/components/layout/StatusBar.tsx` — clickable "Data as of" → SLA modal
