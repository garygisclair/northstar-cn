import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import { getActiveBuyersData, type Dimension } from './mockData';

// ─── Constants ────────────────────────────────────────────────────────────────

const DIMENSION_LABELS: Record<Dimension, string> = {
  'device': 'Device / Experience',
  'traffic': 'Customer Traffic Source',
  'vertical': 'Vertical',
  'buyer-type': 'Buyer Type',
  'price': 'Price Tranche',
};

const DIMENSIONS: Dimension[] = ['device', 'traffic', 'vertical', 'buyer-type', 'price'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatM(v: number): string {
  if (v >= 1000) return `${(v / 1000).toFixed(1)}b`;
  return `${v.toFixed(1)}m`;
}

function fmtPct(v: number): string {
  return `${v > 0 ? '+' : ''}${v.toFixed(1)}%`;
}

function pctColor(v: number): string {
  if (v === 0) return 'text-muted-foreground';
  return v < 0 ? 'text-negative' : 'text-positive';
}

function yoyBarColor(yoy: number): string {
  if (yoy <= -5) return '#ef4444';
  if (yoy < -1) return '#f87171';
  if (yoy <= 1) return '#d4d4d8';
  if (yoy <= 5) return '#86efac';
  return '#22c55e';
}

function ShareBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="relative flex items-center h-4">
      <div className="absolute left-0 top-0 bottom-0 w-px bg-foreground/30" />
      <div
        className="h-4 ml-px bg-foreground"
        style={{ width: `${Math.max(pct, 0.5)}%` }}
      />
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

interface ActiveBuyersTabProps {
  region?: string;
  timeframe?: string;
}

export default function ActiveBuyersTab({ region = 'On-Platform', timeframe = 'T12M' }: ActiveBuyersTabProps) {
  const [activeDim, setActiveDim] = useState<Dimension>('device');

  const rows = getActiveBuyersData(activeDim, region, timeframe);
  const [expandedParents, setExpandedParents] = useState<Set<string>>(() =>
    new Set(rows.filter((r) => r.level === 0 && r.hasChildren).map((r) => r.id))
  );

  const handleDimChange = (dim: Dimension) => {
    setActiveDim(dim);
    const newRows = getActiveBuyersData(dim, region, timeframe);
    setExpandedParents(new Set(newRows.filter((r) => r.level === 0 && r.hasChildren).map((r) => r.id)));
  };

  const parents = rows.filter((r) => r.level === 0);
  const buyerTotal = parents.reduce((s, r) => s + r.buyerCount, 0);
  const gmbTotal = parents.reduce((s, r) => s + r.gmbCount, 0);
  const buyerYoy = parents.reduce((s, r) => s + r.buyerYoy * (r.buyerCount / buyerTotal), 0);
  const gmbYoy = parents.reduce((s, r) => s + r.gmbYoy * (r.gmbCount / gmbTotal), 0);

  const maxBuyerShare = Math.max(...rows.map((r) => r.buyerShare));
  const maxGmbShare = Math.max(...rows.map((r) => r.gmbShare));
  const maxAbsYoy = Math.max(...rows.map((r) => Math.abs(r.buyerYoy)), ...rows.map((r) => Math.abs(r.gmbYoy)));

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
      {/* ── DIMENSION PILLS ──────────────────────────── */}
      <div className="flex gap-2 flex-wrap">
        {DIMENSIONS.map((dim) => (
          <button
            key={dim}
            className={cn(
              'px-5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer',
              activeDim === dim
                ? 'bg-foreground text-background'
                : 'bg-card border border-border text-foreground hover:bg-accent/10',
            )}
            onClick={() => handleDimChange(dim)}
          >
            {DIMENSION_LABELS[dim]}
          </button>
        ))}
      </div>

      {/* ── TABLE CARD ───────────────────────────────── */}
      <section className="rounded border bg-card shadow-sm">
        <div className="flex items-start justify-between px-5 pt-5 pb-0">
          <div className="mb-4">
            <h3 className="text-sm font-bold">Active Buyers — {DIMENSION_LABELS[activeDim]}</h3>
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
                <th className="text-left py-2 pl-4 pr-2 text-[10px] text-muted-foreground uppercase tracking-wider font-medium w-[18%]">Category</th>
                <th className="text-right py-2 px-2 text-[10px] text-muted-foreground uppercase tracking-wider font-medium w-[8%] border-l border-border/30">Buyers</th>
                <th className="text-right py-2 px-2 text-[10px] text-muted-foreground uppercase tracking-wider font-medium w-[7%]">Share</th>
                <th className="text-left py-2 pl-4 text-[10px] text-muted-foreground uppercase tracking-wider font-medium w-[17%]">Buyer Share %</th>
                <th className="text-right py-2 px-2 text-[10px] text-muted-foreground uppercase tracking-wider font-medium w-[8%] border-l border-border/30">GMB</th>
                <th className="text-right py-2 px-2 text-[10px] text-muted-foreground uppercase tracking-wider font-medium w-[7%]">Share</th>
                <th className="text-left py-2 pl-4 text-[10px] text-muted-foreground uppercase tracking-wider font-medium w-[17%]">GMB Share %</th>
                <th className="text-right py-2 px-2 text-[10px] text-muted-foreground uppercase tracking-wider font-medium w-[6%] border-l border-border/30">Buyer YoY</th>
                <th className="text-right py-2 px-2 text-[10px] text-muted-foreground uppercase tracking-wider font-medium w-[6%]">GMB YoY</th>
                <th className="text-left py-2 pl-3 text-[10px] text-muted-foreground uppercase tracking-wider font-medium w-[6%]">YoY</th>
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
                <td className={cn('text-right py-2 px-2 tabular-nums font-bold border-l border-border/30', pctColor(buyerYoy))}>{fmtPct(buyerYoy)}</td>
                <td className={cn('text-right py-2 px-2 tabular-nums font-bold', pctColor(gmbYoy))}>{fmtPct(gmbYoy)}</td>
                <td className="py-2 pl-3 pr-2">
                  <div className="h-3 w-full flex items-center">
                    <div className="h-3" style={{ width: `${Math.min(Math.abs((buyerYoy + gmbYoy) / 2) / maxAbsYoy * 100, 100)}%`, backgroundColor: yoyBarColor((buyerYoy + gmbYoy) / 2), minWidth: '3px' }} />
                  </div>
                </td>
              </tr>

              {visibleRows.map((r) => {
                const isParent = r.level === 0;
                const isExpanded = expandedParents.has(r.id);
                const avgYoy = (r.buyerYoy + r.gmbYoy) / 2;

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
                    <td className={cn('text-right py-1.5 px-2 tabular-nums border-l border-border/30', pctColor(r.buyerYoy))}>{fmtPct(r.buyerYoy)}</td>
                    <td className={cn('text-right py-1.5 px-2 tabular-nums', pctColor(r.gmbYoy))}>{fmtPct(r.gmbYoy)}</td>
                    <td className="py-1.5 pl-3 pr-2">
                      <div className="h-3 w-full flex items-center">
                        <div className="h-3" style={{ width: `${Math.min(Math.abs(avgYoy) / maxAbsYoy * 100, 100)}%`, backgroundColor: yoyBarColor(avgYoy), minWidth: '3px' }} />
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
