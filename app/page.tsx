'use client'
import { useEffect, useState } from "react"
import { useProductStore } from "./store/useProductStore"
import { Product } from "./types"
import ProductRow from "./components/ProductRow"

export default function Home() {
  const [categoryGroupedRows, setCategoryGroupedRows] = useState<Record<string, Product[]>>({})
  const products = useProductStore(state => state.products)
  const fetchProducts = useProductStore(state => state.fetchProducts)

  useEffect(() => {
    fetchProducts()
    const rows: Record<string, Product[]> = {} // categoryGroupedRows

    for (const product of products) {
      if (!rows[product.category]) {
        rows[product.category] = []
      }
      rows[product.category].push(product)
    }

    setCategoryGroupedRows(rows)
  }, [fetchProducts, products])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start h-[200px]">
        <h1>Find the latest deals!</h1>
      </div>

      <div className="flex flex-col gap-4">
        {Object.entries(categoryGroupedRows).map(([category, pRow]) => (
          <ProductRow 
            key={category}
            category={category}
            products={pRow}
          />
        ))}
      </div>
    </div>
  )
}
