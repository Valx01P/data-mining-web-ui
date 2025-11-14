'use client'
import { useEffect } from 'react'
import { useProductStore } from './useProductStore'

// runs on completed hydration
function useEnsureProductsLoaded() {
  const hydrated = useProductStore(s => s.hydrated)
  const loaded = useProductStore(s => s.loaded)
  const fetchProducts = useProductStore(s => s.fetchProducts)

  useEffect(() => {
    if (hydrated && !loaded) {
      fetchProducts()
    }
  }, [hydrated, loaded, fetchProducts])
}

// simple state selector, just avoids repeated work
export function useProduct(id: number) {
  useEnsureProductsLoaded()

  const product = useProductStore(s => s.getProductById(id))
  const hydrated = useProductStore(s => s.hydrated)
  const loaded = useProductStore(s => s.loaded)

  return {
    product,
    hydrated,
    loaded,
    loading: !hydrated || !loaded || !product
  }
}


// returns all products
export function useProducts() {
  useEnsureProductsLoaded()
  return useProductStore(s => s.products)
}
