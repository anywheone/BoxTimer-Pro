"use client"

export default function NotificationTest() {
  const testNotification = () => {
    if (Notification.permission === 'granted') {
      new Notification('🎯 テスト通知', {
        body: 'デスクトップ通知が正常に動作しています！',
        icon: '/BoxTimer_Logo.png',
        requireInteraction: true,
        tag: 'test-notification'
      })
      alert('通知を送信しました！画面右下をご確認ください。')
    } else {
      alert('通知の許可が必要です')
    }
  }

  return (
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
  )
}