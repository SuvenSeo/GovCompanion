'use client'

import { useLanguage } from '@/components/LanguageProvider'
import LkTricolorBar from '@/components/LkTricolorBar'
import { CheckBadgeIcon, PhoneIcon, ShieldIcon } from '@/components/Icons'

const TRUST_ITEMS = [
  { Icon: PhoneIcon, label: 'GIC', value: '1919', href: 'https://gic.gov.lk' },
  { Icon: CheckBadgeIcon, label: 'Data', value: 'Verified', href: 'https://gic.gov.lk' },
  { Icon: ShieldIcon, label: 'Privacy', value: 'No NIC stored', href: undefined },
]

export default function TrustBar() {
  const { t } = useLanguage()
  return (
    <footer className="flex-shrink-0 relative z-10">
      <LkTricolorBar />
      <div className="bg-lk-sand/90 dark:bg-lk-night-card/95 backdrop-blur-sm border-t border-lk-maroon/8 dark:border-lk-gold/10 px-4 md:px-6 py-2 transition-colors duration-300">
        <div className="flex flex-wrap items-center justify-between gap-2 text-[10px]">
          <div className="flex flex-wrap items-center gap-2">
            {TRUST_ITEMS.map(({ Icon, label, value, href }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 bg-white/70 dark:bg-lk-night-elevated/80 border border-lk-maroon/8 dark:border-lk-gold/12 rounded-full px-2.5 py-0.5"
              >
                <Icon size={12} className="text-lk-maroon/70 dark:text-lk-gold-light/70" strokeWidth={2} />
                <span className="text-gray-500 dark:text-lk-cream/50">{label}:</span>
                {href ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-lk-maroon dark:text-lk-gold-light hover:underline"
                  >
                    {value}
                  </a>
                ) : (
                  <span className="font-semibold text-lk-maroon dark:text-lk-gold-light">{value}</span>
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1.5 text-[10px]">
            <span className="inline-flex items-center gap-1.5 font-semibold font-sinhala text-lk-maroon dark:text-lk-gold-light">
              <span className="w-1.5 h-1.5 rounded-full bg-lk-saffron flex-shrink-0" aria-hidden />
              {t('trust.notOfficial')}
            </span>
            <span className="text-gray-300 dark:text-lk-cream/20 hidden sm:inline">·</span>
            <span className="text-gray-400 dark:text-lk-cream/35 font-sinhala hidden sm:inline">
              GovCompanion රජයේ ආයතනයක් නොවේ
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
