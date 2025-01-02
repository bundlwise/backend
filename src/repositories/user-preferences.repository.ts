import { Prisma } from '@prisma/client';
import { BaseRepository } from './base.repository';
import { ApiError } from '../utils/api-error';
import { UserPreferenceInput } from '../models/schemas/user-preference.schema';

export class UserPreferencesRepository extends BaseRepository {
  async findByUserId(userId: number) {
    try {
      return await this.prisma.user_preferences.findUnique({
        where: { user_id: userId },
      });
    } catch (error) {
      throw new ApiError('Database error while fetching preferences', 500);
    }
  }

  async createOrUpdate(userId: number, data: Partial<UserPreferenceInput>) {
    try {
      return await this.prisma.user_preferences.upsert({
        where: { user_id: userId },
        update: {
          ...data,
          last_updated: new Date(),
        },
        create: {
          user_id: userId,
          ...data,
        },
      });
    } catch (error) {
      throw new ApiError('Failed to update preferences', 500);
    }
  }

  async updateGenrePreferences(userId: number, genrePreferences: Record<string, any>) {
    try {
      return await this.prisma.user_preferences.upsert({
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
    } catch (error) {
      throw new ApiError('Failed to update genre preferences', 500);
    }
  }

  async updateLanguagePreferences(userId: number, languagePreferences: Record<string, any>) {
    try {
      return await this.prisma.user_preferences.upsert({
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
    } catch (error) {
      throw new ApiError('Failed to update language preferences', 500);
    }
  }

  async updateWatchTimePreferences(userId: number, watchTimePreferences: Record<string, any>) {
    try {
      return await this.prisma.user_preferences.upsert({
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
    } catch (error) {
      throw new ApiError('Failed to update watch time preferences', 500);
    }
  }
} 