import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavSaved } from "@/components/nav-saved"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import {
  CompassIcon,
  HomeIcon,
  LayoutGridIcon,
  SparklesIcon,
  SunIcon,
  MoonIcon,
} from "lucide-react"
import { PAGES } from "@/data/pages"
import { useFavorites } from "@/stores/favorites"
import type { RightPanelContent } from "@/components/layout/RightPanel"

// Build categorized page lists from PAGES data
const curated = PAGES.filter(p => p.tags.includes('curated')).map(p => ({
  title: p.title,
  url: `#/p/${p.id}`,
}))
const certified = PAGES.filter(p => p.tags.includes('certified')).map(p => ({
  title: p.title,
  url: `#/p/${p.id}`,
}))
const mine = PAGES.filter(p => p.tags.includes('mine')).map(p => ({
  title: p.title,
  url: `#/p/${p.id}`,
}))

const data = {
  user: {
    name: "Jane Doe",
    email: "jane.doe@northstar.dev",
    avatar: "",
  },
  teams: [
    {
      name: "NorthStar",
      logo: <CompassIcon />,
      plan: "Analytics Workspace",
    },
  ],
}

export type SidebarView = 'main' | 'saved'

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  sidebarView: SidebarView
  rightPanel: RightPanelContent | null
  onToggleRightPanel: (content: RightPanelContent) => void
  dark: boolean
  onToggleDark: () => void
}

export function AppSidebar({
  sidebarView,
  rightPanel,
  onToggleRightPanel,
  dark,
  onToggleDark,
  ...props
}: AppSidebarProps) {
  const { favorites } = useFavorites()

  const saved = PAGES.filter(p => favorites.has(p.id)).map(p => ({
    title: p.title,
    url: `#/p/${p.id}`,
  }))

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        {sidebarView === 'saved' ? (
          <NavSaved pages={saved} />
        ) : (
          <NavMain
            links={[
              {
                title: "Home",
                url: "#/",
                icon: <HomeIcon />,
              },
            ]}
            pages={{
              title: "Pages",
              icon: <LayoutGridIcon />,
              categories: [
                { label: "Curated", pages: curated },
                { label: "Certified", pages: certified },
                { label: "My Pages", pages: mine },
              ],
              onNewPage: () => {
                // TODO: open new page creation flow
                console.log('New page')
              },
            }}
          />
        )}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Ask NorthStar"
              isActive={rightPanel === 'ask'}
              onClick={() => onToggleRightPanel('ask')}
            >
              <SparklesIcon />
              <span>Ask NorthStar</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={dark ? 'Light mode' : 'Dark mode'}
              onClick={onToggleDark}
            >
              {dark ? <SunIcon /> : <MoonIcon />}
              <span>{dark ? 'Light mode' : 'Dark mode'}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
