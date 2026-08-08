/**
 * Items flagged for review by a licensed professional.
 *
 * Everything here was written from public sources and is internally consistent,
 * but each entry is a place where the content either needed a source check or
 * still needs a practitioner's judgment — sources disagree, a figure drifts, a
 * rule varies by adopting state, or a boundary is easy to state too broadly.
 *
 * This file is the single source of truth for both the in-app review page and
 * REVIEW.md, so the two cannot drift apart.
 *
 * When an item is resolved, set `status` to 'confirmed' or 'corrected' and fill
 * in `resolution`. If the resolution changes a rule, check `questionIds` — the
 * whole reason this list exists is that an error in a chapter propagates into
 * every question written from it. Fixing the chapter and leaving the questions
 * alone is worse than not fixing it at all, because the app then contradicts
 * itself and the student cannot tell which half is right.
 */

export type ReviewCategory =
  | 'source-disagreement'
  | 'indexed-figure'
  | 'state-variation'
  | 'contested-judgment'
  | 'scope-nuance';

export type ReviewStatus = 'open' | 'confirmed' | 'corrected';

export interface ReviewItem {
  id: string;
  /** Curriculum topic id, for linking to the chapter. */
  topic: string;
  title: string;
  category: ReviewCategory;
  status: ReviewStatus;
  /** What the app currently tells the student. */
  asserted: string;
  /** Why this was flagged rather than stated flatly. */
  concern: string;
  /** The specific thing to check. */
  verify: string;
  /** Question ids that would need changing if the rule turns out to be wrong. */
  questionIds?: number[];
  /** Filled in once reviewed. */
  resolution?: string;
}

export const REVIEW_CATEGORY_LABELS: Record<ReviewCategory, string> = {
  'source-disagreement': 'Sources disagree',
  'indexed-figure': 'Inflation-indexed figure',
  'state-variation': 'Varies by state',
  'contested-judgment': 'Reasonable advisors differ',
  'scope-nuance': 'Scope or nuance',
};

export const REVIEW_CATEGORY_NOTES: Record<ReviewCategory, string> = {
  'source-disagreement':
    'Study material and primary sources give different answers. The app picked the better-supported one and says so, but it is worth confirming which is tested.',
  'indexed-figure':
    'The figure changes over time. A stale number here is wrong rather than merely dated, so re-check it before each content revision.',
  'state-variation':
    'The Uniform Securities Act is model legislation and adopting states differ. The app states the model-act position and says that states vary.',
  'contested-judgment':
    'There is no single correct answer, only a defensible one. Confirm the keyed answer matches how you would actually advise.',
  'scope-nuance':
    'The rule is right but its boundary is easy to state too broadly or too narrowly.',
};

export const reviewItems: ReviewItem[] = [
  /* ---------------------------------------------------------------- */
  /* Resolved — found by the corpus contradiction sweep                */
  /* ---------------------------------------------------------------- */
  {
    id: 'qualified-client',
    topic: 'unethical-ia',
    title: 'Qualified client thresholds',
    category: 'indexed-figure',
    status: 'corrected',
    asserted:
      '$1.4M assets under management with the IA, or more than $2.7M net worth excluding the primary residence, tested at contract inception.',
    concern:
      'The SEC re-indexes Rule 205-3 by order roughly every five years. A stale pair is affirmatively wrong, not merely dated, and the app carried the previous figures for about six weeks after the order took effect.',
    verify:
      'Re-check Rule 205-3 before each content revision rather than trusting the number written here.',
    questionIds: [73],
    resolution:
      'An SEC order effective 2026-06-29 raised the thresholds from $1.1M/$2.2M to $1.4M/$2.7M, with contracts already in place grandfathered. Corrected in the Performance Fees section, the pitfall, the key term, two cheat sheet rows, a most-tested rule and question 73. Every surviving mention of the old pair is now an explicit historical reference, since a candidate studying from older material will have memorised it. Two points were added while in there, both tested and both previously absent: status is measured at inception rather than monitored continuously, and accredited investor is a different and lower standard — which is exactly what question 73 offers as its first distractor.',
  },
  {
    id: 'felony-window',
    topic: 'admin-actions',
    title: 'Statutory disqualification: felony and misdemeanor lookback',
    category: 'source-disagreement',
    status: 'corrected',
    asserted:
      'A felony or a securities-related misdemeanor within the past 10 years is a ground under either model act. Past 10 years the acts diverge, and the power is discretionary throughout.',
    concern:
      'The app previously stated this backwards and stated it two different ways in different files, which is how it survived so long.',
    verify:
      'Confirm which model act your state enacted, since that decides how convictions older than 10 years are treated.',
    questionIds: [48, 49],
    resolution:
      'Three sites said "any felony within 10 years"; the cheat sheet and one explanation said "NON-securities felonies have a 10-year window", implying securities felonies never expire. Everywhere the app also asserted that securities-related misdemeanors have no time limit. Neither model act supports that. The 1956 act (204(a)(2)(B)) reaches convictions within the past ten years for securities misdemeanors and felonies alike; the 2002 act (412(d)(3)) reaches any felony with no time limit plus a securities misdemeanor within the previous ten years. The app had the two categories swapped. Question 49 keyed on the unsupported version — a 2014 securities misdemeanor judged in 2026 was marked still actionable, wrong under both acts — and question 48 had the same defect in a distractor, which made two of its four choices defensible. Both rewritten so their facts sit inside the window where the acts agree.',
  },
  {
    id: 'hearing-timing',
    topic: 'usa-foundations',
    title: 'Direction of the 15-day hearing clock',
    category: 'scope-nuance',
    status: 'corrected',
    asserted:
      'On a written request, the Administrator sets the matter down for hearing within 15 days of receiving it. The model act sets no deadline for making the request.',
    concern:
      'Three of the four places this appeared had the clock running the other way, as a countdown for the party to ask.',
    verify:
      'Confirm your state has not adopted a different period — Nebraska, for one, uses thirty business days.',
    questionIds: [5],
    resolution:
      'The statutory language is that "within fifteen days after the receipt of a written request the matter will be set down for hearing" — the Administrator\'s deadline to schedule, not the registrant\'s deadline to ask. Only the Administrative Actions chapter had it right; the USA Foundations chapter, the cheat sheet, and question 5 all had it reversed, and question 5\'s stem was built on the reversed reading. The stem was rewritten to ask the correct question, keeping the same choices and the same key.',
  },
  {
    id: 'discretion-scope',
    topic: 'unethical-ia',
    title: 'Written DPOA stated as an unscoped absolute',
    category: 'scope-nuance',
    status: 'corrected',
    asserted:
      'A BD agent needs the written DPOA in hand first. An IA may begin on oral authority with written authorization due within 10 business days of the first transaction.',
    concern:
      'The corpus stated "written DPOA required" as an absolute in five places and never mentioned the adviser exception at all, so a student applying the agent rule to an adviser would get it backwards.',
    verify:
      'Confirm the 10-business-day window runs from the first transaction rather than from account opening.',
    questionIds: [115],
    resolution:
      'Verified against NASAA Model Rule 102(a)(4)-1: an adviser may not exercise discretion without written authority obtained within ten business days after the date of the first transaction placed under oral authority, with time and price discretion on a definite amount of a specified security carved out for both. This is the same rule that was found reversed in the Series 65 repo, which is what prompted looking here. All five blanket sites scoped to BD agents, the IA rule added with a comparison table, and question 115 added so the distinction is drilled rather than merely stated.',
  },
  {
    id: 'coordination-conditions',
    topic: 'securities-registration',
    title: 'Registration by coordination: the three conditions',
    category: 'scope-nuance',
    status: 'corrected',
    asserted:
      'Effective simultaneously with federal effectiveness, provided the statement has been on file 10 days, the pricing statement 2 full business days, and no stop order is pending.',
    concern:
      'The app taught simultaneity as unconditional, which is true as far as it goes but omits where the testable content actually lives.',
    verify:
      'Adopting states may lengthen the filing period, so confirm your state before relying on the ten days.',
    questionIds: [82],
    resolution:
      'Added to the chapter, the pitfall, the key term, the cheat sheet and question 82. The pitfall in particular would have contradicted the new chapter text had it kept asserting unconditional simultaneity — brought into line in the same pass rather than left to be found later.',
  },
  {
    id: 'private-placement-offerees',
    topic: 'exempt-transactions',
    title: 'Private placement limit counts offerees, not buyers',
    category: 'scope-nuance',
    status: 'corrected',
    asserted:
      'An offer directed to no more than 10 non-institutional persons in 12 months. The count is of offerees; offers to institutions are unlimited.',
    concern:
      'The chapter and its pitfall both said "11+ non-institutional buyers blows the exemption", which understates the strictness of the rule in the direction that matters.',
    verify:
      'Confirm the model-act figure is what your state uses — Massachusetts allows twenty-five.',
    questionIds: [93],
    resolution:
      'USA 402(b)(9) exempts a transaction pursuant to an offer directed to not more than ten persons other than institutional investors during any twelve consecutive months. The count is therefore of OFFEREES: an eleventh retail person who is merely offered the security breaks the exemption even if they never buy, while ten offers producing ten sales are inside the limit. Corrected in the chapter, the pitfall and question 93.',
  },

  /* ---------------------------------------------------------------- */
  /* Open — model-act figures that adopting states change              */
  /* ---------------------------------------------------------------- */
  {
    id: 'criminal-penalties',
    topic: 'admin-actions',
    title: 'Criminal penalty maximums',
    category: 'state-variation',
    status: 'open',
    asserted:
      'Up to a $5,000 fine and/or 3 years imprisonment per willful violation, described in the chapter as the USA figure.',
    concern:
      'These are model-act maximums and adopting states routinely set higher fines and longer terms. The chapter explanation scopes it to the USA, but the cheat sheet row states "$5,000 / 3 yrs" flat, which reads as a national rule.',
    verify:
      'Confirm the exam tests the model-act figures rather than a state variation, and decide whether the cheat sheet row should carry the qualifier.',
    questionIds: [46],
  },
  {
    id: 'statute-of-limitations',
    topic: 'admin-actions',
    title: 'Civil statute of limitations',
    category: 'state-variation',
    status: 'open',
    asserted:
      'The earlier of 3 years from the violation or 2 years from discovery, with the chapter noting that it varies by state.',
    concern:
      'The chapter says "varies by state" but the cheat sheet states the pair flat. The criminal limitations period is also a separate figure the app does not address at all.',
    verify:
      'Confirm the civil pair is the tested formulation, and whether the criminal statute of limitations is worth adding.',
    questionIds: [47],
  },
  {
    id: 'iar-ce-adoption',
    topic: 'recent-updates',
    title: 'IAR continuing education adoption status',
    category: 'state-variation',
    status: 'open',
    asserted:
      '12 credits annually — 6 Products and Practice plus 6 Ethics — mandatory in adopting states, with non-compliance rendering the IAR "CE inactive".',
    concern:
      'The credit split is stable but the set of adopting states grows every year, and the app says "adopting states" without saying which or how many. A candidate in a non-adopting state may reasonably wonder whether it applies to them. Note also that IAR CE is taught in two chapters — Recent Regulatory Updates and Unethical Practices (IA) — with a question in each; they currently agree, and any change has to land in both.',
    verify:
      'Confirm the current adoption count and whether the exam expects a candidate to know their own state status.',
    questionIds: [81, 114],
  },

  /* ---------------------------------------------------------------- */
  /* Open — boundaries stated more loosely than the rule               */
  /* ---------------------------------------------------------------- */
  {
    id: 'record-retention-periods',
    topic: 'communications',
    title: 'Recordkeeping retention periods given as ranges',
    category: 'scope-nuance',
    status: 'open',
    asserted:
      'A table giving BD order tickets as 3–6 years and communications as 3–5 years, against a flat 5 years for IA records, with prose adding "first 2 in office".',
    concern:
      'The ranges collapse several different record types into one row, so a student cannot tell which record carries which period. The IA row also omits the accessible-location condition that the prose mentions, so the table and the text disagree in emphasis.',
    verify:
      'Decide whether to split the rows by record type and state a single period for each, or keep the ranges and say explicitly that the period depends on the record.',
  },
  {
    id: 'brochure-federal-state-split',
    topic: 'ia-registration',
    title: 'Brochure delivery: NASAA rule stated without the federal counterpart',
    category: 'scope-nuance',
    status: 'open',
    asserted:
      '48+ hours before the contract, or at signing with a 5-business-day right to rescind; annual delivery within 120 days of fiscal year end.',
    concern:
      'This is the NASAA model rule for state-registered advisers. The federal rule for an SEC-registered adviser requires delivery at or before entry into the contract with no rescission right, and the app does not mention it. Defensible for a state-law exam, but a federal covered fact pattern would catch a student out.',
    verify:
      'Decide whether the Series 63 scope warrants naming the federal rule alongside the state one.',
    questionIds: [64],
  },
  {
    id: 'evep-details',
    topic: 'recent-updates',
    title: 'Exam Validity Extension Program specifics',
    category: 'scope-nuance',
    status: 'open',
    asserted:
      'Eligibility requires at least 1 year of registration before termination, opt-in within 2 years, FINRA MQP enrollment for AG EVEP, and a $35 annual fee per program.',
    concern:
      'Program mechanics and fees are administrative details that change without any change in law, and a dollar figure of this kind is the sort of thing that quietly goes stale.',
    verify:
      'Confirm the fee and the enrollment conditions currently, and decide whether the fee is worth stating at all given how it drifts.',
  },
];

export function reviewItemsByStatus(status: ReviewStatus): ReviewItem[] {
  return reviewItems.filter((i) => i.status === status);
}

export function reviewItemsByCategory(category: ReviewCategory): ReviewItem[] {
  return reviewItems.filter((i) => i.category === category);
}
