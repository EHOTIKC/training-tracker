import fs from 'fs/promises';
import path from 'path';
import { SessionQueryParams, TrainingSession, PaginatedResult, SessionStatsSummary } from "../types";

const DATA_FILE = path.resolve('data.json');

export class AppService {

  
  private async readData(): Promise<TrainingSession[]> {
    try {
      const data = await fs.readFile(DATA_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  private async writeData(data: TrainingSession[]): Promise<void> {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  }


public async findSessionById(id: string): Promise<TrainingSession | null> {
  const trainings = await this.readData();
  const session = trainings.find((currentSession) => currentSession.id === id);
  
  return session || null;
}

  public async getAllSession(): Promise<TrainingSession[]> {
    return await this.readData();
  }

  public async getSessions(params: SessionQueryParams): Promise<PaginatedResult<TrainingSession>> {
    const trainings = await this.readData();

    const {
      page = 1,
      limit = 6,
      search = '',
      category = 'all',
      status = 'all',
      tag = '',
      sortBy = 'default',
    } = params;

    let result = trainings.filter((session) => {
      const matchesSearch = !search || session.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'all' || session.category.toLowerCase() === category.toLowerCase();
      const matchesStatus = status === 'all' || (status === 'completed' ? session.isCompleted : !session.isCompleted);
      const matchesTag = !tag || Boolean(session.tags?.some((t) => t.toLowerCase() === tag.toLowerCase()));

      return matchesSearch && matchesCategory && matchesStatus && matchesTag;
    });

    const totalDuration = result.reduce((sum, s) => sum + s.durationMinutes, 0);
    const completedCount = result.filter((s) => s.isCompleted).length;
    const categoryBreakdown = result.reduce<Record<string, number>>((acc, s) => {
      const cat = s.category || 'Other';
      acc[cat] = (acc[cat] || 0) + s.durationMinutes;
      return acc;
    }, {});

    const stats: SessionStatsSummary = {
      totalSessions: result.length,
      totalDuration,
      completedCount,
      categoryBreakdown,
    };

    let sortedResult = [...result];
    if (sortBy === 'duration-asc') {
      sortedResult.sort((a, b) => a.durationMinutes - b.durationMinutes);
    } else if (sortBy === 'duration-desc') {
      sortedResult.sort((a, b) => b.durationMinutes - a.durationMinutes);
    } else if (sortBy === 'title-asc') {
      sortedResult.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'title-desc') {
      sortedResult.sort((a, b) => b.title.localeCompare(a.title));
    }

    const totalItems = sortedResult.length;
    const safePage = Math.max(1, page);
    const safeLimit = Math.max(1, limit);
    const totalPages = Math.ceil(totalItems / safeLimit) || 1;

    const actualPage = Math.min(safePage, totalPages);
    const startIndex = (actualPage - 1) * safeLimit;
    const endIndex = startIndex + safeLimit;

    const paginatedData = sortedResult.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      totalItems,
      totalPages,
      currentPage: actualPage,
      stats,
    };
  }

  public async getCategories(): Promise<string[]> {
    const trainings = await this.readData();
    const categories = trainings.map(s => s.category);
    if (categories.length === 0) {
      return ['Cardio', 'Strength', 'Yoga'];
    }
    return Array.from(new Set(categories));
  }

  public async createSession(dto: Omit<TrainingSession, 'id'>): Promise<TrainingSession> {
    const trainings = await this.readData();
    
    const newSession: TrainingSession = {
      id: Date.now().toString(),
      ...dto,
      tags: dto.tags || []
    };
    
    trainings.push(newSession);
    await this.writeData(trainings);

    return newSession;
  }

  public async updateSession(id: string, updateData: Partial<TrainingSession>): Promise<TrainingSession | null> {
    const trainings = await this.readData();
    const sessionIndex = trainings.findIndex((s) => s.id === id);

    if (sessionIndex === -1) return null;

    const updatedSession: TrainingSession = {
      ...trainings[sessionIndex],
      ...updateData
    } as TrainingSession;

    trainings[sessionIndex] = updatedSession;
    
    await this.writeData(trainings);
    
    return updatedSession;
  }

  public async deleteSession(id: string): Promise<boolean> {
    const trainings = await this.readData();
    const initialLength = trainings.length;

    const filteredTrainings = trainings.filter(session => session.id !== id);
    
    if (filteredTrainings.length === initialLength) return false;

    await this.writeData(filteredTrainings);
    return true;
  }

  public async getStats(): Promise<{ totalSessions: number; totalDuration: number; completedCount: number }> {
    const trainings = await this.readData();
    const completedSessions = trainings.filter(session => session.isCompleted);

    return {
      totalSessions: trainings.length,
      totalDuration: trainings.reduce((total, session) => total + session.durationMinutes, 0),
      completedCount: completedSessions.length,
    };
  }
}