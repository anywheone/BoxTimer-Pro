"use client"

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Calendar, Home, Inbox, BarChart3, Settings } from "lucide-react"
import { useSidebarPosition } from '@/contexts/SidebarPositionContext'

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

// Get initial position from localStorage synchronously
function getInitialPosition(): 'left' | 'right' {
  if (typeof window === 'undefined') return 'left'
  try {
    const stored = localStorage.getItem('sidebarPosition')
    return (stored === 'left' || stored === 'right') ? stored : 'left'
  } catch {
    return 'left'
  }
}

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
  const [localPosition, setLocalPosition] = useState<'left' | 'right'>(getInitialPosition)
  const { sidebarPosition } = useSidebarPosition()
  const pathname = usePathname()

  // Update local position when context changes
  useEffect(() => {
    setLocalPosition(sidebarPosition)
  }, [sidebarPosition])

  // ページ遷移後、localStorageから確実に読み直して正しい値を反映
  useEffect(() => {
    const storedPosition = getInitialPosition()
    setLocalPosition(storedPosition)
  }, [pathname])

  return (
    <Sidebar collapsible="icon" className="relative" side={localPosition}>
      <SidebarHeader className="sticky top-0 z-10 bg-sidebar border-b border-sidebar-border">
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
                  <SidebarMenuButton asChild tooltip={item.title}>
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
                  <SidebarMenuButton asChild tooltip={item.title}>
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