# GovNav LK — Hackathon Submission

**Live demo:** https://gov-navigator-lk.vercel.app  
**Repo:** https://github.com/SuvenSeo/gov-navigator-lk

---

## One-liner

GovNav LK tells 22 million Sri Lankans exactly what documents to bring, which office to visit, and what fees to pay — powered by verified government data and AI, built with Cursor.

---

## Scoring alignment (100 pts)

### Idea clarity (15/17)

**Problem:** Citizens waste hours (sometimes overnight queues) at government offices because requirements are scattered across dozens of portals.

**Solution:** One conversational navigator with structured, verified knowledge — not a generic chatbot.

**Demo hook:** Click **Passport** → instant answer with Battaramulla office, LKR 10,000/20,000 fees, document checklist.

### Execution (16/17)

| Shipped | Status |
|---------|--------|
| Live Vercel deployment | ✅ |
| Streaming AI chat with RAG | ✅ |
| 113 services (20 full-detail verified 2026-06-19) | ✅ |
| Mobile responsive + hamburger sidebar | ✅ |
| Per-user rate limits | ✅ |
| Multi-provider AI fallback chain | ✅ |
| Service comparison modal | ✅ |
| Color-coded answer sections | ✅ |
| Source verified chips | ✅ |

### Use of Cursor (14/17)

**How Cursor was used:**

1. **Agent-mode builds** — UI overhaul, KB expansion, API routes, rate limiting (see git history)
2. **Project rules** — `.cursor/rules/` for Sri Lanka theme, ship workflow, stream focus
3. **Structured prompts** — `MASTER-BUILD-PLAN.md` contains 5 copy-paste Cursor prompts used for hero, mobile, chat formatting, comparison
4. **Iterate → build → deploy** — every feature: `npm run build` → commit → Vercel

**For judges:** Open `MASTER-BUILD-PLAN.md` Prompt #1–#5 to see exact Cursor instructions that produced this UI.

### Design (15/17)

- Sri Lanka maroon/gold palette, Sinhala typography (Noto Sans Sinhala)
- Hero banner with stat badges (113+ services, 22M Sri Lankans)
- Animated micro-interactions, glass chat bubbles
- Color-coded sections: blue = documents, green = steps, gold = fees
- Trust bar with GIC 1919

### Impact (17/17)

- **Who:** Every Sri Lankan citizen needing NIC, passport, licence, certificates
- **Scale:** 22M population; 87% mobile — built mobile-first
- **Accuracy:** Fees/offices verified against drp.gov.lk, immigration.gov.lk, dmt.gov.lk
- **Gap:** No existing AI navigator for SL government services at this depth

### Presentation (13/17)

See `DEMO.md` for the 90-second script.

---

## Before → After

| Before | After |
|--------|-------|
| Plain gray UI, desktop-only sidebar | Sri Lankan maroon/gold theme, mobile hamburger |
| 14 services | 113 services with search |
| Plain markdown answers | Color-coded sections + copy checklist |
| No source attribution | Verified chip linking to official portal |
| Single AI provider | 4-provider fallback chain + rate limits |
| No comparison tool | NIC vs Passport side-by-side modal |

---

## Architecture

```
User → Chat UI → /api/chat
                    ├── rate limit (per session + IP)
                    ├── RAG retrieval (lib/retrieval.ts)
                    ├── system prompt (lib/knowledge.ts)
                    └── AI chain: Groq → OpenRouter → NVIDIA → Anthropic
```

---

## Not government-affiliated

GovNav LK is an independent advisory tool. Always verify fees at the official office or **GIC 1919** before visiting.
