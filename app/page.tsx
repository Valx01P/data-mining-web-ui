'use client'
import { useProducts } from '@/app/store'
import { useMemo } from 'react'
import ProductRow from './components/ProductRow'

export default function Home() {
  const products = useProducts()  // ← auto-hydrates + auto-fetches

  const categoryGroupedRows = useMemo(() => {
    const rows: Record<string, typeof products> = {}

    for (const product of products) {
      if (!rows[product.category]) {
        rows[product.category] = []
      }
      rows[product.category].push(product)
    }

    return rows
  }, [products])

  return (
    <main className="flex flex-col gap-4">
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
    </main>
  )
}
