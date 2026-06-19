'use client'

import { type ReactNode } from 'react'

interface PageTransitionProps {
  children: ReactNode
  layoutKey: number
}

/** Re-animates main workspace when hero collapses or layout shifts */
export default function PageTransition({ children, layoutKey }: PageTransitionProps) {
  return (
    <div key={layoutKey} className="flex-1 flex overflow-hidden relative min-h-0 page-transition-enter">
      {children}
    </div>
  )
}
