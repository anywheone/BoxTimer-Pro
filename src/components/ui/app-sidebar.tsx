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
      <SidebarHeader>
        <div className="flex items-center justify-end px-2">
          <SidebarTrigger className="hidden md:flex" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-2">説明</SidebarGroupLabel>
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