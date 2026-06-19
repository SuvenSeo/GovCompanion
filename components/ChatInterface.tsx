'use client'

import ColoredMarkdown from '@/components/ColoredMarkdown'
import RateLimitBadge from '@/components/RateLimitBadge'
import VerifiedSourceChip from '@/components/VerifiedSourceChip'
import { getSessionHeaders } from '@/lib/client-session'
import { matchServiceFromQuery } from '@/lib/matchServiceFromQuery'
import { useChat } from 'ai/react'
import { useCallback, useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react'

const QUICK_QUESTIONS = [
  'How do I get a new NIC?',
  'How do I renew my passport?',
  'How do I get a driving license?',
  'How do I get a birth certificate copy?',
  'How do I get a police clearance?',
]

const WELCOME_MESSAGE = `👋 **ආයුබෝවන්! Welcome to GovNav LK**

I'm your AI guide to **Sri Lankan government services** — NIC, passport, driving licence, Grama Niladhari certificates, and more.

**What I can help with:**
- 🪪 **NIC** — new, replacement, or updates
- ✈️ **Passport** — new, renewal, express
- 🚗 **Driving licence** — learner's, full, renewal
- 📋 **Birth & marriage certificates**
- ⚖️ **Police clearance** — local or overseas
- 🏛️ **Grama Niladhari** — residency, character, income

Tell me what you need — I'll give you the documents, office location, fees, and steps. **No more wasted trips to Battaramulla!** 🇱🇰`

export interface ChatInterfaceRef {
  submitMessage: (text: string) => void
  focusInput: () => void
}

const ChatInterface = forwardRef<ChatInterfaceRef>((_, ref) => {
  const [rateLimitError, setRateLimitError] = useState<string | null>(null)
  const [retryAfter, setRetryAfter] = useState<number | null>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading, append, setMessages } =
    useChat({
      api: '/api/chat',
      headers: getSessionHeaders(),
      onError: (error) => {
        try {
          const parsed = JSON.parse(error.message)
          if (parsed.error === 'rate_limit_exceeded') {
            setRateLimitError(parsed.message)
            setRetryAfter(parsed.retryAfter ?? 60)
            return
          }
        } catch {
          /* not JSON */
        }
        if (error.message?.includes('429') || error.message?.toLowerCase().includes('rate')) {
          setRateLimitError(
            'You have reached the message limit for now. Please wait a few minutes.',
          )
          setRetryAfter(60)
        }
      },
      onFinish: () => {
        setRateLimitError(null)
        setRetryAfter(null)
      },
    })

  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useImperativeHandle(ref, () => ({
    submitMessage: (text: string) => {
      if (rateLimitError) return
      append({ role: 'user', content: text })
    },
    focusInput: () => {
      inputRef.current?.focus()
    },
  }))

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
    }
  }, [messages, isLoading])

  useEffect(() => {
    if (retryAfter === null || retryAfter <= 0) return
    const t = setInterval(() => {
      setRetryAfter((s) => {
        if (s === null || s <= 1) {
          setRateLimitError(null)
          return null
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [retryAfter])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (input.trim() && !isLoading && !rateLimitError) {
        handleSubmit(e as unknown as React.FormEvent)
      }
    }
  }

  const clearChat = useCallback(() => {
    setMessages([])
    setRateLimitError(null)
    inputRef.current?.focus()
  }, [setMessages])

  const getUserQueryBefore = (assistantIdx: number): string => {
    for (let i = assistantIdx - 1; i >= 0; i--) {
      if (messages[i]?.role === 'user') return messages[i].content
    }
    return ''
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4 md:px-8 py-2.5 border-b border-lk-maroon/8 dark:border-lk-gold/10 bg-white/60 dark:bg-lk-night-card/80 backdrop-blur-md transition-colors duration-300">
        <p className="text-xs text-gray-600 hidden sm:flex items-center gap-2">
          <span className="inline-flex items-center gap-1 bg-lk-maroon/5 text-lk-maroon px-2 py-0.5 rounded-full font-medium">
            EN
          </span>
          <span className="text-gray-300">|</span>
          <span className="font-sinhala inline-flex items-center gap-1 bg-lk-emerald/10 text-lk-emerald px-2 py-0.5 rounded-full font-medium">
            සිංහල
          </span>
        </p>
        <div className="flex items-center gap-2 ml-auto">
          <RateLimitBadge />
          {messages.length > 0 && (
            <button
              type="button"
              onClick={clearChat}
              className="text-[10px] text-gray-400 hover:text-lk-maroon px-2 py-1 rounded-lg hover:bg-lk-maroon/5 transition-all duration-200"
            >
              New chat
            </button>
          )}
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto chat-scroll px-4 md:px-8 py-6 space-y-5">
        <div className="flex gap-3 message-enter">
          <Avatar role="assistant" />
          <div className="ai-message lk-chat-bubble-ai px-4 py-3 max-w-2xl">
            <ColoredMarkdown content={WELCOME_MESSAGE} />
          </div>
        </div>

        {messages.map((message, idx) => {
          const userQuery = message.role === 'assistant' ? getUserQueryBefore(idx) : ''
          const source =
            message.role === 'assistant' && !isLoading
              ? matchServiceFromQuery(userQuery)
              : null

          return (
            <div
              key={message.id}
              className={`flex gap-3 message-enter ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              style={{ animationDelay: `${Math.min(idx * 0.03, 0.15)}s` }}
            >
              <Avatar role={message.role} />
              {message.role === 'user' ? (
                <div className="lk-chat-bubble-user max-w-md">
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
              ) : (
                <div
                  className={`ai-message lk-chat-bubble-ai px-4 py-3 max-w-2xl text-sm text-gray-800 ${
                    isLoading && idx === messages.length - 1 ? 'streaming-cursor' : ''
                  }`}
                >
                  <ColoredMarkdown
                    content={message.content}
                    showCopyChecklist={!isLoading || idx < messages.length - 1}
                  />
                  {source && <VerifiedSourceChip source={source} />}
                </div>
              )}
            </div>
          )
        })}

        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <div className="flex gap-3 message-enter">
            <Avatar role="assistant" />
            <TypingIndicator />
          </div>
        )}
      </div>

      {messages.length === 0 && (
        <div className="px-4 md:px-8 pb-3 flex flex-wrap gap-2">
          {QUICK_QUESTIONS.map((q, i) => (
            <button
              key={q}
              type="button"
              onClick={() => append({ role: 'user', content: q })}
              disabled={Boolean(rateLimitError)}
              className="lk-chip opacity-0 animate-fade-up"
              style={{ animationDelay: `${0.1 + i * 0.05}s`, animationFillMode: 'forwards' }}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {rateLimitError && (
        <div className="mx-4 md:mx-8 mb-2 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm animate-fade-up flex items-start gap-2">
          <span aria-hidden>⏳</span>
          <div>
            <p className="font-medium">{rateLimitError}</p>
            {retryAfter !== null && retryAfter > 0 && (
              <p className="text-xs text-amber-700 mt-0.5">
                Try again in {retryAfter} second{retryAfter !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
      )}

      <div
        id="chat-input-area"
        className="border-t border-lk-gold/20 dark:border-lk-gold/15 bg-white/95 dark:bg-lk-night-card/95 backdrop-blur-xl px-4 md:px-8 py-4 shadow-[0_-8px_32px_rgba(74,11,18,0.06)] dark:shadow-[0_-8px_32px_rgba(0,0,0,0.3)] transition-colors duration-300"
      >
        <form onSubmit={handleSubmit} className="flex gap-3 items-end max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <span
              className="absolute left-4 top-4 text-lk-maroon/30 text-sm pointer-events-none"
              aria-hidden
            >
              💬
            </span>
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="ඔබට අවශ්‍ය රජයේ සේවාව අහන්න..."
              rows={2}
              disabled={Boolean(rateLimitError)}
              className="lk-input-field !pl-10 font-sinhala"
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isLoading || Boolean(rateLimitError)}
            className="lk-btn-primary flex-shrink-0 text-sm"
          >
            {isLoading ? (
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ...
              </span>
            ) : (
              'Send →'
            )}
          </button>
        </form>
        <p className="text-[10px] text-gray-400 mt-2 text-center">
          <kbd className="bg-lk-sand px-1.5 py-0.5 rounded text-[9px] border border-lk-maroon/10">
            Enter
          </kbd>{' '}
          send ·{' '}
          <kbd className="bg-lk-sand px-1.5 py-0.5 rounded text-[9px] border border-lk-maroon/10">
            Shift+Enter
          </kbd>{' '}
          new line
        </p>
      </div>
    </div>
  )
})

function Avatar({ role }: { role: string }) {
  const isUser = role === 'user'
  return (
    <div
      className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 text-base shadow-lk-premium transition-transform duration-200 hover:scale-105 ${
        isUser
          ? 'bg-gradient-to-br from-lk-gold via-lk-gold-light to-lk-gold text-lk-maroon-dark ring-2 ring-lk-gold/40'
          : 'bg-gradient-to-br from-lk-maroon via-lk-maroon-dark to-[#3a0910] text-white ring-2 ring-lk-maroon/25'
      }`}
    >
      {isUser ? '👤' : '🇱🇰'}
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="lk-chat-bubble-ai px-5 py-4">
      <div className="flex gap-1.5 items-center h-5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-lk-maroon/50 animate-bounce"
            style={{ animationDelay: `${i * 0.12}s`, animationDuration: '0.6s' }}
          />
        ))}
        <span className="ml-2 text-xs text-gray-400 animate-pulse-soft">Thinking...</span>
      </div>
    </div>
  )
}

ChatInterface.displayName = 'ChatInterface'

export default ChatInterface
