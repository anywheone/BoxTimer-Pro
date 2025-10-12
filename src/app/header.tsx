import Link from "next/link";
import Image from "next/image";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Header() {
  return (
    <div className="flex items-center justify-center w-full relative">
      <SidebarTrigger className="md:hidden absolute left-0" />
      <Link href="/">
        <Image
          src="/BoxTimer_Logo.png"
          alt="サイトロゴ"
          width={160}
          height={100}
          priority
          className="h-20 w-auto"
        />
      </Link>
    </div>
  )
}