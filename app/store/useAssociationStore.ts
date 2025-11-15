'use client'
import { create } from 'zustand'
import { apriori } from '@/app/lib/algorithms/apriori'
import { eclat } from '@/app/lib/algorithms/eclat'
import { fpGrowth } from '@/app/lib/algorithms/fpgrowth'
import type { Transaction } from '@/app/types'

interface MinedRule {
  left: string[]
  right: string[]
  support: number
  confidence: number
}

interface Pattern {
  itemset: string[]
  support: number
}

interface AssociationResult {
  rules: MinedRule[]
  patterns: Pattern[]
  executionTime: number
}

interface AssociationStore {
  algorithm: 'apriori' | 'eclat' | 'fpgrowth'
  minSupport: number
  minConfidence: number

  rules: MinedRule[]
  patterns: Pattern[]
  execTime: number

  setAlgorithm: (algo: 'apriori' | 'eclat' | 'fpgrowth') => void
  setSupport: (v: number) => void
  setConfidence: (v: number) => void

  run: (txs: Transaction[]) => void
}

export const useAssociationStore = create<AssociationStore>((set, get) => ({
  algorithm: 'apriori',
  minSupport: 0.2,
  minConfidence: 0.5,

  rules: [],
  patterns: [],
  execTime: 0,

  setAlgorithm: (algo) => set({ algorithm: algo }),
  setSupport: (v) => set({ minSupport: v }),
  setConfidence: (v) => set({ minConfidence: v }),

  run: (txs) => {
    const algo = get().algorithm
    const minSup = get().minSupport
    const minConf = get().minConfidence

    const cleaned = txs.map(t => ({ items: t.items }))

    let result: AssociationResult

    if (algo === 'apriori') result = apriori(cleaned, minSup, minConf)
    else if (algo === 'eclat') result = eclat(cleaned, minSup, minConf)
    else result = fpGrowth(cleaned, minSup, minConf)

    set({
      rules: result.rules,
      patterns: result.patterns,
      execTime: result.executionTime
    })
  }
}))
