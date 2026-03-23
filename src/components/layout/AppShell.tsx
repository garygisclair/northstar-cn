import { useState, useEffect, useCallback } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { AppSidebar } from '@/components/app-sidebar';
import { StatusBar } from './StatusBar';
import { RightPanel, type RightPanelContent, type KpiFilters, DEFAULT_FILTERS, type VocFilters, DEFAULT_VOC_FILTERS } from './RightPanel';
import { FavoritesProvider, useFavorites } from '@/stores/favorites';
import { getPage } from '@/data/pages';
import { SlideshowProvider, useSlideshowContext } from '@/components/slideshow/SlideshowContext';
import { PagesProvider, usePages } from '@/stores/pages';
import { SlideshowFab } from '@/components/slideshow/SlideshowFab';
import { SlideshowProgressBar } from '@/components/slideshow/SlideshowProgressBar';
import { FileTextIcon, SearchIcon, BookmarkIcon, BellIcon, MegaphoneIcon, BookOpenIcon, ArrowLeftIcon, ArrowRightIcon, MaximizeIcon, MinimizeIcon, BotIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { SidebarView } from '@/components/app-sidebar';

/** Derive breadcrumb from current route */
function useBreadcrumbs() {
  const location = useLocation();
  const path = location.pathname;

  if (path === '/' || path === '') {
    return [{ label: 'Home' }];
  }
  if (path === '/new-tab') {
    return [{ label: 'New tab' }];
  }
  if (path === '/alerts') {
    return [{ label: 'Home', href: '#/' }, { label: 'Alerts' }];
  }
  const alertsMatch = path.match(/^\/alerts\/(.+)$/);
  if (alertsMatch) {
    const names: Record<string, string> = { announcements: 'Announcements', articles: 'Articles' };
    return [
      { label: 'Home', href: '#/' },
      { label: 'Alerts', href: '#/alerts' },
      { label: names[alertsMatch[1]] ?? alertsMatch[1] },
    ];
  }
  const match = path.match(/^\/p\/([^/]+)\/?(.*)$/);
  if (match) {
    const page = getPage(match[1]);
    const crumbs: { label: string; href?: string }[] = [
      { label: 'Home', href: '#/' },
      { label: page?.title ?? match[1] },
    ];
    if (match[2]) {
      const tab = page?.tabs.find(t => t.id === match[2]);
      crumbs[crumbs.length - 1].href = `#/p/${match[1]}`;
      crumbs.push({ label: tab?.label ?? match[2] });
    }
    return crumbs;
  }
  return [{ label: 'Home', href: '#/' }];
}

/** Only show FAB when saved sidebar is active or slideshow is playing */
function SlideshowFabGuard({ savedView }: { savedView: boolean }) {
  const { state } = useSlideshowContext();
  if (!savedView && !state.playing) return null;
  return <SlideshowFab />;
}

/** Syncs saved/favorite pages into the slideshow context */
function SlideshowSync() {
  const { favorites } = useFavorites();
  const { pages } = usePages();
  const { setSlidePages } = useSlideshowContext();
  useEffect(() => {
    const saved = pages.filter(p => favorites.has(p.id));
    setSlidePages(saved);
  }, [favorites, pages, setSlidePages]);
  return null;
}

export function AppShell() {
  const [sidebarView, setSidebarView] = useState<SidebarView>('main');
  const [rightPanel, setRightPanel] = useState<RightPanelContent | null>(null);
  const [demoTriggered, setDemoTriggered] = useState(false);
  const [kpiFilters, setKpiFilters] = useState<KpiFilters>(DEFAULT_FILTERS);
  const [vocFilters, setVocFilters] = useState<VocFilters>(DEFAULT_VOC_FILTERS);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Apply dark mode from localStorage on mount
  useEffect(() => {
    const dark = localStorage.getItem('theme') === 'dark';
    document.documentElement.classList.toggle('dark', dark);
  }, []);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  }, []);

  const toggleRightPanel = useCallback((content: RightPanelContent) => {
    setRightPanel(prev => (prev === content ? null : content));
  }, []);

  const breadcrumbs = useBreadcrumbs();

  const navigate = useNavigate();

  return (
    <PagesProvider>
    <FavoritesProvider>
    <SlideshowProvider>
    <TooltipProvider>
      <SlideshowSync />
      <SlideshowProgressBar />
      <div className="flex h-svh flex-col">
      <SidebarProvider className="flex-1 min-h-0 flex flex-col" style={{ '--sidebar-top': '2.25rem' } as React.CSSProperties}>
        {/* Top bar — spans full width above sidebar + content */}
        <div className="flex h-9 shrink-0 border-b border-border bg-background z-20">
          {/* Icons — matches sidebar width */}
          <div className="flex shrink-0 items-center gap-1 px-2 lg:w-(--sidebar-width) group-data-[collapsible=icon]/sidebar-wrapper:lg:w-(--sidebar-width-icon)">
            <SidebarTrigger className="h-6 w-6 text-muted-foreground hover:text-foreground" />
            <Tooltip>
              <TooltipTrigger
                render={<button onClick={() => { navigate('/'); setSidebarView('main'); }} className={`flex h-6 w-6 items-center justify-center rounded transition-colors ${sidebarView === 'main' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`} />}
              >
                <FileTextIcon className="h-3.5 w-3.5" />
              </TooltipTrigger>
              <TooltipContent side="bottom">Home</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger
                render={<button className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:text-foreground transition-colors" />}
              >
                <SearchIcon className="h-3.5 w-3.5" />
              </TooltipTrigger>
              <TooltipContent side="bottom">Search</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger
                render={<button
                  onClick={() => setSidebarView(v => v === 'saved' ? 'main' : 'saved')}
                  className={`flex h-6 w-6 items-center justify-center rounded transition-colors ${sidebarView === 'saved' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                />}
              >
                <BookmarkIcon className={`h-3.5 w-3.5 ${sidebarView === 'saved' ? 'fill-current' : ''}`} />
              </TooltipTrigger>
              <TooltipContent side="bottom">Saved</TooltipContent>
            </Tooltip>
          </div>

          {/* Navigation + breadcrumb — fills remaining width */}
          <div className="flex flex-1 items-center px-2 gap-1">
            {breadcrumbs.length > 1 && (
              <>
                <button
                  className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground/50 cursor-default"
                >
                  <ArrowLeftIcon className="h-3.5 w-3.5" />
                </button>
                <button
                  className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground/50 cursor-default"
                >
                  <ArrowRightIcon className="h-3.5 w-3.5" />
                </button>
                <Breadcrumb>
                    <BreadcrumbList>
                      {breadcrumbs.map((crumb, i) => {
                        const isLast = i === breadcrumbs.length - 1;
                        return (
                          <span key={i} className="contents">
                            {i > 0 && <BreadcrumbSeparator />}
                            <BreadcrumbItem>
                              {isLast ? (
                                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                              ) : (
                                <BreadcrumbLink href={crumb.href}>
                                  {crumb.label}
                                </BreadcrumbLink>
                              )}
                            </BreadcrumbItem>
                          </span>
                        );
                      })}
                    </BreadcrumbList>
                </Breadcrumb>
              </>
            )}

            {/* Ask NorthStar + Alerts + fullscreen — right side */}
            <div className="ml-auto flex items-center gap-1">
              <button
                onClick={() => toggleRightPanel('ask')}
                className="flex h-6 items-center gap-1 rounded px-1.5 text-xs bg-gradient-to-r from-purple-400 via-blue-400 to-rose-400 bg-clip-text text-transparent font-medium hover:opacity-80 transition-opacity"
              >
                <BotIcon className="h-3.5 w-3.5" style={{ stroke: 'url(#ask-gradient)' }} />
                <svg width="0" height="0" className="absolute">
                  <defs>
                    <linearGradient id="ask-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#c084fc" />
                      <stop offset="50%" stopColor="#60a5fa" />
                      <stop offset="100%" stopColor="#fb7185" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="hidden sm:inline">Ask NorthStar</span>
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger render={
                  <button className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:text-foreground transition-colors" />
                }>
                  <BellIcon className="h-3.5 w-3.5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={4} className="min-w-44">
                  <DropdownMenuItem onClick={() => navigate('/alerts')}>
                    <BellIcon className="h-3.5 w-3.5" />
                    Alerts
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/alerts/announcements')}>
                    <MegaphoneIcon className="h-3.5 w-3.5" />
                    Announcements
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/alerts/articles')}>
                    <BookOpenIcon className="h-3.5 w-3.5" />
                    Articles
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Tooltip>
                <TooltipTrigger
                  render={<button onClick={toggleFullscreen} className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:text-foreground transition-colors" />}
                >
                  {isFullscreen ? <MinimizeIcon className="h-3.5 w-3.5" /> : <MaximizeIcon className="h-3.5 w-3.5" />}
                </TooltipTrigger>
                <TooltipContent side="bottom">{isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Main layout — sidebar + content */}
        <div className="flex flex-1 min-h-0">
        <AppSidebar
          sidebarView={sidebarView}
        />
        <SidebarInset>
          <div className="flex flex-1 h-full overflow-hidden">
            <div className="flex flex-1 flex-col min-w-0">
              {/* Page content */}
              <main className="flex-1 overflow-auto">
                <Outlet context={{ toggleRightPanel, demoTriggered, kpiFilters, vocFilters, rightPanel }} />
              </main>

              <StatusBar />
            </div>

            {/* Right panel — independent */}
            <RightPanel
              content={rightPanel}
              onClose={() => setRightPanel(null)}
              onDemoComplete={() => setDemoTriggered(true)}
              filters={kpiFilters}
              onFilterChange={setKpiFilters}
              vocFilters={vocFilters}
              onVocFilterChange={setVocFilters}
            />
          </div>
        </SidebarInset>
        </div>
      </SidebarProvider>
      </div>
    </TooltipProvider>
    <SlideshowFabGuard savedView={sidebarView === 'saved'} />
    </SlideshowProvider>
    </FavoritesProvider>
    </PagesProvider>
  );
}
