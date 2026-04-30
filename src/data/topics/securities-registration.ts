import type { Topic } from '../curriculum';

export const topic: Topic = {
    id: 'securities-registration',
    title: 'Securities Registration',
    weight: '~10%',
    order: 5,
    summary:
      'Three state methods: notification (filing) for seasoned issuers, coordination concurrent with federal registration, and qualification for purely intrastate offerings. Federal covered securities are preempted from state registration but may require notice filing.',
    body: `## Three Methods of State Securities Registration

### 1. Registration by Notification (Filing)

For **seasoned issuers**:

- Already registered with the SEC
- In business 3+ years
- Meet financial criteria

Fastest method. Becomes effective at noon on the second business day after filing (or sooner if Administrator orders).

### 2. Registration by Coordination

For issues being registered concurrently under the federal **Securities Act of 1933**.

Becomes effective **at the same moment** as the federal registration. Most common method for IPOs.

### 3. Registration by Qualification

For offerings with **no federal registration** (e.g., purely intrastate under Rule 147). Most demanding state-level filing. Becomes effective when the Administrator orders.

## Federal Covered Securities

Preempted from state registration by NSMIA. Includes:

- NYSE-, NYSE American-, Nasdaq-listed securities (and senior/equal securities of same issuer)
- Investment company securities registered under the Investment Company Act of 1940
- Reg D **Rule 506** offerings
- Reg A+ **Tier 2** offerings
- Securities offered to "qualified purchasers" under §18

States may require **notice filing** and a fee for federal covered securities.

**Reg D Rule 504 is NOT federal covered** — states retain full authority.

## Registration Period

Typically **1 year** from effective date.

## Administrator Authority on Registration

The Administrator may require:

- Prospectus
- Specimen of the security
- Escrow of proceeds
- Impoundment of proceeds
- Specific use of proceeds
- Consent to service of process

The Administrator **cannot** base a denial solely on the offering being "speculative" if proper disclosure is made. Statutory grounds (fraud, misstatement, etc.) are required.`,
    pitfalls: [
      'Reg D Rule 504 is NOT federal covered — states retain full authority. Rule 506 IS federal covered.',
      'Coordination becomes effective at the SAME moment as federal — not 30 days later.',
      'The Administrator cannot deny based solely on a "speculative" judgment if disclosure is adequate.',
    ],
    keyTerms: [
      { term: 'Notification', definition: 'Registration method for seasoned issuers' },
      { term: 'Coordination', definition: "Registration concurrent with federal '33 Act" },
      { term: 'Qualification', definition: 'Registration for offerings without federal registration' },
      { term: 'Federal covered security', definition: 'Preempted from state registration by NSMIA' },
      { term: 'Notice filing', definition: 'Filing required by states for federal covered securities' },
    ],
  };
