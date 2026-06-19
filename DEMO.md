# GovNav LK — 90-Second Demo Script

Use this for judging, stream, or screen recording.

---

## [0:00–0:15] Hook

> "In Sri Lanka, renewing a passport can mean joining a queue at midnight — real people waited **12 hours** in 2025. There's no single guide that tells you what documents to bring. We built one with **Cursor**."

Open: https://gov-navigator-lk.vercel.app

---

## [0:15–0:35] Core demo

1. Point at **hero**: "113 services, 22 million Sri Lankans"
2. Click **Passport** in quick links
3. While AI streams, say:
   > "Watch the color-coded answer — blue documents, green steps, gold fees — all from verified government data."
4. Point at **Source verified** chip → immigration.gov.lk link
5. Click **Copy document checklist**

---

## [0:35–0:50] Mobile + browse

1. Open on **phone** (or resize browser)
2. Tap **☰** → sidebar slides in
3. Show **Sinhala names** under NIC: `ජාතික හැඳුනුම්පත`
4. Search sidebar: type "birth"

---

## [0:50–1:05] Compare + Cursor story

1. Click **⚖️ Compare** in header
2. Select **NIC — New Application** vs **Passport — Renewal**
3. Say:
   > "Side-by-side fees, processing time, documents — built in minutes with Cursor Agent."

---

## [0:05–1:20] Close

> "GovNav LK — the bridge until Sri Lanka's national digital government platform is ready. **22 million people. Zero AI navigators before today.** Built with Cursor, live on Vercel."

**Stats to drop if asked:**
- 113 services indexed
- 20 full-detail entries verified 2026-06-19
- GIC helpline: **1919**
- Per-user rate limits protect API quota during demos

---

## Backup questions

| Question | Answer |
|----------|--------|
| How do you prevent wrong fees? | RAG over verified JSON + anti-hallucination prompt rules |
| What if AI is down? | 4-provider fallback: Groq, OpenRouter, NVIDIA NIM, Anthropic |
| Privacy? | No NIC storage; session ID only for rate limiting |
| Cursor's role? | Agent built UI, KB, API, deploy pipeline — see `MASTER-BUILD-PLAN.md` |
