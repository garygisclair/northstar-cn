# Status — 2026-03-23

## Current State

- **Live site**: https://garygisclair.github.io/northstar-cn/
- **Deploys**: GitHub Actions on push to `master`
- **Dev server**: `npm run dev` → `localhost:5173/northstar-cn/`

### What's Built
- Obsidian-inspired IDE layout: utility bar, tree sidebar, breadcrumb navigation
- KPI Home Page ported from original NorthStar (20 KPIs, customize/save mode, add metric modal, live clock)
- Interactive MiniBarChart on each KPI card (hover tooltips, trend-colored last bar)
- KPI filters panel (240px right panel): timeframe, platform, region with live value updates
- Ask NorthStar demo: scripted chat adds 3 focus category KPI cards with staggered fade-in
- Voice of Customer report: sentiment KPI strip, verbatim card grid, VoC filters panel
- Slideshow: FAB play/pause (saved sidebar only), progress bar, settings modal, help modal
- SLA Modal with 5 datasets, status table, notes (opened from status bar)
- Mutable pages store (React context, in-memory — resets on refresh)
- Page management: create new pages, group/ungroup pages, dynamic sidebar sections
- Expandable multi-tab pages in both sidebars with child tab navigation
- Default saved pages: Buyer Insights, KPI Overview, Voice of Customer
- Custom scrollbar styling for light and dark mode
- 13 seed pages (3 curated with content, 9 certified stubs, 1 home)
- Dark mode default with toggle, fullscreen toggle
- Responsive: sidebar floats at ≤1024px, 4-column KPI grid at ≥1920px

### What's Next
1. Card type picker — "Add Card" opens type selector with preset templates
2. Copy mockMetricData.ts from original NorthStar — seeded PRNG data engine
3. Build BarChartCard — Recharts horizontal bar
4. Build DataTableCard — tabular data grid
5. Arrow navigation (cycle through page categories)
6. Search functionality (utility bar)
7. Wire Ask NorthStar right panel as page/search recommender
8. Clean up unused files (BrowseView.tsx, nav-user.tsx, nav-projects.tsx)

### Key Files
- `CLAUDE.md` — project instructions for Claude
- `ARCHITECTURE.md` — Card Model design, state management, and data structures
- `src/types.ts` — TypeScript interfaces (Card, Page, PageTab)
- `src/stores/pages.tsx` — mutable pages store (createPage, groupPages, ungroupPage, sections)
- `src/stores/favorites.tsx` — saved pages store (localStorage)
- `src/data/pages.ts` — seed page data
- `src/routes/HomePage.tsx` — KPI home page with ALL_KPIS data
- `src/routes/PageView.tsx` — generic page view (tabs, filters, card canvas, ungroup)
- `src/components/layout/AppShell.tsx` — utility bar, sidebar provider, right panel, slideshow wiring
- `src/components/layout/RightPanel.tsx` — right panel with Ask/Filters/VoC panel types
- `src/components/reports/VoiceOfCustomer/` — VoC report (VerbatimFeedTab + mockData)
- `src/components/slideshow/` — SlideshowContext, SlideshowFab, SlideshowProgressBar
- `src/components/panels/` — AskPanel, FiltersPanel, VocFiltersPanel
- `src/components/GroupPagesModal.tsx` — group pages flow
- `src/components/NewPageModal.tsx` — new page creation flow
