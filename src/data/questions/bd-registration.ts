import type { Question } from '../questions';

export const items: Question[] = [
  {
    id: 31,
    topic: 'bd-registration',
    q: 'Which of the following is NOT excluded from the definition of "broker-dealer" under the USA?',
    choices: [
      'A bank',
      'A trust company',
      'A bank holding company',
      'An issuer selling its own securities',
    ],
    answer: 2,
    exp: 'Banks, savings institutions, trust companies, agents, and issuers are excluded. A bank holding company is NOT a bank for these purposes and is therefore not excluded.',
    difficulty: 'medium',
  },
  {
    id: 32,
    topic: 'bd-registration',
    q: 'Which of the following is an "institutional investor" under the USA?',
    choices: [
      'An accredited individual with $5M net worth',
      'A pension plan with $1.5M in assets',
      'A retired physician with $10M portfolio',
      'A family office serving one wealthy family',
    ],
    answer: 1,
    exp: 'Pension and profit-sharing plans with $1M+ in assets qualify as institutional investors. Wealthy individuals are NEVER institutional investors regardless of net worth.',
    difficulty: 'medium',
  },
  {
    id: 33,
    topic: 'bd-registration',
    q: 'A BD with no place of business in State X transacts only with institutional investors there. Is registration required?',
    choices: [
      'Yes — any in-state activity requires registration',
      'No — the institutional-only exemption applies (no place of business + only institutionals)',
      'Yes — institutional clients are unrelated to registration',
      'No — but only if the institutionals are in-state banks',
    ],
    answer: 1,
    exp: 'A BD is exempt from state registration if it has no place of business in the state AND deals only with institutionals/issuers/other BDs. Both conditions must hold.',
    difficulty: 'medium',
  },
  {
    id: 34,
    topic: 'bd-registration',
    q: 'A BD opens a small branch office in State Y. All clients serviced from that branch are institutional. Is BD registration required in State Y?',
    choices: [
      'No — the institutional-only exemption applies',
      'Yes — place of business in a state ALWAYS triggers registration',
      'No — branches under 500 sq ft are excluded',
      'Yes — but only if revenue exceeds $1M',
    ],
    answer: 1,
    exp: 'Place of business in a state always triggers BD registration in that state, even if every client there is institutional. The institutional-only exemption requires NO place of business.',
    difficulty: 'medium',
  },
  {
    id: 35,
    topic: 'bd-registration',
    q: 'Form BD is filed via:',
    choices: ['IARD only', 'CRD', 'EDGAR', 'NASAA Direct'],
    answer: 1,
    exp: 'Form BD (broker-dealer registration) is filed via CRD, which routes to both the SEC and applicable state regulators.',
    difficulty: 'easy',
  },
];
