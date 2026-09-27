import { Link } from 'react-router';
import type { TrainingSession } from '../types';

interface SessionItemProps {
  session: TrainingSession;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: boolean) => void;
  onTagClick?: (tag: string) => void;
}

export default function SessionItem({ session, onDelete, onToggleStatus, onTagClick }: SessionItemProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2">
            {session.title}
          </h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            {session.category}
          </span>
        </div>

        {session.tags && session.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {session.tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => onTagClick?.(tag)}
                className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200/60 shadow-xs hover:bg-blue-600 hover:text-white hover:border-transparent active:scale-95 transition-all duration-150 cursor-pointer dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-blue-600 dark:hover:text-white"
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          {session.durationMinutes} minutes
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onToggleStatus(session.id, session.isCompleted)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors border ${
              session.isCompleted
                ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/40'
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            {session.isCompleted ? 'Completed' : 'Mark Done'}
          </button>
          
          <Link
            to={`/edit/${session.id}`}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100 dark:hover:bg-blue-900/30 dark:hover:border-blue-800 dark:hover:text-blue-400"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
          </Link>
          
          <button
            onClick={() => onDelete(session.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100 dark:hover:bg-red-900/30 dark:hover:border-red-800 dark:hover:text-red-400"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}