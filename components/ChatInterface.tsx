'use client'

import ColoredMarkdown from '@/components/ColoredMarkdown'
import { useLanguage } from '@/components/LanguageProvider'
import LionMotif from '@/components/LionMotif'
import RateLimitBadge from '@/components/RateLimitBadge'
import VerifiedSourceChip from '@/components/VerifiedSourceChip'
import { SendIcon, UserIcon } from '@/components/Icons'
import { getFallbackAnswer, GENERIC_FALLBACK } from '@/lib/fallbackAnswers'
import { QUICK_QUESTIONS_I18N, WELCOME_I18N } from '@/lib/i18n'
import { getSessionHeaders } from '@/lib/client-session'
import { matchServiceFromQuery } from '@/lib/matchServiceFromQuery'
import { useChat } from 'ai/react'
import { useCallback, useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react'

export interface ChatInterfaceRef {
  submitMessage: (text: string) => void
  focusInput: () => void
}

function offlineAssistantMessage(query: string) {
  const canned = getFallbackAnswer(query) ?? GENERIC_FALLBACK
  const id =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `fallback-${Date.now()}`
  return { id, role: 'assistant' as const, content: canned }
}

const ChatInterface = forwardRef<ChatInterfaceRef>((_, ref) => {
  const [rateLimitError, setRateLimitError] = useState<string | null>(null)
  const [retryAfter, setRetryAfter] = useState<number | null>(null)
  const lastQueryRef = useRef<string>('')
  const { lang, t } = useLanguage()
  const langRef = useRef(lang)
  langRef.current = lang
  const welcomeMessage = WELCOME_I18N[lang]
  const quickQuestions = QUICK_QUESTIONS_I18N[lang]
  const chatBody = { language: lang }

  const { messages, input, handleInputChange, handleSubmit, isLoading, append, setMessages } =
    useChat({
      api: '/api/chat',
      headers: getSessionHeaders(),
      body: chatBody,
      onError: (error) => {
        // 1) Rate limit — show the cooldown banner, no fallback answer.
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
          return
        }
        // 2) All AI providers down — serve a data-accurate offline answer so the
        //    most common questions still work (demo-safety net).
        setMessages((prev) => [...prev, offlineAssistantMessage(lastQueryRef.current)])
      },
      onFinish: (message) => {
        setRateLimitError(null)
        setRetryAfter(null)
        if (message.content.trim() === 'An error occurred.') {
          setMessages((prev) => [
            ...prev.filter((m) => m.id !== message.id),
            offlineAssistantMessage(lastQueryRef.current),
          ])
        }
      },
    })

  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useImperativeHandle(ref, () => ({
    submitMessage: (text: string) => {
      if (rateLimitError) return
      lastQueryRef.current = text
      append({ role: 'user', content: text }, { body: { language: langRef.current } })
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

  const onFormSubmit = (e: React.FormEvent) => {
    lastQueryRef.current = input
    handleSubmit(e, { body: chatBody })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (input.trim() && !isLoading && !rateLimitError) {
        lastQueryRef.current = input
        handleSubmit(e as unknown as React.FormEvent, { body: chatBody })
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
        <p className="text-xs text-gray-600 dark:text-lk-cream/60 hidden sm:flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 bg-lk-emerald/10 dark:bg-lk-emerald-light/15 text-lk-emerald dark:text-lk-emerald-light px-2.5 py-0.5 rounded-full font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-lk-emerald dark:bg-lk-emerald-light animate-pulse-soft" />
            EN · සිංහල · தமிழ்
          </span>
        </p>
        <div className="flex items-center gap-2 ml-auto">
          <RateLimitBadge />
          {messages.length > 0 && (
            <button
              type="button"
              onClick={clearChat}
              className="text-[10px] text-gray-400 dark:text-lk-cream/45 hover:text-lk-maroon dark:hover:text-lk-gold-light px-2 py-1 rounded-lg hover:bg-lk-maroon/5 dark:hover:bg-lk-gold/10 transition-all duration-200"
            >
              {t('chat.newChat')}
            </button>
          )}
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto chat-scroll px-4 md:px-8 py-6">
        <div className="mx-auto w-full max-w-6xl space-y-5">
        <div className="flex gap-3 message-enter">
          <Avatar role="assistant" />
          <div className="ai-message lk-chat-bubble-ai px-5 py-4 flex-1 min-w-0 max-w-[60rem]">
            <ColoredMarkdown content={welcomeMessage} />
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
                <div className="lk-chat-bubble-user max-w-xl">
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
              ) : (
                <div
                  className={`ai-message lk-chat-bubble-ai px-5 py-4 flex-1 min-w-0 max-w-[60rem] text-sm text-gray-800 ${
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
      </div>

      {messages.length === 0 && (
        <div className="px-4 md:px-8 pb-3 mx-auto w-full max-w-6xl">
          <p className="text-[10px] font-bold uppercase tracking-widest text-lk-maroon/50 dark:text-lk-gold/50 mb-2">
            {t('chat.popular')}
          </p>
          <div className="flex flex-wrap gap-2">
          {quickQuestions.map((q, i) => (
            <button
              key={q}
              type="button"
              onClick={() => {
                lastQueryRef.current = q
                append({ role: 'user', content: q }, { body: { language: lang } })
              }}
              disabled={Boolean(rateLimitError)}
              className={`lk-chip opacity-0 animate-fade-up ${lang !== 'en' ? 'font-sinhala' : ''}`}
              style={{ animationDelay: `${0.1 + i * 0.05}s`, animationFillMode: 'forwards' }}
            >
              {q}
            </button>
          ))}
          </div>
        </div>
      )}

      {rateLimitError && (
        <div className="mx-4 md:mx-8 mb-2 px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-500/40 text-amber-900 dark:text-amber-200 text-sm animate-fade-up flex items-start gap-2">
          <span aria-hidden>⏳</span>
          <div>
            <p className="font-medium">{rateLimitError}</p>
            {retryAfter !== null && retryAfter > 0 && (
              <p className="text-xs text-amber-700 dark:text-amber-300/80 mt-0.5">
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
        <form onSubmit={onFormSubmit} className="flex gap-3 items-end max-w-6xl mx-auto">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={t('chat.placeholder')}
              rows={2}
              disabled={Boolean(rateLimitError)}
              className="lk-input-field font-sinhala"
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isLoading || Boolean(rateLimitError)}
            className="lk-btn-send flex-shrink-0 text-sm inline-flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-lk-maroon-dark/30 border-t-lk-maroon-dark rounded-full animate-spin" />
                <span className="hidden sm:inline">{t('chat.sending')}</span>
              </>
            ) : (
              <>
                <span>{t('chat.send')}</span>
                <SendIcon size={16} strokeWidth={2} />
              </>
            )}
          </button>
        </form>
        <p className="text-[10px] text-gray-400 dark:text-lk-cream/40 mt-2 text-center">
          <kbd className="bg-lk-sand dark:bg-lk-night-elevated dark:text-lk-cream/70 px-1.5 py-0.5 rounded text-[9px] border border-lk-maroon/10 dark:border-lk-gold/15">
            Enter
          </kbd>{' '}
          {t('chat.hintSend')} ·{' '}
          <kbd className="bg-lk-sand dark:bg-lk-night-elevated dark:text-lk-cream/70 px-1.5 py-0.5 rounded text-[9px] border border-lk-maroon/10 dark:border-lk-gold/15">
            Shift+Enter
          </kbd>{' '}
          {t('chat.hintNewline')}
        </p>
      </div>
    </div>
  )
})

function Avatar({ role }: { role: string }) {
  const isUser = role === 'user'
  return (
    <div
      className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lk-premium transition-transform duration-200 hover:scale-105 ${
        isUser
          ? 'bg-gradient-to-br from-lk-gold via-lk-gold-light to-lk-gold text-lk-maroon-dark ring-2 ring-lk-gold/40'
          : 'bg-gradient-to-br from-lk-maroon via-lk-maroon-dark to-[#3a0910] ring-2 ring-lk-maroon/25'
      }`}
    >
      {isUser ? <UserIcon size={18} strokeWidth={2} /> : <LionMotif size={30} variant="gold" />}
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
            className="w-2 h-2 rounded-full bg-lk-maroon/50 dark:bg-lk-gold/60 animate-bounce"
            style={{ animationDelay: `${i * 0.12}s`, animationDuration: '0.6s' }}
          />
        ))}
        <span className="ml-2 text-xs text-gray-400 dark:text-lk-cream/45 animate-pulse-soft">Thinking...</span>
      </div>
    </div>
  )
}

ChatInterface.displayName = 'ChatInterface'

export default ChatInterface
