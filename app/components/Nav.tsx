'use client'
import { usePathname, useRouter } from 'next/navigation'
import { ShoppingCart } from 'lucide-react'
import { useShoppingCartStore } from '../store/useShoppingCartStore'
import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'

export default function Nav() {
  const webUrl = usePathname()
  const router = useRouter()
  const toggle = useShoppingCartStore(s => s.toggleCart)
  const total = useShoppingCartStore(s => s.items.length)

  const isProducts = webUrl === "/" || webUrl.startsWith("/product")
  
  const handleSliderChange = () => {
    if (isProducts) {
      router.push("/transactions")
    } else {
      router.push("/")
    }
  }

  // show/hide nav on scroll: initially in-flow; once user scrolls it becomes fixed and hides while scrolling down
  const [isVisible, setIsVisible] = useState(true)
  const lastYRef = useRef(0)
  const [isFixed, setIsFixed] = useState(false)
  const scrollTimerRef = useRef<number | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY

      // when at top, keep nav in-flow
      if (y === 0) {
        setIsFixed(false)
        setIsVisible(true)
        lastYRef.current = 0
        return
      }

      // once user scrolls away from top, make nav fixed
      if (!isFixed) setIsFixed(true)

      const lastY = lastYRef.current
      if (y > lastY + 5) {
        // scrolling down
        setIsVisible(false)
      } else if (y < lastY - 5) {
        // scrolling up
        setIsVisible(true)
      }

      lastYRef.current = y

      // show nav after user stops scrolling (debounce)
      if (scrollTimerRef.current) window.clearTimeout(scrollTimerRef.current)
      scrollTimerRef.current = window.setTimeout(() => {
        setIsVisible(true)
      }, 250)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollTimerRef.current) window.clearTimeout(scrollTimerRef.current)
    }
  }, [isFixed])

  const navContent = (
    <div className="flex h-[60px] justify-between items-center backdrop-blur-md bg-white/10 border border-white/20 rounded-xl px-6 shadow-lg">
      <Link href="/">
        <h1 className="text-white font-bold text-lg">Grubclub</h1>
      </Link>
      <ul className='flex flex-row gap-6 items-center'>
        <li className="flex items-center gap-3">
          <span className={`text-sm font-semibold transition-colors duration-300 ${isProducts ? 'text-white' : 'text-white/50'}`}>
            Products
          </span>
          <button
            onClick={handleSliderChange}
            className={`relative inline-flex h-8 w-16 items-center rounded-full transition-all duration-300 ${
              isProducts ? 'bg-gradient-to-r from-green-500 to-green-600 shadow-lg shadow-green-500/50' : 'bg-white/20'
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 shadow-md ${
                isProducts ? 'translate-x-1' : 'translate-x-9'
              }`}
            />
          </button>
          <span className={`text-sm font-semibold transition-colors duration-300 ${!isProducts ? 'text-white' : 'text-white/50'}`}>
            Transactions
          </span>
        </li>
        <li className="relative cursor-pointer hover:opacity-80 transition-opacity" onClick={toggle}>
          <ShoppingCart strokeWidth={1.5} className="text-white" />
          {total > 0 && (
            <div className="absolute top-2 left-3 w-4 h-4 rounded-full bg-gradient-to-r from-green-400 to-green-500 text-white text-[10px] font-bold flex items-center justify-center shadow-lg">
              {total}
            </div>
          )}
        </li>
      </ul>
    </div>
  )

  return (
    <>
      {/* if nav is fixed we render a placeholder to avoid layout jump */}
      {isFixed && <div className="h-[76px]" aria-hidden />}

      {isFixed ? (
        <nav className={`fixed left-1/2 top-4 z-50 w-[calc(100%-48px)] max-w-6xl -translate-x-1/2 transition-transform duration-300 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-24 opacity-0'}`}>
          {navContent}
        </nav>
      ) : (
        <nav className="w-full">
          {navContent}
        </nav>
      )}
    </>
  )
}