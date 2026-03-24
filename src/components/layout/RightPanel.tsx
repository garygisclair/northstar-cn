import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AskPanel } from '@/components/panels/AskPanel';
import { FiltersPanel } from '@/components/panels/FiltersPanel';
import { VocFiltersPanel } from '@/components/panels/VocFiltersPanel';
import { BuyerFiltersPanel, type BuyerFilters } from '@/components/panels/BuyerFiltersPanel';
import { useIsMobile } from '@/hooks/use-mobile';

export type RightPanelContent = 'ask' | 'card-config' | 'sla-details' | 'filters' | 'voc-filters' | 'buyer-filters';
export type { BuyerFilters };
export { DEFAULT_BUYER_FILTERS } from '@/components/panels/BuyerFiltersPanel';

export interface KpiFilters {
  timeframe: string;
  platform: string;
  region: string;
}

export interface VocFilters {
  region: string;
  surveyGroup: string;
  score: string;
}

export const DEFAULT_VOC_FILTERS: VocFilters = {
  region: 'All Regions',
  surveyGroup: 'All',
  score: 'All',
};

export const DEFAULT_FILTERS: KpiFilters = {
  timeframe: 'Weekly',
  platform: 'All Platforms',
  region: 'Marketplace',
};

interface RightPanelProps {
  content: RightPanelContent | null;
  onClose: () => void;
  onDemoComplete?: () => void;
  onBuyerDemoComplete?: () => void;
  filters?: KpiFilters;
  onFilterChange?: (filters: KpiFilters) => void;
  vocFilters?: VocFilters;
  onVocFilterChange?: (filters: VocFilters) => void;
  buyerFilters?: BuyerFilters;
  onBuyerFilterChange?: (filters: BuyerFilters) => void;
  activeBuyerTab?: string;
}

const TITLES: Record<RightPanelContent, string> = {
  ask: 'Ask NorthStar',
  'card-config': 'Card Configuration',
  'sla-details': 'Data Quality',
  filters: 'Filters',
  'voc-filters': 'Filters',
  'buyer-filters': 'Filters',
};

const PANEL_WIDTH: Record<RightPanelContent, string> = {
  ask: 'w-[360px]',
  'card-config': 'w-[360px]',
  'sla-details': 'w-[360px]',
  filters: 'w-[240px]',
  'voc-filters': 'w-[240px]',
  'buyer-filters': 'w-[240px]',
};

function PanelContent({
  content,
  onDemoComplete,
  onBuyerDemoComplete,
  filters,
  onFilterChange,
  vocFilters,
  onVocFilterChange,
  buyerFilters,
  onBuyerFilterChange,
  activeBuyerTab,
}: {
  content: RightPanelContent;
  onDemoComplete?: () => void;
  onBuyerDemoComplete?: () => void;
  filters?: KpiFilters;
  onFilterChange?: (filters: KpiFilters) => void;
  vocFilters?: VocFilters;
  onVocFilterChange?: (filters: VocFilters) => void;
  buyerFilters?: BuyerFilters;
  onBuyerFilterChange?: (filters: BuyerFilters) => void;
  activeBuyerTab?: string;
}) {
  switch (content) {
    case 'ask':
      return <AskPanel onDemoComplete={onDemoComplete} onBuyerDemoComplete={onBuyerDemoComplete} />;
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
    case 'filters':
      return <FiltersPanel filters={filters!} onFilterChange={onFilterChange!} />;
    case 'voc-filters':
      return <VocFiltersPanel filters={vocFilters!} onFilterChange={onVocFilterChange!} />;
    case 'buyer-filters':
      return <BuyerFiltersPanel filters={buyerFilters!} onFilterChange={onBuyerFilterChange!} activeTab={activeBuyerTab} />;
  }
}

export function RightPanel({ content, onClose, onDemoComplete, onBuyerDemoComplete, filters, onFilterChange, vocFilters, onVocFilterChange, buyerFilters, onBuyerFilterChange, activeBuyerTab }: RightPanelProps) {
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
          content ? PANEL_WIDTH[content] : 'w-0'
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
              <PanelContent
                content={content}
                onDemoComplete={onDemoComplete}
                onBuyerDemoComplete={onBuyerDemoComplete}
                filters={filters}
                onFilterChange={onFilterChange}
                vocFilters={vocFilters}
                onVocFilterChange={onVocFilterChange}
                buyerFilters={buyerFilters}
                onBuyerFilterChange={onBuyerFilterChange}
                activeBuyerTab={activeBuyerTab}
              />
            </div>
          </>
        )}
      </aside>
    </>
  );
}
