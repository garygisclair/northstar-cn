"use client"

import { useState } from "react"
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
import { ChevronRightIcon, PlusIcon } from "lucide-react"

interface NavLinkItem {
  title: string
  url: string
  icon?: React.ReactNode
}

interface PageCategory {
  label: string
  pages: { title: string; url: string }[]
}

interface PagesSection {
  title: string
  icon?: React.ReactNode
  categories: PageCategory[]
  onNewPage?: () => void
}

export function NavMain({
  links,
  pages,
}: {
  links: NavLinkItem[]
  pages: PagesSection
}) {
  const { state, toggleSidebar } = useSidebar()
  const [pagesOpen, setPagesOpen] = useState(true)

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {/* Home (flat link) */}
        {links[0] && (
          <SidebarMenuItem>
            <SidebarMenuButton tooltip={links[0].title} render={<a href={links[0].url} />}>
              {links[0].icon}
              <span>{links[0].title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}

        {/* Pages section — collapsible with category sub-groups */}
        <Collapsible
          open={pagesOpen}
          onOpenChange={setPagesOpen}
          className="group/collapsible"
          render={<SidebarMenuItem />}
        >
          <CollapsibleTrigger
            render={<SidebarMenuButton tooltip={pages.title} onClick={state === 'collapsed' ? (e: React.MouseEvent) => { e.preventDefault(); toggleSidebar(); setPagesOpen(true); } : undefined} />}
          >
            {pages.icon}
            <span>{pages.title}</span>
            <ChevronRightIcon className="ml-auto h-3 w-3 shrink-0 transition-transform duration-200 group-data-open/collapsible:rotate-90" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub className="mr-0 pr-0">
              {pages.categories.map((cat) => (
                <Collapsible
                  key={cat.label}
                  defaultOpen={cat.pages.length > 0}
                  className="group/nested"
                >
                  <SidebarMenuSubItem>
                    <CollapsibleTrigger
                      render={<SidebarMenuSubButton render={<button />} className="w-full" />}
                    >
                      <span className="font-medium">{cat.label}</span>
                      <ChevronRightIcon className="ml-auto h-3 w-3 shrink-0 transition-transform duration-200 group-data-open/nested:rotate-90" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub className="mr-0 pr-0">
                        {cat.pages.length > 0 ? (
                          cat.pages.map((page) => (
                            <SidebarMenuSubItem key={page.url}>
                              <SidebarMenuSubButton render={<a href={page.url} />}>
                                <span>{page.title}</span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))
                        ) : (
                          <SidebarMenuSubItem>
                            <span className="px-2 py-1 text-xs text-muted-foreground">
                              No pages yet
                            </span>
                          </SidebarMenuSubItem>
                        )}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuSubItem>
                </Collapsible>
              ))}

              {/* New Page button */}
              {pages.onNewPage && (
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton onClick={pages.onNewPage}>
                    <PlusIcon className="h-3 w-3" />
                    <span>New Page</span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              )}
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>

        {/* Remaining flat links */}
        {links.slice(1).map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton tooltip={item.title} render={<a href={item.url} />}>
              {item.icon}
              <span>{item.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
