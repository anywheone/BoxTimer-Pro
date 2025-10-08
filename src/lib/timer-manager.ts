interface TimerState {
  activeTimerId: string | null
  startTime: number | null
  duration: number // seconds
  isRunning: boolean
  endTime: number | null
}

class TimerManager {
  private static instance: TimerManager
  private listeners: Set<() => void> = new Set()
  private storageKey = 'boxTimerState'

  static getInstance(): TimerManager {
    if (!TimerManager.instance) {
      TimerManager.instance = new TimerManager()
    }
    return TimerManager.instance
  }

  private constructor() {
    // Listen for storage changes from other tabs
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === this.storageKey) {
          this.notifyListeners()
        }
      })

      // Check for completed timers periodically
      setInterval(() => {
        const state = this.getTimerState()
        if (state.isRunning && state.endTime && Date.now() >= state.endTime) {
          this.completeTimer()
        }
      }, 1000)
    }
  }

  startTimer(timerId: string, duration: number): void {
    const now = Date.now()
    const state: TimerState = {
      activeTimerId: timerId,
      startTime: now,
      duration,
      isRunning: true,
      endTime: now + (duration * 1000)
    }
    this.saveTimerState(state)
    this.notifyListeners()
  }

  pauseTimer(): void {
    const state = this.getTimerState()
    if (state.isRunning && state.endTime) {
      const remainingTime = Math.max(0, Math.floor((state.endTime - Date.now()) / 1000))
      const updatedState: TimerState = {
        ...state,
        isRunning: false,
        duration: remainingTime,
        endTime: null
      }
      this.saveTimerState(updatedState)
      this.notifyListeners()
    }
  }

  resumeTimer(): void {
    const state = this.getTimerState()
    if (!state.isRunning && state.activeTimerId && state.duration > 0) {
      const now = Date.now()
      const updatedState: TimerState = {
        ...state,
        isRunning: true,
        startTime: now,
        endTime: now + (state.duration * 1000)
      }
      this.saveTimerState(updatedState)
      this.notifyListeners()
    }
  }

  resetTimer(duration: number): void {
    const state = this.getTimerState()
    if (state.activeTimerId) {
      const updatedState: TimerState = {
        ...state,
        duration,
        isRunning: false,
        startTime: null,
        endTime: null
      }
      this.saveTimerState(updatedState)
      this.notifyListeners()
    }
  }

  async completeTimer(): Promise<void> {
    const state = this.getTimerState()
    if (state.activeTimerId) {
      // Load settings and play sound if enabled
      try {
        const { timeBoxDB } = await import('./indexeddb')
        const settings = await timeBoxDB.getSettings()

        // Get task name and calculate actual duration
        let taskName = 'タスク'
        try {
          const task = await timeBoxDB.getTimeBox(state.activeTimerId)
          if (task) {
            taskName = task.title
            // Calculate actual duration (初期duration - 残り時間)
            const actualDuration = (task.duration * 60) - this.getRemainingTime()
            // Update task with actual duration when completed
            await timeBoxDB.updateTimeBox({
              ...task,
              actualDuration
            })
          }
        } catch (error) {
          console.error('Failed to get task name:', error)
        }

        // Play sound if enabled
        if (settings.soundEnabled && typeof window !== 'undefined') {
          this.playAlarmSound(settings.soundVolume)
        }

        // Show notification if enabled
        if (settings.notificationEnabled && typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
          console.log('Showing notification: Timer completed for task:', taskName)
          new Notification('🎯 タイムボックス完了!', {
            body: `「${taskName}」の時間が終了しました。お疲れ様でした！`,
            icon: '/BoxTimer_Logo.png',
            requireInteraction: true,
            tag: 'timebox-complete'
          })
        } else {
          console.log('Notification not shown:', {
            enabled: settings.notificationEnabled,
            permission: typeof window !== 'undefined' ? Notification.permission : 'unavailable',
            supported: typeof window !== 'undefined' && 'Notification' in window
          })
        }
      } catch (error) {
        console.error('Failed to load settings for timer completion:', error)

        // Fallback notification - try to get task name
        let fallbackTaskName = 'タスク'
        try {
          const { timeBoxDB } = await import('./indexeddb')
          const task = await timeBoxDB.getTimeBox(state.activeTimerId)
          if (task) {
            fallbackTaskName = task.title
          }
        } catch (taskError) {
          console.error('Failed to get task name for fallback:', taskError)
        }

        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
          console.log('Showing fallback notification for task:', fallbackTaskName)
          new Notification('🎯 タイムボックス完了!', {
            body: `「${fallbackTaskName}」の時間が終了しました。お疲れ様でした！`,
            icon: '/BoxTimer_Logo.png',
            requireInteraction: true,
            tag: 'timebox-complete'
          })
        }
      }

      // Clear timer state
      this.clearTimer()
    }
  }

  private playAlarmSound(volume: number): void {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

      // Pleasant notification melody: C5 -> E5 -> G5 -> C6
      const melody = [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6
      const noteDuration = 0.3
      const totalDuration = melody.length * noteDuration

      melody.forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        // Use sine wave for smoother sound
        oscillator.type = 'sine'
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)

        // Create fade in/out envelope for smoother sound
        const startTime = audioContext.currentTime + (index * noteDuration)
        const endTime = startTime + noteDuration

        gainNode.gain.setValueAtTime(0, startTime)
        gainNode.gain.linearRampToValueAtTime(volume * 0.7, startTime + 0.05) // Fade in
        gainNode.gain.setValueAtTime(volume * 0.7, endTime - 0.1)
        gainNode.gain.linearRampToValueAtTime(0, endTime) // Fade out

        oscillator.start(startTime)
        oscillator.stop(endTime)
      })

    } catch (error) {
      console.error('Failed to play alarm sound:', error)
    }
  }

  clearTimer(): void {
    const clearedState: TimerState = {
      activeTimerId: null,
      startTime: null,
      duration: 0,
      isRunning: false,
      endTime: null
    }
    this.saveTimerState(clearedState)
    this.notifyListeners()
  }

  getTimerState(): TimerState {
    if (typeof window === 'undefined') {
      return {
        activeTimerId: null,
        startTime: null,
        duration: 0,
        isRunning: false,
        endTime: null
      }
    }

    try {
      const stored = localStorage.getItem(this.storageKey)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.error('Failed to parse timer state:', error)
    }

    return {
      activeTimerId: null,
      startTime: null,
      duration: 0,
      isRunning: false,
      endTime: null
    }
  }

  getRemainingTime(): number {
    const state = this.getTimerState()
    if (!state.isRunning || !state.endTime) {
      return state.duration
    }

    const remaining = Math.max(0, Math.floor((state.endTime - Date.now()) / 1000))
    return remaining
  }

  isActive(): boolean {
    return this.getTimerState().activeTimerId !== null
  }

  getActiveTimerId(): string | null {
    return this.getTimerState().activeTimerId
  }

  isRunning(): boolean {
    const state = this.getTimerState()
    return state.isRunning && state.endTime !== null && Date.now() < state.endTime
  }

  private saveTimerState(state: TimerState): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(state))
    }
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

export const timerManager = TimerManager.getInstance()
export type { TimerState }