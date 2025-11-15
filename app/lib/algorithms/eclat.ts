// eclat frequent itemset mining
// vertical tidset format

export function eclat(
  transactions: { items: string[] }[],
  minSupport: number,
  minConfidence: number
) {
  const start = performance.now()
  const total = transactions.length

  const tidsets: Record<string, Set<number>> = {}

  transactions.forEach((tx, idx) => {
    for (const item of tx.items) {
      if (!tidsets[item]) tidsets[item] = new Set()
      tidsets[item].add(idx)
    }
  })

  const freq: { itemset: string[], support: number, tids: Set<number> }[] = []
  const items = Object.keys(tidsets)

  function dfs(prefix: string[], tids: Set<number>, remaining: string[]) {
    for (let i = 0; i < remaining.length; i++) {
      const item = remaining[i]

      const inter = new Set<number>()
      for (const t of tids) {
        if (tidsets[item].has(t)) inter.add(t)
      }

      const support = inter.size / total
      if (support >= minSupport) {
        const newSet = [...prefix, item]
        freq.push({ itemset: newSet, support, tids: inter })
        dfs(newSet, inter, remaining.slice(i + 1))
      }
    }
  }

  for (let i = 0; i < items.length; i++) {
    dfs([items[i]], tidsets[items[i]], items.slice(i + 1))
  }

  // build rules
  const rules = []
  for (const f of freq) {
    if (f.itemset.length < 2) continue

    for (const item of f.itemset) {
      const left = f.itemset.filter(i => i !== item)
      const right = [item]

      const leftNode = freq.find(x => x.itemset.join(',') === left.join(','))
      if (!leftNode) continue

      const confidence = f.support / leftNode.support

      if (confidence >= minConfidence) {
        rules.push({
          left,
          right,
          support: f.support,
          confidence
        })
      }
    }
  }

  const patterns = freq.map(f => ({
    itemset: f.itemset,
    support: f.support
  }))

  return {
    rules,
    patterns,
    executionTime: performance.now() - start
  }
}
