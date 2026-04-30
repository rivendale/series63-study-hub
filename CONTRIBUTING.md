# Contributing

## Question Contributions

Add new questions to `src/data/questions.ts`. Follow the existing schema:

```typescript
{
  id: <next sequential>,
  topic: '<topic-id>',
  q: '<question text>',
  choices: ['A', 'B', 'C', 'D'],
  answer: 0,
  exp: '<explanation>',
  difficulty: 'medium'
}
```

Questions must be:
- Original (not copied from commercial prep material)
- Factually accurate (cite USA section or NASAA SOP if you can)
- Have realistic distractors

## Content Corrections

If you spot an error in the curriculum, open an issue or PR. Cite the source (USA section, NASAA Statement of Policy, or other authoritative source).

## Code Style

- TypeScript strict mode
- ESLint + Prettier
- Functional React components, hooks only
- Tailwind for styling (avoid custom CSS unless necessary)

## Pull Request Process

1. Fork the repo
2. Create a feature branch
3. Make changes
4. Run `npm run lint` and `npm run build` to verify
5. Open a PR against `main` with a clear description
