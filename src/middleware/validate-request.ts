import { Context, Next } from 'hono';
import { ZodSchema } from 'zod';
import { ApiError } from '../utils/api-error.js';

interface ValidationConfig {
  params?: ZodSchema;
  query?: ZodSchema;
  body?: ZodSchema;
}

export function validateRequest(config: ValidationConfig) {
  return async (c: Context, next: Next) => {
    try {
      if (config.params) {
        const params = c.req.param();
        config.params.parse(params);
      }

      if (config.query) {
        const query = c.req.query();
        config.query.parse(query);
      }

      if (config.body) {
        const body = await c.req.json();
        config.body.parse(body);
      }

      await next();
    } catch (error) {
      if (error.name === 'ZodError') {
        throw new ApiError('Validation failed', 400, error.errors);
      }
      throw error;
    }
  };
} 