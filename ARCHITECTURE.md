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

## Layout (Obsidian-inspired IDE)

1. **Utility Bar** (top, full-width) — sidebar toggle, home, search, saved | breadcrumb | Ask NorthStar (gradient), alerts dropdown, fullscreen
2. **Left Sidebar** — tree navigation (Pages: Curated/Certified/My Pages), collapsible to icon rail
3. **Saved Sidebar** — alternate view toggled from utility bar bookmark icon
4. **Main Content** — HomePage (KPI grid) or PageView (tabs, filters, card canvas) + StatusBar
5. **Right Panel** — independent 360px panel for Ask NorthStar AI chat, card config, SLA details
6. **Status Bar** — clickable "Data as of" timestamp opens SLA modal with dataset status

## Seed Pages

| Page | Tags | Tabs | Status |
|---|---|---|---|
| My KPIs | `home` | — | 20 KPIs (9 default), customize mode, add metric modal |
| Buyer Insights | `curated` | 5 | Summary has card definitions, others placeholder |
| KPI Overview | `curated` | 3 | Placeholder |
| Voice of Customer | `curated` | 1 | Placeholder |
| + 9 stubs | `curated` | 1 each | Title + category only |

## Carry-Over from Original NorthStar

| Component | Source | Status |
|---|---|---|
| KPI Home Page | `northstar/src/pages/HomePage.tsx` | Ported (20 KPIs, mini bar charts, customize mode) |
| SLA Modal | `northstar/src/components/Reports/SlaModal.tsx` | Ported (shadcn Dialog) |
| mockMetricData.ts (seeded PRNG) | `northstar/src/data/mockMetricData.ts` | Not yet copied |
| BuyerInsights mock data | `northstar/src/components/Reports/BuyerInsights/mockData.ts` | Not yet copied |
| Few/Tufte visualization rules | Design decisions carry over | Applied to card design |

## References

- **Live site**: https://garygisclair.github.io/northstar-cn/
- **Strategic "why"**: `C:\Users\gary\Downloads\Projects\NorthStar\2026-03-22 - Architecture Rethink.md`
- **Original NorthStar**: `C:\Users\gary\Documents\GitHub\northstar\`
- **shadcn blocks**: https://ui.shadcn.com/blocks — always check here before building custom components
