import { Context, Next } from 'hono';
import { ApiError } from '../utils/api-error.js';
import { logger } from '../utils/logger.js';

export function errorHandler() {
  return async (c: Context, next: Next) => {
    try {
      await next();
    } catch (error) {
      if (error instanceof ApiError) {
        // Log client errors only in development
        if (process.env.NODE_ENV === 'development') {
          logger.warn(error);
        }
        
        return c.json({
          success: false,
          error: {
            message: error.message,
            details: error.details,
          },
        }, error.statusCode);
      }

      // Log all server errors
      logger.error(error);
      
      return c.json({
        success: false,
        error: {
          message: 'Internal server error',
        },
      }, 500);
    }
  };
} 