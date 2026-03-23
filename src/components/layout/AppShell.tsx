import { useState, useEffect, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { StatusBar } from './StatusBar';
import { RightPanel, type RightPanelContent } from './RightPanel';
import { NavMain } from '@/components/sidebar/NavMain';
import {
  Sparkles,
  Sun,
  Moon,
  Compass,
  ChevronsUpDown,
  Settings,
  LogOut,
  User,
} from 'lucide-react';
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

  // /p/:pageId or /p/:pageId/:tabId
  const match = path.match(/^\/p\/([^/]+)\/?(.*)$/);
  if (match) {
    const page = getPage(match[1]);
    const crumbs = [
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
        {/* Left sidebar — navigation, collapses to icon rail */}
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" tooltip="NorthStar">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Compass className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">NorthStar</span>
                    <span className="truncate text-xs text-sidebar-foreground">
                      Analytics Workspace
                    </span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>

          <SidebarContent>
            <NavMain />
          </SidebarContent>

          <SidebarFooter>
            <SidebarMenu>
              {/* Ask NorthStar — toggles right panel */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Ask NorthStar"
                  isActive={rightPanel === 'ask'}
                  onClick={() => toggleRightPanel('ask')}
                >
                  <Sparkles />
                  <span>Ask NorthStar</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Theme toggle */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip={dark ? 'Light mode' : 'Dark mode'}
                  onClick={() => setDark(d => !d)}
                >
                  {dark ? <Sun /> : <Moon />}
                  <span>{dark ? 'Light mode' : 'Dark mode'}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* User menu */}
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <SidebarMenuButton
                      size="lg"
                      tooltip="Account"
                    >
                      <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-accent">
                        <User className="size-4" />
                      </div>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">Gary G.</span>
                        <span className="truncate text-xs text-sidebar-foreground">
                          Analytics Team
                        </span>
                      </div>
                      <ChevronsUpDown className="ml-auto size-4" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56"
                    align="end"
                    side="right"
                    sideOffset={4}
                  >
                    <DropdownMenuItem>
                      <Settings className="mr-2 size-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <LogOut className="mr-2 size-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>

          <SidebarRail />
        </Sidebar>

        {/* Main content area */}
        <SidebarInset>
          <div className="flex flex-1 h-full overflow-hidden">
            <div className="flex flex-1 flex-col min-w-0">
              {/* Content header — trigger + breadcrumbs */}
              <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 !h-4" />
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
