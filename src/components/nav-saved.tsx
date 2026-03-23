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
} from "@/components/ui/sidebar"
import { ChevronRightIcon, BookmarkIcon } from "lucide-react"

export function NavSaved({
  pages,
}: {
  pages: { title: string; url: string }[]
}) {
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
            render={<SidebarMenuButton tooltip="Saved" />}
          >
            <ChevronRightIcon className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-open/collapsible:rotate-90" />
            <BookmarkIcon />
            <span>Saved</span>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub className="mr-0 pr-0">
              {pages.length > 0 ? (
                pages.map((page) => (
                  <SidebarMenuSubItem key={page.url}>
                    <SidebarMenuSubButton render={<a href={page.url} />}>
                      <span>{page.title}</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
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
