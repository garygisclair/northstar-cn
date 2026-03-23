import { useNavigate, useLocation } from 'react-router-dom';
import { FileText } from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { PAGES } from '@/data/pages';

export function BrowsePanel() {
  const navigate = useNavigate();
  const location = useLocation();

  const curated = PAGES.filter(p => p.tags.includes('curated'));

  // Group by category
  const grouped = curated.reduce<Record<string, typeof curated>>((acc, page) => {
    const cat = page.category ?? 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(page);
    return acc;
  }, {});

  return (
    <SidebarMenu>
      {/* Browse all link */}
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={location.pathname === '/browse'}
          onClick={() => navigate('/browse')}
        >
          <FileText className="size-4" />
          <span>All Pages</span>
        </SidebarMenuButton>
      </SidebarMenuItem>

      {/* Grouped by category */}
      {Object.entries(grouped).map(([category, pages]) => (
        <SidebarMenuItem key={category}>
          <SidebarMenuButton className="text-xs font-medium uppercase tracking-wider text-sidebar-foreground/60 pointer-events-none">
            <span>{category}</span>
          </SidebarMenuButton>
          <SidebarMenuSub>
            {pages.map(page => (
              <SidebarMenuSubItem key={page.id}>
                <SidebarMenuButton
                  size="sm"
                  isActive={location.pathname === `/p/${page.id}`}
                  onClick={() => navigate(`/p/${page.id}`)}
                >
                  <span className="truncate">{page.title}</span>
                </SidebarMenuButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
