'use client'

import { useLanguage } from '@/components/LanguageProvider'
import { LANGS } from '@/lib/i18n'

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage()

  return (
    <div
      className="flex items-center rounded-xl bg-white/10 dark:bg-white/5 border border-white/15 dark:border-lk-gold/20 p-0.5"
      role="group"
      aria-label="Select language"
    >
      {LANGS.map(({ code, short, label }) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          title={label}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all duration-200 ${
            lang === code
              ? 'bg-gradient-to-r from-lk-gold to-lk-gold-light text-lk-maroon-dark shadow-sm'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          } ${code !== 'en' ? 'font-sinhala' : ''}`}
        >
          {short}
        </button>
      ))}
    </div>
  )
}
