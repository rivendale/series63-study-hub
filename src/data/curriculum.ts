export interface Topic {
  id: string;
  title: string;
  weight: string;
  order: number;
  summary: string;
  body: string;
  pitfalls: string[];
  keyTerms: { term: string; definition: string }[];
}

export const topics: Topic[] = [
  {
    id: 'usa-foundations',
    title: 'USA Foundations',
    weight: '~5%',
    order: 1,
    summary:
      'The Uniform Securities Act (USA) is NASAA model legislation adopted by states with their own variations. The State Securities Administrator enforces it. Federal law (NSMIA, 1996) preempted certain state authority, but states retain anti-fraud and notice-filing power.',
    body: `## The Uniform Securities Act (USA)

The USA is a model law drafted by the **North American Securities Administrators Association (NASAA)**. Each state adopts its own version, sometimes with variations. The Series 63 tests state-level securities law (often called "Blue Sky" law) — not federal law, though federal law forms the backdrop.

## The Administrator

Every state has a **State Securities Administrator** — the official charged with enforcing the USA. Powers include:

- **Rulemaking** — issuing rules and orders necessary to carry out the USA
- **Investigation** — including conduct outside the state if it affects in-state persons
- **Subpoena** — compelling testimony and documents
- **Cease-and-desist** — ordering a stop to violative conduct (with hearing rights)
- **Denial / suspension / revocation** — of registrations
- **Civil and criminal referrals** — for prosecution

The Administrator **cannot** imprison violators directly; that's a court function.

## NSMIA and Federal Preemption

The **National Securities Markets Improvement Act of 1996 (NSMIA)** preempted state registration of "federal covered" securities and certain federal covered persons. After NSMIA:

- States **cannot** require registration of federal covered securities
- States **cannot** impose net capital, financial reporting, or recordkeeping rules stricter than the SEC for federal covered persons
- States **retain** anti-fraud authority over all securities and all persons
- States **may** require notice filings and fees for federal covered securities

## Jurisdiction Rules

An offer or sale is subject to a state's USA if it:

1. **Originated** in the state
2. **Was directed into** the state
3. **Was accepted** in the state

Any one of these triggers jurisdiction. A phone call from State A to State B about a security creates dual jurisdiction (originated in A, directed into B).

### General-circulation exception

Radio and TV broadcasts and newspapers of general circulation are **not** considered directed into another state, even if received there. The offer is in the originating state only.

## Hearing Rights

When the Administrator takes adverse action (denial, suspension, revocation), the affected party:

- Receives written notice of intended action
- May request a hearing within **15 days**
- Receives written findings of fact and conclusions of law

In emergencies, the Administrator may issue a **summary order** without a prior hearing — but a post-issuance hearing is required.

## Consent to Service of Process

Every registrant files an **irrevocable consent appointing the Administrator as agent for service of process** in any action under the USA. This eliminates jurisdictional barriers to enforcement.`,
    pitfalls: [
      'A phone call from State A into State B is subject to BOTH states\' jurisdiction (originated in A, directed into B).',
      'A TV broadcast in State A received in State B is State A jurisdiction only — general circulation exception.',
      'Anti-fraud applies even to exempt securities and exempt transactions. There is no exemption from anti-fraud.',
      'The Administrator has authority over conduct outside the state if it affects in-state persons.',
    ],
    keyTerms: [
      { term: 'USA', definition: 'Uniform Securities Act, the NASAA model state securities law' },
      { term: 'Administrator', definition: 'State official enforcing the USA' },
      { term: 'NSMIA', definition: 'National Securities Markets Improvement Act of 1996' },
      { term: 'Federal covered', definition: 'Securities or persons preempted from state registration by NSMIA' },
      { term: 'Blue Sky', definition: 'Colloquial name for state securities law' },
    ],
  },
  {
    id: 'agent-registration',
    title: 'Agent Registration',
    weight: '~25%',
    order: 2,
    summary:
      'An "agent" is an individual (never a firm) who represents a broker-dealer or issuer in effecting securities transactions. Registration is via Form U4 through CRD; termination is Form U5 within 30 days.',
    body: `## Definition of "Agent"

An **agent** is an **individual** who represents a broker-dealer or issuer in effecting (or attempting to effect) securities transactions.

Critical: an agent is always a person, never a firm. A broker-dealer itself is **never** an "agent."

## When Registration Is Required

Registration in a state is required if the agent:

- Has a **place of business** in the state, OR
- **Transacts** with a non-institutional client in the state

Place of business in a state always triggers registration, even if the agent has no clients there.

## Excluded from the Agent Definition

An individual representing an **issuer** is excluded from the agent definition (no agent registration required) when:

1. The transaction involves the issuer's **employees** with no commission paid, OR
2. The security is **exempt** under USA §402(a) — US government, municipal, bank, etc., OR
3. The transaction is an **exempt transaction** under USA §402(b)

Clerical and ministerial personnel (secretaries who only take messages) are not agents.

## Form U4 and U5

- **U4** — Uniform Application for Securities Industry Registration. Filed via CRD when an agent joins a firm.
- **U5** — Uniform Termination Notice. Must be filed by the firm within **30 days** of termination.

When an agent moves between firms, **all three parties** — agent, old firm, and new firm — must promptly notify the Administrator.

## Effect of BD Suspension

Agent registration is **contingent** on the broker-dealer's registration. If the BD's registration is suspended, the agent's registration is also suspended.

## De Minimis Exemption (IARs Only)

This applies to **IARs of federal covered IAs**, not to BD agents:

- No place of business in the state, AND
- Fewer than 6 retail clients in any 12-month period

BD agents have **no de minimis** exemption. Every state where a BD agent solicits a non-institutional resident requires registration.

## Snowbird Exemption (Canadian BDs)

A Canadian BD's agent may continue to service an existing Canadian client temporarily in the US (e.g., a winter visitor) without US state registration if the BD files a **notice and consent to service of process** with the state.

## Effective Date

Agent registration generally becomes effective **30 days after filing** if no proceeding is pending and the Administrator does not order a different effective date.`,
    pitfalls: [
      'A BD itself is NEVER an "agent." The term applies only to individuals.',
      'BD agents have NO de minimis exemption — only IARs of federal covered IAs do.',
      'Discretionary trading without a written DPOA is unauthorized regardless of suitability or outcome.',
      'A new agent who accepts an order before her U4 is effective has violated the USA.',
      'Place of business in a state ALWAYS triggers registration, even with zero clients there.',
    ],
    keyTerms: [
      { term: 'Agent', definition: 'Individual representing a BD or issuer in securities transactions' },
      { term: 'Form U4', definition: 'Registration application' },
      { term: 'Form U5', definition: 'Termination notice (30 days)' },
      { term: 'CRD', definition: 'Central Registration Depository' },
      { term: 'De minimis', definition: 'Fewer than 6 retail clients in 12 months, no place of business — applies to IARs only' },
    ],
  },
  {
    id: 'bd-registration',
    title: 'Broker-Dealer Registration',
    weight: '~10%',
    order: 3,
    summary:
      'A broker-dealer is a person engaged in the business of effecting securities transactions for others or its own account. Banks, S&Ls, trust companies, agents, and issuers are excluded entirely from the BD definition.',
    body: `## Definition of "Broker-Dealer"

A **broker-dealer** (BD) is a person engaged in the business of effecting securities transactions either:

- For the account of others (broker), or
- For its own account (dealer)

## Exclusions from the BD Definition

The following are NOT broker-dealers under the USA:

- **Agents** (individuals — they are agents, not BDs)
- **Banks, savings institutions, trust companies**
- **Issuers** (when selling their own securities)

Note: a **bank holding company** is NOT a bank for these purposes — BHCs are typically subject to BD/IA rules if they engage in those activities.

## Registration Exemption

A BD may be exempt from registration in a state if it has:

- **No place of business** in the state, AND
- Only deals with one or more of the following:
  - Other broker-dealers
  - Institutional investors
  - Issuers
  - Existing customers temporarily in the state (under 30 days)
  - Limited offerings to fewer than 5 retail customers in 12 months

## "Institutional Investor" Defined

Includes:

- Banks, S&Ls, trust companies
- Insurance companies
- Investment companies
- Pension/profit-sharing plans with **$1M+ assets**
- Other broker-dealers
- Other entities the Administrator designates

**Wealthy individuals are NOT institutional investors**, regardless of net worth.

## Place of Business Always Triggers Registration

If the BD has a branch office or any place of business in the state, registration is required — even if all clients are institutional. The institutional-only exemption requires no place of business.

## Form BD

Filed via CRD. Routes to both SEC and applicable state regulators. Renewal is annual.

## Federal Limits on State Requirements (NSMIA)

For SEC-registered BDs, states cannot impose:

- Net capital requirements stricter than the SEC's
- Financial reporting stricter than federal
- Recordkeeping stricter than federal

States retain anti-fraud authority and may require notice filings and fees.`,
    pitfalls: [
      'Wealthy individuals are NEVER institutional investors. Net worth alone does not exempt a BD from registration.',
      'Place of business in a state ALWAYS triggers registration. The institutional-only exemption requires no place of business.',
      'Bank holding companies are NOT banks — they don\'t get the bank exclusion.',
    ],
    keyTerms: [
      { term: 'Broker-Dealer', definition: 'Person effecting securities transactions for others or own account' },
      { term: 'Institutional investor', definition: 'Banks, insurance cos, ICs, pension plans with $1M+ assets, BDs' },
      { term: 'Place of business', definition: 'Any office or location where the BD transacts business' },
      { term: 'Form BD', definition: 'BD registration form, filed via CRD' },
    ],
  },
];
