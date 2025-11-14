'use client'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { CartItem, Product } from '../types'

// manages and stores all the shopping cart related state
interface ShoppingCartState {
  items: CartItem[]
  isOpen: boolean

  addToCart: (product: Product) => void
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
        const exists = get().items.some(i => i.productId === product.id)
        if (exists) return

        const newItem: CartItem = {
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.main_image_url
        }

        set(state => ({
          ...state,
          items: [...state.items, newItem]
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
