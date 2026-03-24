import { useParams, useNavigate } from 'react-router-dom';
import { Bookmark, MoreVertical, X, SlidersHorizontal, Ungroup } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { usePages } from '@/stores/pages';
import { PageCanvas } from '@/components/canvas/PageCanvas';
import VerbatimFeedTab from '@/components/reports/VoiceOfCustomer/VerbatimFeedTab';
import SummaryTab from '@/components/reports/BuyerInsights/SummaryTab';
import KeyMetricsTab from '@/components/reports/BuyerInsights/KeyMetricsTab';
import SegmentationTab from '@/components/reports/BuyerInsights/SegmentationTab';
import ActiveBuyersTab from '@/components/reports/BuyerInsights/ActiveBuyersTab';
import ChurnedTab from '@/components/reports/BuyerInsights/ChurnedTab';
import { useFavorites } from '@/stores/favorites';
import { useSlideshowContext } from '@/components/slideshow/SlideshowContext';
import { cn } from '@/lib/utils';

interface PageViewProps {
  pageId?: string;
}

export function PageView({ pageId: propPageId }: PageViewProps) {
  const { pageId: paramPageId, tabId: paramTabId } = useParams();
  const navigate = useNavigate();
  const id = propPageId ?? paramPageId ?? 'home';

  const { toggleRightPanel, vocFilters, buyerFilters, rightPanel, buyerDemoCount, setActiveBuyerTab } = useOutletContext<{
    toggleRightPanel: (content: string) => void;
    vocFilters: { region: string; surveyGroup: string; score: string };
    buyerFilters: { timeframe: string; timeMeasure: string; region: string; format: string };
    rightPanel: string | null;
    buyerDemoCount?: number;
    setActiveBuyerTab?: (tab: string) => void;
  }>();
  const { getPage, ungroupPage } = usePages();
  const page = getPage(id);
  const [activeTabId, setActiveTabId] = useState<string | undefined>(paramTabId);
  const { activeTabOverride } = useSlideshowContext();
  const { toggle, isFavorite } = useFavorites();

  // Sync tab from URL param when navigating via sidebar links
  useEffect(() => {
    if (paramTabId) setActiveTabId(paramTabId);
  }, [paramTabId]);

  // Slideshow tab override
  useEffect(() => {
    if (activeTabOverride) setActiveTabId(activeTabOverride);
  }, [activeTabOverride]);
  const saved = isFavorite(id);

  if (!page) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Page not found: {id}
      </div>
    );
  }

  const currentTab = activeTabId
    ? page.tabs.find(t => t.id === activeTabId) ?? page.tabs[0]
    : page.tabs[0];

  const hasMultipleTabs = page.tabs.length > 1;

  return (
    <div className="flex h-full flex-col animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between border-b border-border px-6 py-3">
        <div>
          <h1 className="text-lg font-semibold">{page.title}</h1>
          {page.subtitle && (
            <p className="text-sm text-muted-foreground">{page.subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasMultipleTabs && (
            <button
              onClick={() => {
                ungroupPage(id);
                navigate('/');
              }}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
              title="Ungroup into separate pages"
            >
              <Ungroup className="h-3.5 w-3.5" />
              <span>Ungroup</span>
            </button>
          )}
          <button
            onClick={() => toggle(id)}
            className={cn(
              'p-1.5 rounded transition-colors',
              saved ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
            title={saved ? 'Remove from Saved' : 'Save page'}
          >
            <Bookmark className={cn('h-4 w-4', saved && 'fill-current')} />
          </button>
          <button className="p-1.5 rounded text-muted-foreground hover:text-foreground transition-colors">
            <MoreVertical className="h-4 w-4" />
          </button>
          {id !== 'home' && (
            <button
              onClick={() => navigate('/')}
              className="p-1.5 rounded text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Tab bar */}
      {hasMultipleTabs && (
        <div className="flex items-center gap-1 border-b border-border px-6 overflow-x-auto">
          {page.tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTabId(tab.id);
                if (id === 'buyers') setActiveBuyerTab?.(tab.id);
              }}
              className={cn(
                'px-3 py-2 text-sm whitespace-nowrap border-b-2 transition-colors',
                currentTab?.id === tab.id
                  ? 'border-foreground text-foreground font-medium'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              {tab.label}
            </button>
          ))}
          {id === 'buyers' && (
            <button
              onClick={() => toggleRightPanel('buyer-filters')}
              className={cn(
                'ml-auto flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer shrink-0',
                rightPanel === 'buyer-filters'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground',
              )}
            >
              <SlidersHorizontal className="h-3 w-3" />
              Filters
            </button>
          )}
        </div>
      )}

      {/* Tab filters */}
      {currentTab?.filters && currentTab.filters.length > 0 && (
        <div className="flex items-center gap-3 border-b border-border px-6 py-2">
          {currentTab.filters.map(filter => (
            <div key={filter.id} className="flex items-center gap-1.5">
              <label className="text-xs text-muted-foreground">{filter.label}</label>
              <select className="text-xs border border-input rounded px-2 py-1 bg-background text-foreground">
                {filter.options.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          ))}
          {page.dataAsOf && (
            <span className="ml-auto text-xs text-muted-foreground flex items-center gap-1">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-positive" />
              Data as of {new Date(page.dataAsOf).toLocaleDateString()}
            </span>
          )}
        </div>
      )}

      {/* Page content */}
      <div className="flex-1 overflow-auto">
        {id === 'buyers' && currentTab?.id === 'summary' ? (
          <SummaryTab
            key={`summary-demo-${buyerDemoCount ?? 0}`}
            demoMode={(buyerDemoCount ?? 0) > 0}
            timeframe={buyerFilters.timeframe}
          />
        ) : id === 'buyers' && currentTab?.id === 'key-metrics' ? (
          <KeyMetricsTab
            timeMeasure={buyerFilters.timeMeasure}
            region={buyerFilters.region}
            format={buyerFilters.format}
          />
        ) : id === 'buyers' && currentTab?.id === 'segmentation' ? (
          <SegmentationTab
            region={buyerFilters.region}
            timeframe={buyerFilters.timeframe}
          />
        ) : id === 'buyers' && currentTab?.id === 'active-buyers' ? (
          <ActiveBuyersTab
            region={buyerFilters.region}
            timeframe={buyerFilters.timeframe}
          />
        ) : id === 'buyers' && currentTab?.id === 'churned' ? (
          <ChurnedTab
            region={buyerFilters.region}
            timeframe={buyerFilters.timeframe}
          />
        ) : id === 'cust-feedback' ? (
          <div className="p-6">
            <div className="flex items-center mb-5">
              <span className="text-xs text-muted-foreground">Customer verbatim feedback and satisfaction scores across all survey channels. Use filters to drill into specific regions, survey groups, or sentiment levels.</span>
              <div className="flex-1" />
              <button
                onClick={() => toggleRightPanel('voc-filters')}
                className={cn(
                  'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer shrink-0',
                  rightPanel === 'voc-filters'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                )}
              >
                <SlidersHorizontal className="h-3 w-3" />
                Filters
              </button>
            </div>
            <VerbatimFeedTab region={vocFilters.region} surveyGroup={vocFilters.surveyGroup} score={vocFilters.score} />
          </div>
        ) : currentTab ? (
          <PageCanvas
            cards={currentTab.cards}
            columns={id === 'home' ? 3 : 4}
          />
        ) : (
          <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
            Select a tab to view content.
          </div>
        )}
      </div>
    </div>
  );
}
