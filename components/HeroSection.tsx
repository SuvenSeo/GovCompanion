'use client'

import { useLanguage } from '@/components/LanguageProvider'
import LionMotif from '@/components/LionMotif'
import LkTricolorBar from '@/components/LkTricolorBar'
import { ClockIcon, LayersIcon, PhoneIcon, UsersIcon } from '@/components/Icons'
import { getTotalServiceCount } from '@/lib/knowledge'
import { useEffect, useState } from 'react'

const STORAGE_KEY = 'govcompanion-hero-dismissed'

interface HeroSectionProps {
  onStartQuery: () => void
  onVisibilityChange?: (expanded: boolean) => void
}

export default function HeroSection({ onStartQuery, onVisibilityChange }: HeroSectionProps) {
  const [visible, setVisible] = useState(true)
  const [closing, setClosing] = useState(false)
  const total = getTotalServiceCount()
  const { t } = useLanguage()

  const stats = [
    { Icon: LayersIcon, value: `${total}+`, label: t('stats.services') },
    { Icon: UsersIcon, value: '22M', label: t('stats.citizens') },
    { Icon: ClockIcon, value: '2–4h', label: t('stats.saved') },
    { Icon: PhoneIcon, value: '1919', label: 'GIC' },
  ]

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === '1') {
        setVisible(false)
        onVisibilityChange?.(false)
      }
    } catch {
      /* ignore */
    }
  }, [onVisibilityChange])

  const dismiss = () => {
    setClosing(true)
    setTimeout(() => {
      setVisible(false)
      setClosing(false)
      onVisibilityChange?.(false)
      try {
        localStorage.setItem(STORAGE_KEY, '1')
      } catch {
        /* ignore */
      }
    }, 400)
  }

  const handleStart = () => {
    onStartQuery()
    dismiss()
  }

  const restore = () => {
    setVisible(true)
    onVisibilityChange?.(true)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
  }

  if (!visible && !closing) {
    return (
      <button
        type="button"
        onClick={restore}
        className="flex-shrink-0 w-full text-center py-2 text-[11px] font-semibold text-lk-maroon/80 hover:text-lk-maroon dark:text-lk-gold/70 dark:hover:text-lk-gold-light bg-gradient-to-r from-lk-gold/12 via-lk-cream to-lk-emerald/8 dark:from-lk-gold/8 dark:via-lk-night-card dark:to-lk-emerald/8 border-b border-lk-gold/20 transition-colors"
      >
        <span className="inline-flex items-center justify-center gap-2">
          <LionMotif size={18} variant="maroon" className="dark:hidden" />
          <LionMotif size={18} variant="gold" className="hidden dark:block" />
          {t('hero.showBanner')}
        </span>
      </button>
    )
  }

  return (
    <div
      className={`flex-shrink-0 overflow-hidden transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
        closing ? 'max-h-0 opacity-0' : 'max-h-[340px] md:max-h-[148px] opacity-100'
      }`}
    >
      <section className="hero-batik relative overflow-hidden">
        <LkTricolorBar />
        <div className="absolute inset-0 bg-gradient-to-r from-lk-maroon via-[#5a1018] to-lk-maroon-dark dark:from-[#1a0508] dark:via-[#2d0a10] dark:to-[#0f0a0c]" />
        <LionMotif
          size={140}
          variant="gold"
          opacity={0.07}
          className="absolute -right-4 top-1/2 -translate-y-1/2 pointer-events-none hidden lg:block"
        />

        <div className="relative px-4 md:px-6 py-4 md:py-3">
          <button
            type="button"
            onClick={dismiss}
            className="absolute top-2 right-2 md:top-3 md:right-3 z-10 w-8 h-8 rounded-full bg-black/25 hover:bg-black/40 text-white/80 text-base backdrop-blur-sm border border-white/10 transition-all hover:scale-105"
            aria-label="Dismiss welcome banner"
          >
            ×
          </button>

          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 text-white pr-10">
            <div className="flex items-start gap-3 md:min-w-0 md:flex-1">
              <LionMotif size={44} variant="gold" className="flex-shrink-0 hidden sm:block animate-float" />
              <div className="min-w-0 text-left">
                <p className="font-sinhala text-[10px] font-bold uppercase tracking-widest text-lk-gold-light/90 mb-1">
                  {t('hero.eyebrow')}
                </p>
                <h2 className="font-sinhala text-lg sm:text-xl md:text-2xl font-black leading-tight tracking-tight">
                  {t('hero.titleLead')}{' '}
                  <span className="text-lk-gold-light">{t('hero.titleAccent')}</span>
                </h2>
                <p className="font-sinhala text-xs md:text-sm text-white/70 mt-1 truncate">
                  {t('hero.tagline')}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 md:gap-2.5 md:flex-shrink-0">
              {stats.map(({ Icon, value, label }) => (
                <div
                  key={label}
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold border border-lk-gold/35 bg-white/8 backdrop-blur-sm px-2.5 py-1.5 rounded-lg"
                >
                  <Icon size={13} className="text-lk-gold-light/80" strokeWidth={2} />
                  <span className="text-lk-gold-light">{value}</span>
                  <span className="text-white/50 font-medium uppercase">{label}</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleStart}
              className="group font-sinhala flex-shrink-0 w-full md:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-lk-gold via-lk-gold-light to-lk-gold text-lk-maroon-dark font-extrabold px-5 py-2.5 rounded-full shadow-lk-glow transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] text-sm"
            >
              {t('hero.cta')}
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </button>
          </div>
        </div>
        <LkTricolorBar />
      </section>
    </div>
  )
}
