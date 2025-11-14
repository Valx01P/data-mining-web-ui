import { Transaction } from '@/app/types'

// normalizes a row
export function parseTransactionLine(line: string): Transaction | null {
  // number, values to be comma separated
  const match = line.match(/^(\d+),"(.*)"$/)
  if (!match) return null

  const id = Number(match[1])
  const rawItems = match[2]

  // clean and normalize
  const items = rawItems
    .split(",")
    .map(i => i.trim().toLowerCase())
    .filter(Boolean)

  if (items.length === 0) return null

  // remove any duplicates with a set
  const unique = Array.from(new Set(items))

  return {
    id,
    items: unique,
    createdAt: new Date().toISOString(),
    source: "sample",
  }
}

// parse the entire csv into transactions
export function parseCSVTransactions(csvText: string): Transaction[] {
  const lines = csvText.trim().split("\n")

  // remove the header row
  const dataLines = lines.slice(1)

  const parsed: Transaction[] = dataLines
    .map(line => parseTransactionLine(line.trim()))
    .filter((t): t is Transaction => t !== null)

  return parsed
}

// id offset for avoiding id collisions with existing itemsets
export function offsetTransactionIds(
  transactions: Transaction[],
  offset: number
): Transaction[] {
  return transactions.map((t) => ({
    ...t,
    id: t.id + offset
  }))
}

// cleans, normalizes, and correctly offsets the csv for existing itemsets
export function cleanSampleTransactions(
  csvText: string,
  existingMaxId: number
): Transaction[] {
  const parsed = parseCSVTransactions(csvText)
  return offsetTransactionIds(parsed, existingMaxId)
}
