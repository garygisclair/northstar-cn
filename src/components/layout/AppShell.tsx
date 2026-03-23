import { useState, useEffect, useCallback } from 'react';
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
import { RightPanel, type RightPanelContent } from './RightPanel';
import { HomePanel } from '@/components/sidebar/HomePanel';
import { BrowsePanel } from '@/components/sidebar/BrowsePanel';
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

/** Left sidebar nav items — navigation only */
const NAV_ITEMS: { id: NavItem; icon: typeof Home; label: string }[] = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'browse', icon: LayoutGrid, label: 'Browse' },
  { id: 'alerts', icon: Bell, label: 'Alerts' },
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
    default:
      return null;
  }
}

export function AppShell() {
  const [activeNav, setActiveNav] = useState<NavItem>('home');
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

  return (
    <TooltipProvider>
      <SidebarProvider>
        {/* Left sidebar — navigation, collapses to icon rail */}
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
            </SidebarMenu>
          </SidebarFooter>

          <SidebarRail />
        </Sidebar>

        {/* Main content + right panel */}
        <SidebarInset>
          <div className="flex flex-1 h-full overflow-hidden">
            {/* Center: page canvas */}
            <div className="flex flex-1 flex-col min-w-0">
              <main className="flex-1 overflow-auto">
                <Outlet context={{ activeNav, setActiveNav, toggleRightPanel }} />
              </main>
              <StatusBar />
            </div>

            {/* Right panel — independent, slides in from right */}
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
