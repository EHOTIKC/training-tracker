import { useState, useEffect, useCallback } from 'react';
import useDarkMode from '../hooks/useDarkMode';

import type { TrainingSession, SortOption, PaginatedResponse, SessionStatsSummary } from '../types';
import SessionTable from '../components/SessionTable';
import SessionStats from '../components/SessionStats';
import SessionFilters from '../components/SessionFilters';
import Pagination from '../components/Pagination';
import SessionCharts from '../components/SessionCharts';
import SessionCardSkeleton from '../components/SessionCardSkeleton';

import toast from 'react-hot-toast';

export default function SessionsPage() {
  const { theme, toggleTheme } = useDarkMode();
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [selectedTag, setSelectedTag] = useState<string>('');

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const LIMIT = 6;


  const [stats, setStats] = useState<SessionStatsSummary>({
    totalSessions: 0,
    totalDuration: 0,
    completedCount: 0,
    categoryBreakdown: {},
  });

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const onDelete = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/sessions/${id}`, { method: 'DELETE' });
      if (response.ok) {
        toast.success('Session deleted successfully');
        if (sessions.length === 1 && currentPage > 1) {
          setCurrentPage((prev) => prev - 1);
        } else {
          fetchSessions();
        }
      } else {
        toast.error('Failed to delete session');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error.');
    }
  };

  const onToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`${API_BASE_URL}/sessions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isCompleted: !currentStatus }),
      });

      if (response.ok) {
        toast.success('Status updated');
        fetchSessions();
      } else {
        toast.error('Failed to toggle status.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error.');
    }
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag((prevTag) => (prevTag === tag ? '' : tag));
    setCurrentPage(1);
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error('Failed to load categories', err));
  }, []);

  const fetchSessions = useCallback(() => {
    setLoading(true);
    setIsError(false);

    const params = new URLSearchParams({
      page: String(currentPage),
      limit: String(LIMIT),
      search: searchQuery,
      category: selectedCategory,
      status: filterStatus,
      tag: selectedTag,
      sortBy: sortBy,
    });

    fetch(`${API_BASE_URL}/sessions?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load sessions');
        return res.json() as Promise<PaginatedResponse<TrainingSession>>;
      })
      .then((resData) => {
        setSessions(resData.data);
        setTotalPages(resData.totalPages);
        setCurrentPage(resData.currentPage);
        setStats(resData.stats);
      })
      .catch((err) => {
        console.error(err);
        toast.error('Failed to load sessions');
        setSessions([]);
        setTotalPages(1);
        setIsError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [API_BASE_URL, currentPage, searchQuery, selectedCategory, filterStatus, selectedTag, sortBy]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 py-8 px-4 sm:px-6 lg:px-8 antialiased">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex items-center justify-between gap-4 mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white transition-colors truncate">
            Training Dashboard
          </h1>
          
          <button
            onClick={toggleTheme}
            className="px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-medium rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors shrink-0 cursor-pointer"
            aria-label="Toggle Dark Mode"
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>

        <SessionStats stats={stats} />

        <SessionCharts stats={stats} />

        <SessionFilters
          searchQuery={searchQuery}
          setSearchQuery={(query) => { setSearchQuery(query); setCurrentPage(1); }}
          filterStatus={filterStatus}
          setFilterStatus={(status) => { setFilterStatus(status); setCurrentPage(1); }}
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={(cat) => { setSelectedCategory(cat); setCurrentPage(1); }}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {selectedTag && (
          <div className="flex items-center gap-2 mb-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 px-3 py-1.5 rounded-lg w-fit text-sm text-blue-700 dark:text-blue-300">
            <span>Filtered by: <strong>#{selectedTag}</strong></span>
            <button
              onClick={() => { setSelectedTag(''); setCurrentPage(1); }}
              className="font-bold hover:text-blue-900 dark:hover:text-blue-100 leading-none text-base ml-1 cursor-pointer"
            >
              ×
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: LIMIT }).map((_, idx) => (
              <SessionCardSkeleton key={idx} />
            ))}
          </div>
        ) : isError ? (
          <div className="bg-white dark:bg-gray-800 border border-red-200 dark:border-red-900/50 rounded-xl p-8 text-center space-y-4 shadow-xs transition-colors">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 text-xl font-bold">
              !
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">Unable to load sessions</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Could not connect to the backend server. Please check if the server is running.
              </p>
            </div>
            <button
              type="button"
              onClick={fetchSessions}
              className="inline-flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer shadow-xs"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <SessionTable
              sessions={sessions}
              onDelete={onDelete}
              onToggleStatus={onToggleStatus}
              onTagClick={handleTagClick}
            />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </>
        )}

      </div>
    </div>
  );
}