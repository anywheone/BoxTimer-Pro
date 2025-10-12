"use client"

import { useState, useEffect } from 'react'
import Link from "next/link"
import Image from "next/image"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { timeBoxDB } from '@/lib/indexeddb'

export default function Header() {
  const [sidebarPosition, setSidebarPosition] = useState<'left' | 'right'>('left')

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await timeBoxDB.getSettings()
        setSidebarPosition(settings.sidebarPosition || 'left')
      } catch (error) {
        console.error('Failed to load sidebar position:', error)
      }
    }
    loadSettings()
  }, [])

  return (
    <div className="flex items-center justify-center w-full relative">
      <SidebarTrigger
        className={`md:hidden absolute ${sidebarPosition === 'left' ? 'left-0' : 'right-0'}`}
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