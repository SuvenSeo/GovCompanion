import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'lk-maroon': '#6B0F1A',
        'lk-maroon-dark': '#4A0B12',
        'lk-maroon-light': '#8B1A28',
        'lk-gold': '#D4A017',
        'lk-gold-light': '#F5D060',
        'lk-green': '#0D5C4B',
        'lk-green-light': '#1A7A64',
        'lk-emerald': '#005F4E',
        'lk-emerald-light': '#1A8A72',
        'lk-saffron': '#FF6B35',
        'lk-cream': '#FFF9F2',
        'lk-sand': '#F5EDE0',
        'lk-night': '#0f0a0c',
        'lk-night-card': '#1a1014',
        'lk-night-elevated': '#24161c',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        sinhala: ['var(--font-noto-sinhala)', 'var(--font-inter)', 'sans-serif'],
      },
      boxShadow: {
        'lk-soft': '0 4px 24px -4px rgba(107, 15, 26, 0.12)',
        'lk-glow': '0 0 40px -8px rgba(212, 160, 23, 0.35)',
        'lk-card': '0 2px 12px rgba(74, 11, 18, 0.08)',
        'lk-premium': '0 8px 32px -8px rgba(107, 15, 26, 0.18), 0 0 0 1px rgba(212, 160, 23, 0.08)',
        'lk-inner': 'inset 0 1px 0 rgba(255, 255, 255, 0.6)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.65' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.05)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'modal-in': {
          '0%': { opacity: '0', transform: 'scale(0.95) translateY(8px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'modal-out': {
          '0%': { opacity: '1', transform: 'scale(1) translateY(0)' },
          '100%': { opacity: '0', transform: 'scale(0.96) translateY(4px)' },
        },
        'hero-collapse': {
          '0%': { opacity: '1', maxHeight: '500px' },
          '100%': { opacity: '0', maxHeight: '0' },
        },
        'main-expand': {
          '0%': { opacity: '0.85', transform: 'scale(0.99)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.45s ease-out forwards',
        'fade-in': 'fade-in 0.35s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.4s ease-out forwards',
        'slide-in-left': 'slide-in-left 0.4s ease-out forwards',
        shimmer: 'shimmer 2.5s linear infinite',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        float: 'float 3s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 4s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
        'modal-in': 'modal-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'modal-out': 'modal-out 0.25s ease-in forwards',
        'hero-collapse': 'hero-collapse 0.45s ease-in forwards',
        'main-expand': 'main-expand 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
    },
  },
  plugins: [],
}

export default config
