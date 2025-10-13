"use client"

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
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
  const pathname = usePathname()

  // Update local position when context changes
  // スマホでも設定変更を反映するため、常にsidebarPositionを追従
  useEffect(() => {
    setLocalPosition(sidebarPosition)
  }, [sidebarPosition])

  // ページ遷移後、localStorageから確実に読み直して正しい値を反映
  useEffect(() => {
    const storedPosition = getInitialPosition()
    setLocalPosition(storedPosition)
  }, [pathname])

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