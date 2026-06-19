# AGENTS.md — GovNav LK

AI guide for agents working on **GovNav LK** — Sri Lanka's government service navigator.

## What this is

RAG-powered chat over structured gov service data. Users ask how to renew passports, get NICs, driving licenses, etc.

**Live:** https://gov-navigator-lk.vercel.app

## Quick start

```bash
npm install
cp .env.example .env.local   # GROQ_API_KEY and/or OPENROUTER_API_KEY, NVIDIA_NIM_API_KEY
npm run dev
```

## Stack

| Layer | Tech |
|-------|------|
| App | Next.js 15, React 19, TypeScript |
| AI | Vercel AI SDK + Groq / OpenRouter / NVIDIA NIM / Anthropic |
| UI | Tailwind (`lk-maroon`, `lk-gold`, `lk-cream`) |
| Deploy | Vercel |

## Repository layout

```
app/
  api/chat/route.ts       # RAG chat + provider fallback
  api/rate-limit/route.ts # Quota peek endpoint
  page.tsx                # Header, hero, sidebar, chat
components/
  HeroSection.tsx         # Welcome banner + stats
  ChatInterface.tsx       # Streaming chat, color-coded markdown
  ColoredMarkdown.tsx     # Section colors + copy checklist
  ServiceSidebar.tsx      # 113 services, Sinhala names, mobile overlay
  ServiceComparison.tsx   # Compare two services modal
  VerifiedSourceChip.tsx  # Official source link chip
data/
  services.json           # 14 core full-detail services
  stream-expansion-ready.json  # 6 more full-detail
  services-catalog.json   # 93 catalog entries
lib/
  knowledge.ts            # merge, search, buildSystemPrompt
  retrieval.ts            # query scoring + context focus
  ai.ts                   # multi-provider chain
  rate-limit.ts           # per-user limits
  compareServices.ts      # comparison table data
  matchServiceFromQuery.ts # source chip matching
```

## Current build status

| Layer | Status |
|-------|--------|
| AI backend + RAG + retrieval | ✅ Done |
| 113-service knowledge base | ✅ Done |
| 20 full-detail verified (2026-06-19) | ✅ Done |
| Sri Lankan UI + hero + animations | ✅ Done |
| Mobile hamburger sidebar | ✅ Done |
| Color-coded chat sections | ✅ Done |
| Service comparison modal | ✅ Done |
| Source verified chips | ✅ Done |
| Per-user rate limits | ✅ Done |
| Multi-provider AI fallback | ✅ Done |
| Deploy | ✅ Live on Vercel |

## Agent conventions

- Use existing Tailwind tokens; Sri Lanka-themed professional UI
- Run `npm run build` before deploy
- Keep PDPA-safe (no PII storage)
- Include trust disclaimer in UI changes
- Do not invent fees — data lives in `data/*.json`

## Cursor resources

- `.cursor/rules/` — project standards
- `MASTER-BUILD-PLAN.md` — stream prompts
- `SUBMISSION.md` — hackathon summary
- `DEMO.md` — 90-second demo script
