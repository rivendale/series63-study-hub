import type { Topic } from '../curriculum';

export const topic: Topic = {
    id: 'exempt-transactions',
    title: 'Exempt Transactions',
    weight: '~10%',
    order: 7,
    summary:
      'Transaction exemptions are based on HOW the security is sold, not what it is. Heavily tested.',
    body: `## Common Exempt Transactions

### Unsolicited Brokerage Transactions

The customer initiates the order. Most common exempt transaction. The order ticket should be marked **"unsolicited."**

### Transactions with Financial Institutions / Institutional Investors

Banks, S&Ls, trust companies, insurance companies, investment companies, BDs, employee benefit plans with $1M+ assets.

### Private Placements (State-Level)

Distinct from federal Reg D. Requires:

- **≤ 10 non-institutional persons** in 12 months
- **No general solicitation or advertising**
- **No commission** paid for non-institutional sales

11+ non-institutional buyers blows the exemption.

### Pre-Organization Subscriptions

- ≤ 10 subscribers
- No commission
- No payment until corporation is organized

### Isolated Non-Issuer Transactions

One-off resales by individuals not in the dealer business.

### Court-Appointed Fiduciary Transactions

- Executors
- Administrators
- Sheriffs and marshals
- Trustees in bankruptcy
- Guardians and conservators

**Trustees of inter vivos (living) trusts are NOT included** — they are not court-appointed.

### Existing Security Holder Transactions

Rights offerings, conversions, dividends paid in securities — exempt if no commission for solicitation.

### Issuer-Underwriter Transactions

Between an issuer and underwriter, or between underwriters.

## Exempt Does Not Mean Exempt from Anti-Fraud

Exempt transactions are exempt from securities registration and certain advertising/sales literature filings. They are **NOT exempt** from anti-fraud rules, agent/BD registration requirements, or suitability obligations.`,
    pitfalls: [
      'Trustees of living trusts are NOT court-appointed fiduciaries — exemption does not apply.',
      '11 non-institutional buyers blows the state private placement exemption (limit is 10).',
      'Wealthy individuals are NOT institutional investors.',
      'An exempt transaction does NOT exempt the agent or BD from registration.',
    ],
    keyTerms: [
      { term: 'Exempt transaction', definition: 'Exempt from securities registration based on the manner of sale' },
      { term: 'Unsolicited transaction', definition: 'Customer-initiated; mark order ticket "unsolicited"' },
      { term: 'Court-appointed fiduciary', definition: 'Executor, administrator, trustee in bankruptcy, etc.' },
    ],
  };
