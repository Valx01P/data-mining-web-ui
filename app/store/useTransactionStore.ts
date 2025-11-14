'use client'
import { create } from 'zustand'
import { cleanSampleTransactions } from '../lib/preprocessing/cleaner'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { CartItem, Transaction } from '../types'

// manages and stores all the transaction related state
interface TransactionStore {
  transactions: Transaction[]
  loadedSample: boolean

  addTransactionFromCart: (items: CartItem[]) => void
  loadSampleTransactions: () => Promise<void>
  clearAll: () => void
}

export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set, get) => ({
      transactions: [],
      loadedSample: false,

      addTransactionFromCart: (items) => {
        if (items.length === 0) return

        const itemNames = items.map(i => i.name.toLowerCase().trim())
        const unique = Array.from(new Set(itemNames))

        const current = get().transactions
        const nextId = current.length > 0
          ? Math.max(...current.map(t => t.id)) + 1
          : 1

        const tx: Transaction = {
          id: nextId,
          items: unique,
          createdAt: new Date().toISOString(),
          source: "user"
        }

        set({ transactions: [...current, tx] })
      },

      loadSampleTransactions: async () => {
        const current = get().transactions
        const maxId = current.length > 0
          ? Math.max(...current.map(t => t.id))
          : 0

        if (get().loadedSample) return

        try {
          const res = await fetch("/data/sample_transactions.csv")
          const csv = await res.text()

          const sample = cleanSampleTransactions(csv, maxId)

          set({
            transactions: [...current, ...sample],
            loadedSample: true,
          })
        } catch (err) {
          console.error("Failed to load sample transactions", err)
        }
      },

      clearAll: () => set({
        transactions: [],
        loadedSample: false
      })
    }),
    {
      name: "transactions-store",
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        transactions: state.transactions,
        loadedSample: state.loadedSample
      })
    }
  )
)
