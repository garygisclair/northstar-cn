import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CardRenderer } from './CardRenderer';
import type { Card } from '@/types';

interface PageCanvasProps {
  cards: Card[];
  columns?: number;
}

export function PageCanvas({ cards, columns = 3 }: PageCanvasProps) {
  if (cards.length === 0) {
    return (
      <div className="p-6">
        <div className="rounded border-2 border-dashed border-border p-8 flex flex-col items-center justify-center gap-2 min-h-[160px] text-muted-foreground hover:border-foreground/30 hover:text-foreground transition-colors cursor-pointer">
          <Plus className="h-6 w-6" />
          <span className="text-sm font-medium">Add Card</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'grid gap-4 p-4',
        columns === 4
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      )}
    >
      {cards.map(card => (
        <div
          key={card.id}
          className={cn(
            card.layout.colSpan > 1 && `sm:col-span-${Math.min(card.layout.colSpan, 2)} lg:col-span-${card.layout.colSpan}`,
            card.layout.rowSpan > 1 && `row-span-${card.layout.rowSpan}`
          )}
          style={{
            gridColumn: card.layout.colSpan > 1 ? `span ${card.layout.colSpan}` : undefined,
            gridRow: card.layout.rowSpan > 1 ? `span ${card.layout.rowSpan}` : undefined,
          }}
        >
          <CardRenderer card={card} />
        </div>
      ))}
    </div>
  );
}
