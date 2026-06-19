'use client'

import { getTotalServiceCount } from '@/lib/knowledge'
import { useEffect, useState } from 'react'

const STORAGE_KEY = 'govnav-hero-dismissed'

interface HeroSectionProps {
  onStartQuery: () => void
}

const STATS = [
  { icon: '🦁', label: `${getTotalServiceCount()}+ Services` },
  { icon: '🇱🇰', label: '22M Sri Lankans' },
  { icon: '⏱️', label: 'Save 2–4 Hours' },
]

export default function HeroSection({ onStartQuery }: HeroSectionProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === '1') setVisible(false)
    } catch {
      /* ignore */
    }
  }, [])

  const dismiss = () => {
    setVisible(false)
    try {
      localStorage.setItem(STORAGE_KEY, '1')
    } catch {
      /* ignore */
    }
  }

  if (!visible) {
    return (
      <button
        type="button"
        onClick={() => setVisible(true)}
        className="flex-shrink-0 w-full text-center py-1.5 text-[10px] text-lk-maroon/60 hover:text-lk-maroon bg-lk-gold/10 border-b border-lk-gold/20 transition-colors"
      >
        Show welcome banner ↑
      </button>
    )
  }

  return (
    <section className="hero-batik flex-shrink-0 relative overflow-hidden animate-fade-in">
      <div className="absolute inset-0 bg-gradient-to-br from-lk-maroon via-lk-maroon-dark to-[#3a0910]" />
      <div className="relative px-4 md:px-8 py-6 md:py-8 text-center text-white">
        <button
          type="button"
          onClick={dismiss}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/70 text-sm transition-colors"
          aria-label="Dismiss welcome banner"
        >
          ×
        </button>

        <h2 className="text-xl md:text-3xl font-extrabold tracking-tight max-w-2xl mx-auto leading-tight">
          Never Waste A Day At A{' '}
          <span className="text-lk-gold-light">Government Office</span> Again
        </h2>
        <p className="font-sinhala text-sm md:text-base text-white/75 mt-2 max-w-xl mx-auto">
          ලේසියෙන්ම රජයේ සේවාවන් ලබා ගන්නේ කෙසේද?
        </p>

        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mt-5">
          {STATS.map(({ icon, label }, i) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 text-xs md:text-sm font-semibold border border-lk-gold/50 bg-white/5 backdrop-blur-sm px-3 py-1.5 rounded-full opacity-0 animate-fade-up"
              style={{ animationDelay: `${0.1 + i * 0.06}s`, animationFillMode: 'forwards' }}
            >
              <span aria-hidden>{icon}</span>
              {label}
            </span>
          ))}
        </div>

        <button
          type="button"
          onClick={onStartQuery}
          className="mt-5 inline-flex items-center gap-2 bg-lk-gold hover:bg-lk-gold-light text-lk-maroon-dark font-bold px-6 py-2.5 rounded-full shadow-lk-glow transition-all duration-200 hover:-translate-y-0.5 active:scale-95 text-sm md:text-base"
        >
          Start Your Query →
        </button>
      </div>
    </section>
  )
}
