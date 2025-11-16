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
    <div className="backdrop-blur-md bg-white/8 border border-white/20 rounded-xl p-6 flex flex-col gap-4 text-sm text-white shadow-lg">
      {/* header */}
      <button
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center text-lg w-full"
      >
        <span className="font-semibold text-xl">Query Analysis</span>
        <div className="text-white/80">{open ? <ChevronUp /> : <ChevronDown />}</div>
      </button>

      {open && (
        <>
          {/* algorithm selector */}
          <div className="flex gap-2 text-sm">
            <button
              onClick={() => setAlgo('apriori')}
              className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                algo === 'apriori' ? 'bg-gradient-to-r from-green-500 to-green-600 shadow-md text-white' : 'backdrop-blur-md bg-white/6 border border-white/10 text-white/80'
              }`}
            >
              Apriori
            </button>

            <button
              onClick={() => setAlgo('eclat')}
              className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                algo === 'eclat' ? 'bg-gradient-to-r from-green-500 to-green-600 shadow-md text-white' : 'backdrop-blur-md bg-white/6 border border-white/10 text-white/80'
              }`}
            >
              Eclat
            </button>

            <button
              onClick={() => setAlgo('fpgrowth')}
              className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                algo === 'fpgrowth' ? 'bg-gradient-to-r from-green-500 to-green-600 shadow-md text-white' : 'backdrop-blur-md bg-white/6 border border-white/10 text-white/80'
              }`}
            >
              FP-Growth
            </button>
          </div>

          {/* sliders */}
          <div className="flex flex-col gap-4">
            {/* min support */}
            <label className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white/90">Min support</span>
                <span className="text-sm text-green-400">{(minSup * 100).toFixed(0)}%</span>
              </div>

              <input
                type="range"
                min={0.05}
                max={0.8}
                step={0.05}
                value={minSup}
                onChange={(e) => setSup(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #16a34a ${(minSup - 0.05) / 0.75 * 100}%, #374151 ${(minSup - 0.05) / 0.75 * 100}%)`
                }}
              />
            </label>

            {/* min confidence */}
            <label className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white/90">Min confidence</span>
                <span className="text-sm text-green-400">{(minConf * 100).toFixed(0)}%</span>
              </div>

              <input
                type="range"
                min={0.1}
                max={0.9}
                step={0.05}
                value={minConf}
                onChange={(e) => setConf(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #16a34a ${(minConf - 0.1) / 0.8 * 100}%, #374151 ${(minConf - 0.1) / 0.8 * 100}%)`
                }}
              />
            </label>
          </div>

          {/* run mining */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => run(transactions)}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:shadow-lg text-white font-semibold px-4 py-2 rounded-lg"
            >
              Run Mining
            </button>

            {/* exec info */}
            {execTime > 0 && (
              <p className="text-sm text-white/80">
                execution time: <span className="font-medium">{execTime.toFixed(2)}ms</span> — <span className="font-medium">{rules.length}</span> rules
              </p>
            )}
          </div>

          {/* item query */}
          <div className="flex flex-col gap-2">
            <input
              placeholder="query item (ex: milk)"
              value={queryItem}
              onChange={(e) => setQueryItem(e.target.value)}
              className="backdrop-blur-md bg-white/6 border border-white/10 px-3 py-2 rounded-lg text-sm text-white/90"
            />

            {/* scrollable results */}
            {queryItem && queriedRules.length > 0 && (
              <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1">
                {queriedRules.map((r, i) => (
                  <div key={i} className="backdrop-blur-md bg-white/6 border border-white/10 p-3 rounded-lg text-sm text-white transition-all duration-200">
                    <p className="mb-2 font-medium text-white">{r.left.join(', ')} → {r.right.join(', ')}</p>

                    <div className="h-3 bg-white/10 rounded overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-green-400 to-green-500 h-full"
                        style={{ width: `${r.confidence * 100}%` }}
                      />
                    </div>

                    <p className="text-xs text-white/70 mt-2">
                      confidence <span className="font-semibold">{(r.confidence * 100).toFixed(1)}%</span>
                      &nbsp; support <span className="font-semibold">{(r.support * 100).toFixed(1)}%</span>
                    </p>
                  </div>
                ))}
              </div>
            )}

            {queryItem && queriedRules.length === 0 && (
              <p className="text-sm text-white/70">no rules found for this item</p>
            )}
          </div>
        </>
      )}
    </div>
  )
}
