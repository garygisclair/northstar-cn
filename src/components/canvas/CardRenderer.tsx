import { KpiCard } from './KpiCard';
import type { Card } from '@/types';

interface CardRendererProps {
  card: Card;
}

export function CardRenderer({ card }: CardRendererProps) {
  switch (card.type) {
    case 'kpi':
      return <KpiCard card={card} />;
    case 'bar-chart':
      return <PlaceholderCard card={card} icon="chart" />;
    case 'data-table':
      return <PlaceholderCard card={card} icon="table" />;
    default:
      return <PlaceholderCard card={card} icon="unknown" />;
  }
}

function PlaceholderCard({ card, icon }: { card: Card; icon: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[200px] rounded-lg border border-border bg-card p-4">
      <div className="text-2xl mb-2">{icon === 'chart' ? '\u2593' : icon === 'table' ? '\u2261' : '?'}</div>
      <span className="text-sm font-medium text-card-foreground">{card.title}</span>
      <span className="text-xs text-muted-foreground mt-1 capitalize">{card.type}</span>
    </div>
  );
}
