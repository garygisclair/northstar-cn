import { useNavigate, useLocation } from 'react-router-dom';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PAGES } from '@/data/pages';

export function HomePanel() {
  const navigate = useNavigate();
  const location = useLocation();

  // Show curated pages as favorites
  const favorites = PAGES.filter(p => p.tags.includes('curated'));

  return (
    <div className="py-2">
      <div className="px-4 pb-2 text-xs font-medium uppercase tracking-wider text-sidebar-foreground">
        Favorites
      </div>
      {favorites.map(page => {
        const isActive = location.pathname === `/p/${page.id}`;
        return (
          <button
            key={page.id}
            onClick={() => navigate(`/p/${page.id}`)}
            className={cn(
              'flex w-full items-center gap-2 px-4 py-2 text-left text-sm transition-colors',
              isActive
                ? 'bg-sidebar-active text-sidebar-active-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-hover hover:text-sidebar-active-foreground'
            )}
          >
            <Star className="h-3.5 w-3.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              {page.category && (
                <span className="text-[10px] uppercase tracking-wider text-sidebar-foreground">
                  {page.category}
                </span>
              )}
              <div className="truncate">{page.title}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
