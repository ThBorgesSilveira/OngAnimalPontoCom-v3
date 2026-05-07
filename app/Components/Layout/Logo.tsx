import Link from "next/link"
import Image from "next/image"

export default function Logo() {
  return (
    <Link href="/" className="navbar-brand">
      <div className="logo">
        <Image
          src="/images/Logo.png"
          alt="Logo AnimalPontoCom"
          width={120}
          height={60}
        />
      </div>
    </Link>
  )
}
