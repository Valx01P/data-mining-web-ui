'use client'
import { useState, useMemo } from 'react'
import { useTransactionStore } from '@/app/store/useTransactionStore'
import { useProducts } from '@/app/store'
import { ArrowUp, ArrowDown, ChevronDown, ChevronUp, X } from 'lucide-react'
import QueryPanel from '@/app/components/QueryPanel'

import type { Product } from '@/app/types'

export default function Transactions() {
  const txs = useTransactionStore(s => s.transactions)
  const loadSample = useTransactionStore(s => s.loadSampleTransactions)
  const loadedSample = useTransactionStore(s => s.loadedSample)
  const clearAll = useTransactionStore(s => s.clearAll)
  const addTx = useTransactionStore(s => s.addTransactionFromCart)

  // preprocessing stats
  const total = useTransactionStore(s => s.totalTransactions)
  const empty = useTransactionStore(s => s.emptyTransactions)
  const single = useTransactionStore(s => s.singleItemTransactions)
  const duplicates = useTransactionStore(s => s.duplicateItemTransactions)
  const invalid = useTransactionStore(s => s.invalidItemTransactions)

  const products = useProducts()

  const [sortAsc, setSortAsc] = useState(true)

  const [builderOpen, setBuilderOpen] = useState(false)
  const [builderItems, setBuilderItems] = useState<
    {
      productId: number
      name: string
      price: number
      image: string
    }[]
  >([])

  const sortedTx = useMemo(() => {
    return [...txs].sort((a, b) => (sortAsc ? a.id - b.id : b.id - a.id))
  }, [txs, sortAsc])

  const addToBuilder = (p: Product) => {
    const exists = builderItems.some(i => i.productId === p.id)
    if (exists) return

    setBuilderItems([
      ...builderItems,
      {
        productId: p.id,
        name: p.name,
        price: p.price,
        image: p.main_image_url
      }
    ])
  }

  const removeFromBuilder = (id: number) => {
    setBuilderItems(builderItems.filter(i => i.productId !== id))
  }

  const clearBuilder = () => setBuilderItems([])

  const createTransactionFromBuilder = () => {
    if (builderItems.length === 0) return
    addTx(builderItems)
    clearBuilder()
    setBuilderOpen(false)
  }

  return (
    <main className="p-6 flex flex-col gap-6">
      {/* header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl">transactions</h1>

        <div className="flex gap-2 items-center">
          {/* toggle builder */}
          <button
            onClick={() => setBuilderOpen(!builderOpen)}
            className="bg-zinc-800 px-3 py-2 rounded text-sm flex items-center gap-1"
          >
            {builderOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            quick builder
          </button>

          {/* sort */}
          <button
            onClick={() => setSortAsc(!sortAsc)}
            className="bg-zinc-800 p-2 rounded"
          >
            {sortAsc ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
          </button>

          {/* clear */}
          <button
            onClick={clearAll}
            className="bg-zinc-800 px-3 py-2 rounded text-sm"
          >
            clear all
          </button>

          {/* load sample */}
          <button
            onClick={loadSample}
            className="bg-zinc-800 px-3 py-2 rounded text-sm"
          >
            {loadedSample ? 'sample loaded' : 'load sample csv'}
          </button>
        </div>
      </div>

      {/* quick builder panel */}
      {builderOpen && (
        <div className="bg-[#1b1b1b] p-4 rounded flex flex-col gap-4">
          <div className="flex flex-row overflow-x-auto gap-2 pb-2">
            {products.map((p) => (
              <button
                key={p.id}
                onClick={() => addToBuilder(p)}
                className="bg-zinc-800 px-3 py-2 rounded text-sm shrink-0"
              >
                {p.name}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            {builderItems.length === 0 ? (
              <p className="text-sm opacity-70">no items selected</p>
            ) : (
              builderItems.map((item) => (
                <div
                  key={item.productId}
                  className="bg-zinc-900 p-2 rounded text-sm flex justify-between items-center"
                >
                  <span>{item.name}</span>
                  <button onClick={() => removeFromBuilder(item.productId)}>
                    <X size={14} />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={createTransactionFromBuilder}
              className="bg-green-700 px-3 py-2 rounded text-sm"
            >
              create transaction
            </button>
            <button
              onClick={clearBuilder}
              className="bg-zinc-800 px-3 py-2 rounded text-sm"
            >
              clear
            </button>
          </div>
        </div>
      )}

      {/* stats */}
      {loadedSample && (
        <div className="bg-[#1b1b1b] p-4 rounded text-sm flex flex-col gap-1">
          <p>total rows: {total}</p>
          <p>empty removed: {empty}</p>
          <p>single-item removed: {single}</p>
          <p>duplicate items removed: {duplicates}</p>
          <p>invalid items removed: {invalid}</p>
        </div>
      )}

      {/* query analysis panel */}
      <QueryPanel transactions={txs} />

      {/* transaction list */}
      {txs.length === 0 ? (
        <p className="opacity-60">no transactions yet</p>
      ) : (
        <div className="flex flex-col gap-3 max-h-[50vh] overflow-y-auto">
          {sortedTx.map((tx) => (
            <div key={tx.id} className="bg-[#1b1b1b] p-3 rounded text-sm">
              <div className="flex justify-between mb-1">
                <span>transaction #{tx.id}</span>
                <span className="opacity-60">{tx.source}</span>
              </div>
              <p>{tx.items.join(', ')}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
