import type { Service, ServiceCatalogEntry } from '@/lib/knowledge'

const QUERY_ALIASES: Record<string, string[]> = {
  nic: ['national identity card', 'identity card', 'හැඳුනුම්පත'],
  passport: ['travel document', 'පාස්පෝට්', 'renew', 'renewal'],
  renew: ['renewal', 'replace', 'update'],
  license: ['licence', 'driving', 'vehicle'],
  tax: ['ird', 'income tax', 'tin', 'vat', 'බදු'],
  land: ['property', 'title', 'deed', 'ඉඩම'],
  welfare: ['aswesuma', 'samurdhi', 'benefits', 'දීමනා'],
  company: ['business', 'eroc', 'incorporation', 'සමාගම'],
  foreign: ['slbfe', 'overseas', 'migrant', 'විදේශ'],
  court: ['legal', 'case', 'lawsuit', 'නඩු'],
  hospital: ['health', 'medical', 'doctor', 'රෝහල'],
  school: ['education', 'university', 'exam', 'පාසල'],
}

/** Boost specific service IDs when query intent is clear */
const INTENT_BOOSTS: { pattern: RegExp; serviceIds: string[]; bonus: number }[] = [
  { pattern: /\brenew.*passport|\bpassport.*renew/i, serviceIds: ['passport-renewal'], bonus: 50 },
  { pattern: /\bnew.*passport|\bfirst.*passport|\bapply.*passport/i, serviceIds: ['passport-new'], bonus: 40 },
  { pattern: /\bpassport/i, serviceIds: ['passport-new', 'passport-renewal'], bonus: 20 },
  { pattern: /\bdriving.*renew|\brenew.*driv/i, serviceIds: ['driving-license-renewal'], bonus: 50 },
  { pattern: /\blearner|\bprovisional/i, serviceIds: ['driving-license-learner'], bonus: 40 },
  { pattern: /\bfull.*driv|\bdriving.*full/i, serviceIds: ['driving-license-full'], bonus: 40 },
]

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s/-]/gu, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1)
}

function expandQueryTokens(tokens: string[]): Set<string> {
  const expanded = new Set(tokens)
  for (const token of tokens) {
    const aliases = QUERY_ALIASES[token]
    if (aliases) {
      for (const alias of aliases) {
        for (const part of tokenize(alias)) {
          expanded.add(part)
        }
      }
    }
  }
  return expanded
}

function scoreText(haystack: string, tokens: Set<string>): number {
  const lower = haystack.toLowerCase()
  let score = 0
  for (const token of tokens) {
    if (lower.includes(token)) score += 1
  }
  return score
}

function scoreItem(
  item: {
    id?: string
    title: string
    category: string
    description?: string
    summary?: string
    sinhala?: string
    department?: string
    keywords?: string[]
  },
  tokens: Set<string>,
  query: string,
): number {
  let score = 0
  score += scoreText(item.title, tokens) * 4
  score += scoreText(item.category, tokens) * 2
  if (item.description) score += scoreText(item.description, tokens) * 2
  if (item.summary) score += scoreText(item.summary, tokens) * 2
  if (item.department) score += scoreText(item.department, tokens)
  if (item.sinhala) score += scoreText(item.sinhala, tokens) * 3
  if (item.keywords) {
    for (const kw of item.keywords) {
      score += scoreText(kw, tokens) * 2
    }
  }
  if (item.id) {
    for (const boost of INTENT_BOOSTS) {
      if (boost.pattern.test(query) && boost.serviceIds.includes(item.id)) {
        score += boost.bonus
      }
    }
  }
  return score
}

export type RetrievalResult = {
  fullServices: Service[]
  catalogServices: ServiceCatalogEntry[]
}

export function retrieveRelevantContext(
  query: string,
  allFull: Service[],
  allCatalog: ServiceCatalogEntry[],
  options?: { maxFull?: number; maxCatalog?: number },
): RetrievalResult {
  const maxFull = options?.maxFull ?? 6
  const maxCatalog = options?.maxCatalog ?? 10

  const trimmed = query.trim()
  if (!trimmed) {
    return {
      fullServices: allFull.slice(0, maxFull),
      catalogServices: allCatalog.slice(0, maxCatalog),
    }
  }

  const tokens = expandQueryTokens(tokenize(trimmed))

  const rankedFull = allFull
    .map((s) => ({ s, score: scoreItem(s, tokens, trimmed) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)

  const rankedCatalog = allCatalog
    .map((s) => ({ s, score: scoreItem(s, tokens, trimmed) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)

  const fullIds = new Set(rankedFull.map((x) => x.s.id))

  const catalogWithoutDupes = rankedCatalog.filter((x) => !fullIds.has(x.s.id))

  // When one service is a clear match, avoid polluting context with unrelated services
  const topScore = rankedFull[0]?.score ?? 0
  const secondScore = rankedFull[1]?.score ?? 0
  const focusedFull =
    topScore > 0 && topScore >= secondScore * 2
      ? rankedFull.slice(0, 1)
      : rankedFull.slice(0, maxFull)

  return {
    fullServices:
      rankedFull.length > 0 ? focusedFull.map((x) => x.s) : allFull.slice(0, 3),
    catalogServices:
      catalogWithoutDupes.length > 0
        ? catalogWithoutDupes.slice(0, Math.min(maxCatalog, 4)).map((x) => x.s)
        : [],
  }
}

export function buildServiceIndex(
  allFull: Service[],
  allCatalog: ServiceCatalogEntry[],
): string {
  const byCategory = new Map<string, string[]>()

  const add = (category: string, label: string) => {
    const list = byCategory.get(category) ?? []
    list.push(label)
    byCategory.set(category, list)
  }

  for (const s of allFull) {
    add(s.category, `${s.emoji} ${s.title} [full detail]`)
  }
  for (const s of allCatalog) {
    add(s.category, `${s.emoji} ${s.title}`)
  }

  const lines: string[] = []
  for (const [category, items] of [...byCategory.entries()].sort((a, b) =>
    a[0].localeCompare(b[0]),
  )) {
    lines.push(`### ${category} (${items.length})`)
    for (const item of items.sort((a, b) => a.localeCompare(b))) {
      lines.push(`- ${item}`)
    }
    lines.push('')
  }

  return lines.join('\n')
}
