import { generateText, formatDataStreamPart, generateId, type Message } from 'ai'
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

const LANGUAGE_DIRECTIVE: Record<string, string> = {
  si: '\n\nIMPORTANT: The user has selected Sinhala. Reply entirely in clear, natural Sinhala (සිංහල). Keep official office names, URLs, and form codes in their original form.',
  ta: '\n\nIMPORTANT: The user has selected Tamil. Reply entirely in clear, natural Tamil (தமிழ்). Keep official office names, URLs, and form codes in their original form.',
}

/** useChat-compatible data stream from a completed answer (enables reliable multi-provider fallback). */
function dataStreamFromText(text: string, headers: Record<string, string>): Response {
  const messageId = generateId()
  const body = [
    formatDataStreamPart('start_step', { messageId }),
    formatDataStreamPart('text', text),
    formatDataStreamPart('finish_message', {
      finishReason: 'stop',
      usage: { promptTokens: 0, completionTokens: 0 },
    }),
  ].join('')

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Vercel-AI-Data-Stream': 'v1',
      ...headers,
    },
  })
}

async function generateWithProviderFallback(
  messages: Omit<Message, 'id'>[],
  extraHeaders: Record<string, string>,
  language?: string,
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

  const system =
    buildSystemPrompt(messages) + (language ? LANGUAGE_DIRECTIVE[language] ?? '' : '')
  let lastError: unknown = null
  let attemptIndex = 0

  for (let i = 0; i < chain.length; i++) {
    const provider = chain[i] as AiProvider
    const models = modelsForProvider(provider)

    for (let m = 0; m < models.length; m++) {
      const nvidiaModel = models[m]
      const attempt: AttemptResult = { provider, model: nvidiaModel, index: attemptIndex++ }

      try {
        const { text } = await generateText({
          model: getChatModelForProvider(provider, { nvidiaModel }),
          system,
          messages,
          maxTokens: 1024,
          temperature: 0.2,
        })

        return dataStreamFromText(text, {
          'X-AI-Provider': provider,
          ...(nvidiaModel ? { 'X-AI-Model': nvidiaModel } : {}),
          'X-AI-Fallback-Index': String(attempt.index),
          ...extraHeaders,
        })
      } catch (error) {
        lastError = error
        const hasNextProvider = i < chain.length - 1
        const hasNextModel = m < models.length - 1

        if (isRetryableProviderError(error) && (hasNextModel || hasNextProvider)) {
          console.warn(
            `[GovCompanion] ${provider}${nvidiaModel ? `/${nvidiaModel}` : ''} failed, trying next:`,
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
          'You have reached the message limit for now. Please wait a few minutes — this helps keep GovCompanion available for everyone.',
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

  const { messages, language } = await req.json()

  try {
    return await generateWithProviderFallback(
      messages as Omit<Message, 'id'>[],
      rateLimitHeaders(rate),
      typeof language === 'string' ? language : undefined,
    )
  } catch (error) {
    console.error('[GovCompanion] Chat error:', error)
    return new Response(
      JSON.stringify({
        error: 'ai_error',
        message: 'Our AI is temporarily busy. Please try again in a moment.',
      }),
      { status: 503, headers: { 'Content-Type': 'application/json', ...rateLimitHeaders(rate) } },
    )
  }
}
