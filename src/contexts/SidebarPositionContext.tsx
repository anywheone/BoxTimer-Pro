"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { timeBoxDB } from '@/lib/indexeddb'

type SidebarPosition = 'left' | 'right'

interface SidebarPositionContextType {
  sidebarPosition: SidebarPosition
  setSidebarPosition: (position: SidebarPosition) => void
}

const SidebarPositionContext = createContext<SidebarPositionContextType | undefined>(undefined)

export function SidebarPositionProvider({ children }: { children: React.ReactNode }) {
  const [sidebarPosition, setSidebarPosition] = useState<SidebarPosition>('left')

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await timeBoxDB.getSettings()
        setSidebarPosition(settings.sidebarPosition || 'left')
      } catch (error) {
        console.error('Failed to load sidebar position:', error)
      }
    }
    loadSettings()
  }, [])

  return (
    <SidebarPositionContext.Provider value={{ sidebarPosition, setSidebarPosition }}>
      {children}
    </SidebarPositionContext.Provider>
  )
}

export function useSidebarPosition() {
  const context = useContext(SidebarPositionContext)
  if (context === undefined) {
    throw new Error('useSidebarPosition must be used within a SidebarPositionProvider')
  }
  return context
}
