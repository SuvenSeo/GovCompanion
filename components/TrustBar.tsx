'use client'

const TRUST_ITEMS = [
  { icon: '📞', label: 'GIC Helpline', value: '1919', href: 'https://gic.gov.lk' },
  { icon: '🏛️', label: 'Official sources', value: 'Verified data', href: 'https://gic.gov.lk' },
  { icon: '🔒', label: 'Fair use', value: 'Per-user limits', href: undefined },
]

export default function TrustBar() {
  return (
    <div className="flex-shrink-0 border-t border-lk-maroon/10 bg-lk-sand/80 backdrop-blur-sm px-4 md:px-6 py-2">
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-[10px] md:text-[11px] text-gray-600">
        {TRUST_ITEMS.map(({ icon, label, value, href }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span aria-hidden>{icon}</span>
            <span className="text-gray-500">{label}:</span>
            {href ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-lk-maroon hover:text-lk-maroon-light transition-colors"
              >
                {value}
              </a>
            ) : (
              <span className="font-semibold text-lk-maroon">{value}</span>
            )}
          </div>
        ))}
        <span className="hidden sm:inline text-gray-400">·</span>
        <span className="text-gray-400 text-center">
          Always confirm fees at the official office before you visit
        </span>
      </div>
    </div>
  )
}
