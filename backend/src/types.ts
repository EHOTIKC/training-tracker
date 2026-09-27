export interface TrainingSession {
  id: string;
  title: string;
  category: string;
  durationMinutes: number;
  isCompleted: boolean;
  tags: string[];
}

export interface SessionQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
  tag?: string;
  sortBy?: string;
}


export interface SessionStatsSummary {
  totalSessions: number;
  totalDuration: number;
  completedCount: number;
  categoryBreakdown: Record<string, number>;
}

export interface PaginatedResult<T> {
  data: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  stats: SessionStatsSummary;
}