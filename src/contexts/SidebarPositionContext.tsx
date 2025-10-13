"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { timeBoxDB } from '@/lib/indexeddb'

type SidebarPosition = 'left' | 'right'

interface SidebarPositionContextType {
  sidebarPosition: SidebarPosition
  setSidebarPosition: (position: SidebarPosition) => void
}

const SidebarPositionContext = createContext<SidebarPositionContextType | undefined>(undefined)

// Get initial position from localStorage synchronously
function getInitialPosition(): SidebarPosition {
  if (typeof window === 'undefined') return 'left'
  try {
    const stored = localStorage.getItem('sidebarPosition')
    return (stored === 'left' || stored === 'right') ? stored : 'left'
  } catch {
    return 'left'
  }
}

export function SidebarPositionProvider({ children }: { children: React.ReactNode }) {
  const [sidebarPosition, setSidebarPosition] = useState<SidebarPosition>(getInitialPosition)

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await timeBoxDB.getSettings()
        const position = settings.sidebarPosition || 'left'
        setSidebarPosition(position)
        // Sync to localStorage
        localStorage.setItem('sidebarPosition', position)
      } catch (error) {
        console.error('Failed to load sidebar position:', error)
      }
    }
    loadSettings()
  }, [])

  // Update localStorage when position changes
  const updatePosition = (position: SidebarPosition) => {
    setSidebarPosition(position)
    localStorage.setItem('sidebarPosition', position)
  }

  return (
    <SidebarPositionContext.Provider value={{ sidebarPosition, setSidebarPosition: updatePosition }}>
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
