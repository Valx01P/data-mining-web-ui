'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Product } from '../types'
import { useShoppingCartStore } from '../store/useShoppingCartStore'

interface ProductRowProps {
  category: string
  products: Product[]
}

export default function ProductRow({ category, products }: ProductRowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const addToCart = useShoppingCartStore(s => s.addToCart)

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount)
      scrollContainerRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' })
      setTimeout(checkScroll, 300)
    }
  }

  return (
    <div className="backdrop-blur-md bg-white/6 border border-white/10 rounded-2xl p-4 shadow-2xl">
      <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="capitalize text-2xl font-bold text-white">{category}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-lg transition-all duration-300 text-white"
            aria-label={`Scroll ${category} left`}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-lg transition-all duration-300 text-white"
            aria-label={`Scroll ${category} right`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="flex flex-row gap-4 overflow-x-auto scroll-smooth pb-2"
        >
          {products.map((p) => {
            const shortTitle =
              p.title.length > 26 ? p.title.slice(0, 26) + "..." : p.title

            return (
              <div
                key={p.id}
                className="backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/20 hover:shadow-lg hover:shadow-white/20 w-56 h-64 shrink-0 relative rounded-xl p-3 flex flex-col transition-all duration-300 shadow-lg"
              >
                {/* IMAGE (clickable) */}
                <Link href={`/product/${p.id}`} className="relative w-full h-40 bg-white/5 rounded-lg overflow-hidden">
                  <Image
                    src={p.main_image_url}
                    alt={p.name}
                    fill
                    className="object-contain p-2"
                  />
                </Link>

                {/* TITLE */}
                <Link href={`/product/${p.id}`} className="text-white text-[13px] leading-tight mt-2 truncate font-medium hover:underline">
                  {shortTitle}
                </Link>

                <div className="mt-auto flex items-center justify-between gap-2">
                  {/* PRICE */}
                  <p className="text-green-400 text-[14px] font-bold">
                    ${p.price.toFixed(2)}
                  </p>

                  {/* ADD TO CART */}
                  <button
                    onClick={() => addToCart(p)}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-md text-sm font-semibold hover:scale-105 transition-transform"
                    aria-label={`Add ${p.title} to cart`}
                  >
                    Add
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  </div>
  )
}
