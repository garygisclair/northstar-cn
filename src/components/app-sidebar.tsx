import * as React from "react"
import { useState, useCallback } from "react"

import { NavMain } from "@/components/nav-main"
import { NavSaved } from "@/components/nav-saved"
import { TeamSwitcher } from "@/components/team-switcher"
import { GroupPagesModal } from "@/components/GroupPagesModal"
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
import { useFavorites } from "@/stores/favorites"
import { usePages } from "@/stores/pages"

// Build categorized page lists from PAGES data
export interface SidebarPage {
  id: string
  title: string
  url: string
  tabs: { id: string; label: string; url: string }[]
}

function toSidebarPage(p: { id: string; title: string; tabs: { id: string; label: string }[] }): SidebarPage {
  return {
    id: p.id,
    title: p.title,
    url: `#/p/${p.id}`,
    tabs: p.tabs.map(t => ({ id: t.id, label: t.label, url: `#/p/${p.id}/${t.id}` })),
  }
}

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
  const { pages, groupPages } = usePages()
  const { favorites } = useFavorites()
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark')
  const [showGroupModal, setShowGroupModal] = useState(false)

  const curated = pages.filter(p => p.tags.includes('curated')).map(toSidebarPage)
  const certified = pages.filter(p => p.tags.includes('certified')).map(toSidebarPage)
  const mine = pages.filter(p => p.tags.includes('mine')).map(toSidebarPage)

  const toggleDark = useCallback(() => {
    setDark(prev => {
      const next = !prev
      document.documentElement.classList.toggle('dark', next)
      localStorage.setItem('theme', next ? 'dark' : 'light')
      return next
    })
  }, [])

  const saved = pages.filter(p => favorites.has(p.id)).map(toSidebarPage)

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
              onGroupPages: () => setShowGroupModal(true),
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

      {showGroupModal && (
        <GroupPagesModal
          onClose={() => setShowGroupModal(false)}
          onGroup={(name, pageIds) => {
            groupPages(name, pageIds)
          }}
        />
      )}
    </Sidebar>
  )
}
