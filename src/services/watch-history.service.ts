import { PrismaClient, Prisma } from '@prisma/client';
import { ApiError } from '../utils/api-error';
import { WatchHistoryInput } from '../models/schemas/watch-history.schema';
import { watchHistorySchema } from '../models/schemas/watch-history.schema';

export class WatchHistoryService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createWatchRecord(data: WatchHistoryInput) {
    try {
      const validatedData = watchHistorySchema.parse(data);

      // Check if a record already exists
      const existingRecord = await this.prisma.watch_history.findFirst({
        where: {
          profile_id: validatedData.profile_id,
          content_id: validatedData.content_id,
        },
      });

      if (existingRecord) {
        // Update existing record
        return await this.prisma.watch_history.update({
          where: { history_id: existingRecord.history_id },
          data: {
            watch_time: validatedData.watch_time,
            completed: validatedData.completed,
            watched_at: new Date(),
          },
          include: {
            content: true,
          },
        });
      }

      // Create new record
      return await this.prisma.watch_history.create({
        data: validatedData,
        include: {
          content: true,
        },
      });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to create watch record', 500);
    }
  }

  async getProfileWatchHistory(profileId: number, page: number, limit: number) {
    try {
      const skip = (page - 1) * limit;
      const [history, total] = await Promise.all([
        this.prisma.watch_history.findMany({
          where: { profile_id: profileId },
          include: {
            content: true,
          },
          orderBy: {
            watched_at: 'desc',
          },
          skip,
          take: limit,
        }),
        this.prisma.watch_history.count({
          where: { profile_id: profileId },
        }),
      ]);

      return {
        data: history,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new ApiError('Failed to fetch watch history', 500);
    }
  }

  async updateWatchProgress(historyId: number, data: { watch_time: number; completed: boolean }) {
    try {
      return await this.prisma.watch_history.update({
        where: { history_id: historyId },
        data: {
          watch_time: data.watch_time,
          completed: data.completed,
          watched_at: new Date(),
        },
        include: {
          content: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new ApiError('Watch history record not found', 404);
        }
      }
      throw new ApiError('Failed to update watch progress', 500);
    }
  }

  async getContentWatchStats(contentId: string) {
    try {
      const watchRecords = await this.prisma.watch_history.findMany({
        where: { content_id: contentId },
      });

      const totalWatches = watchRecords.length;
      const completedWatches = watchRecords.filter(record => record.completed).length;
      const averageWatchTime = watchRecords.reduce((acc, record) => acc + record.watch_time, 0) / totalWatches;

      return {
        total_watches: totalWatches,
        completed_watches: completedWatches,
        completion_rate: totalWatches ? (completedWatches / totalWatches) * 100 : 0,
        average_watch_time: averageWatchTime || 0,
      };
    } catch (error) {
      throw new ApiError('Failed to fetch content watch stats', 500);
    }
  }

  async getContinueWatching(profileId: number) {
    try {
      return await this.prisma.watch_history.findMany({
        where: {
          profile_id: profileId,
          completed: false,
        },
        include: {
          content: true,
        },
        orderBy: {
          watched_at: 'desc',
        },
        take: 10,
      });
    } catch (error) {
      throw new ApiError('Failed to fetch continue watching list', 500);
    }
  }
} 