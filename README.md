# Series 63 Study Hub

[![Deploy](https://github.com/rivendale/series63-study-hub/actions/workflows/deploy.yml/badge.svg)](https://github.com/rivendale/series63-study-hub/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/rivendale/series63-study-hub/pulls)

A free, open-source, mobile-first study companion for the FINRA / NASAA **Series 63** (Uniform Securities Agent State Law) exam.

**Live demo:** https://rivendale.github.io/series63-study-hub/

## ⚠️ Disclaimer

This is an **unofficial, independent** study aid. It is not affiliated with, endorsed by, or sponsored by FINRA, NASAA, the SEC, or any commercial exam-prep provider. All content is original, written from publicly available sources (Uniform Securities Act model law, NASAA Statements of Policy). No actual exam questions or proprietary commercial-prep material is reproduced.

This app is **not** legal, compliance, or examination advice. Securities laws and threshold amounts change. Verify current rules with primary sources before relying on any content for professional purposes.

## Features

- **14-topic curriculum** covering the full NASAA outline plus 2022–2026 regulatory updates (Marketing Rule, SECURE 2.0, Reg BI, Form CRS, IAR CE, EVEP/MQP)
- **114-question bank** with detailed explanations, distributed across all 14 topics
- **Topic quizzes** with immediate feedback after each question
- **Mock exam** mirroring the real Prometric delivery: **65 questions (60 scored + 5 unscored pretest), 75 minutes, 72% pass mark (43 of 60)** — sampled in proportion to the official NASAA blueprint (47% BD/Agents, 35% Remedies/Admin, 10% Securities/Issuers, 8% IAs/IARs)
- **Glossary** — searchable list of every key term across the curriculum
- **Cheat Sheet** — exam blueprint, threshold table, and 20 most-tested rules
- **Progress tracking** — by-topic stats and full mock-exam history
- **Mobile-first PWA** — install on iOS / Android home screen, offline support
- **Dark mode** with system / light / dark toggle
- **100% client-side** — no tracking, no accounts, no data leaves your device

## Exam structure (current as of 2026)

| | |
|---|---|
| Total questions | 65 (60 scored + 5 unscored pretest) |
| Time | 75 minutes |
| Pass mark | 43 of 60 scored = 72% |
| Sponsor | NASAA / FINRA-administered (Prometric) |
| Content outline effective | June 12, 2023 |

## Quick start

```bash
git clone https://github.com/rivendale/series63-study-hub.git
cd series63-study-hub
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

Output is in `dist/` — deploy to GitHub Pages (auto via included workflow), Cloudflare Pages, Vercel, or any static host.

## Tech stack

- Vite 7 + React 18 + TypeScript (strict)
- Tailwind CSS v3 + `@tailwindcss/typography`
- React Router v6 (HashRouter for GitHub Pages compatibility)
- vite-plugin-pwa (Workbox-based service worker, autoUpdate)
- react-markdown + remark-gfm (curriculum reader)
- lucide-react (icons)

## Project layout

```
src/
├── data/
│   ├── examInfo.ts              # 65/60/5/72% exam constants
│   ├── categories.ts            # NASAA blueprint mapping (4 official categories)
│   ├── curriculum.ts            # imports each topic module
│   ├── questions.ts             # imports each question module
│   ├── topics/                  # per-topic curriculum modules (14 files)
│   └── questions/               # per-topic question modules (14 files)
├── pages/                       # Home, Curriculum, TopicReader, Topics, Quiz,
│   │                            # Progress, Glossary, CheatSheet, About
├── components/                  # Layout, ProgressBar, TopicCard, QuestionCard
├── hooks/                       # useProgress (localStorage), useQuiz (state machine)
└── lib/                         # shuffle, stats
```

The per-topic file structure (rather than monolithic data files) keeps any single file small enough to push via Git over slow / proxy-restricted connections, and lets contributors add a topic or a batch of questions in isolation.

## Roadmap

- [x] v0.1 — initial release: curriculum, questions, mock exam, PWA
- [x] v0.2 — NASAA-blueprint mock exam (65/60/5), glossary, cheat sheet
- [ ] v0.3 — expand question bank to 250–300, add roman-numeral compound questions
- [ ] v0.4 — "quiz only my missed questions" + lightweight spaced repetition
- [ ] v0.5 — by-category progress (4 NASAA buckets) alongside by-topic
- [ ] v1.0 — content reviewed by a licensed compliance professional

Have ideas? Open an issue or PR.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). Question contributions, content corrections, and UI improvements all welcome. The per-topic module layout means most contributions touch a single small file.

For repository-specific guidance for AI assistants (including future Claude sessions), see [CLAUDE.md](./CLAUDE.md).

## Acknowledgments

- **NASAA** for the Uniform Securities Act model law and Statements of Policy
- **FINRA** for the Series 63 content outline that structures this study guide
- The open-source community behind Vite, React, Tailwind CSS, lucide-react, and vite-plugin-pwa

## License

MIT — see [LICENSE](./LICENSE).
