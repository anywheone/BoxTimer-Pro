"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { timeBoxDB } from '@/lib/indexeddb'

type SidebarPosition = 'left' | 'right'

interface SidebarPositionContextType {
  sidebarPosition: SidebarPosition
  setTemporarySidebarPosition: (position: SidebarPosition) => void
  saveSidebarPosition: (position: SidebarPosition) => Promise<void>
  resetToSaved: () => void
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
  const [savedPosition, setSavedPosition] = useState<SidebarPosition>(getInitialPosition)

  useEffect(() => {
    const loadSettings = async () => {
      try {
        // localStorageの値を優先（すでに設定されている場合）
        const localStored = localStorage.getItem('sidebarPosition')
        if (localStored === 'left' || localStored === 'right') {
          // localStorageに値がある場合は、それを使用してIndexedDBと同期
          setSidebarPosition(localStored)
          setSavedPosition(localStored)

          // IndexedDBも同じ値に更新
          const settings = await timeBoxDB.getSettings()
          if (settings.sidebarPosition !== localStored) {
            await timeBoxDB.updateSettings({ ...settings, sidebarPosition: localStored })
          }
        } else {
          // localStorageに値がない場合のみ、IndexedDBから読み込む
          const settings = await timeBoxDB.getSettings()
          const position = settings.sidebarPosition || 'left'
          setSidebarPosition(position)
          setSavedPosition(position)
          localStorage.setItem('sidebarPosition', position)
        }
      } catch (error) {
        console.error('Failed to load sidebar position:', error)
      }
    }
    loadSettings()
  }, [])

  // Temporarily update position (preview only, not saved)
  const setTemporarySidebarPosition = useCallback((position: SidebarPosition) => {
    setSidebarPosition(position)
  }, [])

  // Save position to localStorage and IndexedDB
  const saveSidebarPosition = useCallback(async (position: SidebarPosition) => {
    setSidebarPosition(position)
    setSavedPosition(position)
    localStorage.setItem('sidebarPosition', position)

    try {
      const settings = await timeBoxDB.getSettings()
      await timeBoxDB.updateSettings({ ...settings, sidebarPosition: position })
    } catch (error) {
      console.error('Failed to save sidebar position:', error)
    }
  }, [])

  // Reset to last saved position
  const resetToSaved = useCallback(() => {
    setSidebarPosition(savedPosition)
  }, [savedPosition])

  return (
    <SidebarPositionContext.Provider value={{
      sidebarPosition,
      setTemporarySidebarPosition,
      saveSidebarPosition,
      resetToSaved
    }}>
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
