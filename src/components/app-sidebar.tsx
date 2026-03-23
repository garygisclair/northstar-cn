import * as React from "react"
import { useState, useCallback } from "react"

import { NavMain } from "@/components/nav-main"
import { NavSaved } from "@/components/nav-saved"
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
  SettingsIcon,
  LogOutIcon,
  SunIcon,
  MoonIcon,
} from "lucide-react"
import { PAGES } from "@/data/pages"
import { useFavorites } from "@/stores/favorites"

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
}

export function AppSidebar({
  sidebarView,
  ...props
}: AppSidebarProps) {
  const { favorites } = useFavorites()
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark')

  const toggleDark = useCallback(() => {
    setDark(prev => {
      const next = !prev
      document.documentElement.classList.toggle('dark', next)
      localStorage.setItem('theme', next ? 'dark' : 'light')
      return next
    })
  }, [])

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
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center justify-between px-2 py-1.5 group-data-[collapsible=icon]:justify-center">
              <span className="truncate text-sm text-sidebar-foreground group-data-[collapsible=icon]:hidden">{data.user.name}</span>
              <div className="flex items-center gap-0.5">
                <SidebarMenuButton tooltip={dark ? 'Light mode' : 'Dark mode'} className="h-7 w-7 p-0 justify-center group-data-[collapsible=icon]:hidden" onClick={toggleDark}>
                  {dark ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
                </SidebarMenuButton>
                <SidebarMenuButton tooltip="Settings" className="h-7 w-7 p-0 justify-center">
                  <SettingsIcon className="h-4 w-4" />
                </SidebarMenuButton>
                <SidebarMenuButton tooltip="Log out" className="h-7 w-7 p-0 justify-center group-data-[collapsible=icon]:hidden">
                  <LogOutIcon className="h-4 w-4" />
                </SidebarMenuButton>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
