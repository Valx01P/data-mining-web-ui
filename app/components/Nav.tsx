'use client'
import { usePathname } from 'next/navigation'
import { ShoppingCart } from 'lucide-react'
import { useShoppingCartStore } from '../store/useShoppingCartStore'
import Link from 'next/link'

export default function Nav() {
  const webUrl = usePathname()
  const toggle = useShoppingCartStore(s => s.toggleCart)
  const total = useShoppingCartStore(s => s.items.length)

  return (
    <nav className="flex h-[60px] justify-between items-center">
      <Link href="/">
        <h1>Grubclub</h1>
      </Link>
      <ul className='flex flex-row gap-4'>
        <li>
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
        </li>
        <li className="relative cursor-pointer" onClick={toggle}>
          <ShoppingCart strokeWidth={1.5} />
          {total > 0 && (
            <div className="absolute top-2 left-3 w-4 h-4 rounded-full bg-green-500 text-black text-[10px] font-bold flex items-center justify-center">
              {total}
            </div>
          )}
        </li>
      </ul>
    </nav>
  )
}