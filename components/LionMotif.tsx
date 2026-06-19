/** Stylized heraldic lion — decorative motif inspired by Sri Lankan civic identity (not official state emblem). */
interface LionMotifProps {
  className?: string
  size?: number
  opacity?: number
  variant?: 'gold' | 'maroon' | 'cream'
}

const fills = {
  gold: { primary: '#F5D060', secondary: '#D4A017', accent: '#FFF9F2' },
  maroon: { primary: '#8B1A28', secondary: '#6B0F1A', accent: '#D4A017' },
  cream: { primary: '#FFF9F2', secondary: '#F5EDE0', accent: '#D4A017' },
}

export default function LionMotif({
  className = '',
  size = 120,
  opacity = 1,
  variant = 'gold',
}: LionMotifProps) {
  const c = fills[variant]

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ opacity }}
      aria-hidden
    >
      <circle cx="60" cy="60" r="56" stroke={c.accent} strokeWidth="1" strokeOpacity="0.35" />
      <circle cx="60" cy="60" r="48" stroke={c.secondary} strokeWidth="0.5" strokeOpacity="0.25" />
      {/* Mane */}
      <path
        d="M38 52c-4-14 8-28 22-30 10-1 18 4 22 14 6-2 14 0 18 8 4 10 0 22-8 28-6 4-14 6-22 4-8 10-22 12-32 2-8-8-6-20 0-26z"
        fill={c.secondary}
        fillOpacity="0.9"
      />
      {/* Head */}
      <ellipse cx="62" cy="48" rx="18" ry="16" fill={c.primary} />
      {/* Ear */}
      <path d="M48 36 L44 28 L52 34 Z" fill={c.primary} />
      <path d="M76 36 L80 28 L72 34 Z" fill={c.primary} />
      {/* Eye */}
      <circle cx="56" cy="46" r="2.5" fill={c.secondary} />
      <circle cx="68" cy="46" r="2.5" fill={c.secondary} />
      {/* Nose */}
      <path d="M60 52 L56 56 L64 56 Z" fill={c.secondary} />
      {/* Body */}
      <path
        d="M42 68c0 12 10 22 24 24 14-2 24-12 24-24 0-8-4-14-10-18-6 6-14 10-24 10s-18-4-24-10c-6 4-10 10-10 18z"
        fill={c.primary}
        fillOpacity="0.85"
      />
      {/* Front paw */}
      <ellipse cx="50" cy="88" rx="8" ry="5" fill={c.secondary} fillOpacity="0.7" />
      <ellipse cx="74" cy="88" rx="8" ry="5" fill={c.secondary} fillOpacity="0.7" />
      {/* Tail curl */}
      <path
        d="M88 72c8 4 12 14 8 22-2 4-6 6-10 6"
        stroke={c.accent}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* Sword-inspired vertical line (abstract civic symbol) */}
      <line
        x1="60"
        y1="62"
        x2="60"
        y2="95"
        stroke={c.accent}
        strokeWidth="2"
        strokeOpacity="0.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
