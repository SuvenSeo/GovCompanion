import { streamText } from 'ai'
import { getActiveProvider, getChatModel } from '@/lib/ai'
import { buildSystemPrompt } from '@/lib/knowledge'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(req: Request) {
  const provider = getActiveProvider()

  if (!provider) {
    return new Response(
      JSON.stringify({
        error:
          'AI service is not configured. Set GROQ_API_KEY, OPENROUTER_API_KEY, or ANTHROPIC_API_KEY.',
      }),
      { status: 503, headers: { 'Content-Type': 'application/json' } },
    )
  }

  const { messages } = await req.json()

  const result = streamText({
    model: getChatModel(),
    system: buildSystemPrompt(),
    messages,
    maxTokens: 1024,
    temperature: 0.2,
  })

  return result.toDataStreamResponse({
    headers: {
      'X-AI-Provider': provider,
    },
  })
}
