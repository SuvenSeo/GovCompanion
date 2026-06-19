const STORAGE_KEY = 'govnav-session-id'

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `gn-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}

/** Stable per-browser session id for fair rate limiting (not for auth). */
export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return 'server'
  try {
    let id = localStorage.getItem(STORAGE_KEY)
    if (!id) {
      id = generateId()
      localStorage.setItem(STORAGE_KEY, id)
    }
    return id
  } catch {
    return generateId()
  }
}

export function getSessionHeaders(): Record<string, string> {
  return { 'x-govnav-session': getOrCreateSessionId() }
}
