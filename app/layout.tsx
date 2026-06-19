import { ThemeProvider } from '@/components/ThemeProvider'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GovNav LK — Sri Lanka Government Service Navigator',
  description:
    'AI-powered guide to Sri Lankan government services. Find out exactly what documents to bring, which office to visit, and how to get it done.',
  openGraph: {
    title: 'GovNav LK — Government Service Navigator',
    description:
      'Never waste a day at a government office again. AI guide for NIC, passport, licenses, and more.',
    type: 'website',
    locale: 'en_LK',
  },
}

const themeScript = `
(function(){
  try {
    var t = localStorage.getItem('govnav-theme');
    var dark = false;
    if (t === 'dark') dark = true;
    else if (t !== 'light') dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (dark) { document.documentElement.classList.add('dark'); document.documentElement.style.colorScheme = 'dark'; }
  } catch(e) {}
})();
`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-sans antialiased h-full text-gray-900 dark:text-lk-cream bg-lk-cream dark:bg-lk-night transition-colors duration-300">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
