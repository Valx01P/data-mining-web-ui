'use client'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { CartItem, Product } from '../types'

// manages and stores all the shopping cart related state
interface ShoppingCartState {
  items: CartItem[]
  isOpen: boolean

  addToCart: (product: Product) => void
  increaseQuantity: (productId: number) => void
  decreaseQuantity: (productId: number) => void
  setQuantity: (productId: number, qty: number) => void
  removeFromCart: (productId: number) => void
  clearCart: () => void

  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
}

export const useShoppingCartStore = create<ShoppingCartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addToCart: (product) => {
        const items = get().items
        const idx = items.findIndex(i => i.productId === product.id)
        if (idx === -1) {
          const newItem: CartItem = {
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.main_image_url,
            quantity: 1
          }
          set(state => ({ ...state, items: [...state.items, newItem] }))
        } else {
          // increment quantity
          const next = items.map(i =>
            i.productId === product.id ? { ...i, quantity: (i.quantity || 1) + 1 } : i
          )
          set({ items: next })
        }
      },

      increaseQuantity: (productId) => {
        set(state => ({
          ...state,
          items: state.items.map(i => i.productId === productId ? { ...i, quantity: (i.quantity || 1) + 1 } : i)
        }))
      },

      decreaseQuantity: (productId) => {
        const items = get().items
        const item = items.find(i => i.productId === productId)
        if (!item) return
        if ((item.quantity || 1) <= 1) {
          // remove item
          set(state => ({ ...state, items: state.items.filter(i => i.productId !== productId) }))
        } else {
          set(state => ({
            ...state,
            items: state.items.map(i => i.productId === productId ? { ...i, quantity: (i.quantity || 1) - 1 } : i)
          }))
        }
      },

      setQuantity: (productId, qty) => {
        if (qty <= 0) {
          set(state => ({ ...state, items: state.items.filter(i => i.productId !== productId) }))
          return
        }
        set(state => ({
          ...state,
          items: state.items.map(i => i.productId === productId ? { ...i, quantity: qty } : i)
        }))
      },

      removeFromCart: (productId) =>
        set(state => ({
          ...state,
          items: state.items.filter(i => i.productId !== productId)
        })),

      clearCart: () => set(state => ({ ...state, items: [] })),

      openCart: () => set(state => ({ ...state, isOpen: true })),
      closeCart: () => set(state => ({ ...state, isOpen: false })),
      toggleCart: () => set(state => ({ ...state, isOpen: !state.isOpen }))
    }),
    {
      name: "shopping-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        items: state.items,
      })
    }
  )
)
