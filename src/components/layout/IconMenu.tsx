import { Home, LayoutGrid, Bell, Sparkles, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NavItem, RightPanelContent } from '@/types';
import { useEffect, useState } from 'react';

interface IconMenuProps {
  activeNav: NavItem;
  onNavChange: (nav: NavItem) => void;
  onToggleLeft: () => void;
  onToggleRight: (content: RightPanelContent) => void;
  rightContent: RightPanelContent;
  isMobile: boolean;
  isBottomBar?: boolean;
}

const NAV_ITEMS: { id: NavItem; icon: typeof Home; label: string }[] = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'browse', icon: LayoutGrid, label: 'Browse' },
  { id: 'alerts', icon: Bell, label: 'Alerts' },
  { id: 'search', icon: Sparkles, label: 'Ask' },
];

export function IconMenu({
  activeNav,
  onNavChange,
  onToggleRight,
  rightContent,
  isMobile,
  isBottomBar,
}: IconMenuProps) {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  // Initialize from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') setDark(true);
    else if (saved === 'light') setDark(false);
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) setDark(true);
  }, []);

  // Bottom bar for mobile
  if (isBottomBar) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-border bg-background py-1">
        {NAV_ITEMS.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => {
              if (id === 'search') {
                onToggleRight('ask');
              } else {
                onNavChange(id);
              }
            }}
            className={cn(
              'flex flex-col items-center gap-0.5 px-3 py-1.5 text-xs transition-colors',
              activeNav === id && id !== 'search'
                ? 'text-foreground'
                : id === 'search' && rightContent === 'ask'
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </button>
        ))}
        <button
          onClick={() => setDark(d => !d)}
          className="flex flex-col items-center gap-0.5 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          <span>Theme</span>
        </button>
      </nav>
    );
  }

  // Don't render left strip on mobile
  if (isMobile) return null;

  // Desktop left icon strip
  return (
    <nav className="flex h-full w-14 flex-shrink-0 flex-col items-center border-r border-border bg-sidebar py-3">
      {NAV_ITEMS.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => {
            if (id === 'search') {
              onToggleRight('ask');
            } else {
              onNavChange(id);
            }
          }}
          title={label}
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-md transition-colors mb-1',
            activeNav === id && id !== 'search'
              ? 'bg-sidebar-active text-sidebar-active-foreground'
              : id === 'search' && rightContent === 'ask'
                ? 'bg-sidebar-active text-sidebar-active-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-hover hover:text-sidebar-active-foreground'
          )}
        >
          <Icon className="h-5 w-5" />
        </button>
      ))}

      <div className="flex-1" />

      <button
        onClick={() => setDark(d => !d)}
        title={dark ? 'Light mode' : 'Dark mode'}
        className="flex h-10 w-10 items-center justify-center rounded-md text-sidebar-foreground hover:bg-sidebar-hover hover:text-sidebar-active-foreground transition-colors"
      >
        {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>
    </nav>
  );
}
