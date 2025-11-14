'use client'
import Image from "next/image"
import Link from "next/link"
import { Product } from "../types"

interface ProductRowProps {
  category: string
  products: Product[]
}

export default function ProductRow({ category, products }: ProductRowProps) {
  return (
    <div className="flex flex-col h-70 bg-[#1b1b1b] w-full p-4 rounded-md">
      <h2 className="capitalize mb-2">{category}</h2>

      <div className="flex flex-row gap-8 h-full overflow-x-auto snap-x snap-mandatory">
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/product/${p.id}`}
            className="w-50 h-50 shrink-0 snap-start bg-white relative cursor-pointer rounded-md"
          >
            <Image
              src={p.main_image_url}
              alt={p.name}
              fill
              className="object-contain p-2"
            />
          </Link>
        ))}
      </div>
    </div>
  )
}
