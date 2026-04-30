import type { Topic } from '../curriculum';

export const topic: Topic = {
    id: 'exempt-securities',
    title: 'Exempt Securities',
    weight: '~5%',
    order: 6,
    summary:
      'Certain securities are exempt from STATE registration and advertising filing. Anti-fraud always applies.',
    body: `## Categories of Exempt Securities

### Government Securities

- **US government** — Treasuries, agency securities (GNMA, FNMA, FHLMC)
- **Municipal** — any state, territory, or political subdivision

### Foreign Government Securities

Exempt only if the **US has diplomatic relations** with the issuer country.

### Bank, S&L, Credit Union, Trust Company Securities

Exempt because the issuer is heavily regulated.

**Bank holding company stock is NOT exempt** — BHCs are not banks.

### Insurance Company Securities

Securities of **domestic** insurance companies authorized to do business in the state are exempt.

**Variable annuities are NOT exempt** — they are securities subject to full registration. Fixed annuities are insurance products, not securities at all.

### Public Utility / Common Carrier Securities

Securities regulated by a federal or state commission (e.g., FERC, ICC, state PUC).

### Nonprofit Securities

Securities of religious, educational, charitable, or fraternal organizations.

### Commercial Paper

- Maturity ≤ **9 months** (270 days)
- Denominations ≥ **$50,000**
- Top-3 NRSRO ratings

### Investment Contracts in Employee Benefit Plans

Pension, profit-sharing, employee stock purchase, and similar plan interests.

### Securities Listed on National Exchanges

NYSE, NYSE American, Nasdaq, and equivalents. **Federal covered** — preempted from state registration; notice filing typical.

## Anti-Fraud Always Applies

Exempt from registration is NOT exempt from anti-fraud. The Administrator retains full anti-fraud authority over exempt securities.`,
    pitfalls: [
      'Bank holding companies are NOT exempt as bank securities. BHC ≠ bank.',
      'Variable annuities ARE securities. Fixed annuities are NOT securities at all.',
      'Foreign government bonds require US diplomatic relations with the issuer country.',
      'Anti-fraud always applies — being exempt from registration is not being exempt from §501.',
    ],
    keyTerms: [
      { term: 'Exempt security', definition: 'Exempt from state registration and advertising filings' },
      { term: 'Federal covered security', definition: "Listed exchange, '40 Act IC, Reg D 506, Reg A+ Tier 2" },
      { term: 'Commercial paper', definition: '≤9 months, ≥$50K, top-3 NRSRO' },
    ],
  };
