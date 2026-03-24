import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import LineChart from './LineChart';
import { getKeyMetricsData, TIMEFRAME_WINDOWS, WINDOW_LABELS, TREND_MONTHS, type MetricRow } from './mockData';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatK(v: number | null): string {
  if (v === null) return '--';
  if (v >= 1000) return `${(v / 1000).toFixed(1)}m`;
  return `${v.toFixed(0)}k`;
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

interface KeyMetricsTabProps {
  demoMode?: boolean;
  timeMeasure?: string;
  region?: string;
  format?: string;
}

export default function KeyMetricsTab({ demoMode = false, timeMeasure = 'Calendar', region = 'On-Platform', format = 'YoY' }: KeyMetricsTabProps) {

  const data = getKeyMetricsData(timeMeasure, region);
  const [selectedMetric, setSelectedMetric] = useState<MetricRow>(data[0]);

  // Staggered reveal: 2 sections
  const [visibleSections, setVisibleSections] = useState<number>(demoMode ? 0 : 2);

  useEffect(() => {
    if (!demoMode) return;
    const timers = [
      setTimeout(() => setVisibleSections(1), 400),   // Table
      setTimeout(() => setVisibleSections(2), 1400),   // Charts
    ];
    return () => timers.forEach(clearTimeout);
  }, [demoMode]);

  const dataAsOf = 'Mar 16, 2026';
  const chartContext = `${dataAsOf} · ${timeMeasure} · ${region}`;

  return (
    <div className="p-6 space-y-4">
      {/* ── TABLE ──────────────────────────────────────── */}
      {visibleSections >= 1 && (
        <section className="rounded border bg-card shadow-sm animate-card-fade-in">
          <div className="flex items-start justify-between px-5 pt-5 pb-0">
            <div className="mb-4">
              <h3 className="text-sm font-bold">Key Buyer Metrics — {region}</h3>
              <p className="text-[10px] text-muted-foreground leading-relaxed mt-0.5">{dataAsOf} · {timeMeasure} · {region}</p>
              <p className="text-[10px] text-muted-foreground/60 italic">Select a metric to view trends below</p>
            </div>
          </div>

          <div className="px-5 pb-5 overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                {/* Top header: timeframe group labels */}
                <tr className="border-b border-border/50">
                  <th className="text-left py-2 pl-4 pr-2 text-[10px] text-muted-foreground uppercase tracking-wider font-medium" rowSpan={2}>Metrics</th>
                  {TIMEFRAME_WINDOWS.map((tw) => (
                    <th key={tw} colSpan={2} className="text-center py-1.5 px-2 text-[10px] text-muted-foreground uppercase tracking-wider font-medium border-l border-border/30">
                      {WINDOW_LABELS[tw]}
                    </th>
                  ))}
                </tr>
                {/* Sub header: Actual / YoY per group */}
                <tr className="border-b border-border">
                  {TIMEFRAME_WINDOWS.map((tw) => (
                    <th key={`${tw}-a`} className="text-right py-1.5 px-2 text-[10px] text-muted-foreground uppercase tracking-wider font-medium border-l border-border/30 w-[9%]">Actual</th>
                  )).flatMap((el, i) => [
                    el,
                    <th key={`${TIMEFRAME_WINDOWS[i]}-y`} className="text-right py-1.5 px-2 text-[10px] text-muted-foreground uppercase tracking-wider font-medium w-[9%]">YoY</th>,
                  ])}
                </tr>
              </thead>
              <tbody>
                {data.map((m, rowIdx) => {
                  const isSelected = selectedMetric.id === m.id;
                  const allNull = Object.values(m.windows).every((w) => w.actual === null);

                  return (
                    <tr
                      key={m.id}
                      className={cn(
                        'transition-colors cursor-pointer border-b border-border/40',
                        isSelected ? 'shadow-[inset_0_0_0_2px_var(--color-foreground)]' : 'hover:bg-accent/10',
                        rowIdx % 2 === 1 && !isSelected && 'bg-accent/5',
                      )}
                      onClick={() => !allNull && setSelectedMetric(m)}
                    >
                      <td className={cn(
                        'py-2 pl-4 pr-2 whitespace-nowrap font-medium',
                        isSelected && 'bg-foreground text-background',
                      )}>
                        {m.label}
                      </td>
                      {TIMEFRAME_WINDOWS.map((tw) => {
                        const w = m.windows[tw];
                        return [
                          <td key={`${tw}-a`} className="text-right py-2 px-2 tabular-nums border-l border-border/30">
                            {formatK(w.actual)}
                          </td>,
                          <td key={`${tw}-y`} className={cn('text-right py-2 px-2 tabular-nums', pctColor(w.yoy))}>
                            {fmtPct(w.yoy)}
                          </td>,
                        ];
                      }).flat()}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ── 4 CHARTS — one per timeframe window ───────── */}
      {visibleSections >= 2 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          {TIMEFRAME_WINDOWS.map((tw, i) => {
            const w = selectedMetric.windows[tw];
            const isYoY = format === 'YoY';
            const chartValues = isYoY ? w.yoyTrend : w.actualTrend;
            const target = isYoY ? 0 : null;
            const priorActual = w.actual !== null && w.yoy !== null ? w.actual / (1 + w.yoy / 100) : null;

            return (
              <div
                key={tw}
                className="rounded border bg-card p-4 shadow-sm flex flex-col animate-card-fade-in"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <p className="text-sm font-bold">{WINDOW_LABELS[tw]}</p>
                <p className="text-[10px] text-muted-foreground mb-2">{chartContext} · {selectedMetric.label} · {format}</p>
                <LineChart
                  values={chartValues}
                  months={TREND_MONTHS}
                  label=""
                  compact
                  target={isYoY ? target : priorActual}
                  targetLabel={isYoY ? '' : 'Prior Yr'}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
