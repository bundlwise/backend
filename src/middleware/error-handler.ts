import { Context, Next } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { ApiError } from '../utils/api-error.js';
import { logger } from '../utils/logger.js';

type StatusCode = 200 | 201 | 400 | 401 | 403 | 404 | 409 | 429 | 500;

export function errorHandler() {
  return async (c: Context, next: Next) => {
    try {
      await next();
    } catch (error) {
      if (error instanceof ApiError) {
        return c.json({
          success: false,
          error: {
            message: error.message,
            details: error.details,
          },
        }, error.statusCode as StatusCode);
      }

      logger.error(error);
      return c.json({
        success: false,
        error: {
          message: 'Internal server error',
        },
      }, 500 as StatusCode);
    }
  };
} 