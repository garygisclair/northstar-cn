import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import { getChurnedRows } from './mockData';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatM(v: number): string {
  if (v >= 1000) return `${(v / 1000).toFixed(1)}b`;
  return `${v.toFixed(1)}m`;
}

function fmtPct(v: number): string {
  return `${v > 0 ? '+' : ''}${v.toFixed(1)}%`;
}

// For churn, negative YoY is good (churn declining)
function churnYoyColor(v: number): string {
  if (v === 0) return 'text-muted-foreground';
  return v < 0 ? 'text-positive' : 'text-negative';
}

function yoyBarColor(yoy: number): string {
  // Inverted for churn — negative YoY is good
  if (yoy >= 5) return '#ef4444';
  if (yoy > 1) return '#f87171';
  if (yoy >= -1) return '#d4d4d8';
  if (yoy >= -5) return '#86efac';
  return '#22c55e';
}

function ShareBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="relative flex items-center h-4">
      <div className="absolute left-0 top-0 bottom-0 w-px bg-foreground/30" />
      <div className="h-4 ml-px bg-foreground" style={{ width: `${Math.max(pct, 0.5)}%` }} />
    </div>
  );
}

function KpiCard({ label, value, sublabel }: { label: string; value: string; sublabel?: string }) {
  return (
    <div className="flex-1 min-w-[130px] rounded border bg-card p-4 shadow-sm">
      <p className="text-[11px] text-muted-foreground leading-4">{label}</p>
      <p className="text-xl font-bold tracking-tight mt-1">{value}</p>
      {sublabel && <p className="text-[10px] text-muted-foreground mt-0.5">{sublabel}</p>}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

interface ChurnedTabProps {
  region?: string;
  timeframe?: string;
}

export default function ChurnedTab({ region = 'On-Platform', timeframe = 'T12M' }: ChurnedTabProps) {
  const rows = getChurnedRows(region, timeframe);
  const [expandedParents, setExpandedParents] = useState<Set<string>>(() =>
    new Set(rows.filter((r) => r.level === 0 && r.hasChildren).map((r) => r.id))
  );

  const parents = rows.filter((r) => r.level === 0);
  const buyerTotal = parents.reduce((s, r) => s + r.buyerCount, 0);
  const gmbTotal = parents.reduce((s, r) => s + r.gmbCount, 0);
  const avgChurnRate = parents.reduce((s, r) => s + r.churnRate * (r.buyerCount / buyerTotal), 0);
  const avgChurnRateYoy = parents.reduce((s, r) => s + r.churnRateYoy * (r.buyerCount / buyerTotal), 0);
  const gmbShareOfTotal = 24.8;

  const maxBuyerShare = Math.max(...rows.map((r) => r.buyerShare));
  const maxGmbShare = Math.max(...rows.map((r) => r.gmbShare));
  const maxAbsYoy = Math.max(...rows.map((r) => Math.abs(r.churnRateYoy)), 0.1);

  const toggleExpand = (id: string) => {
    setExpandedParents((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const visibleRows = rows.filter(
    (r) => r.level === 0 || (r.parentId !== null && expandedParents.has(r.parentId))
  );

  const dataAsOf = 'Mar 16, 2026';
  const context = `${dataAsOf} · ${timeframe} · ${region}`;

  return (
    <div className="p-6 space-y-4">
      {/* ── KPI STRIP ────────────────────────────────── */}
      <div className="flex gap-4 flex-wrap">
        <KpiCard label="Churned Buyer Type Last Year" value={formatM(buyerTotal)} />
        <KpiCard label="Churn Rate" value={`${avgChurnRate.toFixed(1)}%`} />
        <KpiCard label="Churn Rate YoY" value={fmtPct(avgChurnRateYoy)} />
        <KpiCard label="Churned GMB" value={formatM(gmbTotal)} />
        <KpiCard label="Churned GMB Share" value={`${gmbShareOfTotal.toFixed(2)}%`} />
      </div>

      {/* ── TABLE CARD ───────────────────────────────── */}
      <section className="rounded border bg-card shadow-sm">
        <div className="flex items-start justify-between px-5 pt-5 pb-0">
          <div className="mb-4">
            <h3 className="text-sm font-bold">Gross Churned Metrics — {region}</h3>
            <p className="text-[10px] text-muted-foreground leading-relaxed mt-0.5">Month End {context}</p>
            {rows.some((r) => r.hasChildren) && (
              <p className="text-[10px] text-muted-foreground/60 italic">Click a segment to expand sub-categories</p>
            )}
          </div>
        </div>

        <div className="px-5 pb-5">
          <table className="w-full text-xs border-collapse table-fixed">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pl-4 pr-2 text-[10px] text-muted-foreground uppercase tracking-wider font-medium w-[16%]">Buyer Type</th>
                <th className="text-right py-2 px-2 text-[10px] text-muted-foreground uppercase tracking-wider font-medium w-[8%] border-l border-border/30">Buyers</th>
                <th className="text-right py-2 px-2 text-[10px] text-muted-foreground uppercase tracking-wider font-medium w-[7%]">Share</th>
                <th className="text-left py-2 pl-4 text-[10px] text-muted-foreground uppercase tracking-wider font-medium w-[14%]">Buyer Share %</th>
                <th className="text-right py-2 px-2 text-[10px] text-muted-foreground uppercase tracking-wider font-medium w-[8%] border-l border-border/30">GMB</th>
                <th className="text-right py-2 px-2 text-[10px] text-muted-foreground uppercase tracking-wider font-medium w-[7%]">Share</th>
                <th className="text-left py-2 pl-4 text-[10px] text-muted-foreground uppercase tracking-wider font-medium w-[14%]">GMB Share %</th>
                <th className="text-right py-2 px-2 text-[10px] text-muted-foreground uppercase tracking-wider font-medium w-[8%] border-l border-border/30">Churn Rate</th>
                <th className="text-right py-2 px-2 text-[10px] text-muted-foreground uppercase tracking-wider font-medium w-[8%]">Rate YoY</th>
                <th className="text-left py-2 pl-3 text-[10px] text-muted-foreground uppercase tracking-wider font-medium w-[10%]">Churn YoY</th>
              </tr>
            </thead>
            <tbody>
              {/* Total row */}
              <tr className="border-b-2 border-foreground/15 bg-accent/5">
                <td className="py-2 pl-4 pr-2 font-bold text-[13px] whitespace-nowrap">Total — {region}</td>
                <td className="text-right py-2 px-2 tabular-nums font-bold border-l border-border/30">{formatM(buyerTotal)}</td>
                <td className="text-right py-2 px-2 tabular-nums text-muted-foreground font-medium">100%</td>
                <td className="py-2 pl-4 pr-2" />
                <td className="text-right py-2 px-2 tabular-nums font-bold border-l border-border/30">{formatM(gmbTotal)}</td>
                <td className="text-right py-2 px-2 tabular-nums text-muted-foreground font-medium">100%</td>
                <td className="py-2 pl-4 pr-2" />
                <td className="text-right py-2 px-2 tabular-nums font-bold border-l border-border/30">{avgChurnRate.toFixed(1)}%</td>
                <td className={cn('text-right py-2 px-2 tabular-nums font-bold', churnYoyColor(avgChurnRateYoy))}>{fmtPct(avgChurnRateYoy)}</td>
                <td className="py-2 pl-3 pr-2">
                  <div className="h-3 w-full flex items-center">
                    <div className="h-3" style={{ width: `${Math.min(Math.abs(avgChurnRateYoy) / maxAbsYoy * 100, 100)}%`, backgroundColor: yoyBarColor(avgChurnRateYoy), minWidth: '3px' }} />
                  </div>
                </td>
              </tr>

              {visibleRows.map((r) => {
                const isParent = r.level === 0;
                const isExpanded = expandedParents.has(r.id);

                return (
                  <tr
                    key={r.id}
                    className={cn(
                      'transition-colors border-b border-border/40',
                      isParent && r.hasChildren && 'cursor-pointer',
                      isParent && isExpanded && r.hasChildren && 'border-b-2 border-foreground/15',
                      !isParent && 'bg-accent/5',
                      isParent && r.hasChildren && 'hover:bg-accent/10',
                    )}
                    onClick={() => isParent && r.hasChildren && toggleExpand(r.id)}
                  >
                    <td className={cn(
                      'py-1.5 pr-2 whitespace-nowrap',
                      isParent ? 'font-bold text-[13px] pl-4' : 'pl-9 text-[12px]',
                    )}>
                      <span className="flex items-center gap-1.5">
                        {isParent && r.hasChildren && (
                          <ChevronRight className={cn(
                            'h-3.5 w-3.5 text-muted-foreground transition-transform',
                            isExpanded && 'rotate-90',
                          )} />
                        )}
                        {r.label}
                      </span>
                    </td>
                    <td className="text-right py-1.5 px-2 tabular-nums border-l border-border/30">{formatM(r.buyerCount)}</td>
                    <td className="text-right py-1.5 px-2 tabular-nums text-muted-foreground">{r.buyerShare.toFixed(1)}%</td>
                    <td className="py-1.5 pl-4 pr-2"><ShareBar value={r.buyerShare} max={maxBuyerShare} /></td>
                    <td className="text-right py-1.5 px-2 tabular-nums border-l border-border/30">{formatM(r.gmbCount)}</td>
                    <td className="text-right py-1.5 px-2 tabular-nums text-muted-foreground">{r.gmbShare.toFixed(1)}%</td>
                    <td className="py-1.5 pl-4 pr-2"><ShareBar value={r.gmbShare} max={maxGmbShare} /></td>
                    <td className="text-right py-1.5 px-2 tabular-nums border-l border-border/30">{r.churnRate.toFixed(1)}%</td>
                    <td className={cn('text-right py-1.5 px-2 tabular-nums', churnYoyColor(r.churnRateYoy))}>{fmtPct(r.churnRateYoy)}</td>
                    <td className="py-1.5 pl-3 pr-2">
                      <div className="h-3 w-full flex items-center">
                        <div className="h-3" style={{ width: `${Math.min(Math.abs(r.churnRateYoy) / maxAbsYoy * 100, 100)}%`, backgroundColor: yoyBarColor(r.churnRateYoy), minWidth: '3px' }} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
