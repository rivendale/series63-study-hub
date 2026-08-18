# Content review queue

The curriculum and question bank in this app are original work, written from public sources: the Uniform Securities Act model law, NASAA model rules and Statements of Policy, and the Investment Advisers Act of 1940 and the rules under it. The material is internally consistent — chapters agree with the questions written from them, and a figure is stated the same way everywhere it appears.

This file lists the places where internal consistency was not enough. Entries arrive here two ways, and the status on each says which.

**Open** items are points where the writer or the auditor stopped short of asserting something flatly: sources disagree about what is actually tested, a figure will drift, a rule varies by adopting state, or the answer is a matter of judgment on which competent advisors differ. Nothing in an open item is known to be wrong — these are the points where certainty ran out, and where a licensed reviewer's judgment is worth more than another pass through the same public sources.

**Confirmed** and **corrected** items have been resolved. A corrected entry means something *was* wrong and has been fixed, with the resolution recording what changed and why; several were found by comparing the same rule across files rather than by reading any file on its own. They stay in the list because the reasoning is worth keeping, and because anyone reopening the question should be able to see what was already decided.

Each item states exactly what the app currently tells a student, why it was flagged, and the single specific thing to check. The intent is that a review is an hour or two of targeted checking rather than a re-read of the whole curriculum.

**12 items — 0 open, 1 confirmed, 11 corrected — across 8 chapters and 13 questions.**

| Category | Items | Open | What the category means |
|---|---:|---:|---|
| Sources disagree | 1 | 0 | Study material and primary sources give different answers. The app picked the better-supported one and says so, but it is worth confirming which is tested. |
| Inflation-indexed figure | 1 | 0 | The figure changes over time. A stale number here is wrong rather than merely dated, so re-check it before each content revision. |
| Varies by state | 3 | 0 | The Uniform Securities Act is model legislation and adopting states differ. The app states the model-act position and says that states vary. |
| Reasonable advisors differ | 0 | 0 | There is no single correct answer, only a defensible one. Confirm the keyed answer matches how you would actually advise. |
| Scope or nuance | 7 | 0 | The rule is right but its boundary is easy to state too broadly or too narrowly. |

*Generated from [`src/data/reviewItems.ts`](src/data/reviewItems.ts) by `npm run review:md`. Edit that file, not this one — the in-app `/review` page renders the same data, so the two cannot disagree.*

## Checklist

Paste this section into a GitHub issue or a PR body to track the review there; the boxes are live task-list syntax. Items already resolved are pre-ticked and listed for the record rather than for action.

**Sources disagree**

- [x] [Statutory disqualification: felony and misdemeanor lookback](#felony-window) — Administrative Actions and Penalties · corrected, no action needed

**Inflation-indexed figure**

- [x] [Qualified client thresholds](#qualified-client) — Unethical IA/IAR Practices · corrected, no action needed

**Varies by state**

- [x] [Criminal penalty maximums](#criminal-penalties) — Administrative Actions and Penalties · corrected, no action needed
- [x] [Civil statute of limitations](#statute-of-limitations) — Administrative Actions and Penalties · corrected, no action needed
- [x] [IAR continuing education adoption status](#iar-ce-adoption) — Recent Regulatory Updates (2022–2026) · corrected, no action needed

**Scope or nuance**

- [x] [Direction of the 15-day hearing clock](#hearing-timing) — USA Foundations · corrected, no action needed
- [x] [Written DPOA stated as an unscoped absolute](#discretion-scope) — Unethical IA/IAR Practices · corrected, no action needed
- [x] [Registration by coordination: the three conditions](#coordination-conditions) — Securities Registration · corrected, no action needed
- [x] [Private placement limit counts offerees, not buyers](#private-placement-offerees) — Exempt Transactions · corrected, no action needed
- [x] [Recordkeeping retention periods given as ranges](#record-retention-periods) — Communications and Recordkeeping · corrected, no action needed
- [x] [Brochure delivery: NASAA rule stated without the federal counterpart](#brochure-federal-state-split) — Investment Adviser Registration · corrected, no action needed
- [x] [Exam Validity Extension Program specifics](#evep-details) — Recent Regulatory Updates (2022–2026) · confirmed, no action needed

## Sources disagree

> Study material and primary sources give different answers. The app picked the better-supported one and says so, but it is worth confirming which is tested.

<a id="felony-window"></a>

### Statutory disqualification: felony and misdemeanor lookback

**Status:** Corrected · **Item id:** `felony-window`

**Chapter:** [Administrative Actions and Penalties](src/data/topics/admin-actions.ts) — topic id `admin-actions` · [read in the app](https://rivendale.github.io/series63-study-hub/#/curriculum/admin-actions)

**The app asserts.** A felony or a securities-related misdemeanor within the past 10 years is a ground under either model act. Past 10 years the acts diverge, and the power is discretionary throughout.

**Why it is flagged.** The app previously stated this backwards and stated it two different ways in different files, which is how it survived so long.

**To verify.** Confirm which model act your state enacted, since that decides how convictions older than 10 years are treated.

**Questions that change with it.** 48, 49 in [`src/data/questions/admin-actions.ts`](src/data/questions/admin-actions.ts)

**Resolution.** Three sites said "any felony within 10 years"; the cheat sheet and one explanation said "NON-securities felonies have a 10-year window", implying securities felonies never expire. Everywhere the app also asserted that securities-related misdemeanors have no time limit. Neither model act supports that. The 1956 act (204(a)(2)(B)) reaches convictions within the past ten years for securities misdemeanors and felonies alike; the 2002 act (412(d)(3)) reaches any felony with no time limit plus a securities misdemeanor within the previous ten years. The app had the two categories swapped. Question 49 keyed on the unsupported version — a 2014 securities misdemeanor judged in 2026 was marked still actionable, wrong under both acts — and question 48 had the same defect in a distractor, which made two of its four choices defensible. Both rewritten so their facts sit inside the window where the acts agree.

## Inflation-indexed figure

> The figure changes over time. A stale number here is wrong rather than merely dated, so re-check it before each content revision.

<a id="qualified-client"></a>

### Qualified client thresholds

**Status:** Corrected · **Item id:** `qualified-client`

**Chapter:** [Unethical IA/IAR Practices](src/data/topics/unethical-ia.ts) — topic id `unethical-ia` · [read in the app](https://rivendale.github.io/series63-study-hub/#/curriculum/unethical-ia)

**The app asserts.** \$1.4M assets under management with the IA, or more than \$2.7M net worth excluding the primary residence, tested at contract inception.

**Why it is flagged.** The SEC re-indexes Rule 205-3 by order roughly every five years. A stale pair is affirmatively wrong, not merely dated, and the app carried the previous figures for about six weeks after the order took effect.

**To verify.** Re-check Rule 205-3 before each content revision rather than trusting the number written here.

**Questions that change with it.** 73 in [`src/data/questions/unethical-ia.ts`](src/data/questions/unethical-ia.ts)

**Resolution.** An SEC order effective 2026-06-29 raised the thresholds from \$1.1M/\$2.2M to \$1.4M/\$2.7M, with contracts already in place grandfathered. Corrected in the Performance Fees section, the pitfall, the key term, two cheat sheet rows, a most-tested rule and question 73. Every surviving mention of the old pair is now an explicit historical reference, since a candidate studying from older material will have memorised it. Two points were added while in there, both tested and both previously absent: status is measured at inception rather than monitored continuously, and accredited investor is a different and lower standard — which is exactly what question 73 offers as its first distractor.

## Varies by state

> The Uniform Securities Act is model legislation and adopting states differ. The app states the model-act position and says that states vary.

<a id="criminal-penalties"></a>

### Criminal penalty maximums

**Status:** Corrected · **Item id:** `criminal-penalties`

**Chapter:** [Administrative Actions and Penalties](src/data/topics/admin-actions.ts) — topic id `admin-actions` · [read in the app](https://rivendale.github.io/series63-study-hub/#/curriculum/admin-actions)

**The app asserts.** Up to a \$5,000 fine and/or 3 years imprisonment per willful violation, described in the chapter as the USA figure.

**Why it is flagged.** These are model-act maximums and adopting states routinely set higher fines and longer terms. The chapter explanation scopes it to the USA, but the cheat sheet row states "\$5,000 / 3 yrs" flat, which reads as a national rule.

**To verify.** Confirm the exam tests the model-act figures rather than a state variation, and decide whether the cheat sheet row should carry the qualifier.

**Questions that change with it.** 46 in [`src/data/questions/admin-actions.ts`](src/data/questions/admin-actions.ts)

**Resolution.** The \$5,000 and 3-year figures are correct as model-act maximums, so the chapter was right and only the framing needed work. The cheat sheet row now carries 'model-act maximums; adopting states set their own' rather than stating the pair flat, and question 46's explanation says the same. Added the point the chapter had buried, that no criminal liability attaches where the person had no knowledge of the rule or order violated - that is a genuine element rather than a footnote.

<a id="statute-of-limitations"></a>

### Civil statute of limitations

**Status:** Corrected · **Item id:** `statute-of-limitations`

**Chapter:** [Administrative Actions and Penalties](src/data/topics/admin-actions.ts) — topic id `admin-actions` · [read in the app](https://rivendale.github.io/series63-study-hub/#/curriculum/admin-actions)

**The app asserts.** 1956 act (§410(f)): the earlier of 3 years after the contract of sale or the rendering of investment advice, or 2 years after discovery. 2002 act (§509(j)): the earlier of 2 years after discovery or 5 years after the violation. Criminal: 5 years after the alleged violation.

**Why it is flagged.** This entry is a warning, not a doubt. An automated pass talked itself out of the correct rule on the reasoning that the widely taught 3-and-2 pair looked like a prep-industry convention. It is the statutory text. The reasoning was plausible, the replacement was fluent, and it was wrong twice in a row before anyone opened the act.

**To verify.** Nothing outstanding on the 1956 figures. Two loose ends: the §509(j) citation for the 2002 act was not checked against the primary PDF (only its figures were corroborated), and adopting states set their own periods, so a state-specific answer may differ from the model act.

**Questions that change with it.** 47 in [`src/data/questions/admin-actions.ts`](src/data/questions/admin-actions.ts)

**Resolution.** The app taught '3 years from violation OR 2 years from discovery'. A content pass concluded that pairing matched neither model act and rewrote the chapter around a single 1956 trigger of two years after the contract of sale. THAT REWRITE WAS WRONG AND HAS BEEN REVERSED. The 3-and-2 pairing is section 410(f) of the 1956 act verbatim: no suit more than three years after the contract of sale, or the rendering of investment advice, or more than two years after discovery of the facts constituting the violation, whichever first occurs. Three specifics worth recording, because each one was asserted wrongly here before the act was opened: the limitations provision is 410(f), not 410(e) (410(e) is survival of the cause of action after death); the phrase 'four years' appears nowhere in the act, so there is no outer cap by claim type; and 410(f) applies to 'this section' without distinguishing a registration claim under 410(a)(1) from a fraud claim under 410(a)(2), so there is no split by claim type either. What survives from the pass is genuinely useful: the chapter now names the second conduct trigger the original omitted (the rendering of investment advice, which starts the clock against an adviser who never sold anything), spells out that discovery can only shorten the window and never extend it, and separates the criminal five-year clock explicitly. Question 47 keys the 2002 act pair as before; its explanation no longer calls the 3-and-2 choice a teaching convention, because that choice is a true statement of the majority rule under a different act, and telling a student otherwise is the error this entry exists to prevent. Primary text extracted from NASAA's 1956 Uniform Securities Act with NASAA Updates and Commentary.

<a id="iar-ce-adoption"></a>

### IAR continuing education adoption status

**Status:** Corrected · **Item id:** `iar-ce-adoption`

**Chapter:** [Recent Regulatory Updates (2022–2026)](src/data/topics/recent-updates.ts) — topic id `recent-updates` · [read in the app](https://rivendale.github.io/series63-study-hub/#/curriculum/recent-updates)

**The app asserts.** 12 credits annually — 6 Products and Practice plus 6 Ethics — mandatory in adopting states, with non-compliance rendering the IAR "CE inactive".

**Why it is flagged.** The credit split is stable but the set of adopting states grows every year, and the app says "adopting states" without saying which or how many. A candidate in a non-adopting state may reasonably wonder whether it applies to them. Note also that IAR CE is taught in two chapters — Recent Regulatory Updates and Unethical Practices (IA) — with a question in each; they currently agree, and any change has to land in both.

**To verify.** Confirm the current adoption count and whether the exam expects a candidate to know their own state status.

**Questions that change with it.** 81 in [`src/data/questions/unethical-ia.ts`](src/data/questions/unethical-ia.ts); 114 in [`src/data/questions/recent-updates.ts`](src/data/questions/recent-updates.ts)

**Resolution.** Verified: roughly two dozen jurisdictions had adopted by early 2026, with adoption beginning in 2023 and continuing every year since. The 12 credit / 6 Products and Practice / 6 Ethics split is stable and remains the tested fact. The chapter now says exactly that - credit split is the fact to learn, adoption count is a moving number to check against your own state - and makes the practical consequence explicit, that an IAR registered only in a non-adopting state has no IAR CE obligation at all though a single rulemaking can change that. Deliberately phrased as 'roughly two dozen' rather than a hard count, since the number goes stale within months and a wrong count is worse than an approximate one.

## Scope or nuance

> The rule is right but its boundary is easy to state too broadly or too narrowly.

<a id="hearing-timing"></a>

### Direction of the 15-day hearing clock

**Status:** Corrected · **Item id:** `hearing-timing`

**Chapter:** [USA Foundations](src/data/topics/usa-foundations.ts) — topic id `usa-foundations` · [read in the app](https://rivendale.github.io/series63-study-hub/#/curriculum/usa-foundations)

**The app asserts.** On a written request, the Administrator sets the matter down for hearing within 15 days of receiving it. The model act sets no deadline for making the request.

**Why it is flagged.** Three of the four places this appeared had the clock running the other way, as a countdown for the party to ask.

**To verify.** Confirm your state has not adopted a different period — Nebraska, for one, uses thirty business days.

**Questions that change with it.** 5 in [`src/data/questions/usa-foundations.ts`](src/data/questions/usa-foundations.ts)

**Resolution.** The statutory language is that "within fifteen days after the receipt of a written request the matter will be set down for hearing" — the Administrator's deadline to schedule, not the registrant's deadline to ask. Only the Administrative Actions chapter had it right; the USA Foundations chapter, the cheat sheet, and question 5 all had it reversed, and question 5's stem was built on the reversed reading. The stem was rewritten to ask the correct question, keeping the same choices and the same key.

<a id="discretion-scope"></a>

### Written DPOA stated as an unscoped absolute

**Status:** Corrected · **Item id:** `discretion-scope`

**Chapter:** [Unethical IA/IAR Practices](src/data/topics/unethical-ia.ts) — topic id `unethical-ia` · [read in the app](https://rivendale.github.io/series63-study-hub/#/curriculum/unethical-ia)

**The app asserts.** A BD agent needs the written DPOA in hand first. An IA may begin on oral authority with written authorization due within 10 business days of the first transaction.

**Why it is flagged.** The corpus stated "written DPOA required" as an absolute in five places and never mentioned the adviser exception at all, so a student applying the agent rule to an adviser would get it backwards.

**To verify.** Confirm the 10-business-day window runs from the first transaction rather than from account opening.

**Questions that change with it.** 115 in [`src/data/questions/unethical-ia.ts`](src/data/questions/unethical-ia.ts)

**Resolution.** Verified against NASAA Model Rule 102(a)(4)-1: an adviser may not exercise discretion without written authority obtained within ten business days after the date of the first transaction placed under oral authority, with time and price discretion on a definite amount of a specified security carved out for both. This is the same rule that was found reversed in the Series 65 repo, which is what prompted looking here. All five blanket sites scoped to BD agents, the IA rule added with a comparison table, and question 115 added so the distinction is drilled rather than merely stated.

<a id="coordination-conditions"></a>

### Registration by coordination: the three conditions

**Status:** Corrected · **Item id:** `coordination-conditions`

**Chapter:** [Securities Registration](src/data/topics/securities-registration.ts) — topic id `securities-registration` · [read in the app](https://rivendale.github.io/series63-study-hub/#/curriculum/securities-registration)

**The app asserts.** Effective simultaneously with federal effectiveness, provided the statement has been on file 10 days, the pricing statement 2 full business days, and no stop order is pending.

**Why it is flagged.** The app taught simultaneity as unconditional, which is true as far as it goes but omits where the testable content actually lives.

**To verify.** Adopting states may lengthen the filing period, so confirm your state before relying on the ten days.

**Questions that change with it.** 82 in [`src/data/questions/securities-registration.ts`](src/data/questions/securities-registration.ts)

**Resolution.** Added to the chapter, the pitfall, the key term, the cheat sheet and question 82. The pitfall in particular would have contradicted the new chapter text had it kept asserting unconditional simultaneity — brought into line in the same pass rather than left to be found later.

<a id="private-placement-offerees"></a>

### Private placement limit counts offerees, not buyers

**Status:** Corrected · **Item id:** `private-placement-offerees`

**Chapter:** [Exempt Transactions](src/data/topics/exempt-transactions.ts) — topic id `exempt-transactions` · [read in the app](https://rivendale.github.io/series63-study-hub/#/curriculum/exempt-transactions)

**The app asserts.** An offer directed to no more than 10 non-institutional persons in 12 months. The count is of offerees; offers to institutions are unlimited.

**Why it is flagged.** The chapter and its pitfall both said "11+ non-institutional buyers blows the exemption", which understates the strictness of the rule in the direction that matters.

**To verify.** Confirm the model-act figure is what your state uses — Massachusetts allows twenty-five.

**Questions that change with it.** 93 in [`src/data/questions/exempt-transactions.ts`](src/data/questions/exempt-transactions.ts)

**Resolution.** USA 402(b)(9) exempts a transaction pursuant to an offer directed to not more than ten persons other than institutional investors during any twelve consecutive months. The count is therefore of OFFEREES: an eleventh retail person who is merely offered the security breaks the exemption even if they never buy, while ten offers producing ten sales are inside the limit. Corrected in the chapter, the pitfall and question 93.

<a id="record-retention-periods"></a>

### Recordkeeping retention periods given as ranges

**Status:** Corrected · **Item id:** `record-retention-periods`

**Chapter:** [Communications and Recordkeeping](src/data/topics/communications.ts) — topic id `communications` · [read in the app](https://rivendale.github.io/series63-study-hub/#/curriculum/communications)

**The app asserts.** A table giving BD order tickets as 3–6 years and communications as 3–5 years, against a flat 5 years for IA records, with prose adding "first 2 in office".

**Why it is flagged.** The ranges collapse several different record types into one row, so a student cannot tell which record carries which period. The IA row also omits the accessible-location condition that the prose mentions, so the table and the text disagree in emphasis.

**To verify.** Decide whether to split the rows by record type and state a single period for each, or keep the ranges and say explicitly that the period depends on the record.

**Questions that change with it.** 100 in [`src/data/questions/security-definition.ts`](src/data/questions/security-definition.ts)

**Resolution.** The ranges were hiding two different regimes behind one table. Split them. Broker-dealers under SEC Rule 17a-4: six years for blotters, general ledgers, position records and customer account information; three years for correspondence, confirmations and most operational records; life of the firm plus three for organizational documents - with the first two years easily accessible throughout. Investment advisers under Advisers Act Rule 204-2 and the parallel NASAA model rule: a flat five years with the first two in an appropriate office of the adviser. The chapter now states the discriminator plainly, that five is the adviser number while three or six is the broker-dealer number, and question 100's explanation carries the same contrast rather than the previous vague 'life + 6'.

<a id="brochure-federal-state-split"></a>

### Brochure delivery: NASAA rule stated without the federal counterpart

**Status:** Corrected · **Item id:** `brochure-federal-state-split`

**Chapter:** [Investment Adviser Registration](src/data/topics/ia-registration.ts) — topic id `ia-registration` · [read in the app](https://rivendale.github.io/series63-study-hub/#/curriculum/ia-registration)

**The app asserts.** 48+ hours before the contract, or at signing with a 5-business-day right to rescind; annual delivery within 120 days of fiscal year end.

**Why it is flagged.** This is the NASAA model rule for state-registered advisers. The federal rule for an SEC-registered adviser requires delivery at or before entry into the contract with no rescission right, and the app does not mention it. Defensible for a state-law exam, but a federal covered fact pattern would catch a student out.

**To verify.** Decide whether the Series 63 scope warrants naming the federal rule alongside the state one.

**Questions that change with it.** 68 in [`src/data/questions/ia-registration.ts`](src/data/questions/ia-registration.ts)

**Resolution.** Worth stating, because the omission was the kind that produces a confidently wrong answer rather than a blank. The 48-hour / 5-day pairing is the NASAA model rule for STATE-REGISTERED advisers and remains the Series 63 answer. The federal rule under Advisers Act Rule 204-3, governing an SEC-registered federal covered adviser, was amended in 2010 to require delivery before or at the time of entering into the contract with no rescission right at all; the annual 120-day obligation applies under both. Added to the chapter and to question 68 with the tell spelled out - a stem naming a federal covered adviser is not asking for the 48 hours. Note this item originally pointed at question 64, which is about wrap-fee special compensation and has nothing to do with brochures; the pointer has been corrected to 68.

<a id="evep-details"></a>

### Exam Validity Extension Program specifics

**Status:** Confirmed · **Item id:** `evep-details`

**Chapter:** [Recent Regulatory Updates (2022–2026)](src/data/topics/recent-updates.ts) — topic id `recent-updates` · [read in the app](https://rivendale.github.io/series63-study-hub/#/curriculum/recent-updates)

**The app asserts.** Eligibility requires at least 1 year of registration before termination, opt-in within 2 years, FINRA MQP enrollment for AG EVEP, and a \$35 annual fee per program.

**Why it is flagged.** Program mechanics and fees are administrative details that change without any change in law, and a dollar figure of this kind is the sort of thing that quietly goes stale.

**To verify.** Confirm the fee and the enrollment conditions currently, and decide whether the fee is worth stating at all given how it drifts.

**Questions that change with it.** None — this one is chapter text only.

**Resolution.** Every figure verified and all correct: \$35 annually per program, so \$70 for someone opting into both AG and IAR EVEP; at least one year of registration in the terminated category immediately before termination; election within two years of termination; and enrolment in good standing in FINRA's Maintaining Qualifications Program, which carries its own \$100 annual fee. The concern that an administrative fee would quietly drift is reasonable in principle but has not materialised here, and the figure is cheap to re-check. Left stated rather than removed. No content change.

## Feeding corrections back

A correction is not finished when the chapter is right. Every question written from a rule repeats it — in the stem, in the keyed answer index, and in the explanation — and the explanation is the part a student reads most carefully.

This is not hypothetical. One chapter stated the oral-discretion grace period backwards. The error propagated into a question that keyed the wrong choice and then taught the reversal in its explanation, so a student who read the chapter, answered the question, and read the feedback met the same mistake three times and had it confirmed twice. The `questionIds` field exists because of that.

**A half-applied correction is worse than no correction.** Fix the chapter and leave the question, and the surviving instance now stands alone and unqualified — the student has no contradiction to notice, just a wrong rule delivered with the app's full authority in the one place they are being graded on it.

### Where each piece lives

| What | File |
|---|---|
| The rule, as taught | `src/data/topics/<topic-id>.ts` — linked on every item above |
| The questions built on it | `src/data/questions/<module>.ts` — the ids are listed on every item |
| The flag itself | [`src/data/reviewItems.ts`](src/data/reviewItems.ts) |
| Thresholds repeated out of context | [`src/pages/CheatSheet.tsx`](src/pages/CheatSheet.tsx), plus any `keyTerms` or `formulas` entry in the topic module |

### The loop

1. **Correct the chapter** in its topic module. If the point is genuinely contested, say so in the text rather than picking a side silently.
2. **Work every id in `questionIds`.** For each one check the stem, the `answer` index, and the `exp` string. A rule reversal usually means all three move; changing only `answer` leaves an explanation that argues for the old answer.
3. **Grep for the figure.** A dollar threshold or day count often also appears on the cheat sheet, in a `confusions` row, or in a chapter that cross-references this one.
4. **Update the item** in `src/data/reviewItems.ts`: set `status` to `confirmed` (the app was right) or `corrected` (it was not), and write a `resolution` saying what was checked and against what. A confirmed item is a finding worth keeping — it stops the same question being reopened next year.
5. **Regenerate this file:** `npm run review:md`. It is not part of `npm run build`, so it will not update itself.
6. **Build:** `npm run lint && npm run build`.

Do not edit `REVIEW.md` by hand — the next regeneration discards it, and the in-app `/review` page would never have shown the change anyway.

### Every affected question, in one place

13 questions across the whole list. If a question appears against two items, both rules have to be settled before it is safe to touch.

| Question | Module | Item |
|---:|---|---|
| 5 | [`src/data/questions/usa-foundations.ts`](src/data/questions/usa-foundations.ts) | [Direction of the 15-day hearing clock](#hearing-timing) |
| 46 | [`src/data/questions/admin-actions.ts`](src/data/questions/admin-actions.ts) | [Criminal penalty maximums](#criminal-penalties) |
| 47 | [`src/data/questions/admin-actions.ts`](src/data/questions/admin-actions.ts) | [Civil statute of limitations](#statute-of-limitations) |
| 48 | [`src/data/questions/admin-actions.ts`](src/data/questions/admin-actions.ts) | [Statutory disqualification: felony and misdemeanor lookback](#felony-window) |
| 49 | [`src/data/questions/admin-actions.ts`](src/data/questions/admin-actions.ts) | [Statutory disqualification: felony and misdemeanor lookback](#felony-window) |
| 68 | [`src/data/questions/ia-registration.ts`](src/data/questions/ia-registration.ts) | [Brochure delivery: NASAA rule stated without the federal counterpart](#brochure-federal-state-split) |
| 73 | [`src/data/questions/unethical-ia.ts`](src/data/questions/unethical-ia.ts) | [Qualified client thresholds](#qualified-client) |
| 81 | [`src/data/questions/unethical-ia.ts`](src/data/questions/unethical-ia.ts) | [IAR continuing education adoption status](#iar-ce-adoption) |
| 82 | [`src/data/questions/securities-registration.ts`](src/data/questions/securities-registration.ts) | [Registration by coordination: the three conditions](#coordination-conditions) |
| 93 | [`src/data/questions/exempt-transactions.ts`](src/data/questions/exempt-transactions.ts) | [Private placement limit counts offerees, not buyers](#private-placement-offerees) |
| 100 | [`src/data/questions/security-definition.ts`](src/data/questions/security-definition.ts) | [Recordkeeping retention periods given as ranges](#record-retention-periods) |
| 114 | [`src/data/questions/recent-updates.ts`](src/data/questions/recent-updates.ts) | [IAR continuing education adoption status](#iar-ce-adoption) |
| 115 | [`src/data/questions/unethical-ia.ts`](src/data/questions/unethical-ia.ts) | [Written DPOA stated as an unscoped absolute](#discretion-scope) |
