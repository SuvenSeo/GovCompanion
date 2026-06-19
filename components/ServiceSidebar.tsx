'use client'

import {
  categories,
  getBrowsableByCategory,
  getTotalServiceCount,
  searchBrowsable,
  type BrowsableService,
} from '@/lib/knowledge'
import { useMemo, useState } from 'react'

interface ServiceSidebarProps {
  onSelectService: (query: string) => void
  mobileOpen?: boolean
  onClose?: () => void
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

function ServiceRow({
  svc,
  onClick,
  indent = false,
}: {
  svc: BrowsableService
  onClick: () => void
  indent?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left ${indent ? 'px-6' : 'px-4'} py-2.5 text-xs text-white/75 hover:text-white hover:bg-white/10 transition-all duration-150 leading-snug rounded-lg mx-1 hover:translate-x-0.5 active:scale-[0.99] border-l-2 border-transparent hover:border-lk-gold/60`}
    >
      <span className="mr-1.5">{svc.emoji}</span>
      <span className="block">{svc.title}</span>
      {svc.sinhala && (
        <span className="block font-sinhala text-[10px] text-white/35 mt-0.5 leading-snug">
          {svc.sinhala}
        </span>
      )}
      {svc.detailLevel === 'catalog' && (
        <span className="text-white/30"> · overview</span>
      )}
    </button>
  )
}

export default function ServiceSidebar({
  onSelectService,
  mobileOpen = false,
  onClose,
}: ServiceSidebarProps) {
  const [expanded, setExpanded] = useState<string | null>('Identity')
  const [search, setSearch] = useState('')

  const totalCount = getTotalServiceCount()
  const searchResults = useMemo(() => searchBrowsable(search), [search])
  const isSearching = search.trim().length > 0

  const handleServiceClick = (title: string) => {
    onSelectService(`How do I get a ${title}?`)
    setSearch('')
    onClose?.()
  }

  const panelClasses = `
    w-72 flex-shrink-0 text-white flex flex-col overflow-hidden
    bg-gradient-to-b from-lk-maroon-dark via-lk-maroon-dark to-[#3a0910]
    lg:relative lg:translate-x-0 lg:shadow-lk-soft
    fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-out
    ${mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
  `

  return (
    <aside className={panelClasses} aria-label="Government services browser">
      <div className="px-4 py-5 border-b border-white/10 bg-black/10">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-bold text-lk-gold-light uppercase tracking-widest">
            Browse Services
          </p>
          <span className="text-[10px] bg-lk-gold/20 text-lk-gold-light px-2 py-0.5 rounded-full font-semibold">
            {totalCount}
          </span>
        </div>
        <p className="text-[11px] text-white/50 mb-3 font-sinhala">
          රජයේ සේවා {totalCount}ක් — click to ask
        </p>
        <div className="relative">
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-xs"
            aria-hidden
          >
            🔍
          </span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services..."
            className="w-full rounded-xl bg-white/10 border border-white/15 pl-8 pr-3 py-2.5 text-xs text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-lk-gold/50 focus:border-lk-gold/30 transition-all duration-200"
            aria-label="Search government services"
          />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-2 chat-scroll">
        {isSearching ? (
          <div className="px-2 animate-fade-in">
            {searchResults.length === 0 ? (
              <p className="px-3 py-6 text-xs text-white/50 text-center">No services found.</p>
            ) : (
              searchResults.map((svc) => (
                <ServiceRow
                  key={svc.id}
                  svc={svc}
                  onClick={() => handleServiceClick(svc.title)}
                />
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
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : cat)}
                  className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-white/10 transition-all duration-200 text-left group"
                >
                  <span className="flex items-center gap-2 text-sm font-semibold text-white/90 group-hover:text-white">
                    <span className="transition-transform duration-200 group-hover:scale-110">
                      {categoryEmojis[cat] ?? '📄'}
                    </span>
                    {cat}
                    <span className="text-[10px] font-normal text-white/35 bg-white/5 px-1.5 py-0.5 rounded-full">
                      {catServices.length}
                    </span>
                  </span>
                  <span
                    className={`text-white/40 text-xs transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  >
                    ▼
                  </span>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-out ${
                    isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="pb-1">
                    {catServices.map((svc) => (
                      <ServiceRow
                        key={svc.id}
                        svc={svc}
                        indent
                        onClick={() => handleServiceClick(svc.title)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </nav>

      <div className="px-4 py-3 border-t border-white/10 bg-black/15">
        <p className="text-[10px] text-white/40 leading-relaxed">
          📞 Call <strong className="text-lk-gold-light">1919</strong> (GIC) or check{' '}
          <a
            href="https://gic.gov.lk"
            target="_blank"
            rel="noopener noreferrer"
            className="text-lk-gold-light/80 hover:underline"
          >
            gic.gov.lk
          </a>{' '}
          before your visit.
        </p>
      </div>
    </aside>
  )
}
