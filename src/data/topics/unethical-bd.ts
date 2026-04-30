import type { Topic } from '../curriculum';

export const topic: Topic = {
    id: 'unethical-bd',
    title: 'Unethical BD/Agent Practices',
    weight: '~15%',
    order: 9,
    summary:
      'NASAA Statement of Policy on dishonest and unethical business practices. Most heavily tested area on the exam.',
    body: `## Trading Practices

### Churning

Excessive trading inconsistent with the customer's objectives, primarily to generate commissions. Suitability analysis applies even in discretionary accounts.

### Unauthorized Transactions

Discretionary trading without a written **discretionary power of attorney (DPOA)** is unauthorized — regardless of suitability or outcome.

### Time / Price Discretion

Executing a customer's specific order ("buy 100 shares at the best price today") on time and price only does **NOT** require DPOA. The customer has decided the security and quantity.

Full discretion (security, quantity, whether to buy or sell) **DOES** require written DPOA.

### Front-Running

Trading personally ahead of a known customer order to benefit from anticipated price movement.

### Marking the Close / Painting the Tape

Trades designed to manipulate closing prices or create false volume.

## Customer Account Practices

### Sharing in Accounts

Permitted only when:

1. Joint account with the customer, AND
2. Sharing **proportional** to capital contribution, AND
3. **Prior written approval** of the BD

50/50 sharing on 25/75 capital is never permitted.

### Borrowing / Lending

Prohibited unless the customer is:

1. A **financial institution**, OR
2. **In the business of lending**, OR
3. An **immediate family member**

— with the firm's procedures permitting.

### Commingling

Customer funds may NEVER be commingled with firm funds.

### Conversion

Even temporary use of customer funds for personal purposes is conversion. There is no "I returned it the same day" defense.

## Disclosure and Misrepresentation

### Guarantees

Guaranteeing a customer against loss is prohibited.

A "guaranteed security" — where principal/interest is guaranteed by a third party (e.g., a parent company guaranteeing a sub's bond) — IS permitted with disclosure. The guarantee is the third party's, not the agent's.

### Misrepresentation of Qualifications

Falsifying credentials, education, employment, or qualifications.

### Material Omissions

Failing to disclose material facts about a security or transaction.

## Selling Away

Effecting **private securities transactions** outside the BD without:

- Prior **written notice** to the firm, AND
- Prior **written approval** (if compensation is involved)

## Recordkeeping Violations

- Backdating order tickets
- Falsifying records
- Forging signatures

## Communications

- Personal email for client communications likely violates supervised-systems rules
- Social media posts recommending securities are subject to firm supervision and recordkeeping
- Promising specific returns without basis = potential fraud`,
    pitfalls: [
      'A discretionary trade WITHOUT DPOA is unauthorized — even if it is suitable AND profitable.',
      'Borrowing from a friendly client without one of the three exceptions is prohibited regardless of disclosure.',
      'Sharing 50/50 with 25% capital contribution is NEVER allowed.',
      'Time/price discretion on a specific customer order does NOT need DPOA. Full discretion does.',
    ],
    keyTerms: [
      { term: 'Churning', definition: 'Excessive commission-driven trading' },
      { term: 'DPOA', definition: 'Discretionary Power of Attorney (written authorization)' },
      { term: 'Selling away', definition: 'Private transactions outside the BD' },
      { term: 'Conversion', definition: 'Use of customer funds for personal purposes' },
    ],
  };
