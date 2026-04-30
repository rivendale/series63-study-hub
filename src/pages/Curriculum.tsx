import { topics } from '../data/curriculum';
import TopicCard from '../components/TopicCard';
import { useProgress } from '../hooks/useProgress';

export default function Curriculum() {
  const { progress } = useProgress();
  const ordered = [...topics].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold">Curriculum</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          {topics.length} topics. Tap to read.
        </p>
      </header>
      <div className="grid grid-cols-1 gap-3">
        {ordered.map((t) => (
          <TopicCard
            key={t.id}
            topic={t}
            to={`/curriculum/${t.id}`}
            read={Boolean(progress.topicsRead[t.id])}
          />
        ))}
      </div>
    </div>
  );
}
