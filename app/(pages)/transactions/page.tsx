'use client'
import { useState, useMemo } from 'react'
import { useTransactionStore } from '@/app/store/useTransactionStore'
import { ArrowUp, ArrowDown } from 'lucide-react'

export default function Transactions() {
  const txs = useTransactionStore(s => s.transactions)
  const loadSample = useTransactionStore(s => s.loadSampleTransactions)
  const loaded = useTransactionStore(s => s.loadedSample)
  const clearAll = useTransactionStore(s => s.clearAll)

  const [sortAsc, setSortAsc] = useState(true)

  const sortedTx = useMemo(() => {
    return [...txs].sort((a, b) =>
      sortAsc ? a.id - b.id : b.id - a.id
    )
  }, [txs, sortAsc])

  return (
    <main className="p-6 flex flex-col gap-4">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl">Transactions</h1>

        <div className="flex gap-2 items-center">
          {/* SORT BUTTON */}
          <button
            onClick={() => setSortAsc(!sortAsc)}
            className="bg-zinc-800 p-2 rounded hover:cursor-pointer hover:bg-zinc-900"
            title="Sort"
          >
            {sortAsc ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
          </button>

          {/* CLEAR */}
          <button
            onClick={clearAll}
            className="bg-zinc-800 px-3 py-2 rounded text-sm hover:cursor-pointer hover:bg-zinc-900"
          >
            Clear all
          </button>

          {/* LOAD SAMPLE */}
          <button
            onClick={loadSample}
            className="bg-zinc-800 px-3 py-2 rounded text-sm hover:cursor-pointer hover:bg-zinc-900"
          >
            {loaded ? "Sample loaded" : "Load sample data"}
          </button>
        </div>
      </div>

      {
        txs.length === 0
        ?
          <p className="opacity-70 text-sm h-[70vh]">
            No transactions yet. Load sample data or purchase some items.
          </p>
        :
          <div className="flex flex-col gap-3 h-[70vh] overflow-y-scroll">
            {sortedTx.map(tx => (
              <div
                key={tx.id}
                className="bg-[#1b1b1b] p-3 rounded text-sm"
              >
                <div className="flex justify-between mb-1">
                  <span>Transaction #{tx.id}</span>
                  <span className="opacity-60">{tx.source}</span>
                </div>

                <p>{tx.items.join(", ")}</p>
              </div>
            ))}
          </div>
      }


      <div className="flex justify-start items-start">
        <h1 className="text-2xl">Query Analysis</h1>
      </div>
      {
        txs.length === 0
        ?
          <p className="opacity-70 text-sm h-[70vh]">
            No transactions to analyze. Load sample data or purchase some items.
          </p>
        :
          <div className="flex flex-col gap-3 h-[70vh] overflow-y-scroll">

          </div>
      }

    </main>
  )
}
