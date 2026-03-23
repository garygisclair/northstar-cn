import { Compass } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HomePanel } from '@/components/sidebar/HomePanel';
import { BrowsePanel } from '@/components/sidebar/BrowsePanel';
import type { NavItem } from '@/types';

interface LeftSidebarProps {
  activeNav: NavItem;
  open: boolean;
  onClose: () => void;
  isDesktop: boolean;
}

const TITLES: Record<NavItem, { title: string; subtitle: string }> = {
  home: { title: 'NorthStar', subtitle: 'Analytics Workspace' },
  browse: { title: 'Browse', subtitle: 'All Pages' },
  alerts: { title: 'Alerts', subtitle: 'Notifications' },
  search: { title: 'Search', subtitle: '' },
};

function SidebarContent({ activeNav }: { activeNav: NavItem }) {
  switch (activeNav) {
    case 'home':
      return <HomePanel />;
    case 'browse':
      return <BrowsePanel />;
    case 'alerts':
      return (
        <div className="p-4 text-sm text-muted-foreground">
          No alerts at this time.
        </div>
      );
    default:
      return null;
  }
}

export function LeftSidebar({ activeNav, open, onClose, isDesktop }: LeftSidebarProps) {
  if (!open) return null;

  const { title, subtitle } = TITLES[activeNav];

  return (
    <aside
      className={cn(
        'flex h-full flex-col border-r border-sidebar-border bg-sidebar',
        isDesktop ? 'w-[280px] flex-shrink-0' : 'fixed left-14 top-0 z-40 w-[280px]'
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-sidebar-border px-4 py-3">
        <Compass className="h-5 w-5 text-sidebar-foreground" />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-sidebar-active-foreground truncate">
            {title}
          </div>
          {subtitle && (
            <div className="text-xs text-sidebar-foreground truncate">{subtitle}</div>
          )}
        </div>
        {!isDesktop && (
          <button
            onClick={onClose}
            className="text-sidebar-foreground hover:text-sidebar-active-foreground"
          >
            &times;
          </button>
        )}
      </div>

      {/* Panel content */}
      <div className="flex-1 overflow-auto">
        <SidebarContent activeNav={activeNav} />
      </div>

      {/* Footer */}
      <div className="border-t border-sidebar-border px-4 py-2">
        <span className="text-xs text-sidebar-foreground">Help &amp; Feedback</span>
      </div>
    </aside>
  );
}
