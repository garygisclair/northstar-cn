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
import { RightPanel, type RightPanelContent } from './RightPanel';
import { FavoritesProvider } from '@/stores/favorites';
import { getPage } from '@/data/pages';
import { FileTextIcon, SearchIcon, BookmarkIcon, BellIcon, MegaphoneIcon, BookOpenIcon, ArrowLeftIcon, ArrowRightIcon, MaximizeIcon, MinimizeIcon } from 'lucide-react';
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

export function AppShell() {
  const [sidebarView, setSidebarView] = useState<SidebarView>('main');
  const [rightPanel, setRightPanel] = useState<RightPanelContent | null>(null);
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
    <FavoritesProvider>
    <TooltipProvider>
      <div className="flex h-svh flex-col">
      <SidebarProvider className="flex-1 min-h-0 flex flex-col" style={{ '--sidebar-top': '2.25rem' } as React.CSSProperties}>
        {/* Top bar — spans full width above sidebar + content */}
        <div className="flex h-9 shrink-0 border-b border-border bg-background z-20">
          {/* Icons — matches sidebar width */}
          <div className="flex shrink-0 items-center gap-1 px-2 md:w-(--sidebar-width) group-data-[collapsible=icon]/sidebar-wrapper:md:w-(--sidebar-width-icon)">
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
                  onClick={() => navigate(-1)}
                  className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeftIcon className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => navigate(1)}
                  className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowRightIcon className="h-3.5 w-3.5" />
                </button>
                <div className="flex-1 flex justify-center">
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
                </div>
              </>
            )}

            {/* Alerts + fullscreen — right side */}
            <div className="ml-auto flex items-center gap-1">
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
                <Outlet context={{ toggleRightPanel }} />
              </main>

              <StatusBar />
            </div>

            {/* Right panel — independent */}
            <RightPanel
              content={rightPanel}
              onClose={() => setRightPanel(null)}
            />
          </div>
        </SidebarInset>
        </div>
      </SidebarProvider>
      </div>
    </TooltipProvider>
    </FavoritesProvider>
  );
}
