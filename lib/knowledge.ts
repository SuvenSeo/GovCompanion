import servicesData from '@/data/services.json'
import expansionData from '@/data/stream-expansion-ready.json'
import catalogData from '@/data/services-catalog.json'
import {
  buildServiceIndex,
  retrieveRelevantContext,
} from '@/lib/retrieval'

export type Service = {
  id: string
  title: string
  sinhala?: string
  category: string
  emoji: string
  description: string
  department: string
  offices: { name: string; address: string; phone: string }[]
  documents_required: string[]
  steps: string[]
  fees: Record<string, string>
  processing_time: string
  online_available: boolean
  online_url: string
  tips: string[]
  common_mistakes: string[]
  available_certificates?: string[]
  appointment_url?: string
  source_url?: string
  last_verified?: string
}

export type ServiceCatalogEntry = {
  id: string
  title: string
  sinhala?: string
  category: string
  emoji: string
  department: string
  summary: string
  official_url: string
  online_available: boolean
  keywords: string[]
  last_verified?: string
}

export type BrowsableService = {
  id: string
  title: string
  category: string
  emoji: string
  detailLevel: 'full' | 'catalog'
}

const baseServices = servicesData as unknown as Service[]
const expansionServices = expansionData as unknown as Service[]

const expansionIds = new Set(baseServices.map((s) => s.id))
const mergedExpansion = expansionServices.filter((s) => !expansionIds.has(s.id))

export const services: Service[] = [...baseServices, ...mergedExpansion]
export const catalogServices = catalogData as unknown as ServiceCatalogEntry[]

const fullIds = new Set(services.map((s) => s.id))
export const catalogOnly = catalogServices.filter((c) => !fullIds.has(c.id))

export const categories = [
  ...new Set([
    ...services.map((s) => s.category),
    ...catalogOnly.map((s) => s.category),
  ]),
].sort()

export function getServicesByCategory(category: string): Service[] {
  return services.filter((s) => s.category === category)
}

export function getCatalogByCategory(category: string): ServiceCatalogEntry[] {
  return catalogOnly.filter((s) => s.category === category)
}

export function getBrowsableByCategory(category: string): BrowsableService[] {
  const full: BrowsableService[] = getServicesByCategory(category).map((s) => ({
    id: s.id,
    title: s.title,
    category: s.category,
    emoji: s.emoji,
    detailLevel: 'full' as const,
  }))
  const catalog: BrowsableService[] = getCatalogByCategory(category).map((s) => ({
    id: s.id,
    title: s.title,
    category: s.category,
    emoji: s.emoji,
    detailLevel: 'catalog' as const,
  }))
  return [...full, ...catalog].sort((a, b) => a.title.localeCompare(b.title))
}

export function getServiceById(id: string): Service | undefined {
  return services.find((s) => s.id === id)
}

export function getCatalogEntryById(id: string): ServiceCatalogEntry | undefined {
  return catalogServices.find((s) => s.id === id)
}

export function searchBrowsable(query: string): BrowsableService[] {
  const q = query.trim().toLowerCase()
  if (!q) return []

  const matches: BrowsableService[] = []

  for (const s of services) {
    if (
      s.title.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      (s.sinhala?.includes(query) ?? false)
    ) {
      matches.push({
        id: s.id,
        title: s.title,
        category: s.category,
        emoji: s.emoji,
        detailLevel: 'full',
      })
    }
  }

  for (const s of catalogOnly) {
    if (
      s.title.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.summary.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q) ||
      s.keywords.some((k) => k.toLowerCase().includes(q)) ||
      (s.sinhala?.includes(query) ?? false)
    ) {
      matches.push({
        id: s.id,
        title: s.title,
        category: s.category,
        emoji: s.emoji,
        detailLevel: 'catalog',
      })
    }
  }

  return matches.sort((a, b) => a.title.localeCompare(b.title))
}

export function searchServices(query: string): Service[] {
  const q = query.trim().toLowerCase()
  if (!q) return services

  return services.filter(
    (s) =>
      s.title.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      (s.sinhala?.includes(query) ?? false),
  )
}

export function getTotalServiceCount(): number {
  return services.length + catalogOnly.length
}

function extractLatestUserMessage(messages: unknown): string {
  if (!Array.isArray(messages)) return ''

  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i] as { role?: string; content?: unknown }
    if (msg?.role === 'user' && typeof msg.content === 'string') {
      return msg.content
    }
  }
  return ''
}

export function buildSystemPrompt(userQueryOrMessages?: string | unknown[]): string {
  const userQuery = Array.isArray(userQueryOrMessages)
    ? extractLatestUserMessage(userQueryOrMessages)
    : (userQueryOrMessages ?? '')

  const { fullServices, catalogServices: relevantCatalog } = retrieveRelevantContext(
    userQuery,
    services,
    catalogOnly,
    { maxFull: 3, maxCatalog: 6 },
  )

  const serviceIndex = buildServiceIndex(services, catalogOnly)
  const totalCount = getTotalServiceCount()

  const detailedKnowledge = JSON.stringify(fullServices, null, 2)
  const catalogKnowledge = JSON.stringify(relevantCatalog, null, 2)

  return `You are GovNav LK — Sri Lanka's AI-powered Government Service Navigator. You help Sri Lankan citizens find out exactly what documents to bring, which office to visit, what steps to follow, and how to avoid common mistakes for Sri Lankan government services.

## Coverage
You have access to a knowledge base of **${totalCount} government services** across ${categories.length} categories — sourced from official Sri Lankan government portals (gov.lk, GIC 1919, department websites). Services marked **[full detail]** in the index have complete step-by-step data. Others appear in the catalog with summary information.

## Your Personality
- Clear, friendly, and extremely practical
- You save people from wasting a day at the wrong office
- You always give complete, actionable answers

## Response Format
When answering about a government service, always structure your response using these exact markdown section headers:

**[Service Name]**
*Department: [department name]*
*Office: [address and phone]*

---

## 📋 Documents Required
- [document 1]
- [document 2]

## ✅ Steps
1. [step 1]
2. [step 2]

## 💰 Fees
- Cost: [fee information]
- Processing: [processing time]
- Online: [yes/no and URL if available]

## 💡 Tips
- [tip 1]
- [tip 2]

## ⚠️ Common Mistakes
- [mistake 1]

---
*Fees and requirements change — always call ahead or check the official website to confirm before your visit.*

## Rules
1. Answer ONLY about the specific service the user asked about — use the single best-matching entry in "Full Detail" below
2. NEVER mix document requirements from different services
3. Use ONLY facts from the knowledge below — every fee, address, and step must match the data exactly
4. Each service includes source_url and last_verified (2026-06-19) — when citing fees or offices, prefer that service's official source_url
5. If last_verified is present, tell users fees can change by gazette and to confirm at source_url or call the department hotline
6. Respond in the same language the user writes in (English, Sinhala, or Tamil when possible)
7. For **catalog-only** services: give department, summary, official URL only — always add "verify current fees at [official_url] (catalog last verified 2026-06-19)"
8. If unsure or data is missing, say so — never invent fees, documents, or steps
9. Key verified facts: Immigration Head Office = **Suhurupaya, Battaramulla** | DRP = **Suhurupaya, Battaramulla** | RGD = **Battaramulla** | Adult passport = **LKR 10,000 / 20,000** | First NIC = **LKR 200** | DMT renewal = **LKR 2,800**

## Full Detail — Top Matches for This Query
${detailedKnowledge}

## Catalog Matches — Summary Level (verify at official portal)
${catalogKnowledge}

## Complete Service Index (${totalCount} services)
${serviceIndex}`
}
