interface TimeBox {
  id: string
  title: string
  duration: number // 設定された時間（分）
  actualDuration?: number // 実際に実施した時間（秒）
  description: string
  completed: boolean
  createdAt: Date
  scheduledDate?: Date // 予定日
}

interface Settings {
  id: string
  darkMode: boolean
  soundEnabled: boolean
  soundVolume: number
  notificationEnabled: boolean
  updatedAt: Date
}

class TimeBoxDB {
  private dbName = 'TimeBoxProDB'
  private version = 3
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => {
        reject(request.error)
      }

      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        const oldVersion = event.oldVersion

        // Create timeboxes object store
        if (!db.objectStoreNames.contains('timeboxes')) {
          const timeboxStore = db.createObjectStore('timeboxes', { keyPath: 'id' })
          timeboxStore.createIndex('createdAt', 'createdAt', { unique: false })
          timeboxStore.createIndex('completed', 'completed', { unique: false })
          timeboxStore.createIndex('scheduledDate', 'scheduledDate', { unique: false })
        } else if (oldVersion < 3) {
          // Add scheduledDate index to existing store
          const transaction = (event.target as IDBOpenDBRequest).transaction
          const timeboxStore = transaction!.objectStore('timeboxes')
          if (!timeboxStore.indexNames.contains('scheduledDate')) {
            timeboxStore.createIndex('scheduledDate', 'scheduledDate', { unique: false })
          }
        }

        // Create settings object store
        if (!db.objectStoreNames.contains('settings')) {
          const settingsStore = db.createObjectStore('settings', { keyPath: 'id' })
          settingsStore.createIndex('updatedAt', 'updatedAt', { unique: false })
        }
      }
    })
  }

  async addTimeBox(timeBox: TimeBox): Promise<void> {
    if (!this.db) {
      await this.init()
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['timeboxes'], 'readwrite')
      const store = transaction.objectStore('timeboxes')
      const request = store.add(timeBox)

      request.onsuccess = () => {
        resolve()
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  }

  async getAllTimeBoxes(): Promise<TimeBox[]> {
    if (!this.db) {
      await this.init()
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['timeboxes'], 'readonly')
      const store = transaction.objectStore('timeboxes')
      const request = store.getAll()

      request.onsuccess = () => {
        const timeboxes = request.result.map((timebox: any) => ({
          ...timebox,
          createdAt: new Date(timebox.createdAt),
          scheduledDate: timebox.scheduledDate ? new Date(timebox.scheduledDate) : undefined
        }))
        resolve(timeboxes)
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  }

  async updateTimeBox(timeBox: TimeBox): Promise<void> {
    if (!this.db) {
      await this.init()
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['timeboxes'], 'readwrite')
      const store = transaction.objectStore('timeboxes')
      const request = store.put(timeBox)

      request.onsuccess = () => {
        resolve()
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  }

  async deleteTimeBox(id: string): Promise<void> {
    if (!this.db) {
      await this.init()
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['timeboxes'], 'readwrite')
      const store = transaction.objectStore('timeboxes')
      const request = store.delete(id)

      request.onsuccess = () => {
        resolve()
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  }

  async getTimeBox(id: string): Promise<TimeBox | null> {
    if (!this.db) {
      await this.init()
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['timeboxes'], 'readonly')
      const store = transaction.objectStore('timeboxes')
      const request = store.get(id)

      request.onsuccess = () => {
        const result = request.result
        if (result) {
          resolve({
            ...result,
            createdAt: new Date(result.createdAt),
            scheduledDate: result.scheduledDate ? new Date(result.scheduledDate) : undefined
          })
        } else {
          resolve(null)
        }
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  }

  async clearCompletedTimeBoxes(): Promise<void> {
    if (!this.db) {
      await this.init()
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['timeboxes'], 'readwrite')
      const store = transaction.objectStore('timeboxes')
      const index = store.index('completed')
      const request = index.openCursor(IDBKeyRange.only(true))

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result
        if (cursor) {
          cursor.delete()
          cursor.continue()
        } else {
          resolve()
        }
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  }

  // Settings methods
  async getSettings(): Promise<Settings> {
    if (!this.db) {
      await this.init()
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['settings'], 'readonly')
      const store = transaction.objectStore('settings')
      const request = store.get('app-settings')

      request.onsuccess = () => {
        const result = request.result
        if (result) {
          resolve({
            ...result,
            updatedAt: new Date(result.updatedAt)
          })
        } else {
          // Return default settings
          const defaultSettings: Settings = {
            id: 'app-settings',
            darkMode: false,
            soundEnabled: true,
            soundVolume: 0.5,
            notificationEnabled: true,
            updatedAt: new Date()
          }
          resolve(defaultSettings)
        }
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  }

  async updateSettings(settings: Settings): Promise<void> {
    if (!this.db) {
      await this.init()
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['settings'], 'readwrite')
      const store = transaction.objectStore('settings')
      const request = store.put(settings)

      request.onsuccess = () => {
        resolve()
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  }
}

// Singleton instance
export const timeBoxDB = new TimeBoxDB()

// Export the interface for use in components
export type { TimeBox, Settings }