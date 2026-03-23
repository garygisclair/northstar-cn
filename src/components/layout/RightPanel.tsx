import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AskPanel } from '@/components/panels/AskPanel';
import type { RightPanelContent } from '@/types';

interface RightPanelProps {
  content: RightPanelContent;
  onClose: () => void;
  isDesktop: boolean;
}

const TITLES: Record<string, string> = {
  ask: 'Ask NorthStar',
  'card-config': 'Card Configuration',
  'sla-details': 'Data Quality',
};

function PanelContent({ content }: { content: RightPanelContent }) {
  switch (content) {
    case 'ask':
      return <AskPanel />;
    case 'card-config':
      return (
        <div className="p-4 text-sm text-muted-foreground">
          Select a card to configure.
        </div>
      );
    case 'sla-details':
      return (
        <div className="p-4 text-sm text-muted-foreground">
          SLA details will appear here.
        </div>
      );
    default:
      return null;
  }
}

export function RightPanel({ content, onClose, isDesktop }: RightPanelProps) {
  if (!content) return null;

  return (
    <>
      {/* Backdrop on non-desktop */}
      {!isDesktop && (
        <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />
      )}

      <aside
        className={cn(
          'flex h-full flex-col border-l border-border bg-background',
          isDesktop
            ? 'w-[360px] flex-shrink-0'
            : 'fixed right-0 top-0 z-50 w-[360px] max-w-[85vw] shadow-xl'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="text-sm font-semibold">
            {TITLES[content] ?? 'Panel'}
          </span>
          <button
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Panel content */}
        <div className="flex-1 overflow-auto">
          <PanelContent content={content} />
        </div>
      </aside>
    </>
  );
}
