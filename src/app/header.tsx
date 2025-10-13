"use client"

import Link from "next/link"
import Image from "next/image"
import { SidebarTrigger } from "@/components/ui/sidebar"

export default function Header() {
  return (
    <div className="flex items-center justify-center md:justify-start w-full relative">
      <SidebarTrigger
        className="md:hidden absolute right-0"
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