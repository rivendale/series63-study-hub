import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Download, Share, SquarePlus } from 'lucide-react';
import { useProgress } from '../hooks/useProgress';
import { isStandalone } from '../core/storage';

/**
 * The offer to install.
 *
 * Installing is not cosmetic for this app. A home screen app gets storage the
 * browser is far less willing to evict — the point that matters most on iOS,
 * where site data written in a browsing context becomes eligible for eviction
 * after about seven days without a visit, and a study cycle runs eight to
 * twelve weeks. It also drops the browser chrome, which is real vertical space
 * on a phone held for an hour at a time.
 *
 * None of that justifies nagging. So the offer appears once, after there is
 * evidence the app is actually being used, and a refusal is permanent.
 */

/* ------------------------------------------------------------------ */
/* The captured install event                                          */
/* ------------------------------------------------------------------ */

interface UserChoice {
  outcome: 'accepted' | 'dismissed';
  platform: string;
}

/** Not in lib.dom: still non-standard, and Chromium-only. */
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<UserChoice>;
  prompt: () => Promise<void>;
}

let deferred: BeforeInstallPromptEvent | null = null;
let installedNow = false;

type Subscriber = () => void;
const subscribers = new Set<Subscriber>();

function emit(): void {
  subscribers.forEach((fn) => fn());
}

function subscribe(fn: Subscriber): () => void {
  subscribers.add(fn);
  return () => {
    subscribers.delete(fn);
  };
}

/**
 * Capture at module scope rather than in an effect.
 *
 * Chrome fires beforeinstallprompt during page load, which on a cold start can
 * land before React has mounted anything. The event fires once per page load
 * and is not replayed, so a listener attached in a mount effect can miss it
 * outright — and a missed event means the install offer silently never exists
 * for that session. This module is imported by Layout, so it evaluates as part
 * of the initial bundle, well before first paint.
 */
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (event: Event) => {
    // Suppressing the browser's own mini-infobar is the price of being allowed
    // to call prompt() later, at a moment that makes sense to the reader.
    event.preventDefault();
    deferred = event as BeforeInstallPromptEvent;
    emit();
  });

  window.addEventListener('appinstalled', () => {
    installedNow = true;
    deferred = null;
    // Installed by any route — our button, the browser menu, a different tab —
    // ends the offer for good.
    remember('installed');
    emit();
  });
}

/* ------------------------------------------------------------------ */
/* Dismissal                                                           */
/* ------------------------------------------------------------------ */

/**
 * Its own localStorage key, deliberately not a field on the progress record.
 * Progress is exported to a file and synced between devices; whether somebody
 * waved away an install bar on one phone is neither that phone's study work nor
 * anything another device should inherit.
 */
const DISMISS_KEY = 'series63_install_prompt';
const DISMISS_SCHEMA = 1 as const;

type DismissReason = 'declined' | 'accepted' | 'installed' | 'unavailable';

interface DismissRecord {
  v: typeof DISMISS_SCHEMA;
  at: number;
  reason: DismissReason;
}

/**
 * Backs up the stored flag. Safari in private mode throws on every write, and
 * without this the bar would reappear on each navigation for exactly the reader
 * who has already said no.
 */
let dismissedInMemory = false;

function remember(reason: DismissReason): void {
  dismissedInMemory = true;
  const record: DismissRecord = { v: DISMISS_SCHEMA, at: Date.now(), reason };
  try {
    window.localStorage.setItem(DISMISS_KEY, JSON.stringify(record));
  } catch {
    // Storage refused. The in-memory flag still holds for this session.
  }
}

function isDismissed(): boolean {
  if (dismissedInMemory) return true;
  if (typeof window === 'undefined') return false;
  try {
    const raw = window.localStorage.getItem(DISMISS_KEY);
    if (!raw) return false;
    // Any readable record means the question was already answered. The reason
    // is recorded for diagnosis, not to re-open the decision.
    const parsed = JSON.parse(raw) as Partial<DismissRecord>;
    return parsed.v === DISMISS_SCHEMA;
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------------ */
/* Platform                                                            */
/* ------------------------------------------------------------------ */

/**
 * iOS never fires beforeinstallprompt and offers no programmatic install, so
 * without this branch the whole feature would be invisible on the one platform
 * where installing actually protects the study record.
 *
 * Every iOS browser is WebKit underneath, and Safari, Chrome and Firefox all
 * reach Add to Home Screen through the system share sheet. Embedded webviews —
 * the in-app browsers in Facebook, Instagram and friends — do not, so they are
 * excluded: pointing at a control that is not on screen is worse than silence.
 */
function detectIosBrowser(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  const isIos =
    /iPad|iPhone|iPod/.test(ua) ||
    // iPadOS 13+ reports itself as a Mac; the touch points give it away.
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if (!isIos) return false;
  if (/FBAN|FBAV|Instagram|Line\/|Twitter|OKApp|Snapchat/i.test(ua)) return false;
  return true;
}

const IS_IOS_BROWSER = detectIosBrowser();

/* ------------------------------------------------------------------ */
/* Engagement                                                          */
/* ------------------------------------------------------------------ */

/**
 * A first-time visitor who has read nothing has no way to judge whether this
 * app is worth a home screen slot, and asking them is the behaviour that makes
 * install prompts hated. Either signal is enough: one topic read through, or a
 * short run of questions answered.
 */
const TOPICS_READ_THRESHOLD = 1;
const ANSWERS_THRESHOLD = 5;

/** Long enough that the bar is never part of the first painted frame. */
const REVEAL_DELAY_MS = 1500;

/* ------------------------------------------------------------------ */

interface InstallPromptProps {
  /**
   * Set while the update card is on screen. Two full-width cards in the same
   * dock, both asking for a decision, is a third of a phone screen and two
   * competing calls to action; the update is the more important of the two, so
   * this offer stands down until it is gone and then reappears after the usual
   * delay.
   */
  suppressed?: boolean;
}

export default function InstallPrompt({ suppressed = false }: InstallPromptProps = {}) {
  const { pathname } = useLocation();
  const { progress } = useProgress();

  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(
    () => deferred
  );
  const [installed, setInstalled] = useState(() => installedNow || isStandalone());
  const [dismissed, setDismissed] = useState(isDismissed);
  const [revealed, setRevealed] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(
    () =>
      subscribe(() => {
        setPromptEvent(deferred);
        setInstalled(installedNow || isStandalone());
        setDismissed(isDismissed());
      }),
    []
  );

  // Desktop Chrome can install while leaving this tab in a browser window, so
  // display-mode is watched rather than only read once at mount.
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia('(display-mode: standalone)');
    const onChange = () => setInstalled(installedNow || isStandalone());
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const engaged =
    Object.keys(progress.topicsRead).length >= TOPICS_READ_THRESHOLD ||
    Object.keys(progress.answers).length >= ANSWERS_THRESHOLD;

  const mode: 'native' | 'ios' | null =
    installed || dismissed
      ? null
      : promptEvent
        ? 'native'
        : IS_IOS_BROWSER
          ? 'ios'
          : null;

  useEffect(() => {
    if (!mode || !engaged || suppressed) {
      setRevealed(false);
      return;
    }
    const timer = window.setTimeout(() => setRevealed(true), REVEAL_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [mode, engaged, suppressed]);

  const dismiss = useCallback(() => {
    remember('declined');
    setDismissed(true);
  }, []);

  const install = useCallback(async () => {
    if (!promptEvent) return;
    setBusy(true);
    try {
      // Called synchronously off the click: the browser requires a live user
      // gesture, so nothing may be awaited before this line.
      await promptEvent.prompt();
      const choice = await promptEvent.userChoice;
      // Declining the browser's own dialog is a decision too, and re-asking
      // after it would be exactly the nagging this component avoids.
      remember(choice.outcome === 'accepted' ? 'accepted' : 'declined');
    } catch {
      // The event is single-use and a refused one is never re-issued.
      remember('unavailable');
    } finally {
      deferred = null;
      setPromptEvent(null);
      setDismissed(true);
      setBusy(false);
    }
  }, [promptEvent]);

  // Never over a question. Returning null rather than being unmounted by the
  // parent keeps the captured install event and the dismissal state alive, so
  // the offer is still there after the quiz instead of lost with the component.
  const inQuiz = pathname.startsWith('/quiz/');

  if (!mode || !engaged || !revealed || inQuiz) return null;

  const card =
    'pointer-events-auto w-full max-w-md rounded-xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/95';
  const primaryButton =
    'flex-1 inline-flex items-center justify-center gap-2 min-h-[44px] px-4 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-60';
  const secondaryButton =
    'inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-4 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800';

  if (mode === 'ios') {
    return (
      <section role="region" aria-label="Add this app to your Home Screen" className={card}>
        <div className="flex items-start gap-3">
          <span
            className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300"
            aria-hidden="true"
          >
            <SquarePlus className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Add to your Home Screen
            </h2>
            <p className="mt-0.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              iOS holds on to saved work far longer for apps opened from the Home
              Screen than for pages in a browser tab. Two taps:
            </p>
            <ol className="mt-2 space-y-1.5 text-xs text-slate-700 dark:text-slate-200">
              <li className="flex items-center gap-2">
                <Share className="h-4 w-4 flex-shrink-0 text-slate-500 dark:text-slate-400" aria-hidden="true" />
                <span>
                  <span className="font-semibold">1.</span> Tap Share in the browser
                  toolbar
                </span>
              </li>
              <li className="flex items-center gap-2">
                <SquarePlus className="h-4 w-4 flex-shrink-0 text-slate-500 dark:text-slate-400" aria-hidden="true" />
                <span>
                  <span className="font-semibold">2.</span> Choose Add to Home Screen
                </span>
              </li>
            </ol>
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <button type="button" onClick={dismiss} className={`${secondaryButton} flex-1`}>
            Got it
          </button>
        </div>
      </section>
    );
  }

  return (
    <section role="region" aria-label="Install this app" className={card}>
      <div className="flex items-start gap-3">
        <span
          className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300"
          aria-hidden="true"
        >
          <Download className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Install for offline study
          </h2>
          <p className="mt-0.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            Adds a Home Screen icon, drops the browser bars, and makes this device
            less likely to throw away your saved progress.
          </p>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={install}
          disabled={busy}
          aria-busy={busy}
          className={primaryButton}
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          {busy ? 'Opening…' : 'Install'}
        </button>
        <button
          type="button"
          onClick={dismiss}
          className={secondaryButton}
          aria-label="No thanks. Do not offer to install again."
        >
          No thanks
        </button>
      </div>
    </section>
  );
}
