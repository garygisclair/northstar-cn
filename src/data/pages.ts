import type { Page } from '@/types';

export const PAGES: Page[] = [
  // Home — KPI dashboard
  {
    id: 'home',
    title: 'My KPIs',
    subtitle: 'Key performance indicators at a glance',
    tags: ['home'],
    tabs: [
      {
        id: 'default',
        label: 'Overview',
        cards: [
          { id: 'kpi-1', type: 'kpi', title: 'GMB', config: { format: 'currency', prefix: '$' }, layout: { col: 1, row: 1, colSpan: 1, rowSpan: 1 } },
          { id: 'kpi-2', type: 'kpi', title: 'Active Buyers', config: { format: 'number' }, layout: { col: 2, row: 1, colSpan: 1, rowSpan: 1 } },
          { id: 'kpi-3', type: 'kpi', title: 'Conversion Rate', config: { format: 'percent' }, layout: { col: 3, row: 1, colSpan: 1, rowSpan: 1 } },
          { id: 'kpi-4', type: 'kpi', title: 'Revenue', config: { format: 'currency', prefix: '$' }, layout: { col: 1, row: 2, colSpan: 1, rowSpan: 1 } },
          { id: 'kpi-5', type: 'kpi', title: 'Gross Margin', config: { format: 'percent' }, layout: { col: 2, row: 2, colSpan: 1, rowSpan: 1 } },
          { id: 'kpi-6', type: 'kpi', title: 'NPS', config: { format: 'number' }, layout: { col: 3, row: 2, colSpan: 1, rowSpan: 1 } },
          { id: 'kpi-7', type: 'kpi', title: 'Churn Rate', config: { format: 'percent' }, layout: { col: 1, row: 3, colSpan: 1, rowSpan: 1 } },
          { id: 'kpi-8', type: 'kpi', title: 'CAC', config: { format: 'currency', prefix: '$' }, layout: { col: 2, row: 3, colSpan: 1, rowSpan: 1 } },
          { id: 'kpi-9', type: 'kpi', title: 'LTV', config: { format: 'currency', prefix: '$' }, layout: { col: 3, row: 3, colSpan: 1, rowSpan: 1 } },
        ],
      },
    ],
    dataAsOf: '2026-03-22T14:00:00Z',
    dateCreated: '2026-01-15',
    dateModified: '2026-03-22',
  },

  // Curated — Buyer Insights (fully built)
  {
    id: 'buyers',
    title: 'Buyer Insights',
    subtitle: 'Marketplace buyer trends and segmentation',
    category: 'Buyers',
    tags: ['curated'],
    tabs: [
      {
        id: 'summary',
        label: 'Summary',
        filters: [
          { id: 'timeframe', label: 'Timeframe', options: ['T12M', 'T6M', 'T3M'], defaultValue: 'T12M' },
          { id: 'format', label: 'Format', options: ['YoY', 'Actual'], defaultValue: 'YoY' },
        ],
        cards: [
          { id: 'bi-kpi-1', type: 'kpi', title: 'Total Marketplace', config: { format: 'currency', prefix: '$' }, layout: { col: 1, row: 1, colSpan: 1, rowSpan: 1 } },
          { id: 'bi-kpi-2', type: 'kpi', title: 'On-Platform Share', config: { format: 'percent' }, layout: { col: 2, row: 1, colSpan: 1, rowSpan: 1 } },
          { id: 'bi-kpi-3', type: 'kpi', title: 'Fastest Grower', config: { format: 'text', value: 'Germany' }, layout: { col: 3, row: 1, colSpan: 1, rowSpan: 1 } },
          { id: 'bi-kpi-4', type: 'kpi', title: 'Active Regions', config: { format: 'number' }, layout: { col: 4, row: 1, colSpan: 1, rowSpan: 1 } },
          { id: 'bi-table', type: 'data-table', title: 'Buyers by Region', config: {}, layout: { col: 1, row: 2, colSpan: 3, rowSpan: 2 } },
          { id: 'bi-chart', type: 'bar-chart', title: 'Distribution', config: { orientation: 'horizontal', sorted: true }, layout: { col: 4, row: 2, colSpan: 1, rowSpan: 2 } },
        ],
      },
      { id: 'key-metrics', label: 'Key Metrics', cards: [] },
      { id: 'segmentation', label: 'Segmentation', cards: [] },
      { id: 'active-buyers', label: 'Active Buyers', cards: [] },
      { id: 'churned', label: 'Churned', cards: [] },
    ],
    dataAsOf: '2026-03-22T14:00:00Z',
    dateCreated: '2025-06-01',
    dateModified: '2026-03-22',
  },

  // Curated — KPI Overview
  {
    id: 'perf-dashboard',
    title: 'KPI Overview',
    subtitle: 'Business performance across key metrics',
    category: 'Business Performance',
    tags: ['curated'],
    tabs: [
      { id: 'regional', label: 'Regional Performance', cards: [] },
      { id: 'engagement', label: 'Engagement Funnel', cards: [] },
      { id: 'sell-funnel', label: 'Sell Funnel', cards: [] },
    ],
    dataAsOf: '2026-03-22T12:00:00Z',
    dateCreated: '2025-08-15',
    dateModified: '2026-03-20',
  },

  // Curated — Voice of Customer
  {
    id: 'cust-feedback',
    title: 'Voice of Customer',
    subtitle: 'Customer feedback and sentiment analysis',
    category: 'Customer Experience',
    tags: ['curated'],
    tabs: [
      { id: 'pulse', label: 'Customer Pulse', cards: [] },
    ],
    dataAsOf: '2026-03-22T10:00:00Z',
    dateCreated: '2025-09-01',
    dateModified: '2026-03-18',
  },

  // Certified stubs
  { id: 'biz-perf', title: 'Revenue Trends', category: 'Business Performance', tags: ['certified'], tabs: [{ id: 'default', label: 'Overview', cards: [] }], dateCreated: '2025-07-01', dateModified: '2026-03-15' },
  { id: 'sentiment', title: 'Brand Sentiment', category: 'Customer Experience', tags: ['certified'], tabs: [{ id: 'default', label: 'Overview', cards: [] }], dateCreated: '2025-10-01', dateModified: '2026-03-10' },
  { id: 'promoted', title: 'Ad Performance', category: 'Advertising', tags: ['certified'], tabs: [{ id: 'default', label: 'Overview', cards: [] }], dateCreated: '2025-11-01', dateModified: '2026-03-12' },
  { id: 'hourly', title: 'Real-Time Activity', category: 'Traffic & Engagement', tags: ['certified'], tabs: [{ id: 'default', label: 'Overview', cards: [] }], dateCreated: '2025-12-01', dateModified: '2026-03-08' },
  { id: 'funnel', title: 'Engagement Funnel', category: 'Traffic & Engagement', tags: ['certified'], tabs: [{ id: 'default', label: 'Overview', cards: [] }], dateCreated: '2026-01-01', dateModified: '2026-03-05' },
  { id: 'cbt-sales', title: 'Cross-Border Sales', category: 'Cross-Border Trade', tags: ['certified'], tabs: [{ id: 'default', label: 'Overview', cards: [] }], dateCreated: '2026-01-15', dateModified: '2026-03-01' },
  { id: 'gmv-device', title: 'Platform Mix', category: 'Traffic & Engagement', tags: ['certified'], tabs: [{ id: 'default', label: 'Overview', cards: [] }], dateCreated: '2026-02-01', dateModified: '2026-02-28' },
  { id: 'gmv-category', title: 'Category Breakdown', category: 'Business Performance', tags: ['certified'], tabs: [{ id: 'default', label: 'Overview', cards: [] }], dateCreated: '2026-02-15', dateModified: '2026-02-20' },
  { id: 'sell-funnel', title: 'Seller Pipeline', category: 'Sellers', tags: ['certified'], tabs: [{ id: 'default', label: 'Overview', cards: [] }], dateCreated: '2025-06-15', dateModified: '2026-02-15' },
];

export function getPage(id: string): Page | undefined {
  return PAGES.find(p => p.id === id);
}
