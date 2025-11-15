'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useAssociationStore } from '@/app/store/useAssociationStore'
import { Product, Transaction } from '@/app/types'

function getUserItemHistory(transactions: Transaction[]) {
  const all = transactions.flatMap(t => t.items)
  return Array.from(new Set(all))
}

interface Props {
  products: Product[]
  userTransactions: Transaction[]
}

export default function RecommendationRow({ products, userTransactions }: Props) {
  const rules = useAssociationStore(s => s.rules)

  // no data, hide UI
  if (!rules || rules.length === 0) return null
  if (!userTransactions || userTransactions.length === 0) return null

  const userItems = getUserItemHistory(userTransactions)

  // rules that match any item the user previously purchased
  const matchedRules = rules.filter(rule =>
    rule.left.some(item => userItems.includes(item))
  )

  if (matchedRules.length === 0) return null

  // scoring based on confidence sum
  const scores: Record<string, number> = {}
  for (const r of matchedRules) {
    for (const rec of r.right) {
      scores[rec] = (scores[rec] || 0) + r.confidence
    }
  }

  // top 3 recommendations
  const sorted = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)

  const recommendedProducts = sorted
    .map(([name]) =>
      products.find(p => p.name.toLowerCase() === name.toLowerCase())
    )
    .filter(Boolean) as Product[]

  if (recommendedProducts.length === 0) return null

  return (
    <div className="flex flex-col h-70 bg-[#1b1b1b] w-full p-4 rounded-md">
      <h2 className="capitalize mb-2">recommended for you</h2>

      <div className="flex flex-row gap-8 h-full overflow-x-auto">
        {recommendedProducts.map((p) => {
          const shortTitle =
            p.title.length > 26 ? p.title.slice(0, 26) + "..." : p.title

          return (
            <Link
              key={p.id}
              href={`/product/${p.id}`}
              className="w-52 h-52 shrink-0 bg-white relative cursor-pointer rounded-md p-2 flex flex-col"
            >
              {/* image */}
              <div className="relative w-full h-36 bg-white">
                <Image
                  src={p.main_image_url}
                  alt={p.name}
                  fill
                  className="object-contain p-2"
                />
              </div>

              {/* title */}
              <p className="text-black text-[13px] leading-tight mt-1 truncate">
                {shortTitle}
              </p>

              {/* price */}
              <p className="text-black text-[14px] font-semibold">
                ${p.price.toFixed(2)}
              </p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
