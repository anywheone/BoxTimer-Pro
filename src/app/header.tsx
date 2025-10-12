import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <div className="flex items-center gap-2 w-full">
      <Link href="/">
        <Image
          src="/BoxTimer_Logo.png"
          alt="サイトロゴ"
          width={120}
          height={80}
          priority
          className="h-16 w-auto"
        />
      </Link>
    </div>
  )
}