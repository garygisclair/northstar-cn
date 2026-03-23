import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { StatusBar } from './StatusBar';
import { HomePanel } from '@/components/sidebar/HomePanel';
import { BrowsePanel } from '@/components/sidebar/BrowsePanel';
import { AskPanel } from '@/components/panels/AskPanel';
import {
  Home,
  LayoutGrid,
  Bell,
  Sparkles,
  Sun,
  Moon,
  Compass,
} from 'lucide-react';
import type { NavItem } from '@/types';

const NAV_ITEMS: { id: NavItem; icon: typeof Home; label: string }[] = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'browse', icon: LayoutGrid, label: 'Browse' },
  { id: 'alerts', icon: Bell, label: 'Alerts' },
  { id: 'search', icon: Sparkles, label: 'Ask NorthStar' },
];

function SidebarPanelContent({ activeNav }: { activeNav: NavItem }) {
  switch (activeNav) {
    case 'home':
      return <HomePanel />;
    case 'browse':
      return <BrowsePanel />;
    case 'alerts':
      return (
        <div className="px-3 py-4 text-sm text-muted-foreground">
          No alerts at this time.
        </div>
      );
    case 'search':
      return <AskPanel />;
    default:
      return null;
  }
}

export function AppShell() {
  const [activeNav, setActiveNav] = useState<NavItem>('home');
  const [dark, setDark] = useState(() =>
    typeof window !== 'undefined' && localStorage.getItem('theme') === 'dark'
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <TooltipProvider>
      <SidebarProvider>
        {/* Single sidebar — collapses to icon rail */}
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" tooltip="NorthStar">
                  <Compass />
                  <span className="font-semibold">NorthStar</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>

          <SidebarContent>
            {/* Navigation items */}
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {NAV_ITEMS.map(({ id, icon: Icon, label }) => (
                    <SidebarMenuItem key={id}>
                      <SidebarMenuButton
                        tooltip={label}
                        isActive={activeNav === id}
                        onClick={() => setActiveNav(id)}
                      >
                        <Icon />
                        <span>{label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarSeparator />

            {/* Active panel content — only visible when expanded */}
            <SidebarGroup className="group-data-[collapsible=icon]:hidden">
              <SidebarGroupLabel>
                {NAV_ITEMS.find(n => n.id === activeNav)?.label ?? 'Content'}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarPanelContent activeNav={activeNav} />
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip={dark ? 'Light mode' : 'Dark mode'}
                  onClick={() => setDark(d => !d)}
                >
                  {dark ? <Sun /> : <Moon />}
                  <span>{dark ? 'Light mode' : 'Dark mode'}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>

          <SidebarRail />
        </Sidebar>

        {/* Main content */}
        <SidebarInset>
          <div className="flex flex-1 flex-col h-full">
            <main className="flex-1 overflow-auto">
              <Outlet context={{ activeNav, setActiveNav }} />
            </main>
            <StatusBar />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
