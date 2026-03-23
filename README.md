# NorthStar CN

Portfolio rebuild of an enterprise analytics dashboard designed over 15 years. Built with the **Card Model** architecture — everything is a Page made of Cards.

**Live:** [garygisclair.github.io/northstar-cn](https://garygisclair.github.io/northstar-cn/)

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4 + shadcn/ui (blocks + components)
- Lucide React (icons)
- React Router (hash-based for GitHub Pages)
- Geist font (shadcn default)

## Architecture

**Card Model:** Everything is a Page. Pages contain Cards. Cards are the atomic unit (KPI, chart, table, text). No separate Workbench vs Catalog — one content model with tags (`home`, `curated`, `certified`, `mine`).

**Layout:** Obsidian-inspired IDE with utility bar, tree sidebar, and independent right panel.

```
┌──────────────────────────────────────────────────────────┐
│  Utility Bar (sidebar icons | breadcrumb | Ask NorthStar)│
├─────────────┬──────────────────────────────┬─────────────┤
│  Sidebar     │  Page Header                 │             │
│  (tree nav,  ├──────────────────────────────┤  Right      │
│   collapsible│                              │  Panel      │
│   to icon    │  KPI Grid / Card Canvas      │  (Ask AI)   │
│   rail)      │                              │  360px      │
│              │                              │  on-demand  │
│              ├──────────────────────────────┤             │
│              │  Status Bar (Data as of →SLA) │             │
└─────────────┴──────────────────────────────┴─────────────┘
```

## Features

- **KPI Home Page** — customizable grid of 20 metric cards with interactive mini bar charts, live clock, add/remove metrics modal
- **SLA Modal** — dataset freshness status with per-load SLA table, opened from status bar
- **Ask NorthStar** — AI assistant right panel (gradient button in utility bar)
- **Page system** — curated, certified, and user pages with tabs, filters, and card canvas
- **Saved pages** — bookmark toggle, saved sidebar view
- **Responsive** — sidebar floats at ≤1024px, 4-column KPI grid at ≥1920px
- **Dark mode** — default, toggle in sidebar footer

## Routes

```
/                    → Home page (customizable KPI cards)
/p/:pageId           → Any page
/p/:pageId/:tabId    → Specific tab within a page
/new-tab             → New tab empty state
/alerts              → Alerts page
/alerts/:subPage     → Announcements, Articles
```

## Getting Started

```bash
npm install
npm run dev          # Dev server at localhost:5173/northstar-cn/
npm run build        # Production build
npx tsc -b           # TypeScript check
```

## Deployment

Deploys automatically to GitHub Pages via GitHub Actions on push to `master`.

## Relationship to NorthStar

This is a fresh rebuild of [`northstar`](https://github.com/garygisclair/northstar) using the Card Model architecture. The KPI home page, SLA modal, and metric data are ported from the original. The original repo is preserved untouched.
