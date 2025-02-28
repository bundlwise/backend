import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { prettyJSON } from 'hono/pretty-json';
import { router } from './routes/index.js';
import {
  errorHandler,
  requestLogger,
  rateLimiter,
  corsMiddleware,
} from './middleware/index.js';
import { config } from './config/index.js';
import logger from './utils/logger.js';

const app = new Hono();

// Global Middleware (order matters)
app.use('*', errorHandler());
app.use('*', requestLogger);
app.use('*', corsMiddleware);
app.use('*', prettyJSON());
app.use('*', rateLimiter);

// Routes
app.route('/', router);

// Health check
app.get('/health', (c) => c.json({ 
  status: 'ok', 
  timestamp: new Date().toISOString(),
  version: config.version,
}));

// Start server
const startServer = async () => {
  try {
    await serve({
      fetch: app.fetch,
      port: config.port,
    }, (info) => {
      logger.info(`Server is running on port ${info.port}`);
    });
  } catch (error: unknown) {
    if ((error as { code?: string }).code === 'EADDRINUSE') {
      logger.error(`Port ${config.port} is already in use. Trying port ${config.port + 1}`);
      await serve({
        fetch: app.fetch,
        port: config.port + 1,
      }, (info) => {
        logger.info(`Server is running on port ${info.port}`);
      });
    } else {
      logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }
};

startServer();

export default app;
