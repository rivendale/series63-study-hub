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

| Record | BD | IA |
|--------|----|----|
| Customer account records | Life of account + 6 years | 5 years |
| Order tickets | 3-6 years | 5 years |
| Communications (email, etc.) | 3-5 years | 5 years |
| Form ADV / brochures | N/A | Permanent |

IAs typically keep records 5 years (first 2 in office). Customer account records often life + 6.

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
