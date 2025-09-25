import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <Link href="/">
      <Image
        src="/BoxTimer_Logo.png"
        alt="サイトロゴ"
        width={220}
        height={0}
        priority
      />
    </Link>
  )
}