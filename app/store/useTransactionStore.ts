'use client'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { cleanSampleTransactions } from '../lib/preprocessing/cleaner'
import type { CartItem, Transaction } from '../types'

interface TransactionStore {
  transactions: Transaction[]
  loadedSample: boolean

  // preprocessing stats
  totalTransactions: number
  emptyTransactions: number
  singleItemTransactions: number
  duplicateItemTransactions: number
  invalidItemTransactions: number

  addTransactionFromCart: (items: CartItem[]) => void
  loadSampleTransactions: () => Promise<void>
  clearAll: () => void
}

export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set, get) => ({
      transactions: [],
      loadedSample: false,

      totalTransactions: 0,
      emptyTransactions: 0,
      singleItemTransactions: 0,
      duplicateItemTransactions: 0,
      invalidItemTransactions: 0,

      // adds user-created transaction to the state
      addTransactionFromCart: (items) => {
        if (items.length === 0) return

        const names = items.map(x => x.name.toLowerCase().trim())
        const unique = Array.from(new Set(names))

        const current = get().transactions
        const nextId =
          current.length > 0
            ? Math.max(...current.map(t => t.id)) + 1
            : 1

        const tx: Transaction = {
          id: nextId,
          items: unique,
          createdAt: new Date().toISOString(),
          source: 'user'
        }

        set({ transactions: [...current, tx] })
      },

      // loads the sample csv and applies full preprocessing
      loadSampleTransactions: async () => {
        if (get().loadedSample) return

        try {
          const res = await fetch('/data/sample_transactions.csv')
          const csv = await res.text()

          const current = get().transactions
          const maxId =
            current.length > 0 ? Math.max(...current.map(t => t.id)) : 0

          const { cleaned, report } = cleanSampleTransactions(csv, maxId)

          set({
            transactions: [...current, ...cleaned],
            loadedSample: true,

            totalTransactions: report.totalTransactions,
            emptyTransactions: report.emptyTransactions,
            singleItemTransactions: report.singleItemTransactions,
            duplicateItemTransactions: report.duplicateItemTransactions,
            invalidItemTransactions: report.invalidItemTransactions,
          })
        } catch (err) {
          console.error('failed to load sample csv', err)
        }
      },

      clearAll: () =>
        set({
          transactions: [],
          loadedSample: false,
          totalTransactions: 0,
          emptyTransactions: 0,
          singleItemTransactions: 0,
          duplicateItemTransactions: 0,
          invalidItemTransactions: 0,
        })
    }),
    {
      name: 'transactions-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        transactions: s.transactions,
        loadedSample: s.loadedSample,
        totalTransactions: s.totalTransactions,
        emptyTransactions: s.emptyTransactions,
        singleItemTransactions: s.singleItemTransactions,
        duplicateItemTransactions: s.duplicateItemTransactions,
        invalidItemTransactions: s.invalidItemTransactions,
      })
    }
  )
)
