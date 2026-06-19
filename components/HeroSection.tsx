'use client'

import LionMotif from '@/components/LionMotif'
import LkTricolorBar from '@/components/LkTricolorBar'
import { getTotalServiceCount } from '@/lib/knowledge'
import { useEffect, useState } from 'react'

const STORAGE_KEY = 'govnav-hero-dismissed'

interface HeroSectionProps {
  onStartQuery: () => void
  onVisibilityChange?: (expanded: boolean) => void
}

export default function HeroSection({ onStartQuery, onVisibilityChange }: HeroSectionProps) {
  const [expanded, setExpanded] = useState(true)
  const [closing, setClosing] = useState(false)
  const total = getTotalServiceCount()

  const stats = [
    { icon: '🦁', value: `${total}+`, label: 'Services' },
    { icon: '🇱🇰', value: '22M', label: 'Citizens' },
    { icon: '⏱️', value: '2–4h', label: 'Saved' },
    { icon: '📞', value: '1919', label: 'GIC' },
  ]

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === '1') {
        setExpanded(false)
        onVisibilityChange?.(false)
      }
    } catch {
      /* ignore */
    }
  }, [onVisibilityChange])

  const dismiss = () => {
    setClosing(true)
    setTimeout(() => {
      setExpanded(false)
      setClosing(false)
      onVisibilityChange?.(false)
      try {
        localStorage.setItem(STORAGE_KEY, '1')
      } catch {
        /* ignore */
      }
    }, 450)
  }

  const restore = () => {
    setExpanded(true)
    onVisibilityChange?.(true)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
  }

  if (!expanded && !closing) {
    return (
      <button
        type="button"
        onClick={restore}
        className="flex-shrink-0 w-full text-center py-2.5 text-[11px] font-semibold text-lk-maroon/80 hover:text-lk-maroon dark:text-lk-gold/70 dark:hover:text-lk-gold-light bg-gradient-to-r from-lk-gold/15 via-lk-cream to-lk-emerald/10 dark:from-lk-gold/10 dark:via-lk-night-card dark:to-lk-emerald/10 border-b border-lk-gold/25 transition-all hover:shadow-sm animate-fade-in"
      >
        <span className="inline-flex items-center gap-2">
          <LionMotif size={20} variant="maroon" className="dark:hidden" />
          <LionMotif size={20} variant="gold" className="hidden dark:block" />
          Show Sri Lanka welcome banner
        </span>
      </button>
    )
  }

  return (
    <div
      className={`flex-shrink-0 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        closing ? 'max-h-0 opacity-0' : 'max-h-[520px] opacity-100'
      }`}
    >
      <section className="hero-batik relative overflow-hidden">
        <LkTricolorBar />
        <div
          className="absolute inset-0 bg-gradient-to-br from-lk-maroon via-[#5a1018] to-lk-maroon-dark dark:from-[#1a0508] dark:via-[#2d0a10] dark:to-[#0f0a0c] animate-gradient-shift"
          style={{ backgroundSize: '200% 200%' }}
        />

        <LionMotif
          size={200}
          variant="gold"
          opacity={0.08}
          className="absolute -left-8 -bottom-8 pointer-events-none hidden sm:block"
        />
        <LionMotif
          size={160}
          variant="gold"
          opacity={0.06}
          className="absolute -right-6 top-4 pointer-events-none hidden md:block"
        />

        <div className="relative px-4 md:px-10 py-8 md:py-10">
          <button
            type="button"
            onClick={dismiss}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/20 hover:bg-black/30 text-white/80 text-lg backdrop-blur-sm border border-white/10 transition-all hover:scale-105 hover:rotate-90 duration-300"
            aria-label="Dismiss welcome banner"
          >
            ×
          </button>

          <div className="max-w-3xl mx-auto text-center text-white">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <LionMotif size={56} variant="gold" className="animate-float" />
                <span className="absolute -bottom-1 -right-1 text-lg">🇱🇰</span>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 rounded-full px-4 py-1.5 mb-3 text-[11px] font-semibold tracking-wide uppercase text-lk-gold-light">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-soft" />
              Sri Lanka&apos;s AI Government Guide
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-[1.15]">
              Never Waste A Day At A{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-lk-gold-light via-lk-gold to-lk-gold-light">
                Government Office
              </span>{' '}
              Again
            </h2>

            <p className="font-sinhala text-base md:text-lg text-white/80 mt-3 font-medium">
              ලේසියෙන්ම රජයේ සේවාවන් ලබා ගන්නේ කෙසේද?
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3 mt-6 max-w-2xl mx-auto">
              {stats.map(({ icon, value, label }, i) => (
                <div
                  key={label}
                  className="lk-stat-badge flex-col !py-3 !rounded-xl opacity-0 animate-fade-up"
                  style={{ animationDelay: `${0.08 + i * 0.07}s`, animationFillMode: 'forwards' }}
                >
                  <span className="text-lg" aria-hidden>
                    {icon}
                  </span>
                  <span className="text-lg md:text-xl font-black text-lk-gold-light leading-none">
                    {value}
                  </span>
                  <span className="text-[10px] text-white/60 font-medium uppercase tracking-wider">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={onStartQuery}
              className="group mt-7 inline-flex items-center gap-2.5 bg-gradient-to-r from-lk-gold via-lk-gold-light to-lk-gold text-lk-maroon-dark font-extrabold px-8 py-3.5 rounded-full shadow-lk-glow transition-all duration-300 hover:-translate-y-1 active:scale-[0.98] text-sm md:text-base"
            >
              <span>Start Your Query</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>
          </div>
        </div>
        <LkTricolorBar />
      </section>
    </div>
  )
}
