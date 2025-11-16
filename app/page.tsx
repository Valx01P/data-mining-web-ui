'use client'
import { useProducts } from '@/app/store'
import { useTransactionStore } from '@/app/store/useTransactionStore'
import { useMemo } from 'react'
import ProductRow from './components/ProductRow'
import RecommendationRow from './components/RecommendationRow'

export default function Home() {
  const products = useProducts()
  const transactions = useTransactionStore(s => s.transactions)

  const categoryGroupedRows = useMemo(() => {
    const rows: Record<string, typeof products> = {}
    for (const product of products) {
      if (!rows[product.category]) rows[product.category] = []
      rows[product.category].push(product)
    }
    return rows
  }, [products])

  return (
    <main className="flex flex-col gap-6">

      {/* header hero */}
      <div className="flex items-center justify-center h-[220px]">
        <div className="max-w-3xl w-full text-center backdrop-blur-md bg-white/8 border border-white/20 rounded-2xl p-8 shadow-2xl">
          <h1 className="text-4xl font-extrabold text-white mb-2">Find the latest deals!</h1>
          <p className="text-white/80">Curated food and offers based on recent trends — explore categories below.</p>
        </div>
      </div>

      {/* recommended for you */}
      <RecommendationRow
        products={products}
        userTransactions={transactions}
      />

      {/* categories */}
      <div className="flex flex-col gap-4">
        {Object.entries(categoryGroupedRows).map(([category, pRow]) => (
          <ProductRow key={category} category={category} products={pRow} />
        ))}
      </div>
    </main>
  )
}
