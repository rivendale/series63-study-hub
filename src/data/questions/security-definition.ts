import type { Question } from '../questions';

export const items: Question[] = [
  {
    id: 99,
    topic: 'security-definition',
    q: 'Which of the following is NOT an element of the Howey test?',
    choices: [
      'Investment of money',
      'Common enterprise',
      'Expectation of profit primarily from the efforts of others',
      'A written contract',
    ],
    answer: 3,
    exp: 'Howey: (1) investment of money, (2) common enterprise, (3) expectation of profit, (4) primarily from the efforts of others. A written contract is NOT required — investment contracts can be implied.',
    difficulty: 'medium',
  },
  {
    id: 100,
    topic: 'security-definition',
    q: 'Which is NOT a security?',
    choices: ['A variable annuity', 'A mutual fund share', 'A fixed annuity', 'A debenture'],
    answer: 2,
    exp: 'Fixed annuities are insurance contracts, not securities. Variable annuities ARE securities (and also insurance products).',
    difficulty: 'easy',
  },
  {
    id: 101,
    topic: 'security-definition',
    q: 'A condo purchased outright for personal use is:',
    choices: [
      'A security under Howey',
      'Real estate, not a security',
      'A federal covered security',
      'An exempt security',
    ],
    answer: 1,
    exp: 'A condo for personal use is real estate. The same condo entered into a rental pool managed by a third party for profit becomes a security (investment contract under Howey).',
    difficulty: 'easy',
  },
  {
    id: 102,
    topic: 'security-definition',
    q: 'Promissory notes are presumptively securities under which case?',
    choices: ['SEC v. Howey', 'Reves v. Ernst & Young', 'Basic v. Levinson', 'TSC v. Northway'],
    answer: 1,
    exp: 'Reves established that promissory notes are presumptively securities unless they fit within the "family resemblance" exception (commercial paper, bank loans, consumer loans, etc.).',
    difficulty: 'hard',
  },
  {
    id: 103,
    topic: 'security-definition',
    q: 'Which of the following is regulated by the CFTC, not as a security under the USA?',
    choices: ['ETFs', 'Commodity futures', 'Mutual funds', 'Treasury notes'],
    answer: 1,
    exp: 'Commodity futures and forward contracts are CFTC-regulated and are NOT securities under the USA.',
    difficulty: 'medium',
  },
];
