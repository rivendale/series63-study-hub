import type { Topic } from '../curriculum';

export const topic: Topic = {
    id: 'admin-actions',
    title: 'Administrative Actions and Penalties',
    weight: '~7%',
    order: 12,
    summary:
      'Administrator powers, due process, civil rescission, criminal penalties, statute of limitations.',
    body: `## Grounds for Denial / Suspension / Revocation

The Administrator may deny, suspend, or revoke a registration based on:

- **False or misleading filing**
- **Willful USA violation**
- **Criminal conviction** — see the note below on how the two model acts draw the time limit
- Securities-related **injunction** by any court
- **SRO expulsion** or suspension
- **Lack of qualifications** for the role
- **Insolvency** or financial impairment
- **Dishonest or unethical practices**

### Criminal Convictions — know that the two model acts differ

The **1956 act** (§204(a)(2)(B)) reaches a person convicted **within the past 10 years** of any securities-related misdemeanor **or any felony**. The **2002 act** (§412(d)(3)) reaches **any felony with no time limit**, plus a securities-related misdemeanor **within the previous 10 years**.

**Safe ground under either:** a **felony or a securities-related misdemeanor within the past 10 years** is a ground for action. Past 10 years, the answer turns on which act the state adopted, so a question hinging on an old conviction is testing the state's version rather than a universal rule. Note also that the power is **discretionary** — the Administrator *may* deny, never *must*.

## Due Process

Before adverse action:

1. **Written notice** of intended action
2. **Opportunity for hearing** — on a **written request**, the matter is set down for hearing **within 15 days** of the Administrator receiving it
3. **Written findings** of fact and conclusions of law

Read the 15 days in the right direction: it is the time the Administrator has to **set the matter down after a request arrives**, not a deadline for the party to ask. The model act sets **no** deadline for making the request.

In emergencies, the Administrator may issue a **summary order** without prior hearing — but a post-issuance hearing is required, on the same 15-day timetable once requested.

## Civil Rescission Damages

A buyer of an unlawfully sold security may recover:

- **Original principal**, PLUS
- **Interest at the legal rate** from date of payment, MINUS
- **Income received** (dividends, interest), PLUS
- **Reasonable attorneys' fees and costs**

Lost profits are **NOT** recoverable.

## Criminal Penalties

For **willful** violations of the USA:

- Up to **$5,000 fine**, AND/OR
- Up to **3 years imprisonment**

— per violation.

**No criminal liability** if the person had **no knowledge** of the rule or order violated.

(Federal under the '33/'34/'40 Acts is significantly higher.)

## Statute of Limitations

The two model acts set **different** civil periods. Learn the structure first, then the numbers:

| | Civil limitations period |
| --- | --- |
| **1956 act** (§410(f)) | the **earlier** of **3 years after the contract of sale** — or after the **rendering of investment advice** — or **2 years after discovery** of the facts constituting the violation |
| **2002 act** (§509(j)) | the **earlier** of **2 years after discovery** of the facts constituting the violation or **5 years after the violation** |

Most states still operate under statutes based on the **1956 act**, so **3 and 2** is the pair to reach for absent a fact pattern pointing elsewhere.

The structure is the same in both, and it is what the question usually turns on: the period runs from the **earlier** of a **conduct** trigger and a **discovery** trigger. Discovery can only **shorten** the window, never extend it. A buyer who discovers the violation four years after the sale is out of time under the 1956 act even though the discovery was yesterday; a buyer who spotted it on day one has **2** years, not 3. "Whichever first occurs" is doing the work — a plaintiff cannot revive a stale claim by pleading late discovery.

Note the 1956 act's second conduct trigger: **the rendering of investment advice**, not only a contract of sale. An advisory claim is timed from when the advice was given, so the clock runs against an adviser who never sold the client anything.

**Criminal** cases run on their own clock — the 1956 act bars an indictment or information more than **5 years** after the alleged violation. Do not carry the civil figure across to the criminal side.

## Cease-and-Desist Orders

The Administrator may issue cease-and-desist orders. In emergencies, these may be summary (no prior hearing) — but always with post-issuance hearing rights.

## Consent to Service of Process

Every registrant files an **irrevocable consent** appointing the Administrator as agent for service of process for any action under the USA.`,
    pitfalls: [
      'A conviction within the past 10 years — felony or securities-related misdemeanor — is a ground under either model act. Past 10 years the acts diverge: the 1956 act cuts off both, the 2002 act keeps any felony forever. Nothing here is automatic; the Administrator MAY act, never must.',
      'Lost profits are NOT recoverable in civil rescission. Principal + interest - income + fees only.',
      'FINRA suspension is grounds for state denial, not automatic state suspension.',
      'Knowledge of the rule is required for criminal liability — strict liability does not apply criminally.',
    ],
    keyTerms: [
      { term: 'Civil rescission', definition: "Principal + legal interest - income received + attorneys' fees" },
      { term: 'SOL', definition: '1956 act §410(f) — the earlier of 3 years from the contract of sale or the rendering of investment advice, or 2 years from discovery. Not "3 years from the violation": the trigger is the sale or the advice.' },
      { term: 'Summary order', definition: 'Emergency cease-and-desist without prior hearing' },
      { term: 'Statutory disqualification', definition: 'Felony or securities-related misdemeanor within the past 10 years (1956 act); the 2002 act drops the time limit for felonies' },
    ],
  };
