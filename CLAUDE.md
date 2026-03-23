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
- **Tags** = string-based, how pages are organized (default: `curated`, `certified`, `mine` — admins can create custom sections)
- No separate Workbench/Catalog/Reports — one content model
- Types defined in `src/types.ts`

### Layout (Obsidian-inspired IDE)
1. **Utility Bar** (top, full-width) — sidebar toggle, page icon (home), search, saved toggle | ← → arrows + breadcrumb (text-xs) | Ask NorthStar (gradient button), alerts dropdown, fullscreen toggle
2. **Left Sidebar** — tree navigation with right-aligned chevrons
   - NorthStar branding in header (links to home)
   - Home (flat link)
   - Pages (collapsible: dynamic sections + New Page + Group Pages + New Section)
   - Multi-tab pages show chevron → expandable child tab links
   - Footer: dark mode toggle + settings + logout (collapsed: settings only)
3. **Saved Sidebar** — alternate sidebar view toggled from utility bar bookmark icon, shows saved/bookmarked pages with expandable multi-tab pages
4. **Main Content** — HomePage (KPI grid with customize/add metric/filters) or PageView (header, tabs, filters, card canvas) + StatusBar (clickable "Data as of" opens SLA modal)
5. **Right Panel** — independent, toggled by "Ask NorthStar" (AI chat), "Filters" (KPI or VoC filters), or card config/SLA details

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

## State Management
- `src/stores/pages.tsx` — **PagesProvider**: mutable page list + dynamic sections, in-memory (resets on refresh). Provides createPage, groupPages, ungroupPage, createSection, removeSection.
- `src/stores/favorites.tsx` — **FavoritesProvider**: saved/bookmarked page IDs in localStorage. Default seeds: buyers, perf-dashboard, cust-feedback.

## Data Sources
- `src/data/pages.ts` — seed pages (13 total: 3 curated with content, 9 certified stubs, 1 home). Loaded into PagesProvider on mount.
- `src/routes/HomePage.tsx` — contains ALL_KPIS (20 KPIs with hardcoded data, ported from original NorthStar) + DEMO_CATEGORY_KPIS (Sneakers, Handbags, Watches)
- `src/components/reports/VoiceOfCustomer/mockData.ts` — 27 verbatim feedback items with seeded random generation
- `src/data/mockMetricData.ts` — seeded PRNG mock data generator (NOT YET COPIED)
- Original NorthStar: `C:\Users\gary\Documents\GitHub\northstar\`

## What's Built (as of 2026-03-23)
- [x] Scaffold: React 19 + Vite + Tailwind v4 + shadcn/ui
- [x] Utility bar: sidebar toggle, home, search, saved, arrows, breadcrumb, Ask NorthStar (gradient), alerts dropdown, fullscreen
- [x] Tree sidebar: Pages (Curated/Certified/My Pages), right-aligned chevrons, icon-mode expand
- [x] Saved sidebar view (toggled from utility bar)
- [x] Alerts dropdown with sub-routes (Alerts, Announcements, Articles)
- [x] Page + Card data model + types
- [x] 13 seed pages (3 with card definitions, 10 stubs)
- [x] HomePage: ported from original NorthStar — 20 KPIs, customize/save mode, add metric modal, live clock
- [x] KpiCard with interactive MiniBarChart (hover tooltips, trend-colored last bar)
- [x] PageView route (tabs, filters, card canvas, bookmark toggle)
- [x] SLA modal (shadcn dialog) — dataset status table, opened from status bar "Data as of" link
- [x] StatusBar: clickable "Data as of" with SLA status indicator dot
- [x] New tab empty state
- [x] Favorites store (localStorage persistence)
- [x] Dark mode toggle + persistence
- [x] Fullscreen toggle
- [x] Compass favicon
- [x] Responsive: sidebar floats at ≤1024px
- [x] Sidebar footer: name + dark mode/settings/logout icons
- [x] Ask NorthStar demo: scripted chat flow adds 3 focus category KPI cards (Sneakers, Handbags, Watches) with staggered fade-in animation
- [x] KPI filters panel (240px right panel): Daily/Weekly/Monthly/Quarterly timeframe, platform, region — live value + date prefix updates
- [x] Slideshow: FAB (bottom-right, saved sidebar only), progress bar, settings modal, help modal — cycles saved pages/tabs on timer, ESC to stop
- [x] Voice of Customer: ported from original NorthStar — sentiment KPI strip, verbatim card grid, VoC filters panel (region, survey group, score)
- [x] Default saved pages: Buyer Insights, KPI Overview, Voice of Customer (seeded when localStorage empty)
- [x] Custom scrollbar styling (light + dark mode, 6px thin)
- [x] Mutable pages store (`src/stores/pages.tsx`): React context, in-memory state, resets on refresh
- [x] Expandable multi-tab pages in both sidebars: chevron → child tab links with direct `/p/:pageId/:tabId` navigation
- [x] Group Pages: modal (single-tab pages only), 2-step flow (select → name), merges into grouped page
- [x] Ungroup: button in PageView header for multi-tab pages, splits back into singles
- [x] New Page: modal with title, category (shadcn Select), section pills (My Pages only, Curated/Certified disabled for non-admins)
- [x] Empty page canvas shows dashed "Add Card" placeholder tile
- [x] Dynamic sections: create/remove custom sidebar sections at runtime, removing moves pages to My Pages
- [x] Close button always navigates to home
- [x] Buyer Insights Summary tab stubbed (cards removed)

## What's Next
- [ ] Card type picker: "Add Card" opens type selector (KPI, Bar Chart, Data Table, Verbatim Feed) with preset templates
- [ ] Copy mockMetricData.ts from original NorthStar
- [ ] Build BarChartCard (Recharts horizontal bar)
- [ ] Build DataTableCard (tabular data grid)
- [ ] Arrow navigation (cycle through page categories)
- [ ] Search functionality (utility bar)
- [ ] Wire Ask NorthStar right panel as page/search recommender
- [ ] Deploy to GitHub Pages
- [ ] Clean up unused files (BrowseView.tsx, nav-user.tsx, nav-projects.tsx, favorites.tsx if unneeded)

## Commands
```bash
npm run dev          # Start dev server
npm run build        # Production build
npx tsc -b           # TypeScript check
```
