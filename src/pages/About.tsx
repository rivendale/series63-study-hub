import { useProgress } from '../hooks/useProgress';
import { examInfo } from '../data/examInfo';

export default function About() {
  const { progress, setPreferences } = useProgress();
  const { theme, fontSize } = progress.preferences;

  return (
    <div className="space-y-5 max-w-2xl">
      <header>
        <h1 className="text-2xl font-bold">About</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Version {examInfo.version}</p>
      </header>

      <section className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5">
        <h2 className="font-semibold mb-3">Display</h2>

        <div className="mb-4">
          <label className="text-sm font-medium mb-2 block">Theme</label>
          <div className="grid grid-cols-3 gap-2">
            {(['system', 'light', 'dark'] as const).map((t) => (
              <button key={t} type="button" onClick={() => setPreferences({ theme: t })} className={`px-3 py-2 rounded-lg border text-sm font-medium capitalize min-h-[44px] ${theme === t ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300' : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'}`}>{t}</button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Font size</label>
          <div className="grid grid-cols-3 gap-2">
            {(['sm', 'md', 'lg'] as const).map((s) => (
              <button key={s} type="button" onClick={() => setPreferences({ fontSize: s })} className={`px-3 py-2 rounded-lg border text-sm font-medium uppercase min-h-[44px] ${fontSize === s ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300' : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'}`}>{s}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 prose prose-slate dark:prose-invert max-w-none prose-headings:mt-0 prose-p:text-sm">
        <h2>Disclaimers</h2>
        <p>This app is an unofficial study aid for the FINRA/NASAA Series 63 exam. It is not affiliated with FINRA, NASAA, or any commercial prep provider.</p>
        <p>The content is original, derived from publicly available sources including the Uniform Securities Act model law and NASAA Statements of Policy.</p>
        <p>This app is provided &ldquo;as is&rdquo; with no warranty of fitness for any purpose. It is not legal, compliance, or examination advice. Users should consult official FINRA / NASAA materials and licensed exam preparation providers for authoritative guidance.</p>
        <p>Series 63 questions on the actual exam are confidential to FINRA and NASAA. None of the questions in this app are from any actual or proprietary exam bank. They are original questions written from publicly available rule content for educational purposes.</p>
        <p>Created by Nick Rygiel (Co-Founder of Protocol Wealth LLC). Open-source under MIT License.</p>
        <p>Source: <a href="https://github.com/rivendale/series63-study-hub" target="_blank" rel="noopener noreferrer">github.com/rivendale/series63-study-hub</a></p>
      </section>
    </div>
  );
}
