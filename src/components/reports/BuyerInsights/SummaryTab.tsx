import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';
import LineChart from './LineChart';
import { getSummaryData, type RegionRow } from './mockData';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatK(v: number): string {
  if (v >= 1000) return `${(v / 1000).toFixed(1)}m`;
  return `${v.toFixed(0)}k`;
}

function formatM(v: number): string {
  if (v >= 1000) return `${(v / 1000).toFixed(0)}b`;
  return `${v.toFixed(1)}m`;
}

function lastVal(arr: (number | null)[]): number | null {
  return arr[arr.length - 1];
}

function fmtPct(v: number | null): string {
  if (v === null) return '--';
  return `${v > 0 ? '+' : ''}${v.toFixed(1)}%`;
}

function pctColor(v: number | null): string {
  if (v === null || v === 0) return 'text-muted-foreground';
  return v < 0 ? 'text-negative' : 'text-positive';
}

// ─── Component ────────────────────────────────────────────────────────────────

interface SummaryTabProps {
  demoMode?: boolean;
  timeframe?: string;
}

export default function SummaryTab({ demoMode = false, timeframe = 'T12M' }: SummaryTabProps) {
  const data = getSummaryData('On-Platform', timeframe);
  const [selectedRegion, setSelectedRegion] = useState<RegionRow>(data.table[0]);

  // Staggered reveal: 3 sections fade in one after another
  const [visibleSections, setVisibleSections] = useState<number>(demoMode ? 0 : 3);

  useEffect(() => {
    if (!demoMode) return;

    const timers = [
      setTimeout(() => setVisibleSections(1), 400),   // KPI row
      setTimeout(() => setVisibleSections(2), 1200),   // Table
      setTimeout(() => setVisibleSections(3), 2200),   // Charts
    ];
    return () => timers.forEach(clearTimeout);
  }, [demoMode]);

  // KPI computations
  const mp = data.table.find((r) => r.label === 'Marketplace')!;
  const onP = data.table.find((r) => r.label === 'On-Platform')!;
  const total = lastVal(mp.actual) ?? 0;
  const totalYoy = lastVal(mp.yoy) ?? 0;
  const onPShare = total > 0 ? ((lastVal(onP.actual) ?? 0) / total * 100).toFixed(1) : '0';

  const l2 = data.table.filter((r) => r.level === 2);
  let fastest = { label: '--', yoy: 0 };
  for (const r of l2) {
    const y = lastVal(r.yoy);
    if (y !== null && y > fastest.yoy) fastest = { label: r.label, yoy: y };
  }

  const maxActual = Math.max(...data.table.map((r) => lastVal(r.actual) ?? 0));

  const dataAsOf = 'Mar 16, 2026';
  const kpiContext = `${dataAsOf} · ${timeframe}`;
  const chartContext = `${dataAsOf} · ${timeframe} · ${selectedRegion.label}`;

  const kpis = [
    { label: 'Total Marketplace', value: formatM(total / 1000), delta: totalYoy, hasDelta: true },
    { label: 'On-Platform Share', value: `${onPShare}%`, delta: 0, hasDelta: false },
    { label: 'Fastest Grower', value: fastest.label, delta: fastest.yoy, hasDelta: true },
    { label: 'Active Regions', value: `${l2.filter((r) => r.actual.some((v) => v !== null)).length}`, delta: 0, hasDelta: false },
  ];

  // Chart data for selected region
  const la = lastVal(selectedRegion.actual);
  const ly = lastVal(selectedRegion.yoy);
  const priorActual = la !== null && ly !== null ? la / (1 + ly / 100) : null;

  return (
    <div className="p-6 space-y-4">
      {/* ── KPI ROW ──────────────────────────────────── */}
      {visibleSections >= 1 && (
        <div className="flex gap-4 flex-wrap animate-card-fade-in">
          {kpis.map((k, i) => (
            <div
              key={k.label}
              className="flex-1 min-w-[140px] rounded border bg-card p-4 shadow-sm animate-card-fade-in"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <p className="text-[11px] text-muted-foreground leading-4">{k.label}</p>
              <p className="text-[10px] text-muted-foreground leading-4">{kpiContext}</p>
              <p className="text-2xl font-bold tracking-tight mt-1">{k.value}</p>
              {k.hasDelta && (
                <div className="flex items-center gap-1.5 mt-1">
                  {k.delta >= 0 ? <TrendingUp className="h-4 w-4 text-positive" /> : <TrendingDown className="h-4 w-4 text-negative" />}
                  <span className={cn('text-sm tabular-nums', k.delta < 0 ? 'text-negative' : 'text-positive')}>
                    {k.delta > 0 ? '+' : ''}{k.delta.toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── SPLIT: TABLE + CHARTS ────────────────────── */}
      <div className="flex flex-col xl:flex-row xl:items-stretch gap-4">

        {/* LEFT: Table */}
        {visibleSections >= 2 && (
          <section className="rounded border bg-card shadow-sm xl:flex-1 min-w-0 animate-card-fade-in">
            <div className="flex items-start justify-between px-5 pt-5 pb-0">
              <div className="mb-4">
                <h3 className="text-sm font-bold">Marketplace Summary</h3>
                <p className="text-[10px] text-muted-foreground leading-relaxed mt-0.5">{kpiContext}</p>
                <p className="text-[10px] text-muted-foreground/60 italic">Select a row to view detailed trends</p>
              </div>
            </div>

            <div className="px-5 pb-5">
              <table className="w-full text-xs border-collapse table-fixed">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pl-4 pr-2 text-[10px] text-muted-foreground uppercase tracking-wider font-medium w-[22%]">Region</th>
                    <th className="text-right py-2 px-2 text-[10px] text-muted-foreground uppercase tracking-wider font-medium w-[12%]">Actual</th>
                    <th className="text-right py-2 px-2 text-[10px] text-muted-foreground uppercase tracking-wider font-medium w-[12%]">YoY</th>
                    <th className="text-right py-2 px-2 text-[10px] text-muted-foreground uppercase tracking-wider font-medium w-[12%]">QoQ</th>
                    <th className="text-right py-2 px-2 text-[10px] text-muted-foreground uppercase tracking-wider font-medium w-[12%]">MoM</th>
                    <th className="text-left py-2 pl-4 text-[10px] text-muted-foreground uppercase tracking-wider font-medium w-[30%]">Size</th>
                  </tr>
                </thead>
                <tbody>
                  {data.table.map((r) => {
                    const a = lastVal(r.actual);
                    const yoy = lastVal(r.yoy);
                    const qoq = lastVal(r.qoq);
                    const mom = lastVal(r.mom);
                    const allNull = r.actual.every((v) => v === null);
                    const barPct = a !== null && maxActual > 0 ? (a / maxActual) * 100 : 0;
                    const isSelected = selectedRegion.label === r.label;
                    return (
                      <tr
                        key={r.label}
                        className={cn(
                          'transition-colors cursor-pointer',
                          r.level === 0 && 'border-b-2 border-foreground/15',
                          'border-b border-border/40',
                          isSelected ? 'shadow-[inset_0_0_0_2px_var(--color-foreground)]' : 'hover:bg-accent/10',
                        )}
                        onClick={() => !allNull && setSelectedRegion(r)}
                      >
                        <td
                          className={cn(
                            'py-1.5 pr-2 whitespace-nowrap',
                            r.level === 0 && 'font-bold text-[13px] pl-4',
                            r.level === 1 && 'font-semibold text-[13px] pl-6',
                            r.level === 2 && 'pl-9',
                            isSelected && 'bg-foreground text-background',
                          )}
                          style={r.level === 1 ? { paddingTop: '10px' } : undefined}
                        >
                          {r.label}
                        </td>
                        <td className="text-right py-1.5 px-2 tabular-nums">
                          {a !== null ? formatK(a) : '--'}
                        </td>
                        <td className={cn('text-right py-1.5 px-2 tabular-nums', pctColor(yoy))}>
                          {fmtPct(yoy)}
                        </td>
                        <td className={cn('text-right py-1.5 px-2 tabular-nums', pctColor(qoq))}>
                          {fmtPct(qoq)}
                        </td>
                        <td className={cn('text-right py-1.5 px-2 tabular-nums', pctColor(mom))}>
                          {fmtPct(mom)}
                        </td>
                        <td className="py-1.5 pl-4 pr-2">
                          {a !== null ? (
                            <div className="relative flex items-center">
                              <div className="absolute left-0 top-0 bottom-0 w-px bg-foreground/30" />
                              <div className="h-4 bg-foreground ml-px" style={{ width: `${Math.max(barPct, 0.5)}%` }} />
                            </div>
                          ) : null}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* RIGHT: 4 Chart Cards driven by selected row */}
        {visibleSections >= 3 && (
          <div className="xl:flex-1 min-w-0 grid grid-cols-2 grid-rows-2 gap-3">
            <div className="rounded border bg-card p-4 shadow-sm flex flex-col animate-card-fade-in" style={{ animationDelay: '0ms' }}>
              <p className="text-sm font-bold">Buyer Actuals</p>
              <p className="text-[10px] text-muted-foreground mb-2">{chartContext}</p>
              <LineChart values={selectedRegion.actual} months={data.months} label="" compact target={priorActual} targetLabel="Prior Yr" />
            </div>
            <div className="rounded border bg-card p-4 shadow-sm flex flex-col animate-card-fade-in" style={{ animationDelay: '150ms' }}>
              <p className="text-sm font-bold">Year-over-Year %</p>
              <p className="text-[10px] text-muted-foreground mb-2">{chartContext}</p>
              <LineChart values={selectedRegion.yoy} months={data.months} label="" compact target={0} targetLabel="" />
            </div>
            <div className="rounded border bg-card p-4 shadow-sm flex flex-col animate-card-fade-in" style={{ animationDelay: '300ms' }}>
              <p className="text-sm font-bold">Month-over-Month %</p>
              <p className="text-[10px] text-muted-foreground mb-2">{chartContext}</p>
              <LineChart values={selectedRegion.mom} months={data.months} label="" compact target={0} targetLabel="" />
            </div>
            <div className="rounded border bg-card p-4 shadow-sm flex flex-col animate-card-fade-in" style={{ animationDelay: '450ms' }}>
              <p className="text-sm font-bold">Quarter-over-Quarter %</p>
              <p className="text-[10px] text-muted-foreground mb-2">{chartContext}</p>
              <LineChart values={selectedRegion.qoq} months={data.months} label="" compact target={0} targetLabel="" />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
