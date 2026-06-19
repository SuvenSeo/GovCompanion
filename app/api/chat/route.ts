import { streamText, type Message } from 'ai'
import {
  getProviderChain,
  getChatModelForProvider,
  getNvidiaModelChain,
  isRetryableProviderError,
  type AiProvider,
} from '@/lib/ai'
import { buildSystemPrompt } from '@/lib/knowledge'
import { enforceRateLimit, rateLimitHeaders } from '@/lib/rate-limit'

export const runtime = 'nodejs'
export const maxDuration = 60

type AttemptResult = {
  provider: AiProvider
  model?: string
  index: number
}

function modelsForProvider(provider: AiProvider): (string | undefined)[] {
  if (provider === 'nvidia') return getNvidiaModelChain()
  return [undefined]
}

async function streamWithProviderFallback(
  messages: Omit<Message, 'id'>[],
  extraHeaders: Record<string, string>,
) {
  const chain = getProviderChain()

  if (chain.length === 0) {
    return new Response(
      JSON.stringify({
        error:
          'AI service is not configured. Set GROQ_API_KEY, OPENROUTER_API_KEY, NVIDIA_NIM_API_KEY, or ANTHROPIC_API_KEY.',
      }),
      { status: 503, headers: { 'Content-Type': 'application/json' } },
    )
  }

  const system = buildSystemPrompt(messages)
  let lastError: unknown = null
  let attemptIndex = 0

  for (let i = 0; i < chain.length; i++) {
    const provider = chain[i] as AiProvider
    const models = modelsForProvider(provider)

    for (let m = 0; m < models.length; m++) {
      const nvidiaModel = models[m]
      const attempt: AttemptResult = { provider, model: nvidiaModel, index: attemptIndex++ }

      try {
        const result = streamText({
          model: getChatModelForProvider(provider, { nvidiaModel }),
          system,
          messages,
          maxTokens: 1024,
          temperature: 0.2,
        })

        return result.toDataStreamResponse({
          headers: {
            'X-AI-Provider': provider,
            ...(nvidiaModel ? { 'X-AI-Model': nvidiaModel } : {}),
            'X-AI-Fallback-Index': String(attempt.index),
            ...extraHeaders,
          },
        })
      } catch (error) {
        lastError = error
        const hasNextProvider = i < chain.length - 1
        const hasNextModel = m < models.length - 1

        if (isRetryableProviderError(error) && (hasNextModel || hasNextProvider)) {
          console.warn(
            `[GovNav] ${provider}${nvidiaModel ? `/${nvidiaModel}` : ''} failed, trying next:`,
            error,
          )
          continue
        }
        throw error
      }
    }
  }

  throw lastError ?? new Error('All AI providers failed')
}

export async function POST(req: Request) {
  const rate = enforceRateLimit(req)

  if (!rate.ok) {
    const retrySec = Math.max(1, Math.ceil((rate.resetAt - Date.now()) / 1000))
    return new Response(
      JSON.stringify({
        error: 'rate_limit_exceeded',
        message:
          'You have reached the message limit for now. Please wait a few minutes — this helps keep GovNav available for everyone.',
        retryAfter: retrySec,
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(retrySec),
          ...rateLimitHeaders(rate),
        },
      },
    )
  }

  const { messages } = await req.json()

  try {
    return await streamWithProviderFallback(
      messages as Omit<Message, 'id'>[],
      rateLimitHeaders(rate),
    )
  } catch (error) {
    console.error('[GovNav] Chat error:', error)
    return new Response(
      JSON.stringify({
        error: 'ai_error',
        message: 'Our AI is temporarily busy. Please try again in a moment.',
      }),
      { status: 503, headers: { 'Content-Type': 'application/json', ...rateLimitHeaders(rate) } },
    )
  }
}
