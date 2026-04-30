import { Link } from 'react-router-dom';
import { Clock, Award, FileText, AlertTriangle } from 'lucide-react';
import { examInfo } from '../data/examInfo';
import { OFFICIAL_CATEGORIES } from '../data/categories';

interface ThresholdRow {
  rule: string;
  threshold: string;
}

const thresholds: ThresholdRow[] = [
  { rule: 'Federal covered IA AUM', threshold: '$110M+' },
  { rule: 'State-registered IA AUM', threshold: '< $100M' },
  { rule: 'Buffer band (IA may choose)', threshold: '$100M – $110M' },
  { rule: 'Multi-state IA exemption', threshold: '15+ states' },
  { rule: 'Qualified client AUM', threshold: '$1.1M with the IA' },
  { rule: 'Qualified client net worth', threshold: '$2.2M (excl. primary residence)' },
  { rule: 'Commercial paper denomination', threshold: '≥ $50,000' },
  { rule: 'Commercial paper maturity', threshold: '≤ 9 months (270 days)' },
  { rule: 'Private placement non-institutional limit', threshold: '≤ 10 in 12 months' },
  { rule: 'Pre-organization subscription limit', threshold: '≤ 10 subscribers' },
  { rule: 'Custody check holding', threshold: '≤ 3 business days = not custody' },
  { rule: 'Brochure delivery', threshold: '48+ hrs before contract OR 5-day rescission' },
  { rule: 'Brochure annual delivery', threshold: 'Within 120 days of fiscal year end' },
  { rule: 'Form U5 filing', threshold: 'Within 30 days of termination' },
  { rule: 'Hearing request', threshold: 'Within 15 days of notice' },
  { rule: 'Securities registration period', threshold: 'Typically 1 year' },
  { rule: 'Statute of limitations', threshold: '3 yrs from violation OR 2 yrs from discovery' },
  { rule: 'Criminal penalty per willful violation', threshold: '$5,000 / 3 yrs' },
  { rule: 'RMD age (post-SECURE 2.0)', threshold: '73 (rises to 75 in 2033)' },
  { rule: 'IAR CE credits', threshold: '12 annually (6 Products + 6 Ethics)' },
  { rule: 'EVEP exam validity extension', threshold: 'Up to 5 years' },
  { rule: 'EVEP annual fee', threshold: '$35 per program' },
];

interface RuleRow {
  rule: string;
}

const topRules: RuleRow[] = [
  { rule: 'An "agent" is always an individual, never a firm.' },
  { rule: 'Anti-fraud applies to ALL securities, transactions, and persons — no exemption.' },
  { rule: 'BD agents have NO de minimis exemption (only IARs of federal covered IAs do).' },
  { rule: 'Place of business in a state ALWAYS triggers registration.' },
  { rule: 'Wealthy individuals are NEVER institutional investors regardless of net worth.' },
  { rule: 'Bank holding companies are NOT banks for BD/IA exclusion purposes.' },
  { rule: 'Variable annuities ARE securities. Fixed annuities are NOT.' },
  { rule: 'Discretionary trades without written DPOA are unauthorized — even if profitable AND suitable.' },
  { rule: 'Time/price discretion does NOT need DPOA. Full discretion DOES.' },
  { rule: 'IAs are FIDUCIARIES (loyalty + care). BDs follow suitability + Reg BI.' },
  { rule: 'Performance fees require qualified-client status ($1.1M AUM with IA OR $2.2M net worth excl. primary residence).' },
  { rule: 'Custody is triggered by holding client check (any period) or 3+ days of third-party check.' },
  { rule: 'Reg D Rule 504 is NOT federal covered. Rule 506 IS.' },
  { rule: 'Coordination becomes effective at the SAME moment as federal — not 30 days later.' },
  { rule: 'Lost profits are NOT recoverable in civil rescission.' },
  { rule: 'Securities-related misdemeanors have NO time limit; non-securities felonies have a 10-year window.' },
  { rule: 'Trustees of LIVING trusts are NOT court-appointed fiduciaries.' },
  { rule: 'Selling away requires prior written notice and approval.' },
  { rule: 'IAR registration is ALWAYS state level, even for federal covered IAs.' },
  { rule: 'Marketing Rule (post-Nov 2022) permits IA testimonials with proper disclosure.' },
];

export default function CheatSheet() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <header>
        <h1 className="text-2xl font-bold">Cheat Sheet</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Last-minute reference. Not a substitute for the curriculum, but everything here is
          tested.
        </p>
      </header>

      <section className="rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-5">
        <div className="flex items-center gap-2 mb-3">
          <Award className="w-5 h-5" />
          <h2 className="font-semibold text-lg">Exam structure</h2>
        </div>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-white/70 text-xs uppercase tracking-wide">Total questions</dt>
            <dd className="font-semibold text-lg">{examInfo.totalQuestions}</dd>
          </div>
          <div>
            <dt className="text-white/70 text-xs uppercase tracking-wide">Scored</dt>
            <dd className="font-semibold text-lg">
              {examInfo.scoredQuestions} (+{examInfo.pretestQuestions} pretest)
            </dd>
          </div>
          <div>
            <dt className="text-white/70 text-xs uppercase tracking-wide">Time</dt>
            <dd className="font-semibold text-lg">{examInfo.timeMinutes} min</dd>
          </div>
          <div>
            <dt className="text-white/70 text-xs uppercase tracking-wide">Pass</dt>
            <dd className="font-semibold text-lg">
              {examInfo.passingScore}/60 ({examInfo.passPercentage}%)
            </dd>
          </div>
        </dl>
        <p className="mt-3 text-xs text-white/80">
          Sponsor: {examInfo.sponsor} · Test center: {examInfo.testCenter}
        </p>
      </section>

      <section className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="font-semibold text-lg">NASAA blueprint (60 scored questions)</h2>
        </div>
        <ul className="space-y-2">
          {Object.values(OFFICIAL_CATEGORIES)
            .sort((a, b) => b.questions - a.questions)
            .map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="text-slate-700 dark:text-slate-300">{c.name}</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {c.questions} ({c.pct}%)
                </span>
              </li>
            ))}
        </ul>
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
          Drill BD/Agents and Remedies first — together that&rsquo;s 82% of the exam.
        </p>
      </section>

      <section className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-5 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="font-semibold text-lg">Thresholds and time limits</h2>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300">
              <tr>
                <th className="text-left font-semibold px-5 py-2">Rule</th>
                <th className="text-left font-semibold px-5 py-2">Threshold</th>
              </tr>
            </thead>
            <tbody>
              {thresholds.map((t, i) => (
                <tr
                  key={i}
                  className="border-t border-slate-100 dark:border-slate-800"
                >
                  <td className="px-5 py-2 text-slate-700 dark:text-slate-300">
                    {t.rule}
                  </td>
                  <td className="px-5 py-2 font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap">
                    {t.threshold}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 p-5">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-5 h-5 text-amber-700 dark:text-amber-300" />
          <h2 className="font-semibold text-lg text-amber-900 dark:text-amber-200">
            20 most-tested rules
          </h2>
        </div>
        <ol className="space-y-2 text-sm text-amber-900 dark:text-amber-100/90 list-decimal list-inside">
          {topRules.map((r, i) => (
            <li key={i}>{r.rule}</li>
          ))}
        </ol>
      </section>

      <p className="text-center text-sm">
        <Link to="/glossary" className="text-blue-600 dark:text-blue-400 hover:underline">
          Open the full glossary →
        </Link>
      </p>
    </div>
  );
}
