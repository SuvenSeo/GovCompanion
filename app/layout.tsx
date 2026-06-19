import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GovNav LK — Sri Lanka Government Service Navigator',
  description: 'AI-powered guide to Sri Lankan government services. Find out exactly what documents to bring, which office to visit, and how to get it done.',
  openGraph: {
    title: 'GovNav LK — Government Service Navigator',
    description: 'Never waste a day at a government office again. AI guide for NIC, passport, licenses, and more.',
    type: 'website',
    locale: 'en_LK',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-lk-cream h-full text-gray-900">{children}</body>
    </html>
  )
}
