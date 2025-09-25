import { Calendar, Home, Inbox, BarChart3, Settings } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"

// Menu items.
const explanationItems = [
  {
    title: "タイムボックス法",
    url: "/",
    icon: Home,
  },
  {
    title: "プランニングファラシー",
    url: "/planning-fallacy",
    icon: Inbox,
  },
]

const functionItems = [
  {
    title: "タイムボックス管理",
    url: "/timebox-manager",
    icon: Calendar,
  },
  {
    title: "振り返り",
    url: "/review",
    icon: BarChart3,
  },
  {
    title: "設定",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" className="relative">
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center justify-between px-2">
            <SidebarGroupLabel className="px-0">説明</SidebarGroupLabel>
            <SidebarTrigger className="h-6 w-6 group-data-[collapsible=icon]:hidden" />
          </div>
          {/* Collapsed state trigger */}
          <div className="hidden group-data-[collapsible=icon]:flex justify-center p-2">
            <SidebarTrigger className="h-8 w-8" />
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {explanationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="px-2">機能</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {functionItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}