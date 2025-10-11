"use client"

import { useState } from 'react'
import { Bell } from 'lucide-react'

export default function NotificationTest() {
  const [showTestMessage, setShowTestMessage] = useState(false)

  const testNotification = () => {
    if (Notification.permission === 'granted') {
      // Show in-app message first
      setShowTestMessage(true)

      // Send desktop notification after a short delay
      setTimeout(() => {
        new Notification('🎯 テスト通知', {
          body: 'デスクトップ通知が正常に動作しています！',
          icon: '/BoxTimer_Logo.png',
          requireInteraction: true,
          tag: `test-notification-${Date.now()}`
        })
      }, 300)

      // Hide message after 3 seconds
      setTimeout(() => setShowTestMessage(false), 3000)
    } else {
      alert('通知の許可が必要です')
    }
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-3">
          通知テスト
        </h3>
        <button
          onClick={testNotification}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          テスト通知
        </button>
      </div>

      {showTestMessage && (
        <div className="fixed top-20 right-4 bg-orange-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 z-50 animate-in slide-in-from-top-5 fade-in duration-300">
          <Bell size={20} />
          <span className="font-semibold">テスト通知を送信しました！</span>
        </div>
      )}
    </>
  )
}