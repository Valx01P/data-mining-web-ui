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
  const increase = useShoppingCartStore(s => s.increaseQuantity)
  const decrease = useShoppingCartStore(s => s.decreaseQuantity)
  const remove = useShoppingCartStore(s => s.removeFromCart)
  const items = useShoppingCartStore(s => s.items)

  if (loading) return <main>Loading…</main>
  if (!product) return <main>Not found</main>

  return (
    <main className="flex gap-6 pb-8">
      <aside>
        <div className="w-60 h-60 bg-white/10 backdrop-blur-md border border-white/20 relative rounded-xl shadow-lg">
          <Image src={product.secondary_image_url} alt={product.name} fill className="object-contain p-2" />
        </div>
      </aside>

      <section className="flex flex-col gap-4 text-sm">
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-6 shadow-lg">
          <h1 className="text-3xl font-bold text-white">{product.title}</h1>
          <h2 className="text-2xl font-semibold text-green-400 mt-2">${product.price}</h2>

          <div className="mt-6 flex flex-col gap-3 w-[220px]">
            {(() => {
              const cartItem = items.find(i => i.productId === productId)
              const qty = cartItem ? (cartItem.quantity || 1) : 0
              if (qty === 0) {
                return (
                  <>
                    <button
                      onClick={() => add(product)}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:shadow-lg hover:shadow-green-500/50 text-white font-semibold py-2 px-4 rounded-full transition-all duration-300"
                    >
                      Add to cart
                    </button>
                    <button
                      onClick={() => {
                        add(product)
                        open()
                      }}
                      className="bg-gradient-to-r from-emerald-600 to-green-700 hover:shadow-lg hover:shadow-green-600/50 text-white font-semibold py-2 px-4 rounded-full transition-all duration-300"
                    >
                      Buy now
                    </button>
                  </>
                )
              }

              return (
                <div className="flex items-center gap-3">
                  <button onClick={() => decrease(productId)} className="px-3 py-2 bg-white/6 rounded">-</button>
                  <div className="px-4 py-2 bg-white/5 rounded">{qty}</div>
                  <button onClick={() => increase(productId)} className="px-3 py-2 bg-white/6 rounded">+</button>
                  <button onClick={() => remove(productId)} className="ml-3 text-sm text-red-400">Remove</button>
                  <button onClick={open} className="ml-auto bg-gradient-to-r from-emerald-600 to-green-700 text-white px-3 py-2 rounded-lg">View Cart</button>
                </div>
              )
            })()}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-4 shadow-lg">
            <h3 className="font-semibold mb-2 text-white text-lg">Ingredients</h3>
            <p className="text-white/80">{product.ingredients}</p>
          </div>

          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-4 shadow-lg">
            <h3 className="font-semibold mb-2 text-white text-lg">Nutrition Facts</h3>
            <div className="space-y-1">
              {product.nutrition_facts.map((n, i) => <p key={i} className="text-white/80">{n}</p>)}
            </div>
          </div>

          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-4 shadow-lg">
            <h3 className="font-semibold mb-2 text-white text-lg">About</h3>
            <ul className="list-disc pl-5 space-y-1">
              {product.about.map((a, i) => <li key={i} className="text-white/80">{a}</li>)}
            </ul>
          </div>
        </div>
      </section>
    </main>
  )
}
