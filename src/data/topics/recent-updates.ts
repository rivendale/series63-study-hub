import type { Topic } from '../curriculum';

export const topic: Topic = {
    id: 'recent-updates',
    title: 'Recent Regulatory Updates (2022–2026)',
    weight: '~3-5%',
    order: 14,
    summary:
      'Post-2020 changes incorporated into the NASAA exam in June 2023: Marketing Rule, SECURE 2.0, IAR CE, EVEP, Reg BI / Form CRS context, and cybersecurity model rule.',
    body: `## Why This Topic Matters

Several post-2020 regulatory changes are now testable on the Series 63. NASAA updated its question bank June 12, 2023 to reflect:

- The SEC's amended Investment Adviser Marketing Rule (compliance Nov 4, 2022)
- The SECURE Act 2.0 (December 29, 2022)
- NASAA cybersecurity model rule
- Continuing education programs (AG EVEP and IAR EVEP)
- Form CRS / Regulation Best Interest (Reg BI) — federal context informing state-level conduct standards

These updates appear within questions throughout the four standard exam categories. Memorizing them gives you points across the exam.

## Investment Adviser Marketing Rule (2022)

The SEC's Marketing Rule (Rule 206(4)-1 under the Advisers Act) replaced the prior advertising and cash solicitation rules. Compliance date: **November 4, 2022**.

### What changed

- Single rule replacing the prior advertising rule and cash solicitation rule
- **Testimonials and endorsements** now permitted with proper disclosures (previously prohibited for IAs)
- Hypothetical, predecessor, related, and extracted performance subject to specific conditions
- Past specific recommendations: still subject to fair-presentation standards
- Mandatory disclosures regarding compensated testimonials/endorsements

### Conditions for testimonials/endorsements

- Clear and prominent disclosure that the person is a client (or not), is being compensated (or not), and any material conflicts
- Written agreement with promoter (limited exceptions for de minimis compensation)
- IA oversight required; promoter cannot be subject to disqualifying events

### State-level treatment

States generally align with the SEC rule, but anti-fraud authority is retained. NASAA Series 63 questions assume the post-November 2022 framework. **Older study materials prohibiting all testimonials are out of date.**

## SECURE Act 2.0 (2022)

Signed December 29, 2022. Series 63 questions assume current law:

- **RMD age** now 73 (raised from 72; rises to 75 in 2033)
- **Catch-up contributions** for ages 60-63: enhanced limits effective 2025
- **Roth catch-up contributions** for high earners ($145K+): delayed implementation
- **529-to-Roth IRA rollovers** permitted with conditions (effective 2024)
- **Saver's Match** replacing Saver's Credit (effective 2027)
- **Auto-enrollment** required for new 401(k) and 403(b) plans
- **Emergency withdrawals** without penalty in certain circumstances
- **Student loan match** to retirement accounts permitted

For Series 63 purposes, questions test agent and IA conduct in the context of these accounts, not the technical retirement plan rules themselves.

## Form CRS and Regulation Best Interest (Federal Context)

While Reg BI is a federal SEC rule (effective June 30, 2020), state exam questions address the standard's interaction with state law:

- **Reg BI** applies to BD recommendations to retail customers — Care, Conflict of Interest, Disclosure, and Compliance Obligations
- **Form CRS** (Customer/Client Relationship Summary) — short-form disclosure required by both BDs and IAs
- States retain authority to enforce stricter conduct standards in some areas
- Some states (e.g., Massachusetts) have adopted state-level fiduciary rules for BDs that go beyond Reg BI

## NASAA Cybersecurity Model Rule

Adopted by NASAA for state-registered IAs:

- Written cybersecurity policies and procedures required
- Annual review and update
- Incident response plan
- Employee training
- Vendor management for service providers
- Recordkeeping of incidents

State-registered IAs subject where adopted; federal covered IAs subject to SEC rules separately.

## IAR Continuing Education (mandatory in adopting states)

NASAA's IAR CE Model Rule:

- **6 credits** of Products and Practice
- **6 credits** of Ethics and Professional Responsibility
- Total: **12 credits annually**
- Failing to complete = registration becomes "CE inactive" — IAR cannot do business until current

## AG EVEP and IAR EVEP (Exam Validity Extension)

Extends exam validity to **up to 5 years** (vs. standard 2) when a person terminates registration but stays current via annual CE.

- **AG EVEP** — Series 63 and Series 66 BD-agent portion
- **IAR EVEP** — Series 65 and Series 66 IAR portion

Eligibility: at least 1 year of registration prior to termination; must opt in within 2 years; AG EVEP requires FINRA MQP enrollment. Annual fee: **$35 per program**.

State-by-state adoption: not all states recognize EVEP.

## What's Still Old / Pre-2022

A few items in study material commonly still reflect the pre-2022 framework:

- **Old testimonial prohibition** for IAs — no longer current
- **Old solicitor rule** — replaced by the unified Marketing Rule
- **Old RMD ages** (70½ before SECURE 1.0; 72 before SECURE 2.0; now 73)`,
    pitfalls: [
      'Testimonials by IAs were historically prohibited but are now permitted (with disclosure) under the post-Nov 2022 Marketing Rule.',
      'RMD age is 73 (post-SECURE 2.0). Older materials saying 70½ or 72 are obsolete.',
      'IAR Continuing Education is mandatory in adopting states — 6 Products/Practice + 6 Ethics = 12 credits annually.',
      'EVEP is OPT-IN, not automatic. Not recognized in all states.',
    ],
    keyTerms: [
      { term: 'Marketing Rule', definition: 'SEC Rule 206(4)-1, replaces former advertising/solicitation rules (Nov 4, 2022)' },
      { term: 'Reg BI', definition: 'Regulation Best Interest, federal SEC rule for BD recommendations to retail' },
      { term: 'Form CRS', definition: 'Customer/Client Relationship Summary, required disclosure' },
      { term: 'SECURE Act 2.0', definition: '2022 retirement legislation, raised RMD age to 73' },
      { term: 'IAR CE', definition: 'Mandatory 12 annual credits (6 Products/Practice + 6 Ethics) where adopted' },
      { term: 'AG EVEP', definition: 'Exam Validity Extension Program for Series 63 / Series 66 BD agent portion' },
      { term: 'IAR EVEP', definition: 'Exam Validity Extension Program for Series 65 / Series 66 IAR portion' },
      { term: 'MQP', definition: "FINRA's Maintaining Qualifications Program" },
    ],
  };
