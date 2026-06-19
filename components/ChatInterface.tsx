'use client'

import { getSessionHeaders } from '@/lib/client-session'
import { useChat } from 'ai/react'
import { useCallback, useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import RateLimitBadge from '@/components/RateLimitBadge'

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

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4 md:px-8 py-2 border-b border-lk-maroon/5 bg-white/40">
        <p className="text-xs text-gray-500 hidden sm:block">
          Ask in <span className="font-medium text-lk-maroon">English</span> or{' '}
          <span className="font-sinhala font-medium text-lk-maroon">සිංහල</span> — we understand
          both
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
          <div className="ai-message lk-glass rounded-2xl rounded-tl-sm px-4 py-3 shadow-lk-card max-w-2xl border-l-4 border-l-lk-gold">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{WELCOME_MESSAGE}</ReactMarkdown>
          </div>
        </div>

        {messages.map((message, idx) => (
          <div
            key={message.id}
            className={`flex gap-3 message-enter ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
            style={{ animationDelay: `${Math.min(idx * 0.03, 0.15)}s` }}
          >
            <Avatar role={message.role} />
            {message.role === 'user' ? (
              <div className="bg-gradient-to-br from-lk-maroon to-lk-maroon-dark text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-md shadow-lk-soft">
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
            ) : (
              <div
                className={`ai-message lk-glass rounded-2xl rounded-tl-sm px-4 py-3 shadow-lk-card max-w-2xl text-sm text-gray-800 border-l-4 border-l-lk-maroon/30 ${
                  isLoading && idx === messages.length - 1 ? 'streaming-cursor' : ''
                }`}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
              </div>
            )}
          </div>
        ))}

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

      <div className="border-t border-lk-maroon/10 bg-white/90 backdrop-blur-md px-4 md:px-8 py-4 shadow-[0_-4px_20px_rgba(74,11,18,0.04)]">
        <form onSubmit={handleSubmit} className="flex gap-3 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="ඔබට අවශ්‍ය රජයේ සේවාව අහන්න... / Ask about any government service..."
            rows={2}
            disabled={Boolean(rateLimitError)}
            className="flex-1 resize-none rounded-xl border border-lk-maroon/15 bg-lk-cream/50 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lk-gold/40 focus:border-lk-gold transition-all duration-200 disabled:opacity-50"
          />
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
      className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm shadow-lk-card transition-transform duration-200 ${
        isUser
          ? 'bg-gradient-to-br from-lk-gold to-lk-gold-light text-lk-maroon-dark ring-2 ring-lk-gold/30'
          : 'bg-gradient-to-br from-lk-maroon to-lk-maroon-dark text-white ring-2 ring-lk-maroon/20'
      }`}
    >
      {isUser ? '👤' : '🇱🇰'}
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="lk-glass rounded-2xl rounded-tl-sm px-5 py-3.5 shadow-lk-card border-l-4 border-l-lk-gold">
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
