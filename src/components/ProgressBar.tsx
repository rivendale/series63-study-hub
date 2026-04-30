interface Props {
  value: number;
  className?: string;
  color?: 'blue' | 'emerald' | 'amber' | 'red';
}

const colorMap = {
  blue: 'bg-blue-600',
  emerald: 'bg-emerald-600',
  amber: 'bg-amber-500',
  red: 'bg-red-600',
};

export default function ProgressBar({
  value,
  className = '',
  color = 'blue',
}: Props) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      className={`w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden ${className}`}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`h-full ${colorMap[color]} transition-all duration-300`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
