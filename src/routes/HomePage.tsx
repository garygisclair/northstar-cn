import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Search, TrendingUp, TrendingDown, Plus, X, Pencil, Check, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

// --- Clock ---

function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const display = hours % 12 || 12;

  return (
    <span className="text-right font-bold tabular-nums whitespace-nowrap">
      <span className="text-2xl">{display}:{minutes}</span>
      <span className="text-sm ml-0.5">{ampm}</span>
    </span>
  );
}

// --- KPI Card ---

interface KpiData {
  id: string;
  name: string;
  date: string;
  dimension: string;
  value: string;
  delta: number;
  positive: boolean;
  chartData: number[];
  chartLabels: string[];
}

function MiniBarChart({ data, labels, positive }: { data: number[]; labels: string[]; positive: boolean }) {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div className="flex items-end gap-1.5 h-full w-full relative">
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 min-w-0 relative flex items-end h-full"
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
        >
          <div
            className={cn(
              'w-full rounded-[1px] cursor-default transition-opacity',
              i === data.length - 1
                ? (positive ? 'bg-positive' : 'bg-negative')
                : 'bg-muted-foreground/30',
              hovered !== null && hovered !== i && 'opacity-40',
            )}
            style={{ height: `${v}%`, minHeight: 2 }}
          />
          {hovered === i && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 z-10">
              <div className="rounded bg-foreground px-1.5 py-0.5 text-[10px] font-medium text-background whitespace-nowrap shadow">
                {labels[i]}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function KpiCard({ kpi, editing, onRemove }: { kpi: KpiData; editing: boolean; onRemove: () => void }) {
  return (
    <div className="rounded border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between mb-1">
        <p className="text-sm font-bold">{kpi.name}</p>
        {editing && (
          <button
            onClick={onRemove}
            className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:text-destructive transition-colors cursor-pointer -mt-0.5 -mr-1"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      <p className="text-[11px] text-muted-foreground leading-4">{kpi.date}</p>
      <p className="text-[11px] text-muted-foreground leading-4 mb-2">{kpi.dimension}</p>
      <div className="flex gap-4">
        {/* Left: metrics */}
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <div>
            <p className="text-2xl font-bold tracking-tight">{kpi.value}</p>
            <div className="flex items-center gap-1.5 mt-1">
              {kpi.positive ? (
                <TrendingUp className="h-4 w-4 text-positive" />
              ) : (
                <TrendingDown className="h-4 w-4 text-negative" />
              )}
              <span className={cn('text-sm', kpi.positive ? 'text-positive' : 'text-negative')}>
                {kpi.delta}%
              </span>
            </div>
          </div>
        </div>
        {/* Right: bar chart */}
        <div className="w-24 shrink-0 self-end h-16">
          <MiniBarChart data={kpi.chartData} labels={kpi.chartLabels} positive={kpi.positive} />
        </div>
      </div>
    </div>
  );
}

// --- KPI Data ---

const ALL_KPIS: KpiData[] = [
  { id: 'revenue', name: 'Revenue', date: 'Wk End: Mar 16, 2026', dimension: 'Weekly | All Platforms', value: '4,218.3m', delta: 3.2, positive: true, chartData: [62, 68, 65, 74, 78, 82], chartLabels: ['$3,812.0m', '$3,940.5m', '$3,887.2m', '$4,052.1m', '$4,138.6m', '$4,218.3m'] },
  { id: 'margin-rate', name: 'Margin Rate', date: 'Wk End: Mar 16, 2026', dimension: 'Weekly | All Platforms', value: '12.8%', delta: 0.4, positive: true, chartData: [48, 50, 47, 52, 51, 53], chartLabels: ['11.6%', '12.0%', '11.4%', '12.4%', '12.2%', '12.8%'] },
  { id: 'attach-rate', name: 'Attach Rate', date: 'Wk End: Mar 16, 2026', dimension: 'Weekly | All Platforms', value: '4.7%', delta: 0.2, positive: true, chartData: [30, 32, 29, 33, 31, 34], chartLabels: ['4.1%', '4.3%', '4.0%', '4.4%', '4.2%', '4.7%'] },
  { id: 'gross-margin', name: 'Gross Margin', date: 'Wk End: Mar 16, 2026', dimension: 'Weekly | All Platforms', value: '2,891.5m', delta: 2.8, positive: true, chartData: [55, 60, 58, 66, 70, 74], chartLabels: ['$2,540.8m', '$2,612.4m', '$2,580.0m', '$2,724.3m', '$2,810.7m', '$2,891.5m'] },
  { id: 'active-customers', name: 'Active Customers', date: 'Wk End: Mar 16, 2026', dimension: 'Weekly | All Platforms', value: '38.2m', delta: 1.1, positive: true, chartData: [72, 74, 73, 76, 75, 78], chartLabels: ['36.8m', '37.2m', '37.0m', '37.6m', '37.4m', '38.2m'] },
  { id: 'sub-revenue', name: 'Subscription Revenue', date: 'Wk End: Mar 16, 2026', dimension: 'Weekly | All Platforms', value: '1,204.7m', delta: -0.3, positive: false, chartData: [85, 82, 84, 80, 81, 79], chartLabels: ['$1,228.4m', '$1,220.1m', '$1,225.6m', '$1,214.8m', '$1,218.2m', '$1,204.7m'] },
  { id: 'sessions', name: 'Sessions', date: 'Wk End: Mar 16, 2026', dimension: 'Weekly | All Platforms', value: '892.1m', delta: 1.6, positive: true, chartData: [40, 45, 42, 50, 48, 54], chartLabels: ['810.3m', '832.6m', '818.4m', '854.0m', '846.2m', '892.1m'] },
  { id: 'aov', name: 'Avg Order Value', date: 'Wk End: Mar 16, 2026', dimension: 'Weekly | All Platforms', value: '$68.40', delta: 0.9, positive: true, chartData: [58, 60, 59, 62, 61, 64], chartLabels: ['$65.20', '$66.10', '$65.70', '$67.30', '$66.80', '$68.40'] },
  { id: 'return-rate', name: 'Return Rate', date: 'Wk End: Mar 16, 2026', dimension: 'Weekly | All Platforms', value: '6.2%', delta: -0.5, positive: true, chartData: [44, 42, 40, 38, 39, 36], chartLabels: ['7.4%', '7.1%', '6.8%', '6.5%', '6.6%', '6.2%'] },
  { id: 'nps', name: 'Net Promoter Score', date: 'Wk End: Mar 16, 2026', dimension: 'Weekly | All Platforms', value: '72', delta: 2.1, positive: true, chartData: [55, 58, 60, 64, 68, 72], chartLabels: ['64', '66', '68', '70', '71', '72'] },
  { id: 'cac', name: 'Acquisition Cost', date: 'Wk End: Mar 16, 2026', dimension: 'Weekly | All Platforms', value: '$14.20', delta: -1.8, positive: true, chartData: [52, 48, 46, 42, 40, 38], chartLabels: ['$17.80', '$16.50', '$16.00', '$15.10', '$14.60', '$14.20'] },
  { id: 'ltv', name: 'Customer Lifetime Value', date: 'Wk End: Mar 16, 2026', dimension: 'Weekly | All Platforms', value: '$342.00', delta: 4.5, positive: true, chartData: [50, 56, 60, 68, 74, 82], chartLabels: ['$288.00', '$304.00', '$316.00', '$328.00', '$336.00', '$342.00'] },
  { id: 'churn', name: 'Churn Rate', date: 'Wk End: Mar 16, 2026', dimension: 'Weekly | All Platforms', value: '2.4%', delta: -0.3, positive: true, chartData: [38, 36, 35, 34, 33, 32], chartLabels: ['3.2%', '3.0%', '2.9%', '2.8%', '2.6%', '2.4%'] },
  { id: 'arpu', name: 'Revenue per User', date: 'Wk End: Mar 16, 2026', dimension: 'Weekly | All Platforms', value: '$22.80', delta: 1.4, positive: true, chartData: [60, 63, 62, 66, 68, 70], chartLabels: ['$20.40', '$21.10', '$20.80', '$21.90', '$22.30', '$22.80'] },
  { id: 'bounce', name: 'Bounce Rate', date: 'Wk End: Mar 16, 2026', dimension: 'Weekly | All Platforms', value: '34.1%', delta: -1.2, positive: true, chartData: [50, 48, 46, 44, 42, 40], chartLabels: ['38.2%', '37.4%', '36.5%', '35.8%', '35.0%', '34.1%'] },
  { id: 'cart-abandon', name: 'Cart Abandonment', date: 'Wk End: Mar 16, 2026', dimension: 'Weekly | All Platforms', value: '68.5%', delta: 0.8, positive: false, chartData: [60, 62, 64, 65, 67, 68], chartLabels: ['65.2%', '66.0%', '66.8%', '67.4%', '68.0%', '68.5%'] },
  { id: 'page-views', name: 'Page Views', date: 'Wk End: Mar 16, 2026', dimension: 'Weekly | All Platforms', value: '2.1b', delta: 3.7, positive: true, chartData: [45, 52, 58, 64, 70, 78], chartLabels: ['1.72b', '1.82b', '1.90b', '1.96b', '2.04b', '2.10b'] },
  { id: 'time-on-site', name: 'Avg Time on Site', date: 'Wk End: Mar 16, 2026', dimension: 'Weekly | All Platforms', value: '4m 32s', delta: 0.6, positive: true, chartData: [65, 66, 64, 67, 66, 68], chartLabels: ['4m 08s', '4m 12s', '4m 04s', '4m 18s', '4m 14s', '4m 32s'] },
  { id: 'support-tickets', name: 'Support Tickets', date: 'Wk End: Mar 16, 2026', dimension: 'Weekly | All Platforms', value: '14.2k', delta: -5.1, positive: true, chartData: [70, 64, 58, 52, 46, 40], chartLabels: ['18.6k', '17.2k', '16.1k', '15.4k', '14.8k', '14.2k'] },
  { id: 'fulfillment', name: 'Fulfillment Rate', date: 'Wk End: Mar 16, 2026', dimension: 'Weekly | All Platforms', value: '97.3%', delta: 0.2, positive: true, chartData: [90, 91, 92, 92, 93, 93], chartLabels: ['96.2%', '96.5%', '96.8%', '96.9%', '97.1%', '97.3%'] },
];

const DEFAULT_IDS = ['revenue', 'margin-rate', 'attach-rate', 'gross-margin', 'active-customers', 'sub-revenue', 'sessions', 'aov', 'return-rate'];

const DEMO_CATEGORY_KPIS: KpiData[] = [
  { id: 'cat-sneakers', name: 'Sneakers', date: 'Wk End: Mar 16, 2026', dimension: 'Weekly | Focus Category', value: '312.4m', delta: 7.8, positive: true, chartData: [42, 50, 55, 62, 70, 82], chartLabels: ['$248.1m', '$262.5m', '$274.0m', '$288.6m', '$298.3m', '$312.4m'] },
  { id: 'cat-handbags', name: 'Handbags', date: 'Wk End: Mar 16, 2026', dimension: 'Weekly | Focus Category', value: '189.7m', delta: 5.2, positive: true, chartData: [48, 52, 56, 60, 66, 72], chartLabels: ['$152.3m', '$160.8m', '$168.4m', '$174.2m', '$182.0m', '$189.7m'] },
  { id: 'cat-watches', name: 'Watches', date: 'Wk End: Mar 16, 2026', dimension: 'Weekly | Focus Category', value: '156.1m', delta: 4.1, positive: true, chartData: [50, 53, 55, 60, 64, 68], chartLabels: ['$128.4m', '$134.2m', '$138.7m', '$145.0m', '$150.8m', '$156.1m'] },
];

// --- Add Metric Modal ---

function AddMetricModal({ activeIds, onToggle, onClose }: { activeIds: string[]; onToggle: (id: string) => void; onClose: () => void }) {
  const [search, setSearch] = useState('');
  const filtered = ALL_KPIS.filter((kpi) => kpi.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="relative z-50 w-full max-w-lg rounded-lg border bg-background shadow-lg">
          <div className="flex items-center justify-between border-b px-6 py-4">
            <div>
              <h2 className="text-lg font-bold">Add Metrics</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Select which metrics to show on your dashboard</p>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="px-6 pt-4 pb-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search metrics..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                autoFocus
              />
            </div>
          </div>
          <div className="px-6 py-2 max-h-[60vh] overflow-y-auto">
            {filtered.map((kpi) => {
              const isActive = activeIds.includes(kpi.id);
              return (
                <button
                  key={kpi.id}
                  onClick={() => onToggle(kpi.id)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-md px-3 py-2.5 mb-1 text-left transition-colors cursor-pointer',
                    isActive ? 'bg-accent' : 'hover:bg-accent/50',
                  )}
                >
                  <div className={cn(
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors',
                    isActive ? 'bg-primary border-primary text-primary-foreground' : 'border-input',
                  )}>
                    {isActive && <Check className="h-3 w-3" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{kpi.name}</p>
                    <p className="text-[11px] text-muted-foreground">{kpi.dimension}</p>
                  </div>
                  <span className="text-sm font-bold tabular-nums">{kpi.value}</span>
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-between border-t px-6 py-3">
            <p className="text-xs text-muted-foreground">{activeIds.length} of {ALL_KPIS.length} selected{search && ` · ${filtered.length} shown`}</p>
            <button
              onClick={onClose}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Home Page ---

export function HomePage() {
  const { demoTriggered, toggleRightPanel, kpiFilters, rightPanel } = useOutletContext<{
    demoTriggered: boolean;
    toggleRightPanel: (content: string) => void;
    kpiFilters: { timeframe: string; platform: string; region: string };
    rightPanel: string | null;
  }>();
  const [activeIds, setActiveIds] = useState<string[]>(DEFAULT_IDS);
  const [editing, setEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [demoCards, setDemoCards] = useState<KpiData[]>([]);
  const [visibleDemoIds, setVisibleDemoIds] = useState<Set<string>>(new Set());

  // When demo triggers, stagger-fade the 3 category KPIs
  useEffect(() => {
    if (!demoTriggered || demoCards.length > 0) return;
    // Add all 3 cards at once (invisible), then reveal one by one
    setDemoCards(DEMO_CATEGORY_KPIS);
    DEMO_CATEGORY_KPIS.forEach((kpi, i) => {
      setTimeout(() => {
        setVisibleDemoIds(prev => new Set(prev).add(kpi.id));
      }, i * 400);
    });
  }, [demoTriggered]);

  // Build dimension string and date prefix from active filters
  const filterDimension = `${kpiFilters.timeframe} | ${kpiFilters.platform}${kpiFilters.region !== 'Marketplace' ? ` | ${kpiFilters.region}` : ''}`;

  const DATE_PREFIX: Record<string, string> = {
    Daily: 'EoD:',
    Weekly: 'Wk End:',
    Monthly: 'Mo End:',
    Quarterly: 'Qtr End:',
  };
  const DATE_VALUE: Record<string, string> = {
    Daily: 'Mar 22, 2026',
    Weekly: 'Mar 16, 2026',
    Monthly: 'Feb 28, 2026',
    Quarterly: 'Mar 31, 2026',
  };
  const dateStr = `${DATE_PREFIX[kpiFilters.timeframe] ?? 'Wk End:'} ${DATE_VALUE[kpiFilters.timeframe] ?? 'Mar 16, 2026'}`;

  // Simple hash to generate a consistent multiplier per filter combo
  const filterKey = `${kpiFilters.timeframe}|${kpiFilters.platform}|${kpiFilters.region}`;
  const filterHash = [...filterKey].reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0);
  const filterMult = 0.75 + (((filterHash & 0x7fffffff) % 50) / 100); // 0.75–1.24

  const activeKpis = activeIds.map((id) => ALL_KPIS.find((k) => k.id === id)!).filter(Boolean)
    .map(kpi => {
      // Shift value if filters differ from defaults
      const isDefault = kpiFilters.timeframe === 'Weekly' && kpiFilters.platform === 'All Platforms' && kpiFilters.region === 'Marketplace';
      if (isDefault) return { ...kpi, dimension: filterDimension, date: dateStr };

      // Parse and scale the numeric value
      const raw = kpi.value.replace(/[,$%mbks]/gi, '').trim();
      const num = parseFloat(raw);
      const scaled = num * filterMult;
      // Reconstruct with original suffix
      const suffix = kpi.value.replace(/[\d.,\s-]/g, '');
      const hasComma = kpi.value.includes(',');
      const formatted = hasComma
        ? scaled.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
        : scaled.toFixed(raw.includes('.') ? (raw.split('.')[1]?.length ?? 0) : 0);
      const newValue = kpi.value.startsWith('$') ? `$${formatted}` : `${formatted}${suffix}`;

      // Shift delta slightly
      const deltaShift = ((filterHash & 0xff) % 30 - 15) / 10;
      const newDelta = Math.round((kpi.delta + deltaShift) * 10) / 10;
      const newPositive = kpi.id === 'return-rate' || kpi.id === 'cac' || kpi.id === 'churn' || kpi.id === 'bounce' || kpi.id === 'support-tickets'
        ? newDelta <= 0
        : newDelta >= 0;

      return { ...kpi, value: newValue, delta: newDelta, positive: newPositive, dimension: filterDimension, date: dateStr };
    });

  const handleRemove = (id: string) => {
    setActiveIds((prev) => prev.filter((i) => i !== id));
  };

  const handleToggle = (id: string) => {
    setActiveIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex h-full flex-col animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border px-6 py-3">
        <div>
          <h1 className="text-lg font-semibold">My KPIs</h1>
          <p className="text-sm text-muted-foreground">Key performance indicators making the most impact to the business</p>
        </div>

        <div className="flex-1" />
        <Clock />
      </div>

      {/* KPI Grid */}
      <div className="flex-1 overflow-auto px-6 py-4">
        <div className="flex items-center mb-4">
          <span className="text-xs text-muted-foreground">Quick facts are displayed based on usage statistics. You can customize the list with the Customize List button, or add to it with Add Metric below.</span>
          <div className="flex-1" />
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setEditing(!editing)}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer',
                editing
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground',
              )}
            >
              <Pencil className="h-3 w-3" />
              {editing ? 'Save' : 'Customize List'}
            </button>
            <button
              onClick={() => toggleRightPanel('filters')}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer',
                rightPanel === 'filters'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground',
              )}
            >
              <SlidersHorizontal className="h-3 w-3" />
              Filters
            </button>
          </div>
        </div>
        <div className="kpi-grid grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-4">
          {activeKpis.map((kpi) => (
            <KpiCard key={kpi.id} kpi={kpi} editing={editing} onRemove={() => handleRemove(kpi.id)} />
          ))}

          {/* Demo category cards (fade in on Ask NorthStar demo) */}
          {demoCards.map((kpi) => (
            <div
              key={kpi.id}
              className={cn(
                'transition-all duration-500',
                visibleDemoIds.has(kpi.id)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4',
              )}
            >
              <KpiCard kpi={kpi} editing={editing} onRemove={() => setDemoCards(prev => prev.filter(k => k.id !== kpi.id))} />
            </div>
          ))}

          {/* Add card tile */}
          <button
            onClick={() => setShowModal(true)}
            className="rounded border-2 border-dashed border-border p-5 flex flex-col items-center justify-center gap-2 min-h-[140px] text-muted-foreground hover:border-foreground/30 hover:text-foreground transition-colors cursor-pointer"
          >
            <Plus className="h-6 w-6" />
            <span className="text-sm font-medium">Add Metric</span>
          </button>
        </div>

      </div>

      {/* Add Metric Modal */}
      {showModal && (
        <AddMetricModal
          activeIds={activeIds}
          onToggle={handleToggle}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
