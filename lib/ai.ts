import { anthropic } from '@ai-sdk/anthropic'
import { createGroq } from '@ai-sdk/groq'
import { createOpenAI } from '@ai-sdk/openai'
import type { LanguageModel } from 'ai'

export type AiProvider = 'groq' | 'openrouter' | 'nvidia' | 'anthropic'

export const GROQ_MODEL = 'llama-3.3-70b-versatile'
export const OPENROUTER_MODEL = 'google/gemini-2.5-flash'
export const OPENROUTER_FREE_MODEL = 'meta-llama/llama-3.3-70b-instruct:free'

/** Primary NVIDIA NIM model — strong instruction-following for step-by-step govt guidance */
export const NVIDIA_NIM_MODEL = 'meta/llama-3.3-70b-instruct'

/**
 * Default NVIDIA fallbacks (tried in order when primary is rate-limited or unavailable).
 * - nemotron-super-49b: better reasoning for multi-step procedures
 * - nemotron-3-nano-30b: faster, lighter fallback
 */
export const NVIDIA_NIM_FALLBACK_MODELS = [
  'nvidia/llama-3.3-nemotron-super-49b-v1.5',
  'nvidia/nemotron-3-nano-30b-a3b',
] as const

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

const openrouter = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  headers: {
    'HTTP-Referer': process.env.OPENROUTER_SITE_URL ?? 'https://govcompanion-lk.vercel.app',
    'X-Title': 'GovCompanion',
  },
})

const nvidiaNim = createOpenAI({
  apiKey: process.env.NVIDIA_NIM_API_KEY ?? process.env.NVIDIA_API_KEY,
  baseURL: process.env.NVIDIA_NIM_BASE_URL ?? 'https://integrate.api.nvidia.com/v1',
})

function providerHasKey(provider: AiProvider): boolean {
  switch (provider) {
    case 'groq':
      return Boolean(process.env.GROQ_API_KEY)
    case 'openrouter':
      return Boolean(process.env.OPENROUTER_API_KEY)
    case 'nvidia':
      return Boolean(process.env.NVIDIA_NIM_API_KEY ?? process.env.NVIDIA_API_KEY)
    case 'anthropic':
      return Boolean(process.env.ANTHROPIC_API_KEY)
    default: {
      const _exhaustive: never = provider
      return Boolean(_exhaustive)
    }
  }
}

export function getProviderChain(): AiProvider[] {
  const fromEnv = process.env.AI_PROVIDER_CHAIN?.split(',').map((p) => p.trim().toLowerCase()) as
    | AiProvider[]
    | undefined

  const defaultOrder: AiProvider[] = ['groq', 'openrouter', 'nvidia', 'anthropic']
  const order = fromEnv?.length ? fromEnv : defaultOrder

  return order.filter((p) => {
    if (!['groq', 'openrouter', 'nvidia', 'anthropic'].includes(p)) return false
    return providerHasKey(p as AiProvider)
  }) as AiProvider[]
}

export function getActiveProvider(): AiProvider | null {
  const chain = getProviderChain()
  return chain[0] ?? null
}

export function getNvidiaModelChain(): string[] {
  const primary = process.env.NVIDIA_NIM_MODEL ?? NVIDIA_NIM_MODEL
  const fromEnv = process.env.NVIDIA_NIM_FALLBACK_MODELS?.split(',')
    .map((m) => m.trim())
    .filter(Boolean)
  const fallbacks = fromEnv?.length ? fromEnv : [...NVIDIA_NIM_FALLBACK_MODELS]
  return [...new Set([primary, ...fallbacks])]
}

export function getChatModelForProvider(
  provider: AiProvider,
  options?: { nvidiaModel?: string },
): LanguageModel {
  switch (provider) {
    case 'groq':
      return groq(process.env.GROQ_MODEL ?? GROQ_MODEL)
    case 'openrouter': {
      const modelId =
        process.env.OPENROUTER_MODEL ??
        (process.env.OPENROUTER_USE_FREE === 'true' ? OPENROUTER_FREE_MODEL : OPENROUTER_MODEL)
      return openrouter(modelId)
    }
    case 'nvidia': {
      const modelId = options?.nvidiaModel ?? process.env.NVIDIA_NIM_MODEL ?? NVIDIA_NIM_MODEL
      return nvidiaNim(modelId)
    }
    case 'anthropic':
      return anthropic(process.env.ANTHROPIC_MODEL ?? 'claude-haiku-4-5-20251001')
    default: {
      const _exhaustive: never = provider
      throw new Error(`Unknown provider: ${_exhaustive}`)
    }
  }
}

/** @deprecated Use getChatModelForProvider with getProviderChain */
export function getChatModel(): LanguageModel {
  const provider = getActiveProvider()
  if (!provider) {
    throw new Error(
      'No AI provider configured. Set GROQ_API_KEY, OPENROUTER_API_KEY, NVIDIA_NIM_API_KEY, or ANTHROPIC_API_KEY.',
    )
  }
  return getChatModelForProvider(provider)
}

export function isRetryableProviderError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false
  const err = error as { statusCode?: number; message?: string; status?: number }
  const code = err.statusCode ?? err.status
  if (code === 429 || code === 503 || code === 502 || code === 529) return true
  const msg = (err.message ?? '').toLowerCase()
  return (
    msg.includes('rate limit') ||
    msg.includes('rate_limit') ||
    msg.includes('too many requests') ||
    msg.includes('overloaded') ||
    msg.includes('capacity') ||
    msg.includes('quota') ||
    msg.includes('insufficient credits') ||
    msg.includes('402')
  )
}
