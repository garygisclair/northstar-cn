"use client"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { ChevronRightIcon, BookmarkIcon } from "lucide-react"
import type { SidebarPage } from "@/components/app-sidebar"

function SavedPageItem({ page }: { page: SidebarPage }) {
  const isGrouped = page.tabs.length > 1

  if (!isGrouped) {
    return (
      <SidebarMenuSubItem>
        <SidebarMenuSubButton render={<a href={page.url} />}>
          <span>{page.title}</span>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
    )
  }

  return (
    <Collapsible className="group/savedpage">
      <SidebarMenuSubItem>
        <CollapsibleTrigger
          render={<SidebarMenuSubButton render={<button />} className="w-full" />}
        >
          <span>{page.title}</span>
          <ChevronRightIcon className="ml-auto h-3 w-3 shrink-0 transition-transform duration-200 group-data-open/savedpage:rotate-90" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub className="mr-0 pr-0">
            {page.tabs.map((tab) => (
              <SidebarMenuSubItem key={tab.id}>
                <SidebarMenuSubButton render={<a href={tab.url} />}>
                  <span>{tab.label}</span>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuSubItem>
    </Collapsible>
  )
}

export function NavSaved({
  pages,
}: {
  pages: SidebarPage[]
}) {
  const { state, toggleSidebar } = useSidebar()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Saved</SidebarGroupLabel>
      <SidebarMenu>
        <Collapsible
          defaultOpen
          className="group/collapsible"
          render={<SidebarMenuItem />}
        >
          <CollapsibleTrigger
            render={<SidebarMenuButton tooltip="Saved" onClick={state === 'collapsed' ? (e: React.MouseEvent) => { e.preventDefault(); toggleSidebar(); } : undefined} />}
          >
            <BookmarkIcon />
            <span>Saved</span>
            <ChevronRightIcon className="ml-auto h-3 w-3 shrink-0 transition-transform duration-200 group-data-open/collapsible:rotate-90" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub className="mr-0 pr-0">
              {pages.length > 0 ? (
                pages.map((page) => (
                  <SavedPageItem key={page.id} page={page} />
                ))
              ) : (
                <SidebarMenuSubItem>
                  <span className="px-2 py-1 text-xs text-muted-foreground">
                    No saved pages yet
                  </span>
                </SidebarMenuSubItem>
              )}
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  )
}
