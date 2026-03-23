import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Card } from '@/types';

// Seeded random for deterministic demo values
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

function formatValue(value: number, config: Record<string, unknown>): string {
  const format = config.format as string;
  const prefix = (config.prefix as string) ?? '';

  if (format === 'currency') {
    if (value >= 1_000_000_000) return `${prefix}${(value / 1_000_000_000).toFixed(1)}B`;
    if (value >= 1_000_000) return `${prefix}${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `${prefix}${(value / 1_000).toFixed(1)}K`;
    return `${prefix}${value.toFixed(0)}`;
  }
  if (format === 'percent') return `${value.toFixed(1)}%`;
  if (format === 'number') {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
    return value.toFixed(0);
  }
  return String(value);
}

interface KpiCardProps {
  card: Card;
}

export function KpiCard({ card }: KpiCardProps) {
  // Generate deterministic values from card id
  const hash = card.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const rng = seededRandom(hash);

  const format = card.config.format as string;
  let value: number;
  if (format === 'currency') value = rng() * 5_000_000_000;
  else if (format === 'percent') value = rng() * 80 + 5;
  else value = rng() * 50_000_000;

  const delta = (rng() - 0.4) * 20; // -8% to +12% range
  const isPositive = delta >= 0;

  // Sparkline data (6 periods)
  const sparkline = Array.from({ length: 6 }, () => rng() * 100);

  const maxSpark = Math.max(...sparkline);
  const minSpark = Math.min(...sparkline);
  const sparkRange = maxSpark - minSpark || 1;

  return (
    <div className="flex flex-col rounded-lg border border-border bg-card p-4 h-full">
      <div className="text-xs text-muted-foreground mb-1">{card.title}</div>
      <div className="text-2xl font-bold text-card-foreground mb-1">
        {(card.config as Record<string, unknown>).value
          ? String((card.config as Record<string, unknown>).value)
          : formatValue(value, card.config)}
      </div>

      {/* Delta */}
      <div className={cn('flex items-center gap-1 text-xs mb-3', isPositive ? 'text-positive' : 'text-negative')}>
        {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        <span>{isPositive ? '+' : ''}{delta.toFixed(1)}%</span>
      </div>

      {/* Sparkline */}
      <div className="flex items-end gap-1 mt-auto h-8">
        {sparkline.map((v, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm bg-data-bar"
            style={{ height: `${((v - minSpark) / sparkRange) * 100}%`, minHeight: 2 }}
          />
        ))}
      </div>
    </div>
  );
}
