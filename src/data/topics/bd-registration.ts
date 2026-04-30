import type { Topic } from '../curriculum';

export const topic: Topic = {
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
      "Bank holding companies are NOT banks — they don't get the bank exclusion.",
    ],
    keyTerms: [
      { term: 'Broker-Dealer', definition: 'Person effecting securities transactions for others or own account' },
      { term: 'Institutional investor', definition: 'Banks, insurance cos, ICs, pension plans with $1M+ assets, BDs' },
      { term: 'Place of business', definition: 'Any office or location where the BD transacts business' },
      { term: 'Form BD', definition: 'BD registration form, filed via CRD' },
    ],
  };
