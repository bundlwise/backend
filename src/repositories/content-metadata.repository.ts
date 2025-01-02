import { Prisma } from '@prisma/client';
import { BaseRepository } from './base.repository';
import { ApiError } from '../utils/api-error';
import { ContentMetadataInput } from '../models/schemas/content-metadata.schema';

interface ContentFilters {
  genre?: string;
  language?: string;
}

export class ContentMetadataRepository extends BaseRepository {
  async findAll(page: number, limit: number, filters: ContentFilters) {
    try {
      const skip = (page - 1) * limit;
      const where: Prisma.content_metadataWhereInput = {};

      if (filters.genre) {
        where.genre = filters.genre;
      }

      if (filters.language) {
        where.language = filters.language;
      }

      const [content, total] = await Promise.all([
        this.prisma.content_metadata.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            created_at: 'desc',
          },
        }),
        this.prisma.content_metadata.count({ where }),
      ]);

      return { content, total };
    } catch (error) {
      throw new ApiError('Database error while fetching content', 500);
    }
  }

  async findById(contentId: string) {
    try {
      return await this.prisma.content_metadata.findUnique({
        where: { content_id: contentId },
      });
    } catch (error) {
      throw new ApiError('Database error while fetching content', 500);
    }
  }

  async create(data: ContentMetadataInput) {
    try {
      return await this.prisma.content_metadata.create({
        data,
      });
    } catch (error) {
      throw new ApiError('Failed to create content', 500);
    }
  }

  async update(contentId: string, data: Partial<ContentMetadataInput>) {
    try {
      return await this.prisma.content_metadata.update({
        where: { content_id: contentId },
        data,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new ApiError('Content not found', 404);
        }
      }
      throw new ApiError('Failed to update content', 500);
    }
  }

  async delete(contentId: string) {
    try {
      await this.prisma.content_metadata.delete({
        where: { content_id: contentId },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new ApiError('Content not found', 404);
        }
      }
      throw new ApiError('Failed to delete content', 500);
    }
  }

  async search(query: string, page: number, limit: number) {
    try {
      const skip = (page - 1) * limit;
      const where: Prisma.content_metadataWhereInput = {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { genre: { contains: query, mode: 'insensitive' } },
        ],
      };

      const [results, total] = await Promise.all([
        this.prisma.content_metadata.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            created_at: 'desc',
          },
        }),
        this.prisma.content_metadata.count({ where }),
      ]);

      return { results, total };
    } catch (error) {
      throw new ApiError('Failed to search content', 500);
    }
  }
} 