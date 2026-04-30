// Official NASAA Series 63 content outline (effective June 12, 2023).
// Four categories with these question weights for the 60 scored questions.

export type OfficialCategoryId =
  | 'investment-advisers'
  | 'bd-agents'
  | 'securities-issuers'
  | 'remedies-admin';

export interface OfficialCategory {
  id: OfficialCategoryId;
  name: string;
  questions: number;
  pct: number;
}

export const OFFICIAL_CATEGORIES: Record<OfficialCategoryId, OfficialCategory> = {
  'investment-advisers': {
    id: 'investment-advisers',
    name: 'Regulation of Investment Advisers and IARs',
    questions: 5,
    pct: 8,
  },
  'bd-agents': {
    id: 'bd-agents',
    name: 'Regulation of Broker-Dealers and their Agents',
    questions: 28,
    pct: 47,
  },
  'securities-issuers': {
    id: 'securities-issuers',
    name: 'Regulation of Securities and Issuers',
    questions: 6,
    pct: 10,
  },
  'remedies-admin': {
    id: 'remedies-admin',
    name: 'Remedies and Administrative Provisions',
    questions: 21,
    pct: 35,
  },
};

// Maps each study topic id to the official NASAA category it falls under.
// Mock exam sampling and category-level progress reporting use this map.
export const TOPIC_TO_CATEGORY: Record<string, OfficialCategoryId> = {
  'usa-foundations': 'remedies-admin',
  'agent-registration': 'bd-agents',
  'bd-registration': 'bd-agents',
  'ia-registration': 'investment-advisers',
  'securities-registration': 'securities-issuers',
  'exempt-securities': 'securities-issuers',
  'exempt-transactions': 'securities-issuers',
  'security-definition': 'securities-issuers',
  'unethical-bd': 'bd-agents',
  'unethical-ia': 'investment-advisers',
  fraud: 'remedies-admin',
  'admin-actions': 'remedies-admin',
  communications: 'bd-agents',
  'recent-updates': 'remedies-admin',
};
