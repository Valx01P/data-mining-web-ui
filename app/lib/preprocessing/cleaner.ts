import { Transaction } from '@/app/types'

// valid item list from products.csv
// everything is lowercase and trimmed for comparison
const VALID_ITEMS = new Set([
  'milk','bread','butter','eggs','cheese','yogurt','apple','banana','orange','grape',
  'tomato','potato','onion','garlic','pepper','chicken','beef','pork','rice','pasta',
  'noodles','coffee','tea','juice','soda','water','jam','honey','sauce','vegetables'
])

// parses one csv row into a transaction object
// returns null if invalid or empty
export function parseRawTransaction(line: string) {
  // number, values to be comma separated
  const match = line.match(/^(\d+),"(.*)"$/)
  if (!match) return null

  const id = Number(match[1])
  const raw = match[2]

  // split the items, normalize them, lowercase, trim
  let items = raw
    .split(',')
    .map(x => x.trim().toLowerCase())
    .filter(Boolean)

  // track duplicates before removing them
  const duplicateCount = items.length - new Set(items).size

  // remove duplicates
  items = Array.from(new Set(items))

  // filter out invalid items
  const invalidItems = items.filter(i => !VALID_ITEMS.has(i))
  items = items.filter(i => VALID_ITEMS.has(i))

  // if everything was invalid or empty, drop the transaction
  if (items.length === 0) {
    return {
      id,
      items: [],
      empty: true,
      single: false,
      duplicates: duplicateCount,
      invalid: invalidItems.length,
    }
  }

  // detect single-item transactions
  const single = items.length === 1

  return {
    id,
    items,
    empty: false,
    single,
    duplicates: duplicateCount,
    invalid: invalidItems.length,
  }
}

// parses the entire csv content into raw stats + cleaned transactions
export function cleanSampleTransactions(csvText: string, existingMaxId: number) {
  const lines = csvText.trim().split('\n')
  const data = lines.slice(1)

  const cleaned: Transaction[] = []

  let total = data.length
  let emptyCount = 0
  let singleCount = 0
  let duplicateCount = 0
  let invalidCount = 0

  for (let line of data) {
    const result = parseRawTransaction(line.trim())
    if (!result) continue

    emptyCount += result.empty ? 1 : 0
    singleCount += result.single ? 1 : 0
    duplicateCount += result.duplicates
    invalidCount += result.invalid

    // skip empty transactions
    if (result.empty) continue

    // skip single-item transactions
    if (result.single) continue

    // ready to keep
    cleaned.push({
      id: result.id + existingMaxId,
      items: result.items,
      createdAt: new Date().toISOString(),
      source: 'sample'
    })
  }

  return {
    cleaned,
    report: {
      totalTransactions: total,
      emptyTransactions: emptyCount,
      singleItemTransactions: singleCount,
      duplicateItemTransactions: duplicateCount,
      invalidItemTransactions: invalidCount,
    }
  }
}
