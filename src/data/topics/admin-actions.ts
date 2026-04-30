import type { Topic } from '../curriculum';

export const topic: Topic = {
    id: 'admin-actions',
    title: 'Administrative Actions and Penalties',
    weight: '~7%',
    order: 12,
    summary:
      'Administrator powers, due process, civil rescission, criminal penalties, statute of limitations.',
    body: `## Grounds for Denial / Suspension / Revocation

The Administrator may deny, suspend, or revoke a registration based on:

- **False or misleading filing**
- **Willful USA violation**
- Felony conviction within **10 years** OR any securities-related misdemeanor
- Securities-related **injunction** by any court
- **SRO expulsion** or suspension
- **Lack of qualifications** for the role
- **Insolvency** or financial impairment
- **Dishonest or unethical practices**

## Due Process

Before adverse action:

1. **Written notice** of intended action
2. **Opportunity for hearing** within 15 days of request
3. **Written findings** of fact and conclusions of law

In emergencies, the Administrator may issue a **summary order** without prior hearing — but a post-issuance hearing is required.

## Civil Rescission Damages

A buyer of an unlawfully sold security may recover:

- **Original principal**, PLUS
- **Interest at the legal rate** from date of payment, MINUS
- **Income received** (dividends, interest), PLUS
- **Reasonable attorneys' fees and costs**

Lost profits are **NOT** recoverable.

## Criminal Penalties

For **willful** violations of the USA:

- Up to **$5,000 fine**, AND/OR
- Up to **3 years imprisonment**

— per violation.

**No criminal liability** if the person had **no knowledge** of the rule or order violated.

(Federal under the '33/'34/'40 Acts is significantly higher.)

## Statute of Limitations

Standard USA SOL:

- **3 years** from the violation, OR
- **2 years** from discovery

— whichever is **earlier**. Varies by state.

## Cease-and-Desist Orders

The Administrator may issue cease-and-desist orders. In emergencies, these may be summary (no prior hearing) — but always with post-issuance hearing rights.

## Consent to Service of Process

Every registrant files an **irrevocable consent** appointing the Administrator as agent for service of process for any action under the USA.`,
    pitfalls: [
      'A felony 11 years ago does NOT automatically disqualify — the 10-year window has passed (still discretionary).',
      'Lost profits are NOT recoverable in civil rescission. Principal + interest - income + fees only.',
      'FINRA suspension is grounds for state denial, not automatic state suspension.',
      'Knowledge of the rule is required for criminal liability — strict liability does not apply criminally.',
    ],
    keyTerms: [
      { term: 'Civil rescission', definition: "Principal + legal interest - income received + attorneys' fees" },
      { term: 'SOL', definition: 'Statute of limitations — 3 years from violation or 2 from discovery' },
      { term: 'Summary order', definition: 'Emergency cease-and-desist without prior hearing' },
      { term: 'Statutory disqualification', definition: 'Felony in past 10 years or securities-related misdemeanor' },
    ],
  };
