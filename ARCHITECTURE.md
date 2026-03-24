# Architecture — Card Model

## Core Concept

Everything is a **Page**. A Page is a canvas of **Cards**.

```
Datasets → Card (configured inline) → Page (canvas of cards) → Tags (dynamic sections)
```

## Data Model

```typescript
interface Card {
  id: string;
  type: 'kpi' | 'bar-chart' | 'data-table';
  title: string;
  datasetId?: string;
  query?: CardQuery;
  config: Record<string, unknown>;
  layout: { col, row, colSpan, rowSpan };
}

interface PageTab {
  id: string;
  label: string;
  filters?: TabFilter[];
  cards: Card[];
}

interface Page {
  id: string;
  title: string;
  subtitle?: string;
  category?: string;
  tags: string[];  // dynamic — defaults: 'home', 'curated', 'certified', 'mine'
  tabs: PageTab[];
  dataAsOf?: string;
  dateCreated: string;
  dateModified: string;
}
```

## State Management

All page state is **in-memory** (React context). Browser refresh resets to seed data.

| Store | Location | Persistence | Purpose |
|---|---|---|---|
| **PagesProvider** | `src/stores/pages.tsx` | None (in-memory) | Mutable page list, dynamic sections, group/ungroup |
| **FavoritesProvider** | `src/stores/favorites.tsx` | localStorage | Saved/bookmarked page IDs |
| **SlideshowProvider** | `src/components/slideshow/SlideshowContext.tsx` | None | Slideshow playback state |

### PagesProvider Actions
- `createPage(title, category, sectionId)` → new empty page
- `groupPages(name, pageIds)` → merge single-tab pages into one grouped page
- `ungroupPage(pageId)` → split grouped page back into singles
- `createSection(label)` → new sidebar section
- `removeSection(sectionId)` → remove section, move pages to My Pages

## Why This Model

The original NorthStar was a **portal** (consume curated reports) with a separate **workbench** (build visualizations). These are two different UX paradigms crammed into one app.

Modern tools (Notion, Figma, Grafana, Hex) use **one content model, multiple views**. The Card Model collapses:

| Old NorthStar | Card Model |
|---|---|
| Home KPI Dashboard | Page tagged `home` with KPI cards |
| Buyer Insights Report (5 tabs) | Page tagged `curated` with 5 tabs of cards |
| My Collections | Pages tagged `mine` |
| Certified Collections | Pages tagged `certified` |
| Workbench / Visualize | "+ Add Card" on any page (future) |
| Custom Collections | Pages in user-created sections |

## Layout (Obsidian-inspired IDE)

1. **Utility Bar** (top, full-width) — sidebar toggle, home, search, saved | breadcrumb | Ask NorthStar (gradient), alerts dropdown, fullscreen
2. **Left Sidebar** — tree navigation with dynamic sections, expandable multi-tab pages, New Page / Group Pages / New Section actions
3. **Saved Sidebar** — alternate view toggled from utility bar bookmark icon, expandable multi-tab pages
4. **Main Content** — HomePage (KPI grid + filters) or PageView (tabs, filters, card canvas) + StatusBar
5. **Right Panel** — independent panel for Ask NorthStar AI chat (360px), KPI filters (240px), VoC filters (240px), Buyer Insights filters (240px, tab-aware)
6. **Status Bar** — clickable "Data as of" timestamp opens SLA modal with dataset status
7. **Slideshow FAB** — bottom-right (saved sidebar only), cycles saved pages/tabs on timer

## Seed Pages

| Page | Tags | Tabs | Status |
|---|---|---|---|
| My KPIs | `home` | 1 | 20 KPIs, customize mode, add metric modal, filters panel |
| Buyer Insights | `curated` | 5 | All tabs fully built (Summary, Key Metrics, Segmentation, Active Buyers, Churned) |
| KPI Overview | `curated` | 3 | All tabs stubbed |
| Voice of Customer | `curated` | 1 | Full VoC report (sentiment KPIs + verbatim feed + filters) |
| + 9 stubs | `certified` | 1 each | Title + category only |

## Carry-Over from Original NorthStar

| Component | Source | Status |
|---|---|---|
| KPI Home Page | `northstar/src/pages/HomePage.tsx` | Ported (20 KPIs, mini bar charts, customize mode) |
| Buyer Insights (5 tabs) | `northstar/src/components/Reports/BuyerInsights/` | Ported (all tabs, mock data, line charts, slopegraph) |
| Voice of Customer | `northstar/src/components/Reports/VoiceOfCustomer/` | Ported (sentiment KPIs, verbatim feed, filters) |
| SLA Modal | `northstar/src/components/Reports/SlaModal.tsx` | Ported (shadcn Dialog) |
| Slideshow | `northstar/src/components/Slideshow/` | Ported (FAB, progress bar, settings, help modal) |
| Ask NorthStar Demo | Custom | 2 demos: KPI focus categories (one-shot) + Buyer Insights Summary (repeatable, fade-in) |
| Few/Tufte visualization rules | Design decisions carry over | Applied to LineChart (range-frame axes, split coloring, direct labels) |

## References

- **Live site**: https://garygisclair.github.io/northstar-cn/
- **Strategic "why"**: `C:\Users\gary\Downloads\Projects\NorthStar\2026-03-22 - Architecture Rethink.md`
- **Original NorthStar**: `C:\Users\gary\Documents\GitHub\northstar\`
- **shadcn blocks**: https://ui.shadcn.com/blocks — always check here before building custom components
