'use client'

import LkTricolorBar from '@/components/LkTricolorBar'

const TRUST_ITEMS = [
  { icon: '📞', label: 'GIC Helpline', value: '1919', href: 'https://gic.gov.lk' },
  { icon: '✓', label: 'Data', value: 'Official sources', href: 'https://gic.gov.lk' },
  { icon: '🔒', label: 'Privacy', value: 'No NIC stored', href: undefined },
  { icon: '🇱🇰', label: 'Built for', value: 'Sri Lanka', href: undefined },
]

export default function TrustBar() {
  return (
    <footer className="flex-shrink-0 relative">
      <LkTricolorBar />
      <div className="bg-gradient-to-r from-lk-sand via-lk-cream to-lk-sand dark:from-lk-night dark:via-lk-night-card dark:to-lk-night border-t border-lk-maroon/8 dark:border-lk-gold/10 px-4 md:px-6 py-3 transition-colors duration-300">
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[10px] md:text-[11px]">
          {TRUST_ITEMS.map(({ icon, label, value, href }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 bg-white/60 dark:bg-lk-night-elevated/80 border border-lk-maroon/8 dark:border-lk-gold/15 rounded-full px-3 py-1 shadow-sm"
            >
              <span aria-hidden>{icon}</span>
              <span className="text-gray-500">{label}:</span>
              {href ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-lk-maroon hover:text-lk-maroon-light transition-colors"
                >
                  {value}
                </a>
              ) : (
                <span className="font-bold text-lk-maroon">{value}</span>
              )}
            </div>
          ))}
        </div>
        <p className="text-center text-[10px] text-gray-400 dark:text-lk-cream/40 mt-2 font-sinhala">
          GovNav LK රජයේ ආයතනයක් නොවේ · Not affiliated with the Government of Sri Lanka
        </p>
      </div>
    </footer>
  )
}
