"use client"

import { useState, useEffect } from 'react'
import { CalendarIcon, Clock, CheckCircle, Target, TrendingUp, TrendingDown } from 'lucide-react'
import { timeBoxDB, type TimeBox } from '@/lib/indexeddb'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

interface DailyStats {
  date: string
  totalTasks: number
  completedTasks: number
  totalTime: number
  completedTime: number
  tasks: TimeBox[]
}

export default function ReviewPage() {
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([])
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDailyStats()
  }, [])

  const loadDailyStats = async () => {
    try {
      const allTimeBoxes = await timeBoxDB.getAllTimeBoxes()

      // Group timeboxes by date
      const groupedByDate: { [key: string]: TimeBox[] } = {}

      allTimeBoxes.forEach(timebox => {
        const date = new Date(timebox.createdAt).toDateString()
        if (!groupedByDate[date]) {
          groupedByDate[date] = []
        }
        groupedByDate[date].push(timebox)
      })

      // Calculate daily statistics
      const stats: DailyStats[] = Object.entries(groupedByDate)
        .map(([date, tasks]) => {
          const totalTasks = tasks.length
          const completedTasks = tasks.filter(task => task.completed).length
          // actualDurationがあればそれを使用、なければduration（分）を秒に変換
          const totalTime = tasks.reduce((sum, task) => {
            const seconds = task.actualDuration ?? (task.duration * 60)
            return sum + seconds
          }, 0)
          const completedTime = tasks
            .filter(task => task.completed)
            .reduce((sum, task) => {
              const seconds = task.actualDuration ?? (task.duration * 60)
              return sum + seconds
            }, 0)

          return {
            date,
            totalTasks,
            completedTasks,
            totalTime: totalTime / 3600, // Convert to hours (秒→時間)
            completedTime: completedTime / 3600, // Convert to hours (秒→時間)
            tasks
          }
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

      setDailyStats(stats)
      if (stats.length > 0) {
        setSelectedDate(stats[0].date)
      }
    } catch (error) {
      console.error('Failed to load daily stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return '今日'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return '昨日'
    } else {
      return date.toLocaleDateString('ja-JP', {
        month: 'long',
        day: 'numeric',
        weekday: 'short'
      })
    }
  }

  const getCompletionRate = (completed: number, total: number) => {
    if (total === 0) return 0
    return Math.round((completed / total) * 100)
  }

  const selectedDayStats = dailyStats.find(stat => stat.date === selectedDate)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">データを読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            📊 タイムボックス振り返り
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            日ごとの実績を確認して、生産性を向上させましょう
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Daily List */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                <CalendarIcon className="mr-2 h-5 w-5" />
                日付別実績
              </h2>

              {/* Date Picker */}
              <div className="mb-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="w-full flex items-center justify-between gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                      <span className="text-sm font-medium">
                        {selectedDate ? format(new Date(selectedDate), 'yyyy年MM月dd日', { locale: ja }) : '日付を選択'}
                      </span>
                      <CalendarIcon size={16} className="text-gray-500 dark:text-gray-400" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate ? new Date(selectedDate) : undefined}
                      onSelect={(date) => {
                        if (date) {
                          setSelectedDate(date.toDateString())
                        }
                      }}
                      locale={ja}
                      className="rounded-md border-0"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {dailyStats.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  まだタイムボックスの実績がありません
                </p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {dailyStats.map((stat) => (
                    <div
                      key={stat.date}
                      onClick={() => setSelectedDate(stat.date)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedDate === stat.date
                          ? 'bg-blue-100 dark:bg-blue-900 border-2 border-blue-300 dark:border-blue-600'
                          : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-800 dark:text-gray-200">
                          {formatDate(stat.date)}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {getCompletionRate(stat.completedTasks, stat.totalTasks)}%
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Target className="h-4 w-4 mr-1" />
                        <span>{stat.completedTasks}/{stat.totalTasks}</span>
                        <Clock className="h-4 w-4 ml-3 mr-1" />
                        <span>{stat.completedTime.toFixed(1)}h</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Detailed View */}
          <div className="lg:col-span-2">
            {selectedDayStats ? (
              <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">完了率</p>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {getCompletionRate(selectedDayStats.completedTasks, selectedDayStats.totalTasks)}%
                        </p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">完了時間</p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {selectedDayStats.completedTime.toFixed(1)}h
                        </p>
                      </div>
                      <Clock className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">完了タスク</p>
                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          {selectedDayStats.completedTasks}/{selectedDayStats.totalTasks}
                        </p>
                      </div>
                      <Target className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                </div>

                {/* Task List */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                    {formatDate(selectedDate)}のタスク詳細
                  </h3>

                  <div className="space-y-3">
                    {selectedDayStats.tasks.map((task) => (
                      <div
                        key={task.id}
                        className={`p-4 rounded-lg border-2 ${
                          task.completed
                            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
                            : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            {task.completed ? (
                              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-3" />
                            ) : (
                              <div className="h-5 w-5 rounded-full border-2 border-gray-400 mr-3" />
                            )}
                            <div>
                              <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                                {task.title}
                              </h4>
                              {task.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  {task.description}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              {task.actualDuration
                                ? `${Math.floor(task.actualDuration / 60)}分`
                                : `${task.duration}分`}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                              {new Date(task.createdAt).toLocaleTimeString('ja-JP', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  左側から日付を選択してください
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}