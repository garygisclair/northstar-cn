/** Card query — what data a card needs */
export interface CardQuery {
  metric: string;
  dimensions?: string[];
  granularity?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  timeframe?: 'T12M' | 'T6M' | 'T3M';
}

/** Card — the atomic unit of content */
export interface Card {
  id: string;
  type: 'kpi' | 'bar-chart' | 'data-table';
  title: string;
  datasetId?: string;
  query?: CardQuery;
  config: Record<string, unknown>;
  layout: {
    col: number;
    row: number;
    colSpan: number;
    rowSpan: number;
  };
}

/** Filter definition for a tab */
export interface TabFilter {
  id: string;
  label: string;
  options: string[];
  defaultValue: string;
}

/** Page Tab — a view within a page containing cards */
export interface PageTab {
  id: string;
  label: string;
  filters?: TabFilter[];
  cards: Card[];
}

/** Page — the only content model */
export interface Page {
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

/** Navigation state */
export type NavItem = 'home' | 'browse' | 'alerts' | 'search';

/** Right panel content type */
export type RightPanelContent = 'ask' | 'card-config' | 'sla-details' | null;
