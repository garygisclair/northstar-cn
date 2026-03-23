import { useState } from 'react';
import { Search, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePages } from '@/stores/pages';

interface GroupPagesModalProps {
  onClose: () => void;
  onGroup: (name: string, pageIds: string[]) => void;
}

export function GroupPagesModal({ onClose, onGroup }: GroupPagesModalProps) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [groupName, setGroupName] = useState('');
  const [step, setStep] = useState<'select' | 'name'>('select');
  const { pages } = usePages();

  // Only show single-tab, non-home pages that can be grouped
  const availablePages = pages.filter(
    (p) => !p.tags.includes('home') && p.tabs.length === 1 && p.title.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCreate = () => {
    if (groupName.trim() && selected.size >= 2) {
      onGroup(groupName.trim(), [...selected]);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="relative z-50 w-full max-w-lg rounded-lg border bg-background shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-6 py-4">
            <div>
              <h2 className="text-lg font-bold">
                {step === 'select' ? 'Group Pages' : 'Name Your Group'}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {step === 'select'
                  ? 'Select 2 or more pages to combine into a grouped page'
                  : 'Choose a name for the new grouped page'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {step === 'select' ? (
            <>
              {/* Search */}
              <div className="px-6 pt-4 pb-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search pages..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    autoFocus
                  />
                </div>
              </div>

              {/* Page list */}
              <div className="px-6 py-2 max-h-[60vh] overflow-y-auto">
                {availablePages.map((page) => {
                  const isSelected = selected.has(page.id);
                  const tabCount = page.tabs.length;
                  return (
                    <button
                      key={page.id}
                      onClick={() => toggle(page.id)}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-md px-3 py-2.5 mb-1 text-left transition-colors cursor-pointer',
                        isSelected ? 'bg-accent' : 'hover:bg-accent/50',
                      )}
                    >
                      <div
                        className={cn(
                          'flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors',
                          isSelected
                            ? 'bg-primary border-primary text-primary-foreground'
                            : 'border-input',
                        )}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{page.title}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {page.category ?? 'Uncategorized'} · {tabCount} {tabCount === 1 ? 'tab' : 'tabs'}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t px-6 py-3">
                <p className="text-xs text-muted-foreground">
                  {selected.size} selected{search && ` · ${availablePages.length} shown`}
                </p>
                <button
                  onClick={() => setStep('name')}
                  disabled={selected.size < 2}
                  className={cn(
                    'rounded-md px-4 py-2 text-sm font-medium transition-colors cursor-pointer',
                    selected.size >= 2
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'bg-muted text-muted-foreground cursor-not-allowed',
                  )}
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Name input */}
              <div className="px-6 py-6 space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-1.5">Group Name</label>
                  <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="e.g., Business Performance"
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCreate();
                    }}
                  />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-2">Pages to group:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {[...selected].map((id) => {
                      const page = pages.find((p) => p.id === id);
                      return (
                        <span
                          key={id}
                          className="inline-flex items-center gap-1 rounded-md bg-accent px-2 py-1 text-xs"
                        >
                          {page?.title ?? id}
                          <button
                            onClick={() => toggle(id)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t px-6 py-3">
                <button
                  onClick={() => setStep('select')}
                  className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!groupName.trim() || selected.size < 2}
                  className={cn(
                    'rounded-md px-4 py-2 text-sm font-medium transition-colors cursor-pointer',
                    groupName.trim() && selected.size >= 2
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'bg-muted text-muted-foreground cursor-not-allowed',
                  )}
                >
                  Create Group
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
