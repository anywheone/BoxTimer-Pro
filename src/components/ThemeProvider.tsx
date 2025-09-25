"use client"

import { useEffect } from 'react'
import { themeManager } from '@/lib/theme-manager'

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize theme on app startup - this is mainly for syncing with IndexedDB
    const initTheme = async () => {
      try {
        const { timeBoxDB } = await import('@/lib/indexeddb')
        const settings = await timeBoxDB.getSettings()

        // Only apply if different from current state to avoid flashing
        const currentIsDark = document.documentElement.classList.contains('dark')
        if (settings.darkMode !== currentIsDark) {
          themeManager.applyTheme(settings.darkMode)
        }
      } catch (error) {
        console.error('Failed to load theme settings:', error)
        // The NoFlashScript should have already handled the initial theme
      }
    }

    initTheme()
  }, [])

  return <>{children}</>
}