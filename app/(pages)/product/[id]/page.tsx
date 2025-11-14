'use client'
import { use } from 'react'
import Image from 'next/image'
import { useProduct } from '@/app/store'
import { useShoppingCartStore } from '@/app/store/useShoppingCartStore'

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const productId = Number(id)

  const { product, loading } = useProduct(productId)
  const add = useShoppingCartStore(s => s.addToCart)
  const open = useShoppingCartStore(s => s.openCart)

  if (loading) return <main>Loading…</main>
  if (!product) return <main>Not found</main>

  return (
    <main className="flex gap-4 pb-8">
      <aside>
        <div className="w-60 h-60 bg-white relative rounded-md">
          <Image src={product.secondary_image_url} alt={product.name} fill className="object-contain p-2" />
        </div>
      </aside>

      <section className="flex flex-col gap-4 text-sm">
        <div>
          <h1 className="text-xl">{product.title}</h1>
          <h2 className="text-lg text-green-500">${product.price}</h2>

          <div className="mt-4 flex flex-col gap-2 w-[140px]">
            <button
              onClick={() => add(product)}
              className="bg-green-800 py-2 px-4 rounded-full"
            >
              Add to cart
            </button>
            <button
              onClick={() => {
                add(product)
                open()
              }}
              className="bg-green-900 py-2 px-4 rounded-full"
            >
              Buy now
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <h3 className="font-semibold mb-1">Ingredients</h3>
            <p>{product.ingredients}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-1">Nutrition Facts</h3>
            {product.nutrition_facts.map((n, i) => <p key={i}>{n}</p>)}
          </div>

          <div>
            <h3 className="font-semibold mb-1">About</h3>
            <ul className="list-disc pl-4">
              {product.about.map((a, i) => <li key={i}>{a}</li>)}
            </ul>
          </div>
        </div>
      </section>
    </main>
  )
}
