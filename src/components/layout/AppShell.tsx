import { useState, useEffect, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
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
import { getPage } from '@/data/pages';

/** Derive breadcrumb from current route */
function useBreadcrumbs() {
  const location = useLocation();
  const path = location.pathname;

  if (path === '/' || path === '') {
    return [{ label: 'Home' }];
  }
  if (path === '/browse') {
    return [{ label: 'Home', href: '#/' }, { label: 'Browse' }];
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
  const [rightPanel, setRightPanel] = useState<RightPanelContent | null>(null);
  const [dark, setDark] = useState(() =>
    typeof window !== 'undefined' && localStorage.getItem('theme') === 'dark'
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  const toggleRightPanel = useCallback((content: RightPanelContent) => {
    setRightPanel(prev => (prev === content ? null : content));
  }, []);

  const breadcrumbs = useBreadcrumbs();

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar
          rightPanel={rightPanel}
          onToggleRightPanel={toggleRightPanel}
          dark={dark}
          onToggleDark={() => setDark(d => !d)}
        />
        <SidebarInset>
          <div className="flex flex-1 h-full overflow-hidden">
            <div className="flex flex-1 flex-col min-w-0">
              {/* Header — matches sidebar-07 exactly */}
              <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                <div className="flex items-center gap-2 px-4">
                  <SidebarTrigger className="-ml-1" />
                  <Separator orientation="vertical" className="mr-2 h-4" />
                  <Breadcrumb>
                    <BreadcrumbList>
                      {breadcrumbs.map((crumb, i) => {
                        const isLast = i === breadcrumbs.length - 1;
                        return (
                          <span key={i} className="contents">
                            {i > 0 && <BreadcrumbSeparator className="hidden md:block" />}
                            <BreadcrumbItem className={i > 0 ? "hidden md:block" : undefined}>
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
              </header>

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
      </SidebarProvider>
    </TooltipProvider>
  );
}
