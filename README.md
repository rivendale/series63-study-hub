# Series 63 Study Hub

A free, open-source, mobile-first study companion for the FINRA/NASAA Series 63 (Uniform Securities Agent State Law) exam.

**Live demo:** https://rivendale.github.io/series63-study-hub/

## Features

- 13-topic curriculum covering the full Series 63 outline
- 174-question bank with detailed explanations
- Topic quizzes with immediate feedback
- Full-length mock exam mode (60 questions, 75 minutes, exam blueprint distribution)
- Progress tracking with by-topic stats
- Mobile-first PWA — install on iOS / Android home screen
- Dark mode
- Offline support
- 100% client-side — no tracking, no accounts, no data leaves your device

## Why open-source?

The Series 63 is a state-mandated exam for securities agents. Quality study material shouldn't be locked behind a paywall. This project is licensed MIT and contributions are welcome.

## Disclaimers

This is an unofficial study aid. The content is original, derived from publicly available NASAA model law and Statements of Policy. It is not affiliated with FINRA, NASAA, or any commercial prep provider.

For the official exam content outline, see [finra.org](https://www.finra.org/registration-exams-ce/qualification-exams/series63).

This is not legal or compliance advice.

## Quick Start

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

Output is in `dist/` — deploy to GitHub Pages, Cloudflare Pages, or any static host.

## Tech

- Vite + React 18 + TypeScript
- Tailwind CSS
- Vite Plugin PWA
- React Router v6 (HashRouter)

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). Question contributions, content corrections, and UI improvements all welcome.

## License

MIT — see [LICENSE](./LICENSE).
