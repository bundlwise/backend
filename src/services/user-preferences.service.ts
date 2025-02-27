import { PrismaClient, Prisma } from '@prisma/client';
import { ApiError } from '../utils/api-error.js';
import { UserPreferenceInput } from '../models/schemas/user-preference.schema.js';
import { userPreferenceSchema } from '../models/schemas/user-preference.schema.js';

export class UserPreferencesService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getUserPreferences(userId: number) {
    try {
      const preferences = await this.prisma.user_preferences.findFirst({
        where: { user_id: userId },
      });

      if (!preferences) {
        // Create default preferences if none exist
        return await this.prisma.user_preferences.create({
          data: {
            user_id: userId,
            genre_preferences: {},
            language_preferences: {},
            watch_time_preferences: {},
          },
        });
      }

      return preferences;
    } catch (error) {
      throw new ApiError('Failed to fetch user preferences', 500);
    }
  }

  async createOrUpdate(userId: number, data: Partial<UserPreferenceInput>) {
    try {
      const validatedData = userPreferenceSchema.partial().parse(data);
      return await this.prisma.user_preferences.upsert({
        where: { user_id: userId },
        update: {
          ...validatedData,
          last_updated: new Date(),
        },
        create: {
          ...validatedData,
          user_id: userId,
        },
      });
    } catch (error) {
      throw new ApiError('Failed to update preferences', 500);
    }
  }

  async updateGenrePreferences(userId: number, genrePreferences: Record<string, any>) {
    try {
      const preferences = await this.prisma.user_preferences.upsert({
        where: {
          user_id: userId,
        },
        update: {
          genre_preferences: genrePreferences,
          last_updated: new Date(),
        },
        create: {
          user_id: userId,
          genre_preferences: genrePreferences,
        },
      });

      return preferences;
    } catch (error) {
      throw new ApiError('Failed to update genre preferences', 500);
    }
  }

  async updateLanguagePreferences(userId: number, languagePreferences: Record<string, any>) {
    try {
      const preferences = await this.prisma.user_preferences.upsert({
        where: {
          user_id: userId,
        },
        update: {
          language_preferences: languagePreferences,
          last_updated: new Date(),
        },
        create: {
          user_id: userId,
          language_preferences: languagePreferences,
        },
      });

      return preferences;
    } catch (error) {
      throw new ApiError('Failed to update language preferences', 500);
    }
  }

  async updateWatchTimePreferences(userId: number, watchTimePreferences: Record<string, any>) {
    try {
      const preferences = await this.prisma.user_preferences.upsert({
        where: {
          user_id: userId,
        },
        update: {
          watch_time_preferences: watchTimePreferences,
          last_updated: new Date(),
        },
        create: {
          user_id: userId,
          watch_time_preferences: watchTimePreferences,
        },
      });

      return preferences;
    } catch (error) {
      throw new ApiError('Failed to update watch time preferences', 500);
    }
  }
} 