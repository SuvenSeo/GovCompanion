import { getProviderChain } from '@/lib/ai'
import { peekRateLimit, rateLimitHeaders } from '@/lib/rate-limit'

export const runtime = 'nodejs'

export async function GET(req: Request) {
  const rate = peekRateLimit(req)
  const providers = getProviderChain()

  return Response.json(
    {
      remaining: rate.remaining,
      limit: rate.limit,
      resetAt: rate.resetAt,
      providersConfigured: providers.length,
      providers,
    },
    { headers: rateLimitHeaders(rate) },
  )
}
