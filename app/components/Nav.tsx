'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function Nav() {
  const webUrl = usePathname()

  return (
    <nav className="flex h-[60px] justify-between items-center">
      <Link href="/">
        <h1>Grubclub</h1>
      </Link>
      <ul>
        {
          webUrl == "/"
          ?
            <Link href="/transactions">
              Transactions
            </Link>
          :
            <Link href="/">
              Products
            </Link>
        }
      </ul>
    </nav>
  )
}