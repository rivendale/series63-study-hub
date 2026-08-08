import type { Topic } from '../curriculum';

export const topic: Topic = {
    id: 'communications',
    title: 'Communications and Recordkeeping',
    weight: '~5%',
    order: 13,
    summary:
      'Client communications, advertising, social media, complaint handling, and records retention.',
    body: `## Reasonable Basis (Suitability)

Every recommendation requires a **reasonable basis**:

- Investigation of the security
- Match to the customer's financial situation, objectives, and risk tolerance

This applies to recommendations on social media, in seminars, in person, and in writing.

## Performance Reporting

Performance must be reported **net of fees** by default. Gross may be shown if:

- Clearly labeled as gross
- Net is also shown
- Methodology and time period disclosed

## Past Specific Recommendations

Cherry-picking winners is prohibited. Past specific recommendations advertising must include:

- All recommendations of the **same type** for a representative period (typically 12 months)
- Enough information for a fair representation

## Predictions of Future Performance

Specific predictions of future security performance are generally prohibited. Forward-looking statements with reasonable basis and disclosed assumptions may be permitted.

## Social Media

Subject to the same rules as other written/electronic communications:

- Firm supervision
- Recordkeeping
- Suitability analysis
- Disclosure of conflicts
- Pre-approval of certain content

A LinkedIn post recommending a specific stock is a recommendation subject to all suitability and recordkeeping rules.

## Complaint Handling

- **Written complaints** must be promptly forwarded to a principal/supervisor and recorded
- **Verbal complaints** should also be documented and escalated under firm procedures

## Recordkeeping Periods

The two regimes work differently, so learn them separately rather than as one table of ranges.

**Broker-dealers — SEC Rule 17a-4.** The period depends on the record, and the split is **six years or three**, with the **first two years easily accessible** either way:

| Record | Period |
|--------|--------|
| Blotters, general ledgers, position records | **6 years** |
| Customer account record information | **6 years** after the later of account closing or the last update |
| Correspondence, confirmations, most operational records | **3 years** |
| Articles, partnership agreements, minute books | **Life of the firm plus 3 years** |

**Investment advisers — Advisers Act Rule 204-2 and the parallel NASAA model rule.** A flat **5 years** for records generally, with the **first 2 years in an appropriate office** of the adviser. Advisory **performance advertising support** and certain organizational records run longer, and **Form ADV and brochures** are effectively kept for the life of the firm.

The distinction candidates lose marks on is which regime applies: **5 years is the adviser number, 3 or 6 is the broker-dealer number**, and "first two years accessible" attaches to both.

## Personal Email

Client communications via personal email circumvents firm supervision and is typically a violation. Communications must be on supervised firm systems.`,
    pitfalls: [
      'A LinkedIn post recommending a specific stock IS a recommendation — full suitability and recordkeeping rules apply.',
      'Cherry-picking only winning past recommendations is misleading. Must show all of the same type.',
      'Personal email for client communication is a violation in most firm policies.',
    ],
    keyTerms: [
      { term: 'Reasonable basis', definition: 'Investigation + matching to client profile' },
      { term: 'Cherry-picking', definition: 'Selecting only favorable past recommendations (prohibited)' },
      { term: 'Recordkeeping', definition: 'Retention requirements for BD/IA records' },
    ],
  };
