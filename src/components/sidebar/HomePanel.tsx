import { useNavigate, useLocation } from 'react-router-dom';
import { Star } from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { PAGES } from '@/data/pages';

export function HomePanel() {
  const navigate = useNavigate();
  const location = useLocation();

  const favorites = PAGES.filter(p => p.tags.includes('curated'));

  return (
    <SidebarMenu>
      {favorites.map(page => {
        const isActive = location.pathname === `/p/${page.id}`;
        return (
          <SidebarMenuItem key={page.id}>
            <SidebarMenuButton
              isActive={isActive}
              onClick={() => navigate(`/p/${page.id}`)}
            >
              <Star className="size-4" />
              <div className="flex flex-col min-w-0">
                {page.category && (
                  <span className="text-[10px] uppercase tracking-wider text-sidebar-foreground/60">
                    {page.category}
                  </span>
                )}
                <span className="truncate">{page.title}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
