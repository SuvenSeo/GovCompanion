'use client'

import { applyTheme, getStoredTheme, setStoredTheme, type Theme } from '@/lib/theme'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'

type ThemeContextValue = {
  theme: Theme
  isDark: boolean
  setTheme: (theme: Theme) => void
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system')
  const [isDark, setIsDark] = useState(false)

  const sync = useCallback((next: Theme) => {
    applyTheme(next)
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

  useEffect(() => {
    const stored = getStoredTheme()
    setThemeState(stored)
    sync(stored)

    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      if (getStoredTheme() === 'system') sync('system')
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [sync])

  const setTheme = useCallback(
    (next: Theme) => {
      setStoredTheme(next)
      setThemeState(next)
      sync(next)
    },
    [sync],
  )

  const toggle = useCallback(() => {
    const next = document.documentElement.classList.contains('dark') ? 'light' : 'dark'
    setTheme(next)
  }, [setTheme])

  return (
    <ThemeContext.Provider value={{ theme, isDark, setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
