import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { PAGES } from '@/data/pages';
import type { NavItem } from '@/types';

import {
  Home,
  LayoutGrid,
  Bell,
} from 'lucide-react';

interface NavSection {
  id: NavItem;
  label: string;
  icon: typeof Home;
  items: { id: string; title: string; url: string }[];
}

function buildNavSections(): NavSection[] {
  const favorites = PAGES.filter(p => p.tags.includes('curated')).slice(0, 6);
  const allCurated = PAGES.filter(p => p.tags.includes('curated'));

  return [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      items: favorites.map(p => ({
        id: p.id,
        title: p.title,
        url: `/p/${p.id}`,
      })),
    },
    {
      id: 'browse',
      label: 'Browse',
      icon: LayoutGrid,
      items: [
        { id: 'all', title: 'All Pages', url: '/browse' },
        ...allCurated.map(p => ({
          id: p.id,
          title: p.title,
          url: `/p/${p.id}`,
        })),
      ],
    },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: Bell,
      items: [],
    },
  ];
}

export function NavMain() {
  const navigate = useNavigate();
  const location = useLocation();
  const sections = buildNavSections();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {sections.map(section => (
          <Collapsible
            key={section.id}
            defaultOpen={section.id === 'home'}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger className="w-full">
                <SidebarMenuButton
                  tooltip={section.label}
                  isActive={
                    section.id === 'home'
                      ? location.pathname === '/'
                      : false
                  }
                  onClick={() => {
                    if (section.id === 'home') navigate('/');
                    else if (section.id === 'browse') navigate('/browse');
                  }}
                >
                  <section.icon />
                  <span>{section.label}</span>
                  {section.items.length > 0 && (
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[open]/collapsible:rotate-90" />
                  )}
                </SidebarMenuButton>
              </CollapsibleTrigger>

              {section.items.length > 0 && (
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {section.items.map(item => (
                      <SidebarMenuSubItem key={item.id}>
                        <SidebarMenuSubButton
                          isActive={location.pathname === item.url}
                          onClick={() => navigate(item.url)}
                        >
                          <span>{item.title}</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              )}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
