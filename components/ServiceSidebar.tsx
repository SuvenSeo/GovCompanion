'use client'

import {
  categories,
  getBrowsableByCategory,
  getTotalServiceCount,
  searchBrowsable,
} from '@/lib/knowledge'
import { useMemo, useState } from 'react'

interface ServiceSidebarProps {
  onSelectService: (query: string) => void
}

const categoryEmojis: Record<string, string> = {
  Identity: '🪪',
  Travel: '✈️',
  Vehicles: '🚗',
  'Civil Records': '📋',
  Legal: '⚖️',
  'Local Services': '🏛️',
  Civic: '🗳️',
  Education: '🎓',
  Health: '⚕️',
  'Business & Trade': '🏭',
  'Tax & Revenue': '💳',
  'Land & Property': '🏠',
  'Welfare & Social': '🤝',
  'Employment & Labour': '💼',
  Immigration: '🛂',
  'Utilities & Licensing': '⚡',
  'Defence & Security': '🪖',
  Agriculture: '🌾',
}

export default function ServiceSidebar({ onSelectService }: ServiceSidebarProps) {
  const [expanded, setExpanded] = useState<string | null>('Identity')
  const [search, setSearch] = useState('')

  const totalCount = getTotalServiceCount()
  const searchResults = useMemo(() => searchBrowsable(search), [search])
  const isSearching = search.trim().length > 0

  const handleServiceClick = (title: string) => {
    onSelectService(`How do I get a ${title}?`)
    setSearch('')
  }

  return (
    <aside className="w-72 flex-shrink-0 bg-lk-maroon-dark text-white flex flex-col overflow-hidden">
      <div className="px-4 py-5 border-b border-white/10">
        <p className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-1">
          Browse Services
        </p>
        <p className="text-xs text-white/40 mb-3">
          {totalCount} services — click to ask the AI
        </p>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search services..."
          className="w-full rounded-md bg-white/10 border border-white/20 px-3 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-lk-gold"
          aria-label="Search government services"
        />
      </div>

      <nav className="flex-1 overflow-y-auto py-2 chat-scroll">
        {isSearching ? (
          <div className="px-2">
            {searchResults.length === 0 ? (
              <p className="px-2 py-4 text-xs text-white/50">No services found.</p>
            ) : (
              searchResults.map((svc) => (
                <button
                  key={svc.id}
                  onClick={() => handleServiceClick(svc.title)}
                  className="w-full text-left px-4 py-2 text-xs text-white/70 hover:text-white hover:bg-white/10 transition-colors leading-snug rounded"
                >
                  <span className="mr-1.5">{svc.emoji}</span>
                  {svc.title}
                  {svc.detailLevel === 'catalog' && (
                    <span className="ml-1 text-white/30">· overview</span>
                  )}
                </button>
              ))
            )}
          </div>
        ) : (
          categories.map((cat) => {
            const catServices = getBrowsableByCategory(cat)
            const isOpen = expanded === cat

            return (
              <div key={cat}>
                <button
                  onClick={() => setExpanded(isOpen ? null : cat)}
                  className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-white/10 transition-colors text-left"
                >
                  <span className="flex items-center gap-2 text-sm font-semibold text-white/90">
                    <span>{categoryEmojis[cat] ?? '📄'}</span>
                    {cat}
                    <span className="text-[10px] font-normal text-white/30">
                      ({catServices.length})
                    </span>
                  </span>
                  <span className="text-white/40 text-xs">{isOpen ? '▲' : '▼'}</span>
                </button>

                {isOpen && (
                  <div className="pb-1">
                    {catServices.map((svc) => (
                      <button
                        key={svc.id}
                        onClick={() => handleServiceClick(svc.title)}
                        className="w-full text-left px-6 py-2 text-xs text-white/70 hover:text-white hover:bg-white/10 transition-colors leading-snug"
                      >
                        {svc.title}
                        {svc.detailLevel === 'catalog' && (
                          <span className="text-white/25"> · overview</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })
        )}
      </nav>

      <div className="px-4 py-3 border-t border-white/10">
        <p className="text-[10px] text-white/30 leading-relaxed">
          Always verify fees and requirements at the official office or gic.gov.lk (1919) before
          your visit.
        </p>
      </div>
    </aside>
  )
}
