'use client'

import { useTheme } from '@/components/ThemeProvider'

export default function ThemeToggle() {
  const { isDark, toggle } = useTheme()

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/10 hover:bg-lk-gold/20 dark:bg-white/5 dark:hover:bg-lk-gold/25 border border-white/10 dark:border-lk-gold/20 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      <span className="text-base transition-transform duration-500" aria-hidden>
        {isDark ? '☀️' : '🌙'}
      </span>
    </button>
  )
}
