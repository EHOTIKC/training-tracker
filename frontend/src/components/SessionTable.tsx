import type { TrainingSession } from '../types';
import SessionItem from './SessionItem';

interface SessionTableProps {
  sessions: TrainingSession[];
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: boolean) => void;
  onTagClick?: (tag: string) => void;
}

export default function SessionTable({
  sessions,
  onDelete,
  onToggleStatus,
  onTagClick,
}: SessionTableProps) {
  if (sessions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-12 text-center transition-colors">
        <p className="text-gray-500 dark:text-gray-400 text-base font-medium">
          No training sessions found. Try adjusting your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sessions.map((session) => (
        <SessionItem
          key={session.id}
          session={session}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
          onTagClick={onTagClick}
        />
      ))}
    </div>
  );
}