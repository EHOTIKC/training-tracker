export interface TrainingSession {
  id: string;
  title: string;
  category: string;
  durationMinutes: number;
  isCompleted: boolean;
  tags: string[];
}

export interface SessionStatsSummary {
  totalSessions: number;
  totalDuration: number;
  completedCount: number;
  categoryBreakdown: Record<string, number>;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  stats: SessionStatsSummary;
}


export type SortOption = 'default' | 'duration-asc' | 'duration-desc' | 'title-asc' | 'title-desc';