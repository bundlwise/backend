import { Context } from 'hono';
import { UserPreferencesService } from '../services/user-preferences.service';
import { ApiError } from '../utils/api-error';
import { UserPreferenceInput } from '../models/schemas/user-preference.schema';

export class UserPreferencesController {
  private service: UserPreferencesService;

  constructor() {
    this.service = new UserPreferencesService();
  }

  getUserPreferences = async (c: Context) => {
    try {
      const userId = Number(c.param('userId'));
      const preferences = await this.service.getUserPreferences(userId);
      return c.json({ success: true, data: preferences });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to fetch user preferences', 500);
    }
  };

  updatePreferences = async (c: Context) => {
    try {
      const userId = Number(c.param('userId'));
      const data = await c.req.json() as UserPreferenceInput;
      const preferences = await this.service.updatePreferences(userId, data);
      return c.json({ success: true, data: preferences });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to update preferences', 500);
    }
  };

  updateGenrePreferences = async (c: Context) => {
    try {
      const userId = Number(c.param('userId'));
      const data = await c.req.json() as Record<string, any>;
      const preferences = await this.service.updateGenrePreferences(userId, data);
      return c.json({ success: true, data: preferences });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to update genre preferences', 500);
    }
  };

  updateLanguagePreferences = async (c: Context) => {
    try {
      const userId = Number(c.param('userId'));
      const data = await c.req.json() as Record<string, any>;
      const preferences = await this.service.updateLanguagePreferences(userId, data);
      return c.json({ success: true, data: preferences });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to update language preferences', 500);
    }
  };

  updateWatchTimePreferences = async (c: Context) => {
    try {
      const userId = Number(c.param('userId'));
      const data = await c.req.json() as Record<string, any>;
      const preferences = await this.service.updateWatchTimePreferences(userId, data);
      return c.json({ success: true, data: preferences });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to update watch time preferences', 500);
    }
  };
} 