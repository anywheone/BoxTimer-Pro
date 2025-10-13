"use client"

import { useState, useEffect, useRef } from 'react'
import Link from "next/link"
import Image from "next/image"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useSidebarPosition } from '@/contexts/SidebarPositionContext'

// Get initial position from localStorage synchronously
function getInitialPosition(): 'left' | 'right' {
  if (typeof window === 'undefined') return 'left'
  try {
    const stored = localStorage.getItem('sidebarPosition')
    return (stored === 'left' || stored === 'right') ? stored : 'left'
  } catch {
    return 'left'
  }
}

export default function Header() {
  // Use localStorage for initial value to prevent flickering
  const [localPosition, setLocalPosition] = useState<'left' | 'right'>(getInitialPosition)
  const { sidebarPosition } = useSidebarPosition()
  const isMobileRef = useRef(false)

  // Check if mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      isMobileRef.current = window.innerWidth < 768
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Update local position when context changes (only on desktop)
  useEffect(() => {
    // スマホ表示では初期位置を維持し、動的変更しない
    if (!isMobileRef.current) {
      setLocalPosition(sidebarPosition)
    }
  }, [sidebarPosition])

  return (
    <div className="flex items-center justify-center md:justify-start w-full relative">
      <SidebarTrigger
        className={`md:hidden absolute ${localPosition === 'left' ? 'left-0' : 'right-0'}`}
      />
      <Link href="/" className="inline-block overflow-visible">
        <Image
          src="/BoxTimer_Logo.png"
          alt="サイトロゴ"
          width={180}
          height={120}
          priority
          className="h-24 w-auto scale-110"
        />
      </Link>
    </div>
  )
}