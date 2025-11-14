'use client'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Product, ProductResponse } from '../types'

// tracks and stores all the products in state
interface ProductStore {
  products: Product[]
  loaded: boolean
  hydrated: boolean
  fetchProducts: () => Promise<void>
  getProductById: (id: number) => Product | undefined
  getProductsByCategory: (category: string) => Product[]
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: [],
      loaded: false,
      hydrated: false,

      fetchProducts: async () => {
        if (get().loaded) return

        try {
          const res = await fetch('/data/products.json')
          const json: ProductResponse = await res.json()

          set({
            products: json.products,
            loaded: true,
          })
        } catch (err) {
          console.error('Failed to fetch products', err)
        }
      },

      getProductById: (id) =>
        get().products.find(p => p.id === id),

      getProductsByCategory: (category) =>
        get().products.filter(p => p.category === category)
    }),
    {
      name: 'product-store',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        products: state.products,
        loaded: state.loaded
      }),
      onRehydrateStorage: () => (state) => {
        if (state) state.hydrated = true
      }
    }
  )
)
