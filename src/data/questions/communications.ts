import type { Question } from '../questions';

export const items: Question[] = [
  {
    id: 104,
    topic: 'communications',
    q: 'An advertisement showing only an IA\'s 5 best past recommendations is:',
    choices: [
      'Permitted with disclosure',
      'Cherry-picking — prohibited; advertising must show all recommendations of the same type for a representative period',
      'Permitted only if the IA is federal covered',
      'Permitted because past performance is historical fact',
    ],
    answer: 1,
    exp: 'Past specific recommendations advertising must include all recommendations of the same type for a representative period (typically 12 months). Selecting only winners is misleading.',
    difficulty: 'medium',
  },
  {
    id: 105,
    topic: 'communications',
    q: 'Performance advertising must be reported:',
    choices: [
      'Gross of fees by default',
      'Net of fees by default (gross may also be shown if clearly labeled, with net also shown)',
      'Either gross or net at the IA’s discretion',
      'Only on annual basis',
    ],
    answer: 1,
    exp: 'Performance must be reported net of fees by default. Gross may be shown if clearly labeled and net is also presented, with methodology and time period disclosed.',
    difficulty: 'medium',
  },
  {
    id: 106,
    topic: 'communications',
    q: 'A written customer complaint received by an agent should be:',
    choices: [
      'Resolved by the agent personally without escalation',
      'Promptly forwarded to a principal/supervisor and recorded',
      'Returned to the customer with an apology',
      'Discarded if minor',
    ],
    answer: 1,
    exp: 'Written complaints must be promptly forwarded to a principal/supervisor and recorded under firm procedures. Verbal complaints should also be documented.',
    difficulty: 'easy',
  },
  {
    id: 107,
    topic: 'communications',
    q: 'Records retention for an IA is generally:',
    choices: [
      'Life of account + 6 years',
      '5 years (first 2 in office)',
      '3 years',
      'Permanent for everything',
    ],
    answer: 1,
    exp: 'IAs generally keep records 5 years (first 2 in office). BD customer account records are typically life + 6 years. Form ADV/brochures are kept permanently.',
    difficulty: 'medium',
  },
  {
    id: 108,
    topic: 'communications',
    q: 'An agent uses her personal email to send investment recommendations to clients. This is:',
    choices: [
      'Permitted with a disclosure on the email',
      'Typically a violation — communications must occur on supervised firm systems',
      'Permitted for non-discretionary clients',
      'Permitted if the firm later receives copies',
    ],
    answer: 1,
    exp: 'Personal email circumvents firm supervision and recordkeeping and is typically a violation of firm policy and supervisory rules.',
    difficulty: 'easy',
  },
];
