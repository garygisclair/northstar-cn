import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
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
  BellIcon,
  SparklesIcon,
  SunIcon,
  MoonIcon,
} from "lucide-react"
import { PAGES } from "@/data/pages"
import type { RightPanelContent } from "@/components/layout/RightPanel"

// Build nav data from pages
const favorites = PAGES.filter(p => p.tags.includes('curated')).slice(0, 6)
const allCurated = PAGES.filter(p => p.tags.includes('curated'))

const data = {
  user: {
    name: "Gary G.",
    email: "gary@northstar.dev",
    avatar: "",
  },
  teams: [
    {
      name: "NorthStar",
      logo: <CompassIcon />,
      plan: "Analytics Workspace",
    },
  ],
  navMain: [
    {
      title: "Home",
      url: "#/",
      icon: <HomeIcon />,
      isActive: true,
      items: favorites.map(p => ({
        title: p.title,
        url: `#/p/${p.id}`,
      })),
    },
    {
      title: "Browse",
      url: "#/browse",
      icon: <LayoutGridIcon />,
      items: [
        { title: "All Pages", url: "#/browse" },
        ...allCurated.map(p => ({
          title: p.title,
          url: `#/p/${p.id}`,
        })),
      ],
    },
    {
      title: "Alerts",
      url: "#",
      icon: <BellIcon />,
      items: [],
    },
  ],
  projects: [] as { name: string; url: string; icon: React.ReactNode }[],
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  rightPanel: RightPanelContent | null
  onToggleRightPanel: (content: RightPanelContent) => void
  dark: boolean
  onToggleDark: () => void
}

export function AppSidebar({
  rightPanel,
  onToggleRightPanel,
  dark,
  onToggleDark,
  ...props
}: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {data.projects.length > 0 && <NavProjects projects={data.projects} />}
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
