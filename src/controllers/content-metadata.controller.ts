import { Context } from 'hono';
import { ContentMetadataService } from '../services/content-metadata.service';
import { ApiError } from '../utils/api-error';
import { ContentMetadataInput } from '../models/schemas/content-metadata.schema';

type HonoContext = Context<{
  Bindings: {};
  Variables: {};
}>;

export class ContentMetadataController {
  private service: ContentMetadataService;

  constructor() {
    this.service = new ContentMetadataService();
  }

  getAllContent = async (c: HonoContext) => {
    try {
      const { page = '1', limit = '10', genre, language } = c.req.query();
      const filters = { genre, language };
      const content = await this.service.getAllContent(
        Number(page),
        Number(limit),
        filters
      );
      return c.json({ success: true, data: content });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to fetch content', 500);
    }
  };

  getContentById = async (c: HonoContext) => {
    try {
      const contentId = c.param('id');
      const content = await this.service.getContentById(contentId);
      
      if (!content) {
        throw new ApiError('Content not found', 404);
      }
      
      return c.json({ success: true, data: content });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to fetch content', 500);
    }
  };

  createContent = async (c: HonoContext) => {
    try {
      const data = await c.req.json() as ContentMetadataInput;
      const content = await this.service.createContent(data);
      return c.json({ success: true, data: content }, 201);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to create content', 500);
    }
  };

  updateContent = async (c: HonoContext) => {
    try {
      const contentId = c.param('id');
      const data = await c.req.json() as Partial<ContentMetadataInput>;
      const content = await this.service.updateContent(contentId, data);
      return c.json({ success: true, data: content });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to update content', 500);
    }
  };

  deleteContent = async (c: HonoContext) => {
    try {
      const contentId = c.param('id');
      await this.service.deleteContent(contentId);
      return c.json({ success: true, message: 'Content deleted successfully' });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to delete content', 500);
    }
  };

  searchContent = async (c: HonoContext) => {
    try {
      const { q, page = '1', limit = '10' } = c.req.query();
      if (!q) {
        throw new ApiError('Search query is required', 400);
      }
      
      const results = await this.service.searchContent(
        q,
        Number(page),
        Number(limit)
      );
      return c.json({ success: true, data: results });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to search content', 500);
    }
  };
} 