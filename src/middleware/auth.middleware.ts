import jwt from 'jsonwebtoken';
import { Context, Next } from 'hono';
import { ApiError } from '../utils/api-error.js';
import { config } from '../config/index.js';
import { UsersRepository } from '../repositories/users.repository.js';
import { logger } from '../utils/logger.js';

interface JwtPayload {
  userId: number;
  email: string;
  iat: number;
  exp: number;
}

export async function authMiddleware(c: Context, next: Next) {
  try {
    const authHeader = c.req.header('Authorization');

    if (!authHeader?.startsWith('Bearer ')) {
      throw new ApiError('No token provided', 401);
    }

    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
      const usersRepo = new UsersRepository();
      const user = await usersRepo.findById(decoded.userId);

      if (!user) {
        throw new ApiError('User not found', 401);
      }

      // Add user to request context
      c.set('user', user);
    } catch (jwtError) {
      logger.warn({ error: jwtError, token }, 'JWT verification failed');
      if (jwtError.name === 'TokenExpiredError') {
        throw new ApiError('Token expired', 401);
      }
      throw new ApiError('Invalid token', 401);
    }

    await next();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    logger.error(error, 'Auth middleware error');
    throw new ApiError('Authentication failed', 401);
  }
} 