import type { MatchedSource } from '@/lib/matchServiceFromQuery'

interface VerifiedSourceChipProps {
  source: MatchedSource
}

export default function VerifiedSourceChip({ source }: VerifiedSourceChipProps) {
  const host = (() => {
    try {
      return new URL(source.sourceUrl).hostname.replace(/^www\./, '')
    } catch {
      return 'official source'
    }
  })()

  return (
    <div className="mt-2 flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
        <span aria-hidden>✓</span> Source verified
        {source.lastVerified && (
          <span className="font-normal text-emerald-700">· {source.lastVerified}</span>
        )}
      </span>
      <a
        href={source.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[10px] text-lk-maroon hover:text-lk-maroon-light underline underline-offset-2"
      >
        {host} — {source.title}
      </a>
    </div>
  )
}
