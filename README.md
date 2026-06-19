# GovNav LK

**Sri Lanka's AI-powered government service navigator** — ask about NIC, passport, driving licences, certificates, and 100+ more services. Get documents, fees, offices, and steps in seconds.

**Live:** https://gov-navigator-lk.vercel.app

## Problem

22 million Sri Lankans navigate fragmented government portals with conflicting information. One wrong document means a wasted day at Battaramulla. GovNav is the bridge until national digital services mature.

## Features

- **113 government services** (20 full-detail, verified against official sources)
- **RAG-powered chat** — answers grounded in structured KB, not hallucinated fees
- **Sinhala + English** — ask in either language
- **Color-coded responses** — documents, steps, fees, tips at a glance
- **Service comparison** — side-by-side NIC vs Passport, etc.
- **Source verified chips** — links to drp.gov.lk, immigration.gov.lk, etc.
- **Per-user rate limits** — fair use under demo load
- **Multi-provider AI** — Groq → OpenRouter → NVIDIA NIM → Anthropic fallback

## Stack

| Layer | Tech |
|-------|------|
| App | Next.js 15, React 19, TypeScript, Tailwind |
| AI | Vercel AI SDK, Groq / OpenRouter / NVIDIA NIM |
| Data | `data/services.json` + catalog + retrieval scoring |
| Deploy | Vercel |

## Quick start

```bash
npm install
cp .env.example .env.local   # add at least one AI provider key
npm run dev
```

## Built with Cursor

This project was built using **Cursor Agent** with project rules (`.cursor/rules/`), structured prompts in `MASTER-BUILD-PLAN.md`, and iterative deploy-to-Vercel workflow. See `SUBMISSION.md` for hackathon judges.

## Docs

- `SUBMISSION.md` — competition summary + scoring alignment
- `DEMO.md` — 90-second live demo script
- `MASTER-BUILD-PLAN.md` — stream arc + Cursor prompts
- `AGENTS.md` — agent/developer guide

## License

MIT — data sourced from public Sri Lankan government portals. Not affiliated with the Government of Sri Lanka.
