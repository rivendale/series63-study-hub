import type { Question } from '../questions';

export const items: Question[] = [
  {
    id: 88,
    topic: 'exempt-securities',
    q: 'Which of the following is NOT an exempt security under the USA?',
    choices: [
      'US Treasury bonds',
      'Municipal bonds',
      'Bank holding company common stock',
      'Securities of a domestic insurance company authorized in the state',
    ],
    answer: 2,
    exp: 'Bank holding company stock is NOT an exempt security. BHCs are not banks for these purposes. Banks themselves, US government and municipal issues, and authorized insurance companies are exempt.',
    difficulty: 'medium',
  },
  {
    id: 89,
    topic: 'exempt-securities',
    q: 'Commercial paper qualifies for the exempt-security treatment if:',
    choices: [
      'Maturity ≤ 9 months, denominations ≥ $50,000, top-3 NRSRO ratings',
      'Maturity ≤ 1 year, any denomination, any rating',
      'Maturity ≤ 3 months, denominations ≥ $25,000',
      'Maturity ≤ 12 months, denominations ≥ $100,000',
    ],
    answer: 0,
    exp: 'Commercial paper exemption: maturity ≤ 9 months (270 days), denominations ≥ $50,000, top-3 NRSRO ratings.',
    difficulty: 'medium',
  },
  {
    id: 90,
    topic: 'exempt-securities',
    q: 'A foreign government bond is exempt under the USA if:',
    choices: [
      'The country is a member of the UN',
      'The US has diplomatic relations with the issuer country',
      'The bond is rated investment-grade',
      'The bond is denominated in US dollars',
    ],
    answer: 1,
    exp: 'Foreign government securities are exempt only if the US has diplomatic relations with the issuer country.',
    difficulty: 'medium',
  },
  {
    id: 91,
    topic: 'exempt-securities',
    q: 'Variable annuities are:',
    choices: [
      'Exempt securities (insurance products)',
      'Securities subject to registration (and also insurance products)',
      'Not securities at all',
      'Federal covered securities under all circumstances',
    ],
    answer: 1,
    exp: 'Variable annuities ARE securities subject to registration AND insurance products subject to state insurance laws. Fixed annuities are NOT securities at all.',
    difficulty: 'medium',
  },
  {
    id: 92,
    topic: 'exempt-securities',
    q: 'Anti-fraud rules apply to:',
    choices: [
      'Only registered securities',
      'Exempt securities are also exempt from anti-fraud',
      'Both registered AND exempt securities — there is no exemption from anti-fraud',
      'Only securities trading on national exchanges',
    ],
    answer: 2,
    exp: 'Exempt from registration ≠ exempt from anti-fraud. Anti-fraud applies to all securities and all persons regardless of registration status.',
    difficulty: 'easy',
  },
];
