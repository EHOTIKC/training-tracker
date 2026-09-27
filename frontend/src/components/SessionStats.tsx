import type { SessionStatsSummary } from '../types';

interface SessionStatsProps {
  stats: SessionStatsSummary;
}

export default function SessionStats({ stats }: SessionStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-xs transition-colors">
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider mb-1">Total Sessions</p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalSessions}</p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-xs transition-colors">
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider mb-1">Total Duration</p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          {stats.totalDuration} <span className="text-base font-normal text-gray-500 dark:text-gray-400">min</span>
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-xs transition-colors">
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider mb-1">Completed</p>
        <p className="text-3xl font-bold text-green-600 dark:text-green-500">
          {stats.completedCount} <span className="text-base font-normal text-gray-500 dark:text-gray-400">/ {stats.totalSessions}</span>
        </p>
      </div>
    </div>
  );
}