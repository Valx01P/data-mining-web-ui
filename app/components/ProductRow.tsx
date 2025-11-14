'use client'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '../types'

interface ProductRowProps {
  category: string
  products: Product[]
}

export default function ProductRow({ category, products }: ProductRowProps) {
  return (
    <div className="flex flex-col h-70 bg-[#1b1b1b] w-full p-4 rounded-md">
      <h2 className="capitalize mb-2">{category}</h2>

      <div className="flex flex-row gap-8 h-full overflow-x-auto">
        {products.map((p) => {
          const shortTitle =
            p.title.length > 26 ? p.title.slice(0, 26) + "..." : p.title

          return (
            <Link
              key={p.id}
              href={`/product/${p.id}`}
              className="w-52 h-52 shrink-0 bg-white relative cursor-pointer rounded-md p-2 flex flex-col"
            >
              {/* IMAGE */}
              <div className="relative w-full h-36 bg-white">
                <Image
                  src={p.main_image_url}
                  alt={p.name}
                  fill
                  className="object-contain p-2"
                />
              </div>

              {/* TITLE */}
              <p className="text-black text-[13px] leading-tight mt-1 truncate">
                {shortTitle}
              </p>

              {/* PRICE */}
              <p className="text-black text-[14px] font-semibold">
                ${p.price.toFixed(2)}
              </p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
