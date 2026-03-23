# Architecture — Card Model

## Core Concept

Everything is a **Page**. A Page is a canvas of **Cards**.

```
Datasets → Card (configured inline) → Page (canvas of cards) → Tags (home/curated/certified/mine)
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
  tags: ('home' | 'curated' | 'certified' | 'mine')[];
  tabs: PageTab[];
  dataAsOf?: string;
  dateCreated: string;
  dateModified: string;
}
```

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

## Layout

Uses shadcn sidebar-07 block as the foundation:

- **Left Sidebar**: shadcn `collapsible="icon"` — TeamSwitcher, NavMain (accordion), NavUser
- **Main Content**: Header (SidebarTrigger + breadcrumbs) + PageCanvas + StatusBar
- **Right Panel**: Independent toggle for AI chat, card config, SLA details

## Seed Pages

| Page | Tags | Tabs | Status |
|---|---|---|---|
| My KPIs | `home` | 1 | 9 KPI cards rendering |
| Buyer Insights | `curated` | 5 | Summary has cards, others placeholder |
| KPI Overview | `curated` | 3 | Placeholder |
| Voice of Customer | `curated` | 1 | Placeholder |
| + 9 stubs | `curated` | 1 each | Title + category only |

## Carry-Over from Original NorthStar

| Component | Source | Status |
|---|---|---|
| mockMetricData.ts (seeded PRNG) | `northstar/src/data/mockMetricData.ts` | Not yet copied |
| BuyerInsights mock data | `northstar/src/components/Reports/BuyerInsights/mockData.ts` | Not yet copied |
| SlaModal | `northstar/src/components/Reports/SlaModal.tsx` | Not yet copied |
| Few/Tufte visualization rules | Design decisions carry over | Applied to card design |

## References

- **Strategic "why"**: `C:\Users\gary\Downloads\Projects\NorthStar\2026-03-22 - Architecture Rethink.md` — portal vs workbench tension, Card Model proposal, Grafana/Notion/Hex comparisons, case study options
- **Original NorthStar**: `C:\Users\gary\Documents\GitHub\northstar\` — the portal-model codebase (preserved, not modified)
- **Original sitemap**: `C:\Users\gary\Documents\GitHub\northstar\SITEMAP.md` — feature map of the old app
- **shadcn blocks**: https://ui.shadcn.com/blocks — always check here before building custom components
