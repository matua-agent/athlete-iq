# AthleteIQ — Sports Science AI

A streaming AI chat assistant for athletes and coaches, backed by peer-reviewed research in exercise physiology — including [Harrison Dudley-Rode's](https://dudleyrode.com) published papers in the *European Journal of Applied Physiology*.

**Live:** [athlete-iq-seven.vercel.app](https://athlete-iq-seven.vercel.app)

---

## What it does

Ask anything about:
- Physiological durability in endurance sports
- The Banister fitness-fatigue model (CTL/ATL/TSB)
- HRV, recovery, and training readiness
- VO2max, aerobic thresholds (VT1/VT2/FTP)
- Periodization (polarized vs. sweet spot vs. block)
- Strength training (e1RM, relative strength)
- Carbohydrate periodization

Responses stream in real-time and cite actual DOIs.

## Research basis

Built on a curated knowledge base that includes:

| Paper | Key Finding |
|-------|------------|
| Dudley-Rode et al. (2024) EJAP [DOI: 10.1007/s00421-024-05687-w](https://doi.org/10.1007/s00421-024-05687-w) | Acute CHO ingestion does NOT alter VT1 in trained cyclists |
| Dudley-Rode et al. (2025) EJAP [DOI: 10.1007/s00421-025-05815-0](https://doi.org/10.1007/s00421-025-05815-0) | Predicting physiological decoupling from pre-exercise markers |
| Banister et al. (1975) | Impulse-response model — basis of CTL/ATL/TSB |
| Maunder et al. (2021) | Systematic review of cycling durability |
| Spragg et al. (2022-2024) | Durability in professional cyclists |

## Stack

- **Next.js 16** — App Router, streaming
- **Anthropic Claude Haiku** — fast, accurate streaming responses
- **React Markdown + Tailwind Typography** — clean formatted output
- **Tailwind CSS v4** — dark athletic UI

## Local dev

```bash
git clone https://github.com/matua-agent/athlete-iq
cd athlete-iq
npm install
# Add your key
echo "ANTHROPIC_API_KEY=your_key" > .env.local
npm run dev
```

## Design decisions

**Why Claude Haiku?** Fast enough for streaming chat, accurate enough for scientific content. Haiku 4.5 has strong reasoning without the latency of larger models.

**Why a curated knowledge base vs. RAG?** For a domain this specific (exercise physiology), a hand-crafted knowledge base gives more reliable citations than approximate vector retrieval. The system prompt encodes the key formulas, findings, and context precisely.

**Why not use the papers directly?** Copyright. Instead, the knowledge base encodes the key findings, methodologies, and implications — enough to answer questions accurately without reproducing copyrighted text.

---

Built by [Harrison Dudley-Rode](https://dudleyrode.com) · [matua-agent](https://github.com/matua-agent)
