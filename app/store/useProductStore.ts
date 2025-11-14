'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Product, ProductResponse } from '../types'

interface ProductStore {
  products: Product[]
  loaded: boolean
  fetchProducts: () => Promise<void>
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: [], // initial state
      loaded: false,

      fetchProducts: async () => {
        if (get().loaded) return

        try {
          const res = await fetch('/data/products.json')
          const json: ProductResponse = await res.json()

          set({
            products: json.products,
            loaded: true
          })
        } catch (err) {
          console.error("Failed to fetch products", err)
        }
      }
    }),
    {
      name: 'product-store', // key for local storage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        products: state.products,
        loaded: state.loaded
      })
    }
  )
)
