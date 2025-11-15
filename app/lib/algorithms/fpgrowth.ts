// fp growth frequent itemset mining
// builds an fp tree and extracts frequent patterns

// tree node structure
class FPNode {
  item: string | null
  count: number
  parent: FPNode | null
  children: Record<string, FPNode>
  next: FPNode | null

  constructor(item: string | null, parent: FPNode | null) {
    this.item = item
    this.count = 1
    this.parent = parent
    this.children = {}
    this.next = null
  }
}

// builds header table
function buildHeaderTable(freqMap: Record<string, number>, minSupportCount: number) {
  const table: Record<string, { support: number; head: FPNode | null }> = {}

  for (const [item, count] of Object.entries(freqMap)) {
    if (count >= minSupportCount) {
      table[item] = { support: count, head: null }
    }
  }

  return table
}

// inserts a transaction into the fp tree
function insertTree(items: string[], node: FPNode, header: any) {
  if (items.length === 0) return

  const first = items[0]

  if (!node.children[first]) {
    const newNode = new FPNode(first, node)
    node.children[first] = newNode

    if (!header[first].head) {
      header[first].head = newNode
    } else {
      let cursor = header[first].head
      while (cursor.next) cursor = cursor.next
      cursor.next = newNode
    }
  } else {
    node.children[first].count += 1
  }

  insertTree(items.slice(1), node.children[first], header)
}

// builds the conditional pattern base for one item
function buildConditionalPatternBase(item: string, header: any) {
  const patterns: { items: string[]; count: number }[] = []

  let node = header[item].head
  while (node) {
    let path: string[] = []
    let parent = node.parent

    while (parent && parent.item !== null) {
      path.push(parent.item)
      parent = parent.parent
    }

    if (path.length > 0) {
      patterns.push({ items: path.reverse(), count: node.count })
    }

    node = node.next
  }

  return patterns
}

// recursive fp growth mining
function mineTree(header: any, prefix: string[], minSupportCount: number, total: number, results: any[]) {
  const items = Object.keys(header).sort((a, b) => header[a].support - header[b].support)

  for (const item of items) {
    const newSet = [...prefix, item]
    const support = header[item].support / total

    results.push({ itemset: newSet, support })

    const conditionalBase = buildConditionalPatternBase(item, header)

    const freqMap: Record<string, number> = {}
    for (const pattern of conditionalBase) {
      for (const i of pattern.items) {
        freqMap[i] = (freqMap[i] || 0) + pattern.count
      }
    }

    const conditionalHeader = buildHeaderTable(freqMap, minSupportCount)
    if (Object.keys(conditionalHeader).length === 0) continue

    const root = new FPNode(null, null)
    for (const pattern of conditionalBase) {
      const filtered = pattern.items.filter(i => conditionalHeader[i])
      filtered.sort((a, b) => conditionalHeader[b].support - conditionalHeader[a].support)
      insertTree(filtered, root, conditionalHeader)
    }

    mineTree(conditionalHeader, newSet, minSupportCount, total, results)
  }
}

// builds fp tree and mines patterns
export function fpGrowth(transactions: { items: string[] }[], minSupport: number, minConfidence: number) {
  const start = performance.now()
  const total = transactions.length
  const minSupportCount = Math.ceil(minSupport * total)

  // count item frequencies
  const freqMap: Record<string, number> = {}
  for (const tx of transactions) {
    for (const i of tx.items) {
      freqMap[i] = (freqMap[i] || 0) + 1
    }
  }

  const header = buildHeaderTable(freqMap, minSupportCount)

  // root of fp tree
  const root = new FPNode(null, null)

  // insert all transactions
  for (const tx of transactions) {
    const sorted = tx.items
      .filter(i => header[i])
      .sort((a, b) => header[b].support - header[a].support)

    insertTree(sorted, root, header)
  }

  // mine patterns
  const results: { itemset: string[]; support: number }[] = []
  mineTree(header, [], minSupportCount, total, results)

  // build rules from frequent patterns
  const rules = []
  for (const res of results) {
    if (res.itemset.length < 2) continue

    for (const i of res.itemset) {
      const left = res.itemset.filter(x => x !== i)
      const right = [i]

      const leftSupport = results.find(r => r.itemset.join(',') === left.join(','))?.support
      if (!leftSupport) continue

      const confidence = res.support / leftSupport
      if (confidence >= minConfidence) {
        rules.push({
          left,
          right,
          support: res.support,
          confidence
        })
      }
    }
  }

  return {
    rules,
    patterns: results,
    executionTime: performance.now() - start
  }
}
