import type { Topic } from '../curriculum';

export const topic: Topic = {
    id: 'ia-registration',
    title: 'Investment Adviser Registration',
    weight: '~10%',
    order: 4,
    summary:
      'An investment adviser, for compensation, advises others on securities in the business. Federal covered IAs (≥$110M AUM, advise registered ICs, or qualify for multi-state exemption) register with SEC; smaller IAs register with states.',
    body: `## Three-Prong Test for IA Status

A person is an **investment adviser** if all three are met:

1. Provides **advice on securities**
2. Receives **compensation** (any form)
3. Engages **in the business** of giving such advice (not isolated)

All three elements must be present.

## Federal vs. State Registration

| AUM | Registration |
|-----|-------------|
| Below $100M | State |
| $100M – $110M | Buffer band — IA may choose |
| $110M+ | SEC (federal covered) |

A federal covered IA also includes:

- Advisers to **registered investment companies** (mutual funds)
- Advisers qualifying for the **multi-state exemption** (required to register in 15+ states)

## Exclusions from the IA Definition

### LATE Exclusions

**L**awyers, **A**ccountants, **T**eachers, **E**ngineers — when:

- Advice is **incidental** to their professional practice, AND
- They receive **no special compensation** for the advice

A CPA who charges a separate fee for stock recommendations IS an IA — special compensation.

### Other Exclusions

- **Banks** (but NOT bank holding companies)
- **Broker-dealers** — when advice is solely incidental to BD activities and there is no special compensation
- **Publishers** of bona fide general circulation publications giving non-personalized advice
- **US government securities advisers** (only)

### Wrap-Fee BDs Lose the BD Exclusion

A BD charging a wrap fee (single fee covering brokerage and advice) receives "special compensation" for advice. The BD exclusion is lost — IA registration applies.

## IAR (Investment Adviser Representative)

An **IAR** is an individual employee or agent of an IA who gives personal investment advice, manages accounts, solicits clients, or supervises any of the above. IAR registration is at the **state level**, even for federal covered IAs.

## IAR De Minimis (Federal Covered IAs)

Where the IAR has:

- **No place of business** in the state, AND
- **Fewer than 6 retail clients** in any 12-month period

No state IAR registration is required. Place of business always triggers registration.

## Form ADV

- **Part 1** — Schedule of business operations, ownership, disciplinary history
- **Part 2A** — The "brochure," plain-English narrative for clients
- **Part 2B** — Brochure supplements for IARs

Filed via **IARD** (Investment Adviser Registration Depository).

## Brochure Delivery Rule

The IA must deliver Form ADV Part 2A to clients:

- **48+ hours** before contract, OR
- **At signing** if client has a **5-day rescission right**

Annual: brochure (or summary of material changes) within **120 days** of fiscal year end.`,
    pitfalls: [
      'Bank holding companies are NOT excluded. Only banks are.',
      'A CPA charging a separate fee for investment advice IS an IA, regardless of CPA license.',
      'Wrap-fee BDs lose the BD exclusion — special compensation kills it.',
      'IAR registration is always at state level, even for federal covered IAs.',
    ],
    keyTerms: [
      { term: 'Investment Adviser', definition: 'Person advising on securities for compensation, in the business' },
      { term: 'Federal covered IA', definition: '$110M+ AUM, advises registered IC, or 15+ state multi-state exemption' },
      { term: 'IAR', definition: 'Individual giving advice on behalf of an IA' },
      { term: 'Form ADV', definition: 'IA registration form, filed via IARD' },
      { term: 'Brochure', definition: 'Form ADV Part 2A, plain-English client disclosure document' },
    ],
  };
