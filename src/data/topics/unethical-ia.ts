import type { Topic } from '../curriculum';

export const topic: Topic = {
    id: 'unethical-ia',
    title: 'Unethical IA/IAR Practices',
    weight: '~15%',
    order: 10,
    summary:
      'IAs are FIDUCIARIES — a higher standard than suitability. Duty of loyalty plus duty of care.',
    body: `## Fiduciary Duty

An IA owes a **fiduciary duty** to clients — significantly higher than a BD's suitability standard:

- **Duty of loyalty** — act in the client's best interest, disclose all material conflicts
- **Duty of care** — reasonable basis for advice, ongoing monitoring

## Brochure Delivery

Form ADV Part 2A must be delivered:

- **48+ hours** before contract, OR
- **At signing** if the client has a **5-day rescission right**

Annual: brochure or summary of material changes within **120 days** of fiscal year end.

## Performance Fees

Prohibited unless the client is a **qualified client**:

- **$1.1M AUM** with the IA, OR
- **$2.2M net worth** excluding primary residence

(Thresholds adjust periodically per SEC inflation indexing.)

## Agency Cross Transactions

When the IA cross-trades on both sides of a transaction:

- **Written client consent** in advance
- Written **disclosure of capacity** and conflict
- **Annual statement** of cross transactions
- The IA **cannot** have **recommended** the transaction to **both** sides

## Principal Transactions

When the IA sells from its own inventory to a client (or buys from a client):

- **Written disclosure** of capacity and conflict
- **Specific consent** for **each transaction** (not blanket)

## Custody

An IA has custody when it:

- Holds client funds or securities, directly or indirectly
- Holds a client check (made out to the IA) for any period
- Holds a client's third-party check for **3+ business days**

Forwarding a third-party check **within 3 business days** does NOT constitute custody.

### Custody Triggers

- **Surprise annual verification** by an independent public accountant
- **Qualified custodian** holds the assets (bank, BD, or qualified foreign financial institution)
- **Quarterly statements** from the custodian to the client
- **Form ADV / state notice** disclosure

## Solicitor Rule

Historically a separate rule; now absorbed into the SEC Marketing Rule (compliance Nov 4, 2022). A compensated promoter (solicitor) for an IA must:

- Have a **written agreement** with the IA
- Provide required disclosures (compensation, material conflicts) at the time of solicitation
- Not be subject to disqualifying events
- Be subject to IA oversight

## Assignment of Advisory Contracts

Per IA Act §205, **assignment requires client consent**. This includes sale of the IA business, effective change of control, and some inter-firm transfers. Negative consent is acceptable in some circumstances; express consent in others.

## Soft Dollars

Receipt of research/services from a BD in exchange for directing brokerage. Must qualify under **§28(e) safe harbor**:

- Research/brokerage services must be **lawful**
- Must benefit **all clients** (not just the favored ones)

Disclosure required.

## §206 Civil Liability

Under IA Act §206, **negligence may be sufficient** for civil liability. Federal §10b-5 requires scienter; §206 does not.`,
    pitfalls: [
      'Holding a client check made out to the IA = custody. Forwarding a third-party check within 3 days is NOT custody.',
      'Performance fees require qualified-client status — $1.1M AUM with IA OR $2.2M net worth excluding primary residence.',
      'IA Act §206 negligence may suffice for civil liability — unlike federal §10b-5 which requires scienter.',
      'Principal transactions need consent FOR EACH transaction, not blanket consent.',
    ],
    keyTerms: [
      { term: 'Fiduciary duty', definition: 'Duty of loyalty plus duty of care' },
      { term: 'Custody', definition: 'Holding client funds/securities or 3+ days holding period' },
      { term: 'Qualified client', definition: '$1.1M AUM with IA OR $2.2M net worth (ex. primary residence)' },
      { term: 'Agency cross', definition: 'Cross-trading both sides of a transaction' },
      { term: 'Principal transaction', definition: 'IA selling from own inventory or buying for own account' },
    ],
  };
