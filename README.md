# NorthStar CN

Portfolio rebuild of an enterprise analytics dashboard using the **Card Model** architecture. Everything is a **Page** made of **Cards** — one content model, infinite views.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4 + shadcn/ui (blocks + components)
- Recharts (visualizations)
- Lucide React (icons)
- React Router (hash-based for GitHub Pages)
- Geist font (shadcn default)

## Architecture

**Card Model:** Everything is a Page. Pages contain Cards. Cards are the atomic unit (KPI, chart, table, text). No separate Workbench vs Catalog — one content model with tags (`home`, `curated`, `certified`, `mine`).

**Layout:** shadcn sidebar-07 block + independent right panel + status bar.

```
┌─────────────┬──────────────────────────────┬────────────┐
│  Sidebar     │  Content Header (breadcrumbs) │            │
│  (shadcn     ├──────────────────────────────┤  Right     │
│   sidebar-07)│                              │  Panel     │
│              │  Page Canvas (cards)          │  (Ask AI)  │
│  Collapses   │                              │            │
│  to icon     │                              │  360px     │
│  rail        │                              │  on-demand │
│              ├──────────────────────────────┤            │
│              │  Status Bar                   │            │
└─────────────┴──────────────────────────────┴────────────┘
```

## Routes

```
/                    → Home page (KPI cards)
/p/:pageId           → Any page
/p/:pageId/:tabId    → Specific tab within a page
/browse              → Browse all pages (table view)
```

## Getting Started

```bash
npm install
npm run dev
```

## Relationship to NorthStar

This is a fresh rebuild of [`northstar`](https://github.com/garygisclair/quickstrike-for-funzies) using the Card Model architecture described in the [Architecture Rethink](../Downloads/Projects/NorthStar/2026-03-22%20-%20Architecture%20Rethink.md). The original repo is preserved untouched.
