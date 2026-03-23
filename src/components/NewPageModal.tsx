import { useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePages } from '@/stores/pages';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const CATEGORIES = [
  'Business Performance',
  'Customer Experience',
  'Buyers',
  'Traffic & Engagement',
  'Advertising',
  'Cross-Border Trade',
  'Sellers',
];

const TAGS = [
  { value: 'mine' as const, label: 'My Pages' },
  { value: 'curated' as const, label: 'Curated' },
  { value: 'certified' as const, label: 'Certified' },
];

interface NewPageModalProps {
  onClose: () => void;
  onCreated: (pageId: string) => void;
}

export function NewPageModal({ onClose, onCreated }: NewPageModalProps) {
  const { createPage } = usePages();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [tag, setTag] = useState<'curated' | 'certified' | 'mine'>('mine');

  const handleCreate = () => {
    if (!title.trim()) return;
    const id = createPage(title.trim(), category, tag);
    onCreated(id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="relative z-50 w-full max-w-md rounded-lg border bg-background shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-6 py-4">
            <div>
              <h2 className="text-lg font-bold">New Page</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Create an empty page to add cards to later</p>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Form */}
          <div className="px-6 py-5 space-y-4">
            {/* Title */}
            <div>
              <label className="text-sm font-medium block mb-1.5">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Q1 Revenue Analysis"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreate();
                }}
              />
            </div>

            {/* Category */}
            <div>
              <label className="text-sm font-medium block mb-1.5">Category</label>
              <Select value={category} onValueChange={(v) => v && setCategory(v)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tag */}
            <div>
              <label className="text-sm font-medium block mb-1.5">Section</label>
              <div className="flex gap-2">
                {TAGS.map((t) => {
                  const disabled = t.value === 'curated' || t.value === 'certified';
                  return (
                    <button
                      key={t.value}
                      onClick={() => !disabled && setTag(t.value)}
                      disabled={disabled}
                      className={cn(
                        'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                        disabled
                          ? 'bg-muted text-muted-foreground/50 cursor-not-allowed'
                          : tag === t.value
                            ? 'bg-primary text-primary-foreground cursor-pointer'
                            : 'bg-accent text-muted-foreground hover:text-foreground cursor-pointer',
                      )}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">Curated and Certified sections require admin access</p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 border-t px-6 py-3">
            <button
              onClick={onClose}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={!title.trim()}
              className={cn(
                'rounded-md px-4 py-2 text-sm font-medium transition-colors cursor-pointer',
                title.trim()
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'bg-muted text-muted-foreground cursor-not-allowed',
              )}
            >
              Create Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
