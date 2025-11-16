'use client'
import Image from 'next/image'
import { useShoppingCartStore } from '../store/useShoppingCartStore'
import { useTransactionStore } from '../store/useTransactionStore'
import { useRouter } from 'next/navigation'

export default function CartSidebar() {
  const { items, isOpen, closeCart, clearCart, increaseQuantity, decreaseQuantity, removeFromCart } = useShoppingCartStore()
  const addTransaction = useTransactionStore(s => s.addTransactionFromCart)

  const total = items.reduce((s, i) => s + (i.price * (i.quantity || 1)), 0)

  const router = useRouter()

  const pay = () => {
    if (items.length === 0) return
    addTransaction(items)
    clearCart()
    closeCart()
    router.push('/transactions')
  }

  return (
    <aside
      className={`fixed top-0 right-0 z-10 h-full w-80 bg-[#1b1b1b] border-l border-zinc-800 p-4 transition-transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex justify-between mb-4">
        <h2 className="text-lg">Cart</h2>
        <button onClick={closeCart}>Close</button>
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto max-h-[70vh]">
        {items.length === 0 && (
          <p className="opacity-60 text-sm">Your cart is empty.</p>
        )}

        {items.map(item => (
          <div key={item.productId} className="bg-white/5 p-3 rounded-lg flex gap-3 items-center">
            <div className="relative w-12 h-12 bg-white/10 rounded-md overflow-hidden">
              <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
            </div>

            <div className="text-sm flex-1">
              <div className="font-medium text-white">{item.name}</div>
              <div className="text-white/70 text-xs">${item.price.toFixed(2)}</div>

              <div className="mt-2 flex items-center gap-2">
                <button onClick={() => decreaseQuantity(item.productId)} className="px-2 py-1 bg-white/6 rounded">-</button>
                <div className="px-3 py-1 bg-white/5 rounded text-sm">{item.quantity || 1}</div>
                <button onClick={() => increaseQuantity(item.productId)} className="px-2 py-1 bg-white/6 rounded">+</button>
                <button onClick={() => removeFromCart(item.productId)} className="ml-3 text-xs text-red-400">Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto border-t border-zinc-800 pt-3">
        <div className="flex justify-between text-sm mb-3">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>

        <button
          onClick={pay}
          disabled={items.length === 0}
          className="w-full bg-green-700 py-2 rounded disabled:bg-zinc-700"
        >
          Pay
        </button>
      </div>
    </aside>
  )
}
