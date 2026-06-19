'use client'

import { getSessionHeaders } from '@/lib/client-session'
import { useEffect, useState } from 'react'

type Quota = {
  remaining: number
  limit: number
}

export default function RateLimitBadge() {
  const [quota, setQuota] = useState<Quota | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/rate-limit', { headers: getSessionHeaders() })
        if (!res.ok) return
        const data = await res.json()
        setQuota({ remaining: data.remaining, limit: data.limit })
      } catch {
        /* ignore */
      }
    }
    load()
    const interval = setInterval(load, 30_000)
    return () => clearInterval(interval)
  }, [])

  if (!quota) return null

  const low = quota.remaining <= 3
  const pct = Math.round((quota.remaining / quota.limit) * 100)

  return (
    <div
      className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors duration-300 ${
        low
          ? 'border-amber-300 bg-amber-50 text-amber-800'
          : 'border-lk-maroon/15 bg-lk-cream text-gray-500'
      }`}
      title="Messages remaining this hour (fair use for all users)"
    >
      {quota.remaining}/{quota.limit} messages
      <span className="sr-only">, {pct}% remaining</span>
    </div>
  )
}
