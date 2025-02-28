import { cors } from 'hono/cors';
import { config } from '../config/index.js';

export const corsMiddleware = cors({
  origin: config.cors.origins,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // 24 hours
  credentials: true,
}); 