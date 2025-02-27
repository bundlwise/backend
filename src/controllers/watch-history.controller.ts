import { Context } from 'hono';
import { WatchHistoryService } from '../services/watch-history.service.js';
import { ApiError } from '../utils/api-error.js';
import { WatchHistoryInput } from '../models/schemas/watch-history.schema.js';

type HonoContext = Context<{
  Bindings: {};
  Variables: {};
}>;

export class WatchHistoryController {
  private service: WatchHistoryService;

  constructor() {
    this.service = new WatchHistoryService();
  }

  createWatchRecord = async (c: HonoContext) => {
    try {
      const data = await c.req.json() as WatchHistoryInput;
      const record = await this.service.createWatchRecord(data);
      return c.json({ success: true, data: record }, 201);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to create watch record', 500);
    }
  };

  getProfileWatchHistory = async (c: HonoContext) => {
    try {
      const profileId = Number(c.param('profileId'));
      const { page = '1', limit = '10' } = c.req.query();
      const history = await this.service.getProfileWatchHistory(
        profileId,
        Number(page),
        Number(limit)
      );
      return c.json({ success: true, data: history });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to fetch watch history', 500);
    }
  };

  updateWatchProgress = async (c: HonoContext) => {
    try {
      const historyId = Number(c.param('id'));
      const { watch_time, completed } = await c.req.json();
      const record = await this.service.updateWatchProgress(historyId, {
        watch_time,
        completed,
      });
      return c.json({ success: true, data: record });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to update watch progress', 500);
    }
  };

  getContentWatchStats = async (c: HonoContext) => {
    try {
      const contentId = c.param('contentId');
      const stats = await this.service.getContentWatchStats(contentId);
      return c.json({ success: true, data: stats });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to fetch content watch stats', 500);
    }
  };

  getContinueWatching = async (c: HonoContext) => {
    try {
      const profileId = Number(c.param('profileId'));
      const content = await this.service.getContinueWatching(profileId);
      return c.json({ success: true, data: content });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to fetch continue watching list', 500);
    }
  };
} 