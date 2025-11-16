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
        <h1 className="text-4xl font-bold text-white">Transactions</h1>

        <div className="flex gap-2 items-center">
          {/* toggle builder */}
          <button
            onClick={() => setBuilderOpen(!builderOpen)}
            className="backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/20 px-3 py-2 rounded-lg text-sm flex items-center gap-1 text-white font-medium transition-all duration-300 shadow-lg"
          >
            {builderOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            quick builder
          </button>

          {/* sort */}
          <button
            onClick={() => setSortAsc(!sortAsc)}
            className="backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/20 p-2 rounded-lg text-white transition-all duration-300 shadow-lg"
          >
            {sortAsc ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
          </button>

          {/* clear */}
          <button
            onClick={clearAll}
            className="backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/20 px-3 py-2 rounded-lg text-sm text-white font-medium transition-all duration-300 shadow-lg"
          >
            clear all
          </button>

          {/* load sample */}
          <button
            onClick={loadSample}
            className="backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/20 px-3 py-2 rounded-lg text-sm text-white font-medium transition-all duration-300 shadow-lg"
          >
            {loadedSample ? 'sample loaded' : 'load sample csv'}
          </button>
        </div>
      </div>

      {/* quick builder panel */}
      {builderOpen && (
        <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-xl flex flex-col gap-4 shadow-lg">
          <div className="flex flex-row overflow-x-auto gap-2 pb-2">
            {products.map((p) => (
              <button
                key={p.id}
                onClick={() => addToBuilder(p)}
                className="backdrop-blur-md bg-white/20 hover:bg-white/30 border border-white/30 px-3 py-2 rounded-lg text-sm shrink-0 text-white font-medium transition-all duration-300"
              >
                {p.name}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            {builderItems.length === 0 ? (
              <p className="text-sm text-white/50">no items selected</p>
            ) : (
              builderItems.map((item) => (
                <div
                  key={item.productId}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 p-3 rounded-lg text-sm flex justify-between items-center text-white transition-all duration-300"
                >
                  <span>{item.name}</span>
                  <button onClick={() => removeFromBuilder(item.productId)} className="hover:text-red-400 transition-colors">
                    <X size={14} />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={createTransactionFromBuilder}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:shadow-lg hover:shadow-green-500/50 text-white font-semibold px-3 py-2 rounded-lg text-sm transition-all duration-300"
            >
              create transaction
            </button>
            <button
              onClick={clearBuilder}
              className="backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/20 text-white font-medium px-3 py-2 rounded-lg text-sm transition-all duration-300"
            >
              clear
            </button>
          </div>
        </div>
      )}

      {/* stats */}
      {loadedSample && (
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-bold text-white">Preprocessing Report:</h2>
          <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-xl text-sm flex flex-col gap-2 shadow-lg">
            <p className="text-white"><span className="font-semibold">Total rows:</span> {total}</p>
            <p className="text-white/80"><span className="font-semibold">Empty removed:</span> {empty}</p>
            <p className="text-white/80"><span className="font-semibold">Single-item removed:</span> {single}</p>
            <p className="text-white/80"><span className="font-semibold">Duplicate items removed:</span> {duplicates}</p>
            <p className="text-white/80"><span className="font-semibold">Invalid items removed:</span> {invalid}</p>
          </div>
        </div>
      )}

      {/* query analysis panel */}
      <QueryPanel transactions={txs} />

      {/* transaction list */}
      {txs.length === 0 ? (
        <p className="text-white/50">no transactions yet</p>
      ) : (
        <div className="flex flex-col gap-3 max-h-[50vh] overflow-y-auto">
          {sortedTx.map((tx) => (
            <div key={tx.id} className="backdrop-blur-md bg-white/10 border border-white/20 p-4 rounded-lg text-sm hover:bg-white/15 transition-all duration-300 shadow-lg">
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-white">Transaction #{tx.id}</span>
                <span className="text-white/60 text-xs">{tx.source}</span>
              </div>
              <p className="text-white/80">{tx.items.join(', ')}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
