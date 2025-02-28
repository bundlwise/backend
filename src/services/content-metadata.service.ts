import { PrismaClient, Prisma } from '@prisma/client';
import { ApiError } from '../utils/api-error.js';
import { ContentMetadataInput } from '../models/schemas/content-metadata.schema.js';
import { contentMetadataSchema } from '../models/schemas/content-metadata.schema.js';

interface ContentFilters {
  genre?: string;
  language?: string;
}

export class ContentMetadataService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getAllContent(page: number, limit: number, filters: ContentFilters) {
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

      return {
        data: content,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new ApiError('Failed to fetch content', 500);
    }
  }

  async getContentById(contentId: string) {
    try {
      return await this.prisma.content_metadata.findUnique({
        where: { content_id: contentId },
      });
    } catch (error) {
      throw new ApiError('Failed to fetch content', 500);
    }
  }

  async createContent(data: ContentMetadataInput) {
    try {
      const validatedData = contentMetadataSchema.parse(data);
      return await this.prisma.content_metadata.create({
        data: validatedData,
      });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to create content', 500);
    }
  }

  async updateContent(contentId: string, data: Partial<ContentMetadataInput>) {
    try {
      const validatedData = contentMetadataSchema.partial().parse(data);
      return await this.prisma.content_metadata.update({
        where: { content_id: contentId },
        data: validatedData,
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

  async deleteContent(contentId: string) {
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

  async searchContent(query: string, page: number, limit: number) {
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

      return {
        data: results,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new ApiError('Failed to search content', 500);
    }
  }
} 