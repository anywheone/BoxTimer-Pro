"use client"

import { useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'

export default function PullToRefresh() {
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [touchStart, setTouchStart] = useState(0)

  useEffect(() => {
    let startY = 0
    let currentY = 0

    const handleTouchStart = (e: TouchEvent) => {
      // Only activate when scrolled to top
      if (window.scrollY === 0) {
        startY = e.touches[0].clientY
        setTouchStart(startY)
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (window.scrollY === 0 && touchStart > 0) {
        currentY = e.touches[0].clientY
        const distance = currentY - startY

        // Only pull down
        if (distance > 0) {
          setPullDistance(Math.min(distance, 100))

          // Prevent default scrolling when pulling
          if (distance > 10) {
            e.preventDefault()
          }
        }
      }
    }

    const handleTouchEnd = () => {
      if (pullDistance > 60) {
        setIsRefreshing(true)

        // Reload the page
        setTimeout(() => {
          window.location.reload()
        }, 300)
      } else {
        setPullDistance(0)
      }
      setTouchStart(0)
    }

    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd)

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [touchStart, pullDistance])

  return (
    <div
      className="fixed top-0 left-0 right-0 flex justify-center items-center pointer-events-none z-[60] transition-all duration-200"
      style={{
        height: `${pullDistance}px`,
        opacity: pullDistance / 100
      }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg">
        <RefreshCw
          size={24}
          className={`text-blue-600 dark:text-blue-400 ${
            isRefreshing || pullDistance > 60 ? 'animate-spin' : ''
          }`}
          style={{
            transform: `rotate(${pullDistance * 3.6}deg)`
          }}
        />
      </div>
    </div>
  )
}
