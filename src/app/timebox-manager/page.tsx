"use client"

import { useState, useEffect } from 'react'
import { Plus, Play, Pause, RotateCcw, Trash2, Edit3, Calendar, RefreshCw } from 'lucide-react'
import { timeBoxDB, type TimeBox } from '@/lib/indexeddb'
import { timerManager } from '@/lib/timer-manager'

export default function TimeBoxManager() {
  const [timeBoxes, setTimeBoxes] = useState<TimeBox[]>([])
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [newTask, setNewTask] = useState({
    title: '',
    duration: 25,
    description: '',
    scheduledDate: new Date().toISOString().split('T')[0]
  })
  const [editingTask, setEditingTask] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [timerState, setTimerState] = useState({
    activeTimer: null as string | null,
    timeRemaining: 0,
    isRunning: false
  })

  // Load timeboxes from IndexedDB on mount
  useEffect(() => {
    const loadTimeBoxes = async () => {
      try {
        const savedTimeBoxes = await timeBoxDB.getAllTimeBoxes()
        setTimeBoxes(savedTimeBoxes)
      } catch (error) {
        console.error('Failed to load timeboxes:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadTimeBoxes()
  }, [])

  // Initialize timer state and listen for changes
  useEffect(() => {
    const updateTimerState = () => {
      setTimerState({
        activeTimer: timerManager.getActiveTimerId(),
        timeRemaining: timerManager.getRemainingTime(),
        isRunning: timerManager.isRunning()
      })
    }

    // Initial state
    updateTimerState()

    // Listen for timer updates
    timerManager.addListener(updateTimerState)

    // Update timer every second
    const interval = setInterval(updateTimerState, 1000)

    return () => {
      timerManager.removeListener(updateTimerState)
      clearInterval(interval)
    }
  }, [])

  // Update document title with countdown
  useEffect(() => {
    if (timerState.activeTimer && timerState.isRunning) {
      const mins = Math.floor(timerState.timeRemaining / 60)
      const secs = timerState.timeRemaining % 60
      document.title = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')} - BoxTimer Pro`
    } else {
      document.title = 'タイムボックス管理 - BoxTimer Pro'
    }
  }, [timerState.activeTimer, timerState.timeRemaining, timerState.isRunning])

  // Request notification permission
  useEffect(() => {
    const requestNotificationPermission = async () => {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'default') {
          const permission = await Notification.requestPermission()
          console.log('Notification permission:', permission)
        } else {
          console.log('Current notification permission:', Notification.permission)
        }
      } else {
        console.log('Notifications not supported')
      }
    }

    requestNotificationPermission()
  }, [])

  const addTimeBox = async () => {
    if (newTask.title.trim()) {
      const timeBox: TimeBox = {
        id: Date.now().toString(),
        title: newTask.title,
        duration: newTask.duration,
        description: newTask.description,
        completed: false,
        createdAt: new Date(),
        scheduledDate: newTask.scheduledDate ? new Date(newTask.scheduledDate) : undefined
      }
      try {
        await timeBoxDB.addTimeBox(timeBox)
        setTimeBoxes([...timeBoxes, timeBox])
        setNewTask({
          title: '',
          duration: 25,
          description: '',
          scheduledDate: new Date().toISOString().split('T')[0]
        })
        setIsAddingTask(false)
      } catch (error) {
        console.error('Failed to add timebox:', error)
      }
    }
  }

  const deleteTimeBox = async (id: string) => {
    try {
      await timeBoxDB.deleteTimeBox(id)
      setTimeBoxes(timeBoxes.filter(box => box.id !== id))
      if (timerState.activeTimer === id) {
        timerManager.clearTimer()
      }
    } catch (error) {
      console.error('Failed to delete timebox:', error)
    }
  }

  const startTimer = (timeBox: TimeBox) => {
    timerManager.startTimer(timeBox.id, timeBox.duration * 60)
  }

  const pauseTimer = () => {
    timerManager.pauseTimer()
  }

  const resumeTimer = () => {
    timerManager.resumeTimer()
  }

  const resetTimer = () => {
    const currentTimeBox = timeBoxes.find(box => box.id === timerState.activeTimer)
    if (currentTimeBox) {
      timerManager.resetTimer(currentTimeBox.duration * 60)
    }
  }

  const completeTimeBox = async (id: string) => {
    const timeBox = timeBoxes.find(box => box.id === id)
    if (!timeBox) return

    // Calculate actual duration if timer is active
    let actualDuration = timeBox.actualDuration
    if (timerState.activeTimer === id) {
      actualDuration = (timeBox.duration * 60) - timerState.timeRemaining
    } else {
      // タイマーなしで完了した場合は、設定時間全体を実施時間とする
      actualDuration = timeBox.duration * 60
    }

    const updatedTimeBox = {
      ...timeBox,
      completed: true,
      actualDuration
    }

    try {
      await timeBoxDB.updateTimeBox(updatedTimeBox)
      setTimeBoxes(timeBoxes.map(box => box.id === id ? updatedTimeBox : box))
      if (timerState.activeTimer === id) {
        timerManager.clearTimer()
      }
    } catch (error) {
      console.error('Failed to update timebox:', error)
    }
  }

  const rerunTimeBox = async (timeBox: TimeBox) => {
    // Create a new timebox based on the completed one
    const newTimeBox: TimeBox = {
      id: Date.now().toString(),
      title: timeBox.title,
      duration: timeBox.duration,
      description: timeBox.description,
      completed: false,
      createdAt: new Date()
    }

    try {
      await timeBoxDB.addTimeBox(newTimeBox)
      setTimeBoxes([...timeBoxes, newTimeBox])
    } catch (error) {
      console.error('Failed to rerun timebox:', error)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const updateTimeBox = async (id: string, updatedData: Partial<TimeBox>) => {
    const updatedTimeBoxes = timeBoxes.map(box =>
      box.id === id ? { ...box, ...updatedData } : box
    )
    const updatedTimeBox = updatedTimeBoxes.find(box => box.id === id)

    if (updatedTimeBox) {
      try {
        await timeBoxDB.updateTimeBox(updatedTimeBox)
        setTimeBoxes(updatedTimeBoxes)
        setEditingTask(null)
      } catch (error) {
        console.error('Failed to update timebox:', error)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">タイムボックスを読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            タイムボックス管理
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            タスクを時間で区切って効率的に作業しましょう
          </p>
        </div>

        {/* Active Timer Display */}
        {timerState.activeTimer && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 text-center">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                実行中のタイムボックス
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                {timeBoxes.find(box => box.id === timerState.activeTimer)?.title}
              </p>
            </div>
            <div className="text-6xl font-mono font-bold text-blue-600 mb-6">
              {formatTime(timerState.timeRemaining)}
            </div>
            <div className="flex justify-center space-x-4">
              {timerState.isRunning ? (
                <button
                  onClick={pauseTimer}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Pause size={20} />
                  <span>一時停止</span>
                </button>
              ) : (
                <button
                  onClick={resumeTimer}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Play size={20} />
                  <span>再開</span>
                </button>
              )}
              <button
                onClick={resetTimer}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <RotateCcw size={20} />
                <span>リセット</span>
              </button>
              <button
                onClick={() => completeTimeBox(timerState.activeTimer!)}
                className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg transition-colors"
              >
                完了
              </button>
            </div>
          </div>
        )}

        {/* Date Filter and Add Button */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsAddingTask(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus size={20} />
              <span>新しいタイムボックスを追加</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={20} className="text-gray-600 dark:text-gray-300" />
            <input
              type="date"
              value={selectedDate || ''}
              onChange={(e) => setSelectedDate(e.target.value || null)}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
            />
            {selectedDate && (
              <button
                onClick={() => setSelectedDate(null)}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                すべて表示
              </button>
            )}
          </div>
        </div>

        {/* Add Task Form */}
        {isAddingTask && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">新しいタイムボックス</h3>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  タスク名
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
                  placeholder="タスク名を入力..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  時間（分）
                </label>
                <input
                  type="number"
                  value={newTask.duration}
                  onChange={(e) => setNewTask({ ...newTask, duration: parseInt(e.target.value) })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  予定日
                </label>
                <input
                  type="date"
                  value={newTask.scheduledDate}
                  onChange={(e) => setNewTask({ ...newTask, scheduledDate: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                説明（任意）
              </label>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
                rows={3}
                placeholder="タスクの詳細..."
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={addTimeBox}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                追加
              </button>
              <button
                onClick={() => setIsAddingTask(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                キャンセル
              </button>
            </div>
          </div>
        )}

        {/* TimeBox List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {timeBoxes
            .filter((timeBox) => {
              if (!selectedDate) return true
              if (!timeBox.scheduledDate) return false
              const boxDate = new Date(timeBox.scheduledDate).toISOString().split('T')[0]
              return boxDate === selectedDate
            })
            .map((timeBox) => (
            <div
              key={timeBox.id}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all ${
                timeBox.completed ? 'opacity-60 bg-green-50' : ''
              } ${timerState.activeTimer === timeBox.id ? 'ring-2 ring-blue-500' : ''}`}
            >
              {editingTask === timeBox.id ? (
                <EditTimeBoxForm
                  timeBox={timeBox}
                  onUpdate={updateTimeBox}
                  onCancel={() => setEditingTask(null)}
                />
              ) : (
                <>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 flex-1">
                      {timeBox.title}
                    </h3>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => setEditingTask(timeBox.id)}
                        className="text-gray-500 hover:text-blue-500 transition-colors"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => deleteTimeBox(timeBox.id)}
                        className="text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    {timeBox.duration}分
                  </div>
                  {timeBox.description && (
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                      {timeBox.description}
                    </p>
                  )}
                  {!timeBox.completed && (
                    <div className="flex space-x-2">
                      {timerState.activeTimer === timeBox.id ? (
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          実行中
                        </span>
                      ) : (
                        <button
                          onClick={() => startTimer(timeBox)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                          disabled={timerState.activeTimer !== null}
                        >
                          <Play size={16} />
                          <span>開始</span>
                        </button>
                      )}
                      <button
                        onClick={() => completeTimeBox(timeBox.id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        完了
                      </button>
                    </div>
                  )}
                  {timeBox.completed && (
                    <div className="flex items-center space-x-2">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        完了済み
                      </span>
                      <button
                        onClick={() => rerunTimeBox(timeBox)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg flex items-center space-x-1 text-sm transition-colors"
                        title="このタスクを再実施"
                      >
                        <RefreshCw size={14} />
                        <span>再実施</span>
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        {timeBoxes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Calendar size={64} className="mx-auto" />
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              まだタイムボックスがありません。<br />
              新しいタスクを追加して始めましょう！
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function EditTimeBoxForm({
  timeBox,
  onUpdate,
  onCancel
}: {
  timeBox: TimeBox
  onUpdate: (id: string, data: Partial<TimeBox>) => void
  onCancel: () => void
}) {
  const [editData, setEditData] = useState({
    title: timeBox.title,
    duration: timeBox.duration,
    description: timeBox.description,
    scheduledDate: timeBox.scheduledDate ? new Date(timeBox.scheduledDate).toISOString().split('T')[0] : ''
  })

  const handleUpdate = () => {
    onUpdate(timeBox.id, {
      ...editData,
      scheduledDate: editData.scheduledDate ? new Date(editData.scheduledDate) : undefined
    })
  }

  return (
    <div>
      <div className="mb-3">
        <input
          type="text"
          value={editData.title}
          onChange={(e) => setEditData({ ...editData, title: e.target.value })}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
        />
      </div>
      <div className="mb-3">
        <input
          type="number"
          value={editData.duration}
          onChange={(e) => setEditData({ ...editData, duration: parseInt(e.target.value) })}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
          min="1"
        />
      </div>
      <div className="mb-3">
        <input
          type="date"
          value={editData.scheduledDate}
          onChange={(e) => setEditData({ ...editData, scheduledDate: e.target.value })}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
        />
      </div>
      <div className="mb-3">
        <textarea
          value={editData.description}
          onChange={(e) => setEditData({ ...editData, description: e.target.value })}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
          rows={2}
        />
      </div>
      <div className="flex space-x-2">
        <button
          onClick={handleUpdate}
          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors"
        >
          保存
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-colors"
        >
          キャンセル
        </button>
      </div>
    </div>
  )
}