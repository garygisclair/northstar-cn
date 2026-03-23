import { useNavigate, useLocation } from 'react-router-dom';
import { FileText, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PAGES } from '@/data/pages';

export function BrowsePanel() {
  const navigate = useNavigate();
  const location = useLocation();

  const curated = PAGES.filter(p => p.tags.includes('curated'));
  const certified = PAGES.filter(p => p.tags.includes('certified'));
  const mine = PAGES.filter(p => p.tags.includes('mine'));

  return (
    <div className="py-2">
      <Section
        title="Curated"
        count={curated.length}
        pages={curated}
        navigate={navigate}
        currentPath={location.pathname}
      />
      <Section
        title="Certified"
        count={certified.length}
        pages={certified}
        navigate={navigate}
        currentPath={location.pathname}
      />
      <Section
        title="My Pages"
        count={mine.length}
        pages={mine}
        navigate={navigate}
        currentPath={location.pathname}
      />
    </div>
  );
}

function Section({
  title,
  count,
  pages,
  navigate,
  currentPath,
}: {
  title: string;
  count: number;
  pages: typeof PAGES;
  navigate: ReturnType<typeof useNavigate>;
  currentPath: string;
}) {
  return (
    <div className="mb-2">
      <button
        onClick={() => navigate('/browse')}
        className="flex w-full items-center justify-between px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-sidebar-foreground hover:text-sidebar-active-foreground"
      >
        <span>{title}</span>
        <span className="flex items-center gap-1">
          <span className="text-[10px]">{count}</span>
          <ChevronRight className="h-3 w-3" />
        </span>
      </button>
      {pages.map(page => {
        const isActive = currentPath === `/p/${page.id}`;
        return (
          <button
            key={page.id}
            onClick={() => navigate(`/p/${page.id}`)}
            className={cn(
              'flex w-full items-center gap-2 px-6 py-1.5 text-left text-sm transition-colors',
              isActive
                ? 'bg-sidebar-active text-sidebar-active-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-hover hover:text-sidebar-active-foreground'
            )}
          >
            <FileText className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="truncate">{page.title}</span>
          </button>
        );
      })}
    </div>
  );
}
