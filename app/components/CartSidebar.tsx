'use client'
import Image from 'next/image'
import { useShoppingCartStore } from '../store/useShoppingCartStore'
import { useTransactionStore } from '../store/useTransactionStore'

export default function CartSidebar() {
  const { items, isOpen, closeCart, clearCart } = useShoppingCartStore()
  const addTransaction = useTransactionStore(s => s.addTransactionFromCart)

  const total = items.reduce((s, i) => s + i.price, 0)

  const pay = () => {
    if (items.length === 0) return
    addTransaction(items)
    clearCart()
    closeCart()
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
          <div key={item.productId} className="bg-zinc-900 p-2 rounded flex gap-3">
            <div className="relative w-10 h-10 bg-white">
              <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
            </div>

            <div className="text-xs flex-1">
              <div>{item.name}</div>
              <div className="opacity-70">${item.price.toFixed(2)}</div>
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
