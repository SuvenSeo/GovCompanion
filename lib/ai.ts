import { anthropic } from '@ai-sdk/anthropic'
import { createGroq } from '@ai-sdk/groq'
import { createOpenAI } from '@ai-sdk/openai'
import type { LanguageModel } from 'ai'

export type AiProvider = 'groq' | 'openrouter' | 'anthropic'

/** Fast, strong instruction-following — best for live demos and English guidance. */
export const GROQ_MODEL = 'llama-3.3-70b-versatile'

/**
 * Balanced quality + multilingual (Sinhala/Tamil) via OpenRouter.
 * Requires OpenRouter credits, or set OPENROUTER_MODEL=meta-llama/llama-3.3-70b-instruct:free
 */
export const OPENROUTER_MODEL = 'google/gemini-2.5-flash'
export const OPENROUTER_FREE_MODEL = 'meta-llama/llama-3.3-70b-instruct:free'
export const OPENROUTER_FALLBACK_MODEL = 'meta-llama/llama-3.3-70b-instruct'

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

const openrouter = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  headers: {
    'HTTP-Referer': process.env.OPENROUTER_SITE_URL ?? 'https://gov-navigator-lk.vercel.app',
    'X-Title': 'GovNav LK',
  },
})

function resolveProvider(): AiProvider | null {
  const configured = process.env.AI_PROVIDER?.toLowerCase() as AiProvider | undefined

  if (configured === 'groq' && process.env.GROQ_API_KEY) return 'groq'
  if (configured === 'openrouter' && process.env.OPENROUTER_API_KEY) return 'openrouter'
  if (configured === 'anthropic' && process.env.ANTHROPIC_API_KEY) return 'anthropic'

  if (process.env.GROQ_API_KEY) return 'groq'
  if (process.env.OPENROUTER_API_KEY) return 'openrouter'
  if (process.env.ANTHROPIC_API_KEY) return 'anthropic'

  return null
}

export function getActiveProvider(): AiProvider | null {
  return resolveProvider()
}

export function getChatModel(): LanguageModel {
  const provider = resolveProvider()

  switch (provider) {
    case 'groq':
      return groq(process.env.GROQ_MODEL ?? GROQ_MODEL)
    case 'openrouter': {
      const modelId =
        process.env.OPENROUTER_MODEL ??
        (process.env.OPENROUTER_USE_FREE === 'true' ? OPENROUTER_FREE_MODEL : OPENROUTER_MODEL)
      return openrouter(modelId)
    }
    case 'anthropic':
      return anthropic(process.env.ANTHROPIC_MODEL ?? 'claude-haiku-4-5-20251001')
    default:
      throw new Error(
        'No AI provider configured. Set GROQ_API_KEY, OPENROUTER_API_KEY, or ANTHROPIC_API_KEY.',
      )
  }
}
