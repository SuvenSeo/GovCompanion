'use client'

interface AppHeaderProps {
  onQuickAsk: (query: string) => void
  onToggleSidebar?: () => void
  sidebarOpen?: boolean
}

const QUICK_LINKS = [
  { label: 'NIC', q: 'How do I apply for a new NIC?' },
  { label: 'Passport', q: 'How do I apply for a new passport?' },
  { label: 'Driving License', q: 'How do I get a new driving license?' },
  { label: 'Birth Certificate', q: 'How do I get a certified copy of my birth certificate?' },
  { label: 'Police Clearance', q: 'How do I get a police clearance certificate?' },
]

const OFFICIAL_LINKS = [
  { label: 'GIC 1919', href: 'https://gic.gov.lk' },
  { label: 'drp.gov.lk', href: 'https://drp.gov.lk' },
  { label: 'immigration.gov.lk', href: 'https://www.immigration.gov.lk' },
  { label: 'dmt.gov.lk', href: 'https://dmt.gov.lk' },
]

export default function AppHeader({ onQuickAsk, onToggleSidebar, sidebarOpen }: AppHeaderProps) {
  return (
    <header className="flex-shrink-0 shadow-lk-soft z-20">
      <div className="lk-gradient-header text-white">
        <div className="flex items-center justify-between px-4 md:px-6 py-3 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {onToggleSidebar && (
              <button
                type="button"
                onClick={onToggleSidebar}
                className="lg:hidden flex-shrink-0 w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200 active:scale-95"
                aria-label={sidebarOpen ? 'Close services menu' : 'Open services menu'}
                aria-expanded={sidebarOpen}
              >
                <span className="text-lg">{sidebarOpen ? '✕' : '☰'}</span>
              </button>
            )}

            <div className="flex items-center gap-3 min-w-0 animate-fade-in">
              <div className="relative flex-shrink-0">
                <span className="text-3xl animate-float inline-block" aria-hidden>
                  🇱🇰
                </span>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-lk-gold rounded-full border-2 border-lk-maroon-dark" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg md:text-xl font-extrabold leading-tight tracking-tight">
                  GovNav <span className="text-lk-gold-light">LK</span>
                </h1>
                <p className="font-sinhala text-[11px] md:text-xs text-white/70 leading-snug truncate">
                  රජයේ සේවා සොයාගන්න · Your Sri Lanka government guide
                </p>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            {OFFICIAL_LINKS.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-white/50 hover:text-lk-gold-light transition-colors duration-200 hover:underline underline-offset-2"
              >
                {label}
              </a>
            ))}
            <div className="h-4 w-px bg-white/20" />
            <span className="text-[11px] bg-white/10 px-2.5 py-1 rounded-full text-white/80 flex items-center gap-1.5 border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-soft" />
              AI Powered
            </span>
          </div>
        </div>
      </div>

      <div className="lk-gold-line" />

      <div className="bg-lk-maroon-dark/90 px-4 md:px-6 py-2 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-[10px] text-lk-gold/80 uppercase tracking-widest font-bold flex-shrink-0">
          Quick ask
        </span>
        {QUICK_LINKS.map(({ label, q }, i) => (
          <button
            key={label}
            type="button"
            onClick={() => onQuickAsk(q)}
            className="flex-shrink-0 text-[11px] text-white/70 hover:text-white bg-white/5 hover:bg-lk-gold/20 hover:border-lk-gold/40 border border-transparent px-3 py-1 rounded-full transition-all duration-200 hover:-translate-y-0.5 active:scale-95 opacity-0 animate-fade-up"
            style={{ animationDelay: `${i * 0.04}s`, animationFillMode: 'forwards' }}
          >
            {label}
          </button>
        ))}
      </div>
    </header>
  )
}
