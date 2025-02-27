import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger.js';

const router = new Hono();
const prisma = new PrismaClient();

router.get('/database', async (c) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    
    // Get some basic stats
    const stats = await Promise.all([
      prisma.users.count(),
      prisma.subscription_plans.count(),
      prisma.content_metadata.count(),
    ]);

    return c.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        stats: {
          users: stats[0],
          subscription_plans: stats[1],
          content: stats[2],
        }
      }
    });
  } catch (error: unknown) {
    logger.error('Database connection test failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown database error';
    return c.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      database: {
        connected: false,
        error: errorMessage
      }
    }, 500);
  }
});

export { router as healthRouter }; 