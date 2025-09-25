import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
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
  )
}