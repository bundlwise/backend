import { Prisma } from '@prisma/client';
import { BaseRepository } from './base.repository';
import { ApiError } from '../utils/api-error';
import { WatchHistoryInput } from '../models/schemas/watch-history.schema';

export class WatchHistoryRepository extends BaseRepository {
  async findByProfileAndContent(profileId: number, contentId: string) {
    try {
      return await this.prisma.watch_history.findFirst({
        where: {
          profile_id: profileId,
          content_id: contentId,
        },
        include: {
          content: true,
        },
      });
    } catch (error) {
      throw new ApiError('Database error while fetching watch history', 500);
    }
  }

  async findByProfile(profileId: number, page: number, limit: number) {
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

      return { history, total };
    } catch (error) {
      throw new ApiError('Database error while fetching watch history', 500);
    }
  }

  async create(data: WatchHistoryInput) {
    try {
      return await this.prisma.watch_history.create({
        data,
        include: {
          content: true,
        },
      });
    } catch (error) {
      throw new ApiError('Failed to create watch record', 500);
    }
  }

  async update(historyId: number, data: Partial<WatchHistoryInput>) {
    try {
      return await this.prisma.watch_history.update({
        where: { history_id: historyId },
        data: {
          ...data,
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
      throw new ApiError('Failed to update watch record', 500);
    }
  }

  async getContentStats(contentId: string) {
    try {
      const watchRecords = await this.prisma.watch_history.findMany({
        where: { content_id: contentId },
      });

      return watchRecords;
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