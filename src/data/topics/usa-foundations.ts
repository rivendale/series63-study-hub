import type { Topic } from '../curriculum';

export const topic: Topic = {
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
      "A phone call from State A into State B is subject to BOTH states' jurisdiction (originated in A, directed into B).",
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
  };
