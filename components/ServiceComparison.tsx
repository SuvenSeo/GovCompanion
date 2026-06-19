'use client'

import { compareServices, getQuickRecommendation } from '@/lib/compareServices'
import { services } from '@/lib/knowledge'
import { useEffect, useMemo, useState } from 'react'

interface ServiceComparisonProps {
  open: boolean
  onClose: () => void
}

export default function ServiceComparison({ open, onClose }: ServiceComparisonProps) {
  const [idA, setIdA] = useState('')
  const [idB, setIdB] = useState('')
  const [mounted, setMounted] = useState(false)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    if (open) {
      setMounted(true)
      setExiting(false)
    } else if (mounted) {
      setExiting(true)
      const t = setTimeout(() => {
        setMounted(false)
        setExiting(false)
      }, 280)
      return () => clearTimeout(t)
    }
  }, [open, mounted])

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

  const handleClose = () => {
    onClose()
  }

  if (!mounted) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className={`absolute inset-0 bg-lk-maroon-dark/60 dark:bg-black/70 backdrop-blur-sm ${
          exiting ? 'animate-modal-out' : 'animate-fade-in'
        }`}
        onClick={handleClose}
        aria-label="Close comparison"
      />
      <div
        className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-lk-night-elevated rounded-2xl shadow-2xl border border-lk-maroon/10 dark:border-lk-gold/20 ${
          exiting ? 'animate-modal-out' : 'animate-modal-in'
        }`}
        role="dialog"
        aria-labelledby="compare-title"
      >
        <div className="sticky top-0 bg-lk-maroon dark:bg-gradient-to-r dark:from-lk-maroon-dark dark:to-lk-night-card text-white px-5 py-4 rounded-t-2xl flex items-center justify-between z-10">
          <h2 id="compare-title" className="text-lg font-bold">
            ⚖️ Compare Services
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-transform hover:rotate-90 duration-300"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="p-5 space-y-4 dark:text-lk-cream/90">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs font-semibold text-gray-500 dark:text-lk-cream/50 uppercase tracking-wide">
                Service A
              </span>
              <select
                value={idA}
                onChange={(e) => setIdA(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-200 dark:border-lk-gold/20 dark:bg-lk-night-card dark:text-lk-cream px-3 py-2 text-sm focus:ring-2 focus:ring-lk-gold/40 focus:border-lk-gold"
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
              <span className="text-xs font-semibold text-gray-500 dark:text-lk-cream/50 uppercase tracking-wide">
                Service B
              </span>
              <select
                value={idB}
                onChange={(e) => setIdB(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-200 dark:border-lk-gold/20 dark:bg-lk-night-card dark:text-lk-cream px-3 py-2 text-sm focus:ring-2 focus:ring-lk-gold/40 focus:border-lk-gold"
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
              <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-lk-gold/15 animate-fade-up">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-lk-maroon dark:bg-lk-maroon-dark text-white">
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
                        className={`${i % 2 === 0 ? 'bg-white dark:bg-lk-night-card' : 'bg-gray-50 dark:bg-lk-night-elevated'} ${
                          row.highlight
                            ? 'ring-1 ring-inset ring-amber-200 dark:ring-amber-500/40 bg-amber-50/50 dark:bg-amber-950/30'
                            : ''
                        }`}
                      >
                        <td className="px-4 py-2.5 font-medium text-gray-600 dark:text-lk-cream/60">
                          {row.label}
                        </td>
                        <td className="px-4 py-2.5 text-gray-800 dark:text-lk-cream/90">
                          {row.valueA}
                        </td>
                        <td className="px-4 py-2.5 text-gray-800 dark:text-lk-cream/90">
                          {row.valueB}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="rounded-xl bg-lk-gold/10 dark:bg-lk-gold/15 border border-lk-gold/30 px-4 py-3 text-sm text-lk-maroon-dark dark:text-lk-gold-light animate-fade-up">
                <span className="font-semibold">Which first? </span>
                {recommendation}
              </div>
            </>
          )}

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={reset}
              className="text-sm text-gray-500 dark:text-lk-cream/50 hover:text-lk-maroon dark:hover:text-lk-gold px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-lk-night-card transition-colors"
            >
              Reset
            </button>
            <button type="button" onClick={handleClose} className="lk-btn-primary text-sm py-2">
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
