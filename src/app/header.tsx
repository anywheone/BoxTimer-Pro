import Link from "next/link";
import Image from "next/image";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Header() {
  return (
    <div className="flex items-center gap-2 w-full">
      <SidebarTrigger className="md:hidden" />
      <Link href="/">
        <Image
          src="/BoxTimer_Logo.png"
          alt="サイトロゴ"
          width={180}
          height={120}
          priority
          className="h-24 w-auto"
        />
      </Link>
    </div>
  )
}