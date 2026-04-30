import type { Topic } from '../curriculum';

export const topic: Topic = {
    id: 'security-definition',
    title: 'Definition of "Security" (Howey Test)',
    weight: '~3%',
    order: 8,
    summary:
      'Under Howey, a security exists when there is (1) an investment of money, (2) in a common enterprise, (3) with expectation of profit, (4) primarily from the efforts of others.',
    body: `## The Howey Test

From *SEC v. W.J. Howey Co.* (1946), an "investment contract" (a security) exists when:

1. **Investment of money**
2. **In a common enterprise**
3. **With expectation of profit**
4. **Derived primarily from the efforts of others**

All four elements must be present.

## Securities

Explicitly listed in the USA definition: stocks; bonds, debentures, notes; options, warrants, rights; mutual fund shares, ETFs; oil and gas interests; investment contracts (Howey); variable annuities; certificates of interest in profit-sharing.

## NOT Securities

- **Fixed annuities** — insurance contracts, regulated by state insurance department
- Whole life insurance, term life
- IRAs themselves (the contributions / investments within may be securities)
- Commodity futures and forward contracts (CFTC-regulated)
- Currency
- Real estate purchased for personal use
- Collectibles for direct ownership

## Variable Annuities

Variable annuities are **both** a security and an insurance product. They are subject to securities registration AND state insurance laws.

## The Real Estate / Howey Edge

- Condo purchased for personal use → real estate, not a security
- Same condo entered into a rental pool managed by a third party for profit → investment contract → security

The pooling and management-by-others elements convert real estate into a security.

## Promissory Notes

Presumptively securities under *Reves v. Ernst & Young* unless they fit the "family resemblance" exception (commercial paper, bank loans, consumer loans).`,
    pitfalls: [
      'Fixed annuities are NOT securities. Variable annuities ARE securities.',
      'A condo for personal use is real estate. The same condo in a rental pool is a security.',
      'Commodity futures are NOT securities — CFTC regulates them.',
    ],
    keyTerms: [
      { term: 'Howey test', definition: 'Four-prong investment contract test' },
      { term: 'Investment contract', definition: 'A security under Howey' },
      { term: 'Variable annuity', definition: 'Security AND insurance product' },
    ],
  };
