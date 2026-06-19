'use client'

import LanguageToggle from '@/components/LanguageToggle'
import { useLanguage } from '@/components/LanguageProvider'
import LionMotif from '@/components/LionMotif'
import LkTricolorBar from '@/components/LkTricolorBar'
import ThemeToggle from '@/components/ThemeToggle'
import { BoltIcon, ScaleIcon } from '@/components/Icons'

interface AppHeaderProps {
  onQuickAsk: (query: string) => void
  onToggleSidebar?: () => void
  sidebarOpen?: boolean
  onOpenCompare?: () => void
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
]

export default function AppHeader({
  onQuickAsk,
  onToggleSidebar,
  sidebarOpen,
  onOpenCompare,
}: AppHeaderProps) {
  const { t } = useLanguage()
  return (
    <header className="flex-shrink-0 z-20 shadow-lk-premium">
      <LkTricolorBar />
      <div className="lk-gradient-header text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              'radial-gradient(circle at 100% 0%, rgba(212,160,23,0.2) 0%, transparent 50%)',
          }}
          aria-hidden
        />
        <div className="relative flex items-center justify-between px-4 md:px-6 py-3 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {onToggleSidebar && (
              <button
                type="button"
                onClick={onToggleSidebar}
                className="lg:hidden flex-shrink-0 w-11 h-11 rounded-xl bg-white/10 hover:bg-lk-gold/25 border border-white/10 flex items-center justify-center transition-all duration-200 active:scale-95 shadow-lg"
                aria-label={sidebarOpen ? 'Close services menu' : 'Open services menu'}
                aria-expanded={sidebarOpen}
              >
                <span className="text-xl">{sidebarOpen ? '✕' : '☰'}</span>
              </button>
            )}

            <div className="flex items-center gap-3 min-w-0">
              <div className="relative flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-lk-gold/30 to-lk-maroon-light/50 dark:from-lk-gold/20 dark:to-lk-night-elevated border border-lk-gold/30 flex items-center justify-center shadow-lk-glow animate-float overflow-hidden">
                <LionMotif size={36} variant="gold" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg md:text-xl font-black leading-tight tracking-tight">
                  Gov<span className="text-transparent bg-clip-text bg-gradient-to-r from-lk-gold-light to-lk-gold">Companion</span>
                </h1>
                <p className="font-sinhala text-[11px] md:text-xs text-white/65 leading-snug truncate">
                  ඔබගේ විශ්වස්ත රජ සහකරු
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <LanguageToggle />
            <ThemeToggle />
            <div className="hidden md:flex items-center gap-3">
              {OFFICIAL_LINKS.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-white/45 hover:text-lk-gold-light transition-colors duration-200 hover:underline underline-offset-2"
              >
                {label}
              </a>
            ))}
            <div className="h-4 w-px bg-white/15" />
            <span className="hidden md:inline text-[11px] bg-emerald-500/20 border border-emerald-400/30 px-2.5 py-1 rounded-full text-emerald-100 flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-soft" />
              {t('header.liveAI')}
            </span>
            </div>
          </div>
        </div>
      </div>

      <div className="lk-gold-line" />

      <div className="bg-gradient-to-r from-lk-maroon-dark via-[#3d0a11] to-lk-maroon-dark dark:from-lk-night dark:via-lk-night-card dark:to-lk-night px-4 md:px-6 py-2 flex items-center gap-2 overflow-x-auto scrollbar-none border-b border-lk-gold/10">
        <span className="text-[10px] text-lk-gold font-bold uppercase tracking-widest flex-shrink-0 inline-flex items-center gap-1.5">
          <BoltIcon size={12} strokeWidth={2.25} />
          {t('header.quickAsk')}
        </span>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {QUICK_LINKS.map(({ label, q }) => (
            <button
              key={label}
              type="button"
              onClick={() => onQuickAsk(q)}
              className="flex-shrink-0 text-[11px] font-medium text-white/75 hover:text-white bg-white/5 hover:bg-lk-gold/25 border border-white/10 hover:border-lk-gold/50 px-3 py-1 rounded-full transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
            >
              {label}
            </button>
          ))}
        </div>
        {onOpenCompare && (
          <button
            type="button"
            onClick={onOpenCompare}
            className="flex-shrink-0 text-[11px] font-bold text-lk-maroon-dark bg-gradient-to-r from-lk-gold to-lk-gold-light hover:from-lk-gold-light hover:to-lk-gold px-3.5 py-1.5 rounded-full transition-all duration-200 hover:-translate-y-0.5 active:scale-95 shadow-lk-glow inline-flex items-center gap-1.5"
          >
            <ScaleIcon size={13} strokeWidth={2} />
            {t('header.compare')}
          </button>
        )}
      </div>
    </header>
  )
}
