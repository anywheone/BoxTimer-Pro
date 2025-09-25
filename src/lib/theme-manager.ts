"use client"

class ThemeManager {
  private static instance: ThemeManager
  private listeners: Set<() => void> = new Set()

  static getInstance(): ThemeManager {
    if (!ThemeManager.instance) {
      ThemeManager.instance = new ThemeManager()
    }
    return ThemeManager.instance
  }

  private constructor() {
    // Initialize theme on client side
    if (typeof window !== 'undefined') {
      this.initializeTheme()
    }
  }

  private initializeTheme(): void {
    // Load theme from localStorage or default to light
    const savedTheme = localStorage.getItem('theme')
    const isDark = savedTheme === 'dark' ||
                   (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)

    this.applyTheme(isDark)
  }

  applyTheme(isDark: boolean): void {
    if (typeof window === 'undefined') return

    const html = document.documentElement

    if (isDark) {
      html.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      html.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }

    this.notifyListeners()
  }

  isDarkMode(): boolean {
    if (typeof window === 'undefined') return false
    return document.documentElement.classList.contains('dark')
  }

  toggle(): void {
    this.applyTheme(!this.isDarkMode())
  }

  addListener(callback: () => void): void {
    this.listeners.add(callback)
  }

  removeListener(callback: () => void): void {
    this.listeners.delete(callback)
  }

  private notifyListeners(): void {
    this.listeners.forEach(callback => callback())
  }
}

export const themeManager = ThemeManager.getInstance()