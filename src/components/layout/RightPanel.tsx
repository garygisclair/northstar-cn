import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AskPanel } from '@/components/panels/AskPanel';
import { useIsMobile } from '@/hooks/use-mobile';

export type RightPanelContent = 'ask' | 'card-config' | 'sla-details';

interface RightPanelProps {
  content: RightPanelContent | null;
  onClose: () => void;
  onDemoComplete?: () => void;
}

const TITLES: Record<RightPanelContent, string> = {
  ask: 'Ask NorthStar',
  'card-config': 'Card Configuration',
  'sla-details': 'Data Quality',
};

function PanelContent({ content, onDemoComplete }: { content: RightPanelContent; onDemoComplete?: () => void }) {
  switch (content) {
    case 'ask':
      return <AskPanel onDemoComplete={onDemoComplete} />;
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
  }
}

export function RightPanel({ content, onClose, onDemoComplete }: RightPanelProps) {
  const isMobile = useIsMobile();

  return (
    <>
      {/* Mobile backdrop */}
      {content && isMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/50 animate-in fade-in-0"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <aside
        className={cn(
          'border-l border-sidebar-border bg-sidebar text-sidebar-foreground',
          'flex flex-col transition-[width] duration-200 ease-in-out overflow-hidden',
          isMobile && 'fixed right-0 top-0 bottom-0 z-50 shadow-xl',
          content ? 'w-[360px]' : 'w-0'
        )}
      >
        {content && (
          <>
            {/* Header */}
            <div className="flex h-12 items-center justify-between border-b border-sidebar-border px-4 shrink-0">
              <span className="text-sm font-semibold text-sidebar-foreground">
                {TITLES[content]}
              </span>
              <button
                onClick={onClose}
                className="flex size-6 items-center justify-center rounded-md text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              <PanelContent content={content} onDemoComplete={onDemoComplete} />
            </div>
          </>
        )}
      </aside>
    </>
  );
}
