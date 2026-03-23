import { useParams } from 'react-router-dom';
import { Star, MoreVertical, X } from 'lucide-react';
import { useState } from 'react';
import { getPage } from '@/data/pages';
import { PageCanvas } from '@/components/canvas/PageCanvas';
import { cn } from '@/lib/utils';

interface PageViewProps {
  pageId?: string;
}

export function PageView({ pageId: propPageId }: PageViewProps) {
  const { pageId: paramPageId, tabId: paramTabId } = useParams();
  const id = propPageId ?? paramPageId ?? 'home';

  const page = getPage(id);
  const [activeTabId, setActiveTabId] = useState<string | undefined>(paramTabId);
  const [starred, setStarred] = useState(false);

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
          <button
            onClick={() => setStarred(s => !s)}
            className={cn(
              'p-1.5 rounded transition-colors',
              starred ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
            title={starred ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star className={cn('h-4 w-4', starred && 'fill-current')} />
          </button>
          <button className="p-1.5 rounded text-muted-foreground hover:text-foreground transition-colors">
            <MoreVertical className="h-4 w-4" />
          </button>
          {id !== 'home' && (
            <button
              onClick={() => window.history.back()}
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
              onClick={() => setActiveTabId(tab.id)}
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

      {/* Card canvas */}
      <div className="flex-1 overflow-auto">
        {currentTab ? (
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
