import { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { IconMenu } from './IconMenu';
import { LeftSidebar } from './LeftSidebar';
import { RightPanel } from './RightPanel';
import { StatusBar } from './StatusBar';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import type { NavItem, RightPanelContent } from '@/types';

export function AppShell() {
  const [activeNav, setActiveNav] = useState<NavItem>('home');
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightContent, setRightContent] = useState<RightPanelContent>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isMobile = useMediaQuery('(max-width: 767px)');

  const toggleRight = useCallback((content: RightPanelContent) => {
    setRightContent(prev => (prev === content ? null : content));
  }, []);

  const handleNavChange = useCallback((nav: NavItem) => {
    setActiveNav(nav);
    if (!isDesktop) setLeftOpen(true);
  }, [isDesktop]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      {/* Icon Menu — left strip on desktop, bottom bar on mobile */}
      <IconMenu
        activeNav={activeNav}
        onNavChange={handleNavChange}
        onToggleLeft={() => setLeftOpen(o => !o)}
        onToggleRight={toggleRight}
        rightContent={rightContent}
        isMobile={isMobile}
      />

      {/* Left Sidebar — collapsible navigation */}
      {!isMobile && (
        <LeftSidebar
          activeNav={activeNav}
          open={leftOpen}
          onClose={() => setLeftOpen(false)}
          isDesktop={isDesktop}
        />
      )}

      {/* Mobile sidebar overlay */}
      {isMobile && leftOpen && (
        <>
          <div
            className="fixed inset-0 z-30 bg-black/40"
            onClick={() => setLeftOpen(false)}
          />
          <LeftSidebar
            activeNav={activeNav}
            open={leftOpen}
            onClose={() => setLeftOpen(false)}
            isDesktop={false}
          />
        </>
      )}

      {/* Main content area */}
      <div className="flex flex-1 flex-col min-w-0">
        <main className="flex-1 overflow-auto">
          <Outlet context={{ activeNav, setActiveNav }} />
        </main>
        <StatusBar />
      </div>

      {/* Right Panel — on-demand context/tools */}
      <RightPanel
        content={rightContent}
        onClose={() => setRightContent(null)}
        isDesktop={isDesktop}
      />

      {/* Mobile bottom tab bar */}
      {isMobile && (
        <IconMenu
          activeNav={activeNav}
          onNavChange={handleNavChange}
          onToggleLeft={() => setLeftOpen(o => !o)}
          onToggleRight={toggleRight}
          rightContent={rightContent}
          isMobile={true}
          isBottomBar
        />
      )}
    </div>
  );
}
