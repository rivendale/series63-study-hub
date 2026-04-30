import type { Topic } from '../curriculum';

export const topic: Topic = {
    id: 'fraud',
    title: 'Fraud and Anti-Fraud',
    weight: '~10%',
    order: 11,
    summary:
      'USA §501-503 anti-fraud applies to ALL securities and ALL persons — even exempt securities, exempt transactions, and unregistered persons.',
    body: `## Scope of Anti-Fraud

The USA's anti-fraud provisions apply to **every** offer, sale, or purchase of **any** security, by **any** person — regardless of whether the security is registered or exempt, the transaction is registered or exempt, or the person is registered or unregistered.

There is no exemption from anti-fraud.

## Prohibited Conduct (USA §501)

It is unlawful, in connection with any offer, sale, or purchase of a security, to:

1. **Employ any device, scheme, or artifice to defraud**
2. **Make any untrue statement of material fact** OR omit a material fact necessary to make statements not misleading
3. **Engage in any act, practice, or course of business that operates as a fraud or deceit**

## "Material" Fact

Per *Basic v. Levinson* and *TSC Industries v. Northway*: a fact is material if a reasonable investor would consider it important in making an investment decision.

## Insider Trading

Trading on **material non-public information** (MNPI), or **tipping** such information.

- The **tipper** breaches a duty
- The **tippee** can be liable if she knew or should have known of the breach
- Both can face civil and criminal liability

## Forward-Looking Statements

A forward-looking statement with reasonable basis and disclosed assumptions is generally NOT fraud, even if subsequently proven wrong.

A specific prediction without basis ("this stock will go up 20% in 30 days") IS potentially fraud.

## Manipulation

- **Pump-and-dump** — inflating a stock through misleading promotion, then selling
- **Marking the close** — trades to manipulate closing prices
- **Matched orders** — coordinated buy/sell pairs to create false volume

All are fraud.

## Scienter Standard

- **Federal §10b-5** — requires scienter (intent or recklessness)
- **IA Act §206** — negligence may suffice for civil liability
- **State §501** — varies by jurisdiction; generally scienter for criminal, possibly negligence for civil

## Selective Disclosure

Selective disclosure of MNPI to a small group of analysts violates federal Reg FD and may form the basis of fraud action under state and federal law.`,
    pitfalls: [
      'Anti-fraud applies even when the security is exempt (Treasuries) or the transaction is exempt (unsolicited).',
      '"Will go up X% in Y days" without basis IS potential fraud, even if expressed as opinion.',
      "Tippees can be liable even without compensation if they knew of the tipper's breach.",
    ],
    keyTerms: [
      { term: 'Material fact', definition: 'One a reasonable investor would consider important' },
      { term: 'MNPI', definition: 'Material non-public information' },
      { term: 'Scienter', definition: 'Intent to deceive (or recklessness)' },
      { term: '§10b-5', definition: 'Federal anti-fraud rule' },
      { term: '§206', definition: 'IA Act fiduciary anti-fraud (negligence may suffice civilly)' },
    ],
  };
