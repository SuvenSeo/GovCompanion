'use client'

import { compareServices, getQuickRecommendation } from '@/lib/compareServices'
import { services } from '@/lib/knowledge'
import { useMemo, useState } from 'react'

interface ServiceComparisonProps {
  open: boolean
  onClose: () => void
}

export default function ServiceComparison({ open, onClose }: ServiceComparisonProps) {
  const [idA, setIdA] = useState('')
  const [idB, setIdB] = useState('')

  const serviceA = services.find((s) => s.id === idA)
  const serviceB = services.find((s) => s.id === idB)

  const rows = useMemo(() => {
    if (!serviceA || !serviceB) return []
    return compareServices(serviceA, serviceB)
  }, [serviceA, serviceB])

  const recommendation = useMemo(() => {
    if (!serviceA || !serviceB) return ''
    return getQuickRecommendation(serviceA, serviceB)
  }, [serviceA, serviceB])

  const reset = () => {
    setIdA('')
    setIdB('')
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-lk-maroon-dark/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-label="Close comparison"
      />
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl animate-fade-up"
        role="dialog"
        aria-labelledby="compare-title"
      >
        <div className="sticky top-0 bg-lk-maroon text-white px-5 py-4 rounded-t-2xl flex items-center justify-between">
          <h2 id="compare-title" className="text-lg font-bold">
            ⚖️ Compare Services
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Service A
              </span>
              <select
                value={idA}
                onChange={(e) => setIdA(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-lk-gold/40 focus:border-lk-gold"
              >
                <option value="">Select…</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.emoji} {s.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Service B
              </span>
              <select
                value={idB}
                onChange={(e) => setIdB(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-lk-gold/40 focus:border-lk-gold"
              >
                <option value="">Select…</option>
                {services.map((s) => (
                  <option key={`b-${s.id}`} value={s.id}>
                    {s.emoji} {s.title}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {serviceA && serviceB && (
            <>
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-lk-maroon text-white">
                      <th className="text-left px-4 py-2.5 font-semibold">Compare</th>
                      <th className="text-left px-4 py-2.5 font-semibold max-w-[140px]">
                        {serviceA.emoji} {serviceA.title}
                      </th>
                      <th className="text-left px-4 py-2.5 font-semibold max-w-[140px]">
                        {serviceB.emoji} {serviceB.title}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => (
                      <tr
                        key={row.label}
                        className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${
                          row.highlight ? 'ring-1 ring-inset ring-amber-200 bg-amber-50/50' : ''
                        }`}
                      >
                        <td className="px-4 py-2.5 font-medium text-gray-600">{row.label}</td>
                        <td className="px-4 py-2.5 text-gray-800">{row.valueA}</td>
                        <td className="px-4 py-2.5 text-gray-800">{row.valueB}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="rounded-xl bg-lk-gold/10 border border-lk-gold/30 px-4 py-3 text-sm text-lk-maroon-dark">
                <span className="font-semibold">Which first? </span>
                {recommendation}
              </div>
            </>
          )}

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={reset}
              className="text-sm text-gray-500 hover:text-lk-maroon px-4 py-2 rounded-lg hover:bg-gray-50"
            >
              Reset
            </button>
            <button type="button" onClick={onClose} className="lk-btn-primary text-sm py-2">
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
