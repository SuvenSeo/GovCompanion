'use client'

import { useRef, useState, useCallback } from 'react'
import AmbientBackground from '@/components/AmbientBackground'
import AppHeader from '@/components/AppHeader'
import ChatInterface, { type ChatInterfaceRef } from '@/components/ChatInterface'
import HeroSection from '@/components/HeroSection'
import PageTransition from '@/components/PageTransition'
import ServiceComparison from '@/components/ServiceComparison'
import ServiceSidebar from '@/components/ServiceSidebar'
import TrustBar from '@/components/TrustBar'

export default function Home() {
  const chatRef = useRef<ChatInterfaceRef>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [compareOpen, setCompareOpen] = useState(false)
  const [layoutKey, setLayoutKey] = useState(0)

  const handleSelectService = (query: string) => {
    chatRef.current?.submitMessage(query)
    setSidebarOpen(false)
  }

  const scrollToChat = () => {
    document.getElementById('chat-input-area')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    chatRef.current?.focusInput()
  }

  const onHeroVisibilityChange = useCallback((expanded: boolean) => {
    if (!expanded) setLayoutKey((k) => k + 1)
  }, [])

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-lk-cream dark:bg-lk-night transition-colors duration-300">
      <div className="lk-pattern-bg absolute inset-0 pointer-events-none opacity-60 dark:opacity-40" aria-hidden />
      <div className="relative flex flex-col h-full min-h-0">
        <AppHeader
          onQuickAsk={handleSelectService}
          onToggleSidebar={() => setSidebarOpen((o) => !o)}
          sidebarOpen={sidebarOpen}
          onOpenCompare={() => setCompareOpen(true)}
        />

        <HeroSection onStartQuery={scrollToChat} onVisibilityChange={onHeroVisibilityChange} />

        <PageTransition layoutKey={layoutKey}>
          {sidebarOpen && (
            <button
              type="button"
              className="lg:hidden fixed inset-0 bg-lk-maroon-dark/50 dark:bg-black/60 backdrop-blur-sm z-30 animate-fade-in"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close services menu"
            />
          )}

          <ServiceSidebar
            onSelectService={handleSelectService}
            mobileOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          <div className="relative flex-1 flex flex-col min-w-0 overflow-hidden">
            <AmbientBackground />
            <div className="relative flex-1 flex flex-col min-h-0 bg-gradient-to-b from-white/40 via-lk-cream/30 to-lk-sand/40 dark:from-lk-night/50 dark:via-lk-night-card/30 dark:to-lk-night transition-colors duration-300">
              <ChatInterface ref={chatRef} />
            </div>
          </div>
        </PageTransition>

        <TrustBar />

        <ServiceComparison open={compareOpen} onClose={() => setCompareOpen(false)} />
      </div>
    </div>
  )
}
