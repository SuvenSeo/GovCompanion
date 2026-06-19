'use client'

import { useRef, useState } from 'react'
import AppHeader from '@/components/AppHeader'
import ChatInterface, { type ChatInterfaceRef } from '@/components/ChatInterface'
import ServiceSidebar from '@/components/ServiceSidebar'
import TrustBar from '@/components/TrustBar'

export default function Home() {
  const chatRef = useRef<ChatInterfaceRef>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSelectService = (query: string) => {
    chatRef.current?.submitMessage(query)
    setSidebarOpen(false)
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden lk-pattern-bg">
      <AppHeader
        onQuickAsk={handleSelectService}
        onToggleSidebar={() => setSidebarOpen((o) => !o)}
        sidebarOpen={sidebarOpen}
      />

      <main className="flex-1 flex overflow-hidden relative">
        {sidebarOpen && (
          <button
            type="button"
            className="lg:hidden fixed inset-0 bg-lk-maroon-dark/40 backdrop-blur-[2px] z-30 animate-fade-in"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close services menu"
          />
        )}

        <ServiceSidebar
          onSelectService={handleSelectService}
          mobileOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex-1 flex flex-col min-w-0 bg-gradient-to-b from-lk-cream/50 to-white/80">
          <ChatInterface ref={chatRef} />
        </div>
      </main>

      <TrustBar />
    </div>
  )
}
