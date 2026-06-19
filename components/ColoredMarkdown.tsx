'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Components } from 'react-markdown'

function headingClass(text: string): string {
  const t = text.toLowerCase()
  if (t.includes('document')) return 'md-section md-section-docs'
  if (t.includes('step') || t.includes('✅')) return 'md-section md-section-steps'
  if (t.includes('fee') || t.includes('💰')) return 'md-section md-section-fees'
  if (t.includes('tip') || t.includes('💡')) return 'md-section md-section-tips'
  if (t.includes('mistake') || t.includes('⚠️') || t.includes('common'))
    return 'md-section md-section-mistakes'
  return 'md-section md-section-default'
}

function extractDocumentChecklist(markdown: string): string | null {
  const match = markdown.match(
    /##\s*📋\s*Documents Required([\s\S]*?)(?=##\s|$)/i,
  )
  if (!match) return null

  const items = [...match[1].matchAll(/^[-*]\s+(.+)$/gm)].map((m) => `☐ ${m[1].trim()}`)
  return items.length > 0 ? items.join('\n') : null
}

const markdownComponents: Components = {
  h2: ({ children }) => {
    const text = String(children)
    return <h2 className={headingClass(text)}>{children}</h2>
  },
  strong: ({ children }) => (
    <strong className="font-bold text-lk-maroon-dark">{children}</strong>
  ),
}

interface ColoredMarkdownProps {
  content: string
  showCopyChecklist?: boolean
}

export default function ColoredMarkdown({ content, showCopyChecklist = false }: ColoredMarkdownProps) {
  const [copied, setCopied] = useState(false)

  const copyChecklist = async () => {
    const checklist = extractDocumentChecklist(content)
    if (!checklist) return
    try {
      await navigator.clipboard.writeText(checklist)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore */
    }
  }

  const hasChecklist = showCopyChecklist && extractDocumentChecklist(content)

  return (
    <div>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {content}
      </ReactMarkdown>
      {hasChecklist && (
        <button
          type="button"
          onClick={copyChecklist}
          className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-medium text-lk-maroon/70 hover:text-lk-maroon bg-lk-maroon/5 hover:bg-lk-maroon/10 px-3 py-1.5 rounded-lg transition-colors"
        >
          📋 {copied ? 'Copied!' : 'Copy document checklist'}
        </button>
      )}
    </div>
  )
}
