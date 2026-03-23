import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Search } from 'lucide-react';
import { PAGES } from '@/data/pages';
import { cn } from '@/lib/utils';

export function BrowseView() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const browsablePages = PAGES.filter(p => p.tags.includes('curated'));
  const categories = ['All', ...new Set(browsablePages.map(p => p.category).filter(Boolean))];

  const filtered = browsablePages.filter(p => {
    if (categoryFilter !== 'All' && p.category !== categoryFilter) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="flex h-full flex-col animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-6 py-3">
        <div>
          <h1 className="text-lg font-semibold">Browse Pages</h1>
          <p className="text-sm text-muted-foreground">
            {filtered.length} pages
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 border-b border-border px-6 py-2">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search pages..."
            className="w-full rounded border border-input bg-background py-1.5 pl-8 pr-3 text-sm outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="rounded border border-input bg-background px-2 py-1.5 text-sm"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground">
              <th className="px-6 py-2 font-medium w-8"></th>
              <th className="px-2 py-2 font-medium">Title</th>
              <th className="px-2 py-2 font-medium hidden sm:table-cell">Category</th>
              <th className="px-2 py-2 font-medium hidden md:table-cell">Tabs</th>
              <th className="px-2 py-2 font-medium hidden lg:table-cell">Modified</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(page => (
              <tr
                key={page.id}
                onClick={() => navigate(`/p/${page.id}`)}
                className="border-b border-border cursor-pointer hover:bg-accent transition-colors"
              >
                <td className="px-6 py-2.5">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      toggleFavorite(page.id);
                    }}
                    className={cn(
                      'text-muted-foreground hover:text-foreground transition-colors',
                      favorites.has(page.id) && 'text-foreground'
                    )}
                  >
                    <Star className={cn('h-3.5 w-3.5', favorites.has(page.id) && 'fill-current')} />
                  </button>
                </td>
                <td className="px-2 py-2.5 font-medium">{page.title}</td>
                <td className="px-2 py-2.5 text-muted-foreground hidden sm:table-cell">{page.category}</td>
                <td className="px-2 py-2.5 text-muted-foreground hidden md:table-cell">{page.tabs.length}</td>
                <td className="px-2 py-2.5 text-muted-foreground hidden lg:table-cell">{page.dateModified}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
            No pages match your filters.
          </div>
        )}
      </div>
    </div>
  );
}
