// apriori frequent itemset mining
// horizontal transaction format

export function apriori(
  transactions: { items: string[] }[],
  minSupport: number,
  minConfidence: number
) {
  const start = performance.now()
  const total = transactions.length

  const supportCount = (set: string[]) =>
    transactions.filter(t => set.every(i => t.items.includes(i))).length

  const supportMap: Record<string, number> = {}
  const levels: string[][][] = []

  // build L1
  const counts: Record<string, number> = {}
  for (const t of transactions) {
    for (const i of t.items) {
      counts[i] = (counts[i] || 0) + 1
    }
  }

  let Lk = Object.entries(counts)
    .filter(([i, c]) => c / total >= minSupport)
    .map(([i]) => [i])

  levels.push(Lk)

  // expand frequent sets
  while (Lk.length > 0) {
    const next: string[][] = []

    for (let i = 0; i < Lk.length; i++) {
      for (let j = i + 1; j < Lk.length; j++) {
        const merged = Array.from(new Set([...Lk[i], ...Lk[j]]))
        if (merged.length !== Lk[i].length + 1) continue

        const sup = supportCount(merged)
        const ratio = sup / total

        if (ratio >= minSupport) {
          next.push(merged)
          supportMap[merged.join(',')] = ratio
        }
      }
    }

    Lk = next
    if (Lk.length > 0) levels.push(Lk)
  }

  // flatten frequent patterns
  const patterns = levels.flat().map(itemset => ({
    itemset,
    support: supportCount(itemset) / total
  }))

  // build rules
  const rules = []
  for (const { itemset, support } of patterns) {
    if (itemset.length < 2) continue

    for (const item of itemset) {
      const left = itemset.filter(i => i !== item)
      const right = [item]

      const leftSupport = supportMap[left.join(',')] ??
        supportCount(left) / total

      const confidence = support / leftSupport

      if (confidence >= minConfidence) {
        rules.push({
          left,
          right,
          support,
          confidence
        })
      }
    }
  }

  return {
    rules,
    patterns,
    executionTime: performance.now() - start
  }
}
