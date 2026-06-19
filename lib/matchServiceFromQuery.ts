import { searchServices, type Service } from '@/lib/knowledge'

export type MatchedSource = {
  title: string
  sourceUrl: string
  lastVerified?: string
}

export function matchServiceFromQuery(query: string): MatchedSource | null {
  const q = query.trim().toLowerCase()
  if (!q) return null

  const results = searchServices(query)
  if (results.length === 0) return null

  const best = pickBestMatch(q, results)
  if (!best?.source_url) return null

  return {
    title: best.title,
    sourceUrl: best.source_url,
    lastVerified: best.last_verified,
  }
}

function pickBestMatch(q: string, results: Service[]): Service | undefined {
  const keywords = [
    { terms: ['passport', 'ගමන්', 'immigration'], id: 'passport' },
    { terms: ['nic', 'identity', 'හැඳුනුම්'], id: 'nic' },
    { terms: ['driving', 'license', 'licence', 'රිය'], id: 'driving' },
    { terms: ['birth', 'උප්පැන්න'], id: 'birth' },
    { terms: ['police', 'clearance', 'පොලිස්'], id: 'police' },
    { terms: ['marriage', 'විවාහ'], id: 'marriage' },
    { terms: ['vehicle', 'registration', 'වාහන'], id: 'vehicle' },
    { terms: ['grama', 'niladhari', 'ග්‍රාම'], id: 'grama' },
  ]

  for (const { terms } of keywords) {
    if (terms.some((t) => q.includes(t))) {
      const hit = results.find((s) =>
        terms.some(
          (t) =>
            s.title.toLowerCase().includes(t) ||
            s.id.toLowerCase().includes(t) ||
            (s.sinhala?.includes(t) ?? false),
        ),
      )
      if (hit) return hit
    }
  }

  return results.find((s) => q.includes(s.title.toLowerCase().slice(0, 8))) ?? results[0]
}
