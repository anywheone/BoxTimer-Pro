"use client"

import { useState, useEffect } from 'react'
import { Moon, Sun, Volume2, VolumeX, Bell, BellOff, Save, RotateCcw, Clock } from 'lucide-react'
import { timeBoxDB, type Settings } from '@/lib/indexeddb'
import { themeManager } from '@/lib/theme-manager'
import NotificationTest from '@/components/NotificationTest'
import { playSound, soundTypes } from '@/lib/sounds'

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    id: 'app-settings',
    darkMode: false,
    soundEnabled: true,
    soundVolume: 0.5,
    soundType: 'chime',
    notificationEnabled: true,
    defaultDuration: 25,
    updatedAt: new Date()
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showSaved, setShowSaved] = useState(false)
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default')

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await timeBoxDB.getSettings()
        setSettings(savedSettings)
        themeManager.applyTheme(savedSettings.darkMode)

        // Check notification permission
        if (typeof window !== 'undefined' && 'Notification' in window) {
          setNotificationPermission(Notification.permission)
        }
      } catch (error) {
        console.error('Failed to load settings:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadSettings()
  }, [])

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
      updatedAt: new Date()
    }))
  }

  const saveSettings = async () => {
    setIsSaving(true)
    try {
      console.log('Saving settings:', settings) // Debug log
      await timeBoxDB.updateSettings(settings)
      themeManager.applyTheme(settings.darkMode)
      setShowSaved(true)
      setTimeout(() => setShowSaved(false), 2000)
      console.log('Settings saved successfully') // Debug log
    } catch (error) {
      console.error('Failed to save settings:', error)
      alert('設定の保存に失敗しました。')
    } finally {
      setIsSaving(false)
    }
  }

  const resetSettings = async () => {
    const defaultSettings: Settings = {
      id: 'app-settings',
      darkMode: false,
      soundEnabled: true,
      soundVolume: 0.5,
      soundType: 'chime',
      notificationEnabled: true,
      defaultDuration: 25,
      updatedAt: new Date()
    }
    setSettings(defaultSettings)
    themeManager.applyTheme(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-3 sm:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">設定を読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-2 sm:mb-4">
            設定
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-lg">
            アプリの動作をカスタマイズできます
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-8 mb-4 sm:mb-6">
          <div className="space-y-4 sm:space-y-8">
            {/* Dark Mode Setting */}
            <div className="flex items-center justify-between p-4 sm:p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                  {settings.darkMode ? (
                    <Moon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <Sun className="h-6 w-6 text-blue-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    ダークモード
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    目に優しい暗いテーマに切り替えます
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  const newDarkMode = !settings.darkMode
                  updateSetting('darkMode', newDarkMode)
                  themeManager.applyTheme(newDarkMode)
                }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.darkMode ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.darkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Sound Setting */}
            <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                    {settings.soundEnabled ? (
                      <Volume2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                    ) : (
                      <VolumeX className="h-6 w-6 text-green-600 dark:text-green-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      アラーム音
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      タイマー終了時に音で通知します
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => updateSetting('soundEnabled', !settings.soundEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.soundEnabled ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {settings.soundEnabled && (
                <>
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        音の種類
                      </label>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {Object.entries(soundTypes).map(([key, sound]) => (
                        <button
                          key={key}
                          onClick={() => {
                            updateSetting('soundType', key as any)
                            // Play preview sound
                            setTimeout(() => playSound(key as any, settings.soundVolume), 100)
                          }}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            settings.soundType === key
                              ? 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                              : 'border-gray-300 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-700'
                          }`}
                        >
                          <div className="text-sm font-semibold">{sound.name}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {sound.description}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      音量
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={settings.soundVolume}
                      onChange={(e) => updateSetting('soundVolume', parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>静か</span>
                      <span>大きい</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Default Duration Setting */}
            <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-full">
                    <Clock className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      デフォルトのタイムボックス時間
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      新規タスク作成時の初期値（分）
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <input
                  type="number"
                  min="1"
                  max="180"
                  value={settings.defaultDuration || ''}
                  onChange={(e) => {
                    const value = e.target.value
                    if (value === '') {
                      // Allow empty value during editing (set to undefined-like state)
                      updateSetting('defaultDuration', '' as any)
                    } else {
                      const numValue = parseInt(value)
                      if (!isNaN(numValue)) {
                        updateSetting('defaultDuration', numValue)
                      }
                    }
                  }}
                  onBlur={(e) => {
                    // On blur, ensure value is valid (1-180) or reset to 25
                    const currentValue = settings.defaultDuration
                    if (!currentValue || currentValue < 1 || currentValue > 180) {
                      updateSetting('defaultDuration', 25)
                    }
                  }}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-200"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>1分〜180分</span>
                  <span>現在: {settings.defaultDuration || '未設定'}分</span>
                </div>
              </div>
            </div>

            {/* Notification Setting */}
            <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                    {settings.notificationEnabled && notificationPermission === 'granted' ? (
                      <Bell className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    ) : (
                      <BellOff className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      デスクトップ通知
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      ブラウザ通知でタイマー終了をお知らせします
                    </p>
                  </div>
                </div>
                <button
                  onClick={async () => {
                    const newValue = !settings.notificationEnabled
                    if (newValue && typeof window !== 'undefined' && 'Notification' in window) {
                      // Request permission when turning on notifications
                      if (Notification.permission === 'default') {
                        try {
                          const permission = await Notification.requestPermission()
                          console.log('Permission result:', permission)
                          setNotificationPermission(permission)
                          if (permission === 'granted') {
                            updateSetting('notificationEnabled', true)
                          } else {
                            // Don't enable if permission denied
                            alert('通知を有効にするには許可が必要です')
                            return
                          }
                        } catch (error) {
                          console.error('Failed to request notification permission:', error)
                          alert('通知の許可リクエストに失敗しました')
                          return
                        }
                      } else if (Notification.permission === 'denied') {
                        alert('通知が拒否されています。ブラウザの設定から通知を許可してください')
                        return
                      } else {
                        updateSetting('notificationEnabled', newValue)
                      }
                    } else {
                      updateSetting('notificationEnabled', newValue)
                    }
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.notificationEnabled && notificationPermission === 'granted' ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.notificationEnabled && notificationPermission === 'granted' ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Permission Status and Test Button */}
              <div className="mt-3 flex items-center justify-between">
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  許可状態: <span className={`font-mono px-2 py-1 rounded ${
                    notificationPermission === 'granted'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      : notificationPermission === 'denied'
                      ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                      : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                  }`}>
                    {notificationPermission === 'granted' ? '許可済み' :
                     notificationPermission === 'denied' ? '拒否' : '未設定'}
                  </span>
                </div>

                {/* Notification Test Button */}
                {settings.notificationEnabled && notificationPermission === 'granted' && (
                  <NotificationTest />
                )}
              </div>

              {notificationPermission === 'denied' && (
                <div className="mt-2 text-xs text-red-600 dark:text-red-400">
                  ⚠️ ブラウザの設定から通知を許可してください
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={saveSettings}
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Save size={20} />
            <span>{isSaving ? '保存中...' : '設定を保存'}</span>
          </button>

          <button
            onClick={resetSettings}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <RotateCcw size={20} />
            <span>リセット</span>
          </button>
        </div>

        {showSaved && (
          <div className="fixed top-20 right-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 z-50 animate-in slide-in-from-top-5 fade-in duration-300">
            <Save size={20} />
            <span className="font-semibold">設定が保存されました！</span>
          </div>
        )}
      </div>
    </div>
  )
}