import type { Topic } from '../curriculum';

export const topic: Topic = {
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
  };
