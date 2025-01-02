import { Context, Next } from 'hono';
import { RateLimiter } from '../utils/rate-limiter.js';
import { ApiError } from '../utils/api-error.js';
import { config } from '../config/index.js';

const limiter = new RateLimiter({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
});

export async function rateLimiter(c: Context, next: Next) {
  const ip = c.req.header('x-forwarded-for') || 'unknown';
  
  const { success, remaining, reset } = await limiter.try(ip);
  
  if (!success) {
    throw new ApiError('Too many requests', 429);
  }
  
  // Add rate limit info to response headers
  c.header('X-RateLimit-Remaining', remaining.toString());
  c.header('X-RateLimit-Reset', reset.toString());
  
  await next();
} 