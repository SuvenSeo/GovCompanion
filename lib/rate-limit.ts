type WindowBucket = {
  count: number
  resetAt: number
}

const store = new Map<string, WindowBucket>()

const CLEANUP_INTERVAL_MS = 60_000
let lastCleanup = Date.now()

function cleanup(now: number) {
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return
  lastCleanup = now
  for (const [key, bucket] of store.entries()) {
    if (bucket.resetAt <= now) store.delete(key)
  }
}

export type RateLimitConfig = {
  limit: number
  windowMs: number
}

export type RateLimitResult = {
  ok: boolean
  limit: number
  remaining: number
  resetAt: number
}

function checkWindow(key: string, config: RateLimitConfig, now: number): RateLimitResult {
  const bucketKey = `${key}:${config.windowMs}`
  const existing = store.get(bucketKey)

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + config.windowMs
    store.set(bucketKey, { count: 1, resetAt })
    return { ok: true, limit: config.limit, remaining: config.limit - 1, resetAt }
  }

  if (existing.count >= config.limit) {
    return { ok: false, limit: config.limit, remaining: 0, resetAt: existing.resetAt }
  }

  existing.count += 1
  return {
    ok: true,
    limit: config.limit,
    remaining: config.limit - existing.count,
    resetAt: existing.resetAt,
  }
}

export function getRateLimitConfigs(): { burst: RateLimitConfig; hourly: RateLimitConfig } {
  return {
    burst: {
      limit: Number(process.env.RATE_LIMIT_PER_MINUTE ?? 5),
      windowMs: 60_000,
    },
    hourly: {
      limit: Number(process.env.RATE_LIMIT_PER_HOUR ?? 25),
      windowMs: 60 * 60_000,
    },
  }
}

export function getClientKey(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  const ip =
    forwarded?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    req.headers.get('cf-connecting-ip') ??
    'anonymous'
  const session = req.headers.get('x-govnav-session')?.slice(0, 64) ?? 'no-session'
  return `${ip}:${session}`
}

export function enforceRateLimit(req: Request): RateLimitResult & { burst: RateLimitResult } {
  const now = Date.now()
  cleanup(now)

  const key = getClientKey(req)
  const { burst, hourly } = getRateLimitConfigs()

  const burstResult = checkWindow(key, burst, now)
  const hourlyResult = checkWindow(key, hourly, now)

  const ok = burstResult.ok && hourlyResult.ok
  const limiting = !burstResult.ok ? burstResult : hourlyResult

  return {
    ok,
    limit: limiting.limit,
    remaining: Math.min(burstResult.remaining, hourlyResult.remaining),
    resetAt: limiting.resetAt,
    burst: burstResult,
  }
}

export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': String(result.limit),
    'X-RateLimit-Remaining': String(Math.max(0, result.remaining)),
    'X-RateLimit-Reset': String(Math.ceil(result.resetAt / 1000)),
  }
}

export function peekRateLimit(req: Request): RateLimitResult {
  const now = Date.now()
  const key = getClientKey(req)
  const { burst, hourly } = getRateLimitConfigs()

  const burstKey = `${key}:${burst.windowMs}`
  const hourlyKey = `${key}:${hourly.windowMs}`
  const burstBucket = store.get(burstKey)
  const hourlyBucket = store.get(hourlyKey)

  const burstRemaining =
    !burstBucket || burstBucket.resetAt <= now
      ? burst.limit
      : Math.max(0, burst.limit - burstBucket.count)
  const hourlyRemaining =
    !hourlyBucket || hourlyBucket.resetAt <= now
      ? hourly.limit
      : Math.max(0, hourly.limit - hourlyBucket.count)

  const resetAt = Math.max(burstBucket?.resetAt ?? now, hourlyBucket?.resetAt ?? now)

  return {
    ok: burstRemaining > 0 && hourlyRemaining > 0,
    limit: hourly.limit,
    remaining: Math.min(burstRemaining, hourlyRemaining),
    resetAt,
  }
}
