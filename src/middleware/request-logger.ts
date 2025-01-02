import { Context, Next } from 'hono';
import { logger } from '../utils/logger.js';

export async function requestLogger(c: Context, next: Next) {
  const start = Date.now();
  const { method, url } = c.req;
  
  try {
    await next();
    
    const duration = Date.now() - start;
    logger.info({
      method,
      url,
      status: c.res.status,
      duration: `${duration}ms`,
    });
  } catch (error: unknown) {
    const duration = Date.now() - start;
    logger.error({
      method,
      url,
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: `${duration}ms`,
    });
    throw error;
  }
} 