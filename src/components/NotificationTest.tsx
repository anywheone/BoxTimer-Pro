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
      <button
        onClick={testNotification}
        className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1.5 rounded-md transition-colors flex items-center space-x-2 text-sm"
      >
        <Bell size={16} />
        <span>テスト通知</span>
      </button>

      {showTestMessage && (
        <div className="fixed top-20 right-4 bg-purple-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 z-50 animate-in slide-in-from-top-5 fade-in duration-300">
          <Bell size={20} />
          <span className="font-semibold">テスト通知を送信しました！</span>
        </div>
      )}
    </>
  )
}