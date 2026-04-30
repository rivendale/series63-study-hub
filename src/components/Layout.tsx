import { Link, NavLink, useLocation } from 'react-router-dom';
import { Home, BookOpen, Brain, BarChart3, Info } from 'lucide-react';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const tabs = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/curriculum', label: 'Read', icon: BookOpen, end: false },
  { to: '/topics', label: 'Quiz', icon: Brain, end: false },
  { to: '/progress', label: 'Stats', icon: BarChart3, end: true },
  { to: '/about', label: 'About', icon: Info, end: true },
];

export default function Layout({ children }: Props) {
  const location = useLocation();
  const hideChrome = location.pathname.startsWith('/quiz/');

  return (
    <div className="min-h-full flex flex-col bg-slate-50 dark:bg-slate-950">
      {!hideChrome && (
        <header className="hidden md:block sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
          <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <span className="inline-block w-7 h-7 rounded-md bg-gradient-to-br from-blue-600 to-indigo-700" />
              <span>Series 63 Study Hub</span>
            </Link>
            <nav className="flex items-center gap-1">
              {tabs.map((t) => (
                <NavLink
                  key={t.to}
                  to={t.to}
                  end={t.end}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`
                  }
                >
                  {t.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </header>
      )}

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 md:px-6 py-4 md:py-6 pb-24 md:pb-10">
        {children}
      </main>

      {!hideChrome && (
        <nav
          className="md:hidden fixed bottom-0 inset-x-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 safe-bottom"
          aria-label="Primary"
        >
          <ul className="grid grid-cols-5">
            {tabs.map((t) => {
              const Icon = t.icon;
              return (
                <li key={t.to}>
                  <NavLink
                    to={t.to}
                    end={t.end}
                    className={({ isActive }) =>
                      `flex flex-col items-center justify-center gap-1 py-2 min-h-[56px] text-xs font-medium ${
                        isActive
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-slate-500 dark:text-slate-400'
                      }`
                    }
                    aria-label={t.label}
                  >
                    <Icon className="w-5 h-5" aria-hidden="true" />
                    <span>{t.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </div>
  );
}
