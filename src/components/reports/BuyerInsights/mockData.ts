/**
 * Mock data for Buyer Insights Summary tab.
 * Uses deterministic seeded hash so filter changes produce different but stable values.
 */

// ─── Seeded random ────────────────────────────────────────────────────────────

function hashSeed(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function seeded(seed: number, key: string): number {
  const combined = hashSeed(`${seed}-${key}`);
  return (combined % 10000) / 10000;
}

function vary(base: number, pct: number, seed: number, key: string): number {
  const r = seeded(seed, key);
  return +(base * (1 + (r - 0.5) * 2 * pct)).toFixed(1);
}

function varyInt(base: number, pct: number, seed: number, key: string): number {
  return Math.round(vary(base, pct, seed, key));
}

function filterSeed(region: string, timeframe: string): number {
  return hashSeed(`${region}|${timeframe}`);
}

// ─── Month generators ─────────────────────────────────────────────────────────

const MONTH_SETS: Record<string, string[]> = {
  T12M: ["Apr '25", "May '25", "Jun '25", "Jul '25", "Aug '25", "Sep '25", "Oct '25", "Nov '25", "Dec '25", "Jan '26", "Feb '26", "Mar '26"],
  T6M:  ["Oct '25", "Nov '25", "Dec '25", "Jan '26", "Feb '26", "Mar '26", "Apr '26", "May '26", "Jun '26", "Jul '26", "Aug '26", "Sep '26"],
  T3M:  ["Jan '26", "Feb '26", "Mar '26", "Apr '26", "May '26", "Jun '26", "Jul '26", "Aug '26", "Sep '26", "Oct '26", "Nov '26", "Dec '26"],
};

function getMonths(timeframe: string): string[] {
  return MONTH_SETS[timeframe] ?? MONTH_SETS.T12M;
}

// ─── Trend builder ────────────────────────────────────────────────────────────

function buildTrend(start: number, end: number, seed: number, key: string): number[] {
  const pts: number[] = [];
  for (let i = 0; i < 12; i++) {
    const t = i / 11;
    const base = start + (end - start) * t;
    const noise = (seeded(seed, `${key}-${i}`) - 0.5) * Math.abs(end - start) * 0.15;
    pts.push(+(base + noise).toFixed(1));
  }
  return pts;
}

// ─── Summary Tab ──────────────────────────────────────────────────────────────

export interface RegionRow {
  label: string;
  level: number;
  yoy: (number | null)[];
  mom: (number | null)[];
  qoq: (number | null)[];
  actual: (number | null)[];
}

export interface SummaryData {
  months: string[];
  table: RegionRow[];
}

function summaryRow(label: string, level: number, yoyArr: number[], actualArr: number[]): RegionRow {
  const mom: (number | null)[] = actualArr.map((v, i) => {
    if (i === 0 || actualArr[i - 1] === 0) return null;
    return +((v - actualArr[i - 1]) / actualArr[i - 1] * 100).toFixed(1);
  });
  const qoq: (number | null)[] = actualArr.map((v, i) => {
    if (i < 3 || actualArr[i - 3] === 0) return null;
    return +((v - actualArr[i - 3]) / actualArr[i - 3] * 100).toFixed(1);
  });
  return { label, level, yoy: yoyArr, mom, qoq, actual: actualArr };
}

interface RegionDef {
  label: string;
  level: number;
  baseActual: number;
  baseYoy: number;
}

const REGION_DEFS: RegionDef[] = [
  { label: 'Marketplace',    level: 0, baseActual: 166900, baseYoy: -0.6 },
  { label: 'On-Platform',    level: 1, baseActual: 142300, baseYoy: -1.2 },
  { label: 'US',             level: 2, baseActual: 82100,  baseYoy: -1.8 },
  { label: 'UK',             level: 2, baseActual: 18400,  baseYoy: -2.6 },
  { label: 'Germany',        level: 2, baseActual: 12700,  baseYoy: 2.7 },
  { label: 'INTL Markets',   level: 1, baseActual: 16800,  baseYoy: -3.0 },
  { label: 'AUZ',            level: 2, baseActual: 4500,   baseYoy: -1.8 },
  { label: 'CEM',            level: 2, baseActual: 3400,   baseYoy: -3.7 },
  { label: 'EU Sited',       level: 2, baseActual: 4100,   baseYoy: -2.0 },
  { label: 'ROW',            level: 2, baseActual: 2700,   baseYoy: -4.1 },
  { label: 'CBT',            level: 2, baseActual: 2100,   baseYoy: -0.9 },
  { label: 'Off-Platform',   level: 1, baseActual: 24600,  baseYoy: 5.4 },
  { label: 'Qoo10',          level: 2, baseActual: 6400,   baseYoy: 4.3 },
];

export function getSummaryData(region: string, timeframe: string): SummaryData {
  const seed = filterSeed(region, timeframe);
  const months = getMonths(timeframe);

  const table: RegionRow[] = REGION_DEFS.map((def) => {
    const endActual = varyInt(def.baseActual, 0.08, seed, `sum-act-${def.label}`);
    const startActual = Math.round(endActual * (1 + Math.abs(def.baseYoy) / 100 * (def.baseYoy < 0 ? 1 : -1)));
    const actualArr = buildTrend(startActual, endActual, seed, `sum-a-${def.label}`).map(Math.round);

    const endYoy = vary(def.baseYoy, 0.3, seed, `sum-yoy-${def.label}`);
    const startYoy = endYoy + vary(3, 0.5, seed, `sum-ys-${def.label}`) * (def.baseYoy < 0 ? -1 : 1);
    const yoyArr = buildTrend(startYoy, endYoy, seed, `sum-y-${def.label}`);

    return summaryRow(def.label, def.level, yoyArr, actualArr);
  });

  return { months, table };
}

// ─── Key Metrics Tab ──────────────────────────────────────────────────────────

export interface MetricWindow {
  actual: number | null;
  yoy: number | null;
  yoyTrend: (number | null)[];
  actualTrend: (number | null)[];
}

export interface MetricRow {
  id: string;
  label: string;
  windows: Record<string, MetricWindow>;
}

export const TIMEFRAME_WINDOWS = ['QTM', 'T1M', 'T3M', 'T12M'] as const;
export const WINDOW_LABELS: Record<string, string> = {
  QTM: 'QTM (Monthly Avg)',
  T1M: 'T1M',
  T3M: 'T3M',
  T12M: 'T12M',
};

interface MetricDef {
  id: string;
  label: string;
  baseActual: number;
  baseYoy: number;
  isNull?: boolean;
}

const METRIC_DEFS: MetricDef[] = [
  { id: 'net-buyers',      label: 'Net Buyers',         baseActual: 14200, baseYoy: -2.1 },
  { id: 'organic',         label: 'Organic Acquisition', baseActual: 8420,  baseYoy: 1.4 },
  { id: 'free',            label: 'Free-Tier Buyers',   baseActual: 3210,  baseYoy: -4.8 },
  { id: 'paid',            label: 'Paid Acquisition',   baseActual: 2570,  baseYoy: 3.2 },
  { id: 'churned-buyers',  label: 'Churned Buyers',     baseActual: 1840,  baseYoy: 5.6 },
  { id: 'churned-rate',    label: 'Churn Rate',         baseActual: 0,     baseYoy: 0, isNull: true },
  { id: 'active-buyers',   label: 'Active Buyer Base',  baseActual: 12800, baseYoy: -1.4 },
  { id: 'repeat-rate',     label: '90-Day Repeat Rate', baseActual: 0,     baseYoy: 0, isNull: true },
];

const WINDOW_MULTIPLIERS: Record<string, number> = { QTM: 1, T1M: 0.97, T3M: 1.02, T12M: 11.9 };

export function getKeyMetricsData(timeMeasure: string, region: string): MetricRow[] {
  const seed = filterSeed(region, timeMeasure);
  const nullTrend = Array(12).fill(null) as (number | null)[];

  return METRIC_DEFS.map((def) => {
    if (def.isNull) {
      const windows: Record<string, MetricWindow> = {};
      for (const tw of TIMEFRAME_WINDOWS) {
        windows[tw] = { actual: null, yoy: null, yoyTrend: nullTrend, actualTrend: nullTrend };
      }
      return { id: def.id, label: def.label, windows };
    }

    const windows: Record<string, MetricWindow> = {};
    for (const tw of TIMEFRAME_WINDOWS) {
      const mult = WINDOW_MULTIPLIERS[tw];
      const actual = varyInt(def.baseActual * mult, 0.08, seed, `km-${def.id}-${tw}-a`);
      const yoy = vary(def.baseYoy, 0.3, seed, `km-${def.id}-${tw}-y`);
      const yoyEnd = yoy;
      const yoyStart = yoy + vary(2, 0.5, seed, `km-${def.id}-${tw}-ys`) * (def.baseYoy < 0 ? -1 : 1);
      const yoyTrend = buildTrend(yoyStart, yoyEnd, seed, `km-${def.id}-${tw}-yt`);
      const actEnd = actual;
      const actStart = Math.round(actual / (1 + yoy / 100));
      const actualTrend = buildTrend(actStart, actEnd, seed, `km-${def.id}-${tw}-at`).map(Math.round);
      windows[tw] = { actual, yoy, yoyTrend, actualTrend };
    }
    return { id: def.id, label: def.label, windows };
  });
}

export const TREND_MONTHS = MONTH_SETS.T12M;

// ─── Segmentation Tab ─────────────────────────────────────────────────────────

export interface SegRow {
  id: string;
  label: string;
  level: number;
  parentId: string | null;
  buyerShare: number;
  buyerCount: number;
  buyerYoy: number;
  gmbShare: number;
  gmbCount: number;
  gmbYoy: number;
  hasChildren: boolean;
}

const SEG_DEFS: SegRow[] = [
  { id: 'high',      label: 'High Enthusiast',    level: 0, parentId: null,   buyerShare: 12.9, buyerCount: 18.4, buyerYoy: -3.2, gmbShare: 52.1, gmbCount: 4820, gmbYoy: -2.8, hasChildren: true },
  { id: 'high-sell', label: 'HV Buyers Who Sell', level: 1, parentId: 'high', buyerShare: 4.8,  buyerCount: 6.8,  buyerYoy: -4.1, gmbShare: 21.0, gmbCount: 1940, gmbYoy: -3.5, hasChildren: false },
  { id: 'high-non',  label: 'HV Non-Sellers',     level: 1, parentId: 'high', buyerShare: 8.2,  buyerCount: 11.6, buyerYoy: -2.7, gmbShare: 31.1, gmbCount: 2880, gmbYoy: -2.3, hasChildren: false },
  { id: 'mid',       label: 'Medium Value',        level: 0, parentId: null,   buyerShare: 29.9, buyerCount: 42.6, buyerYoy: 1.8,  gmbShare: 34.1, gmbCount: 3150, gmbYoy: 2.1,  hasChildren: true },
  { id: 'mid-act',   label: 'Mid Active',          level: 1, parentId: 'mid',  buyerShare: 19.9, buyerCount: 28.4, buyerYoy: 2.4,  gmbShare: 22.7, gmbCount: 2100, gmbYoy: 2.8,  hasChildren: false },
  { id: 'mid-cas',   label: 'Mid Casual',          level: 1, parentId: 'mid',  buyerShare: 10.0, buyerCount: 14.2, buyerYoy: 0.6,  gmbShare: 11.4, gmbCount: 1050, gmbYoy: 0.8,  hasChildren: false },
  { id: 'low',       label: 'Low Value',           level: 0, parentId: null,   buyerShare: 57.1, buyerCount: 81.3, buyerYoy: -1.9, gmbShare: 13.8, gmbCount: 1280, gmbYoy: -4.2, hasChildren: true },
  { id: 'low-sell',  label: 'LV Buyers Who Sell',  level: 1, parentId: 'low',  buyerShare: 8.5,  buyerCount: 12.1, buyerYoy: -3.6, gmbShare: 4.1,  gmbCount: 380,  gmbYoy: -5.1, hasChildren: false },
  { id: 'low-occ',   label: 'Low Occasional',      level: 1, parentId: 'low',  buyerShare: 32.2, buyerCount: 45.8, buyerYoy: -1.2, gmbShare: 6.7,  gmbCount: 620,  gmbYoy: -3.4, hasChildren: false },
  { id: 'low-dorm',  label: 'Low Dormant',         level: 1, parentId: 'low',  buyerShare: 16.4, buyerCount: 23.4, buyerYoy: -2.8, gmbShare: 3.0,  gmbCount: 280,  gmbYoy: -5.8, hasChildren: false },
];

export function getSegmentationRows(region: string, timeframe: string): SegRow[] {
  const seed = filterSeed(region, timeframe);
  return SEG_DEFS.map((def) => ({
    ...def,
    buyerCount: vary(def.buyerCount, 0.1, seed, `seg-bc-${def.id}`),
    buyerShare: vary(def.buyerShare, 0.08, seed, `seg-bs-${def.id}`),
    buyerYoy:   vary(def.buyerYoy, 0.25, seed, `seg-by-${def.id}`),
    gmbCount:   varyInt(def.gmbCount, 0.1, seed, `seg-gc-${def.id}`),
    gmbShare:   vary(def.gmbShare, 0.08, seed, `seg-gs-${def.id}`),
    gmbYoy:     vary(def.gmbYoy, 0.25, seed, `seg-gy-${def.id}`),
  }));
}

export interface MigrationPeriod {
  date: string;
  segments: Record<string, number>;
}

const MIGRATION_DATES = ['Apr 2025', 'Jun 2025', 'Aug 2025', 'Oct 2025', 'Dec 2025', 'Mar 2026'];
const MIGRATION_BASE: Record<string, number[]> = {
  'High Value':    [19.8, 19.5, 19.2, 18.9, 18.6, 18.4],
  'Medium Value':  [41.2, 41.6, 41.8, 42.1, 42.4, 42.6],
  'Low Value':     [77.4, 78.2, 78.6, 79.8, 80.5, 81.3],
  'Churned':       [11.6, 12.1, 12.4, 13.1, 13.8, 14.2],
};

export function getMigrationPeriods(region: string, timeframe: string): MigrationPeriod[] {
  const seed = filterSeed(region, timeframe);
  return MIGRATION_DATES.map((date, i) => {
    const segments: Record<string, number> = {};
    for (const [seg, bases] of Object.entries(MIGRATION_BASE)) {
      segments[seg] = vary(bases[i], 0.06, seed, `mig-${seg}-${i}`);
    }
    return { date, segments };
  });
}

// ─── Active Buyers Tab ────────────────────────────────────────────────────────

export type Dimension = 'device' | 'traffic' | 'vertical' | 'buyer-type' | 'price';

export interface DimRow {
  id: string;
  label: string;
  level: number;
  parentId: string | null;
  buyerShare: number;
  buyerCount: number;
  buyerYoy: number;
  gmbShare: number;
  gmbCount: number;
  gmbYoy: number;
  hasChildren: boolean;
}

const ACTIVE_DEFS: Record<Dimension, Omit<DimRow, 'buyerCount' | 'buyerYoy' | 'gmbCount' | 'gmbYoy'>[]> = {
  device: [
    { id: 'mobile',    label: 'Mobile',       level: 0, parentId: null,     buyerShare: 86.8, gmbShare: 86.9, hasChildren: true },
    { id: 'browser',   label: 'Browser',      level: 1, parentId: 'mobile', buyerShare: 38.2, gmbShare: 42.1, hasChildren: false },
    { id: 'mweb',      label: 'mWeb',         level: 1, parentId: 'mobile', buyerShare: 12.4, gmbShare: 10.2, hasChildren: false },
    { id: 'apps-rest', label: 'Rest of Apps', level: 1, parentId: 'mobile', buyerShare: 4.1,  gmbShare: 3.8,  hasChildren: false },
    { id: 'android',   label: 'Android',      level: 1, parentId: 'mobile', buyerShare: 14.8, gmbShare: 13.6, hasChildren: false },
    { id: 'iphone',    label: 'iPhone',       level: 1, parentId: 'mobile', buyerShare: 17.3, gmbShare: 17.2, hasChildren: false },
    { id: 'pc',        label: 'PC',           level: 0, parentId: null,     buyerShare: 13.2, gmbShare: 13.1, hasChildren: false },
  ],
  traffic: [
    { id: 'free',      label: 'Free',          level: 0, parentId: null,    buyerShare: 28.4, gmbShare: 24.2, hasChildren: true },
    { id: 'seo',       label: 'SEO',           level: 1, parentId: 'free',  buyerShare: 18.2, gmbShare: 15.8, hasChildren: false },
    { id: 'rest-free', label: 'Rest of Free',  level: 1, parentId: 'free',  buyerShare: 10.2, gmbShare: 8.4,  hasChildren: false },
    { id: 'organic',   label: 'Organic',        level: 0, parentId: null,    buyerShare: 32.8, gmbShare: 35.6, hasChildren: false },
    { id: 'direct',    label: 'Direct',         level: 0, parentId: null,    buyerShare: 14.6, gmbShare: 18.4, hasChildren: false },
    { id: 'paid',      label: 'Paid',           level: 0, parentId: null,    buyerShare: 24.2, gmbShare: 21.8, hasChildren: true },
    { id: 'display',   label: 'Display',        level: 1, parentId: 'paid',  buyerShare: 3.2,  gmbShare: 2.4,  hasChildren: false },
    { id: 'epn',       label: 'ePN',            level: 1, parentId: 'paid',  buyerShare: 5.8,  gmbShare: 5.2,  hasChildren: false },
    { id: 'search',    label: 'Search',         level: 1, parentId: 'paid',  buyerShare: 12.4, gmbShare: 11.8, hasChildren: false },
    { id: 'rest-paid', label: 'Rest of Paid',   level: 1, parentId: 'paid',  buyerShare: 2.8,  gmbShare: 2.4,  hasChildren: false },
  ],
  vertical: [
    { id: 'electronics', label: 'Electronics',          level: 0, parentId: null, buyerShare: 22.4, gmbShare: 28.6, hasChildren: false },
    { id: 'fashion',     label: 'Fashion',              level: 0, parentId: null, buyerShare: 18.6, gmbShare: 14.2, hasChildren: false },
    { id: 'home',        label: 'Home & Garden',         level: 0, parentId: null, buyerShare: 14.8, gmbShare: 16.4, hasChildren: false },
    { id: 'collect',     label: 'Collectibles',          level: 0, parentId: null, buyerShare: 12.2, gmbShare: 11.8, hasChildren: false },
    { id: 'lifestyle',   label: 'Lifestyle',             level: 0, parentId: null, buyerShare: 10.4, gmbShare: 8.6,  hasChildren: false },
    { id: 'parts',       label: 'Parts & Accessories',   level: 0, parentId: null, buyerShare: 9.8,  gmbShare: 10.2, hasChildren: false },
    { id: 'media',       label: 'Media',                 level: 0, parentId: null, buyerShare: 7.2,  gmbShare: 5.4,  hasChildren: false },
    { id: 'biz',         label: 'Business & Industrial', level: 0, parentId: null, buyerShare: 4.6,  gmbShare: 4.8,  hasChildren: false },
  ],
  'buyer-type': [
    { id: 'new',         label: 'New',         level: 0, parentId: null, buyerShare: 24.8, gmbShare: 18.2, hasChildren: false },
    { id: 'retained',    label: 'Retained',    level: 0, parentId: null, buyerShare: 62.6, gmbShare: 71.4, hasChildren: false },
    { id: 'reactivated', label: 'Reactivated', level: 0, parentId: null, buyerShare: 12.6, gmbShare: 10.4, hasChildren: false },
  ],
  price: [
    { id: 'lt10',  label: '<$10',      level: 0, parentId: null, buyerShare: 42.4, gmbShare: 8.6,  hasChildren: false },
    { id: '10-50', label: '$10 – $50', level: 0, parentId: null, buyerShare: 34.8, gmbShare: 32.4, hasChildren: false },
    { id: 'gt50',  label: '>$50',      level: 0, parentId: null, buyerShare: 22.8, gmbShare: 59.0, hasChildren: false },
  ],
};

const ACTIVE_YOY_BASE: Record<string, { buyerYoy: number; gmbYoy: number }> = {
  mobile: { buyerYoy: -0.4, gmbYoy: 0.5 }, browser: { buyerYoy: -2.8, gmbYoy: -1.9 },
  mweb: { buyerYoy: -1.2, gmbYoy: -0.8 }, 'apps-rest': { buyerYoy: 3.6, gmbYoy: 4.1 },
  android: { buyerYoy: 2.1, gmbYoy: 2.8 }, iphone: { buyerYoy: 1.8, gmbYoy: 2.4 },
  pc: { buyerYoy: -5.4, gmbYoy: -4.8 },
  free: { buyerYoy: -3.6, gmbYoy: -2.8 }, seo: { buyerYoy: -4.1, gmbYoy: -3.2 },
  'rest-free': { buyerYoy: -2.6, gmbYoy: -2.1 }, organic: { buyerYoy: -0.8, gmbYoy: 0.4 },
  direct: { buyerYoy: 0.6, gmbYoy: 1.2 }, paid: { buyerYoy: 2.4, gmbYoy: 3.1 },
  display: { buyerYoy: -4.2, gmbYoy: -3.8 }, epn: { buyerYoy: 3.4, gmbYoy: 4.1 },
  search: { buyerYoy: 3.8, gmbYoy: 4.2 }, 'rest-paid': { buyerYoy: 1.2, gmbYoy: 1.8 },
  electronics: { buyerYoy: -3.8, gmbYoy: -2.4 }, fashion: { buyerYoy: -2.1, gmbYoy: -1.6 },
  home: { buyerYoy: 1.2, gmbYoy: 2.1 }, collect: { buyerYoy: 0.4, gmbYoy: 0.8 },
  lifestyle: { buyerYoy: 2.8, gmbYoy: 3.4 }, parts: { buyerYoy: 0.6, gmbYoy: 1.2 },
  media: { buyerYoy: -4.6, gmbYoy: -3.8 }, biz: { buyerYoy: 1.8, gmbYoy: 2.6 },
  new: { buyerYoy: -1.4, gmbYoy: -0.8 }, retained: { buyerYoy: -0.6, gmbYoy: -0.2 },
  reactivated: { buyerYoy: 3.8, gmbYoy: 4.6 },
  lt10: { buyerYoy: -3.2, gmbYoy: -2.4 }, '10-50': { buyerYoy: 0.4, gmbYoy: 1.2 },
  gt50: { buyerYoy: 2.8, gmbYoy: 3.6 },
};

const ACTIVE_COUNT_BASE: Record<string, { buyerCount: number; gmbCount: number }> = {
  mobile: { buyerCount: 123.6, gmbCount: 8030 }, browser: { buyerCount: 54.4, gmbCount: 3890 },
  mweb: { buyerCount: 17.7, gmbCount: 940 }, 'apps-rest': { buyerCount: 5.8, gmbCount: 350 },
  android: { buyerCount: 21.1, gmbCount: 1260 }, iphone: { buyerCount: 24.6, gmbCount: 1590 },
  pc: { buyerCount: 18.8, gmbCount: 1210 },
  free: { buyerCount: 40.4, gmbCount: 2240 }, seo: { buyerCount: 25.9, gmbCount: 1460 },
  'rest-free': { buyerCount: 14.5, gmbCount: 780 }, organic: { buyerCount: 46.7, gmbCount: 3290 },
  direct: { buyerCount: 20.8, gmbCount: 1700 }, paid: { buyerCount: 34.5, gmbCount: 2020 },
  display: { buyerCount: 4.6, gmbCount: 220 }, epn: { buyerCount: 8.3, gmbCount: 480 },
  search: { buyerCount: 17.7, gmbCount: 1090 }, 'rest-paid': { buyerCount: 3.9, gmbCount: 230 },
  electronics: { buyerCount: 31.9, gmbCount: 2640 }, fashion: { buyerCount: 26.5, gmbCount: 1310 },
  home: { buyerCount: 21.1, gmbCount: 1520 }, collect: { buyerCount: 17.4, gmbCount: 1090 },
  lifestyle: { buyerCount: 14.8, gmbCount: 800 }, parts: { buyerCount: 14.0, gmbCount: 940 },
  media: { buyerCount: 10.3, gmbCount: 500 }, biz: { buyerCount: 6.5, gmbCount: 440 },
  new: { buyerCount: 35.3, gmbCount: 1680 }, retained: { buyerCount: 89.2, gmbCount: 6600 },
  reactivated: { buyerCount: 17.9, gmbCount: 960 },
  lt10: { buyerCount: 60.4, gmbCount: 800 }, '10-50': { buyerCount: 49.6, gmbCount: 3000 },
  gt50: { buyerCount: 32.5, gmbCount: 5460 },
};

export function getActiveBuyersData(dimension: Dimension, region: string, timeframe: string): DimRow[] {
  const seed = filterSeed(region, timeframe);
  const defs = ACTIVE_DEFS[dimension];

  return defs.map((def) => {
    const counts = ACTIVE_COUNT_BASE[def.id] ?? { buyerCount: 10, gmbCount: 500 };
    const yoys = ACTIVE_YOY_BASE[def.id] ?? { buyerYoy: 0, gmbYoy: 0 };
    return {
      ...def,
      buyerCount: vary(counts.buyerCount, 0.1, seed, `ab-bc-${def.id}`),
      buyerShare: vary(def.buyerShare, 0.08, seed, `ab-bs-${def.id}`),
      buyerYoy:   vary(yoys.buyerYoy, 0.25, seed, `ab-by-${def.id}`),
      gmbCount:   varyInt(counts.gmbCount, 0.1, seed, `ab-gc-${def.id}`),
      gmbShare:   vary(def.gmbShare, 0.08, seed, `ab-gs-${def.id}`),
      gmbYoy:     vary(yoys.gmbYoy, 0.25, seed, `ab-gy-${def.id}`),
    };
  });
}

// ─── Churned Tab ──────────────────────────────────────────────────────────────

export interface ChurnRow {
  id: string;
  label: string;
  level: number;
  parentId: string | null;
  buyerCount: number;
  buyerShare: number;
  churnRate: number;
  churnRateYoy: number;
  gmbCount: number;
  gmbShare: number;
  hasChildren: boolean;
}

const CHURN_DEFS: ChurnRow[] = [
  { id: 'norb',        label: 'NoRB',         level: 0, parentId: null,   buyerCount: 48.2, buyerShare: 42.8, churnRate: 18.4, churnRateYoy: -2.6, gmbCount: 4820,  gmbShare: 38.4, hasChildren: true },
  { id: 'norb-casual', label: 'Casual NoRB',  level: 1, parentId: 'norb', buyerCount: 28.6, buyerShare: 25.4, churnRate: 22.1, churnRateYoy: -3.2, gmbCount: 2240,  gmbShare: 17.8, hasChildren: false },
  { id: 'norb-active', label: 'Active NoRB',  level: 1, parentId: 'norb', buyerCount: 19.6, buyerShare: 17.4, churnRate: 13.2, churnRateYoy: -1.8, gmbCount: 2580,  gmbShare: 20.6, hasChildren: false },
  { id: 'new',         label: 'New',           level: 0, parentId: null,   buyerCount: 24.8, buyerShare: 22.0, churnRate: 32.6, churnRateYoy: -1.4, gmbCount: 1680,  gmbShare: 13.4, hasChildren: false },
  { id: 'reactivated', label: 'Reactivated',  level: 0, parentId: null,   buyerCount: 14.2, buyerShare: 12.6, churnRate: 24.8, churnRateYoy: -0.8, gmbCount: 1420,  gmbShare: 11.3, hasChildren: false },
  { id: 'retained',    label: 'Retained',      level: 0, parentId: null,   buyerCount: 25.4, buyerShare: 22.6, churnRate: 8.2,  churnRateYoy: -3.8, gmbCount: 4640,  gmbShare: 36.9, hasChildren: false },
];

export function getChurnedRows(region: string, timeframe: string): ChurnRow[] {
  const seed = filterSeed(region, timeframe);
  return CHURN_DEFS.map((def) => ({
    ...def,
    buyerCount:   vary(def.buyerCount, 0.1, seed, `ch-bc-${def.id}`),
    buyerShare:   vary(def.buyerShare, 0.08, seed, `ch-bs-${def.id}`),
    churnRate:    vary(def.churnRate, 0.15, seed, `ch-cr-${def.id}`),
    churnRateYoy: vary(def.churnRateYoy, 0.25, seed, `ch-cy-${def.id}`),
    gmbCount:     varyInt(def.gmbCount, 0.1, seed, `ch-gc-${def.id}`),
    gmbShare:     vary(def.gmbShare, 0.08, seed, `ch-gs-${def.id}`),
  }));
}
