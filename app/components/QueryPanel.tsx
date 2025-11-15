'use client'
import { useState } from 'react'
import { useAssociationStore } from '@/app/store/useAssociationStore'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface Props {
  transactions: any[]
}

export default function QueryPanel({ transactions }: Props) {
  const algo = useAssociationStore(s => s.algorithm)
  const setAlgo = useAssociationStore(s => s.setAlgorithm)

  const minSup = useAssociationStore(s => s.minSupport)
  const minConf = useAssociationStore(s => s.minConfidence)
  const setSup = useAssociationStore(s => s.setSupport)
  const setConf = useAssociationStore(s => s.setConfidence)

  const run = useAssociationStore(s => s.run)
  const rules = useAssociationStore(s => s.rules)
  const execTime = useAssociationStore(s => s.execTime)

  const [open, setOpen] = useState(false)
  const [queryItem, setQueryItem] = useState('')

  const queriedRules = rules.filter(r =>
    r.left.includes(queryItem.toLowerCase().trim())
  )

  return (
    <div className="bg-[#1b1b1b] p-4 rounded flex flex-col gap-4 text-sm">
      
      {/* header */}
      <button
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center text-lg"
      >
        <span>query analysis</span>
        {open ? <ChevronUp /> : <ChevronDown />}
      </button>

      {open && (
        <>
          {/* algorithm selector */}
          <div className="flex gap-2 text-sm">
            <button
              onClick={() => setAlgo('apriori')}
              className={`px-3 py-2 rounded ${
                algo === 'apriori' ? 'bg-green-700' : 'bg-zinc-800'
              }`}
            >
              apriori
            </button>

            <button
              onClick={() => setAlgo('eclat')}
              className={`px-3 py-2 rounded ${
                algo === 'eclat' ? 'bg-green-700' : 'bg-zinc-800'
              }`}
            >
              eclat
            </button>

            <button
              onClick={() => setAlgo('fpgrowth')}
              className={`px-3 py-2 rounded ${
                algo === 'fpgrowth' ? 'bg-green-700' : 'bg-zinc-800'
              }`}
            >
              fp growth
            </button>
          </div>

          {/* sliders */}
          <div className="flex flex-col gap-4">

            {/* min support */}
            <label className="flex flex-col gap-1">
              <span className="text-green-500">
                min support: {(minSup * 100).toFixed(0)}%
              </span>

              <input
                type="range"
                min={0.05}
                max={0.8}
                step={0.05}
                value={minSup}
                onChange={(e) => setSup(Number(e.target.value))}
                className="
                  w-full h-2 rounded-lg appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:w-4
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-green-600
                "
                style={{
                  background: `linear-gradient(
                    to right,
                    #16a34a ${(minSup - 0.05) / 0.75 * 100}%,
                    #3f3f46 ${(minSup - 0.05) / 0.75 * 100}%
                  )`
                }}
              />
            </label>

            {/* min confidence */}
            <label className="flex flex-col gap-1">
              <span className="text-green-500">
                min confidence: {(minConf * 100).toFixed(0)}%
              </span>

              <input
                type="range"
                min={0.1}
                max={0.9}
                step={0.05}
                value={minConf}
                onChange={(e) => setConf(Number(e.target.value))}
                className="
                  w-full h-2 rounded-lg appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:w-4
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-green-600
                "
                style={{
                  background: `linear-gradient(
                    to right,
                    #16a34a ${(minConf - 0.1) / 0.8 * 100}%,
                    #3f3f46 ${(minConf - 0.1) / 0.8 * 100}%
                  )`
                }}
              />
            </label>
          </div>

          {/* run mining */}
          <button
            onClick={() => run(transactions)}
            className="bg-green-700 px-3 py-2 rounded text-sm"
          >
            run mining
          </button>

          {/* exec info */}
          {execTime > 0 && (
            <p className="text-xs opacity-70">
              execution time: {execTime.toFixed(2)}ms — {rules.length} rules found
            </p>
          )}

          {/* item query */}
          <div className="flex flex-col gap-2">
            <input
              placeholder="query item (ex: milk)"
              value={queryItem}
              onChange={(e) => setQueryItem(e.target.value)}
              className="bg-zinc-900 px-2 py-1 rounded text-sm"
            />

            {/* scrollable results */}
            {queryItem && queriedRules.length > 0 && (
              <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
                {queriedRules.map((r, i) => (
                  <div key={i} className="bg-zinc-900 p-2 rounded text-sm">
                    <p className="mb-1">
                      {r.left.join(', ')} → {r.right.join(', ')}
                    </p>

                    <div className="h-2 bg-zinc-700 rounded overflow-hidden">
                      <div
                        className="bg-green-600 h-full"
                        style={{ width: `${r.confidence * 100}%` }}
                      />
                    </div>

                    <p className="text-xs opacity-70">
                      confidence {(r.confidence * 100).toFixed(1)}%
                      &nbsp; support {(r.support * 100).toFixed(1)}%
                    </p>
                  </div>
                ))}
              </div>
            )}

            {queryItem && queriedRules.length === 0 && (
              <p className="text-xs opacity-70">no rules found for this item</p>
            )}
          </div>
        </>
      )}
    </div>
  )
}
