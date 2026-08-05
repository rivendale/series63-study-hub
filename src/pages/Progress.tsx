import { useState } from 'react';
import { Download, Trash2, AlertTriangle, LifeBuoy } from 'lucide-react';
import {
  useProgress,
  getRecoveryNotice,
  getWriteStatus,
  readQuarantinedRecord,
  discardQuarantinedRecord,
} from '../hooks/useProgress';
import { overallStats, statsByTopic } from '../lib/stats';
import ProgressBar from '../components/ProgressBar';
import { examInfo } from '../data/examInfo';

export default function ProgressPage() {
  const { progress, resetAll, exportJson } = useProgress();
  // Read once on mount: both are decided during module load, before render.
  const [recovery, setRecovery] = useState(() => getRecoveryNotice());
  const writeStatus = getWriteStatus();

  const downloadQuarantined = () => {
    const raw = readQuarantinedRecord();
    if (!raw) return;
    const url = URL.createObjectURL(new Blob([raw], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `series63-unreadable-progress-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const overall = overallStats(progress);
  const stats = statsByTopic(progress);
  const [confirming, setConfirming] = useState(false);

  const download = () => {
    const blob = new Blob([exportJson()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `series63-progress-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold">Progress</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Your study stats. All data is stored locally in your browser.
        </p>
      </header>

      <section className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5">
        <h2 className="font-semibold mb-3">Overall</h2>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-3">
            <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Answered</div>
            <div className="text-2xl font-bold mt-0.5">{overall.answered}</div>
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-3">
            <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Correct</div>
            <div className="text-2xl font-bold mt-0.5">{overall.correct}</div>
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-3">
            <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Accuracy</div>
            <div className="text-2xl font-bold mt-0.5">{overall.pct}%</div>
          </div>
        </div>
        <ProgressBar value={overall.pct} color={overall.pct >= 80 ? 'emerald' : overall.pct >= 60 ? 'blue' : overall.pct >= 40 ? 'amber' : 'red'} />
      </section>

      <section className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5">
        <h2 className="font-semibold mb-3">By topic</h2>
        <ul className="space-y-3">
          {stats.map((s) => (
            <li key={s.id}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{s.title}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">{s.answered}/{s.total} &middot; {s.pct}%</span>
              </div>
              <ProgressBar value={s.pct} color={s.pct >= 80 ? 'emerald' : s.pct >= 60 ? 'blue' : s.pct >= 40 ? 'amber' : 'red'} />
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5">
        <h2 className="font-semibold mb-3">Mock exam history</h2>
        {progress.mockAttempts.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">No mock attempts yet.</p>
        ) : (
          <ul className="space-y-2">
            {progress.mockAttempts.map((m) => (
              <li key={m.ts} className="flex items-center justify-between text-sm border-t border-slate-100 dark:border-slate-800 pt-2 first:border-0 first:pt-0">
                <div>
                  <div className="font-medium">{new Date(m.ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{m.correct}/{m.total} &middot; {Math.round(m.timeUsed / 60000)} min</div>
                </div>
                <span className={`text-sm font-semibold px-2 py-0.5 rounded-full ${m.pct >= examInfo.passPercentage ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'}`}>{m.pct}%</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5">
        <h2 className="font-semibold mb-3">Data</h2>

        {writeStatus === 'failing' && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-red-300 dark:border-red-900/60 bg-red-50 dark:bg-red-950/40 p-3"
          >
            <p className="flex items-start gap-2 text-sm font-semibold text-red-900 dark:text-red-200">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
              Progress is not being saved
            </p>
            <p className="mt-1 text-sm text-red-900/90 dark:text-red-200/90">
              This browser refused to write to local storage, so anything you do
              now will be lost when you close the tab. Export a copy, then free
              up space or check whether the browser is blocking site data.
            </p>
          </div>
        )}

        {recovery && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-amber-300 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/30 p-3"
          >
            <p className="flex items-start gap-2 text-sm font-semibold text-amber-900 dark:text-amber-200">
              <LifeBuoy className="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
              An earlier progress record could not be read
            </p>
            <p className="mt-1 text-sm text-amber-900/90 dark:text-amber-200/90">
              {recovery.reason === 'foreign-schema'
                ? 'It was written in a format this version does not recognise'
                : 'It was damaged, most likely by an interrupted save'}
              {recovery.preserved
                ? ', so it has been set aside rather than overwritten. Download it if you want to keep it — a future version may be able to read it.'
                : '. A copy could not be set aside because storage is full, so download it now if you want to keep it.'}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={downloadQuarantined}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold bg-amber-600 text-white hover:bg-amber-700 min-h-[44px]"
              >
                <Download className="w-4 h-4" aria-hidden="true" />
                Download it
              </button>
              <button
                type="button"
                onClick={() => {
                  discardQuarantinedRecord();
                  setRecovery(null);
                }}
                className="px-3 py-2 rounded-lg text-sm font-semibold bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-900/60 text-amber-900 dark:text-amber-200 min-h-[44px]"
              >
                Discard
              </button>
            </div>
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-3">
          <button type="button" onClick={download} className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 min-h-[44px]">
            <Download className="w-4 h-4" />
            Export progress
          </button>
          {!confirming ? (
            <button type="button" onClick={() => setConfirming(true)} className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold bg-white dark:bg-slate-900 border border-red-300 text-red-700 dark:text-red-400 hover:bg-red-50 min-h-[44px]">
              <Trash2 className="w-4 h-4" />
              Reset all progress
            </button>
          ) : (
            <div className="flex gap-2">
              <button type="button" onClick={() => { resetAll(); setConfirming(false); }} className="px-4 py-3 rounded-lg font-semibold bg-red-600 text-white hover:bg-red-700 min-h-[44px]">Confirm reset</button>
              <button type="button" onClick={() => setConfirming(false)} className="px-4 py-3 rounded-lg font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 min-h-[44px]">Cancel</button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
