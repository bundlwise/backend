import { pino } from 'pino';
import { config } from '../config/index.js';

const logger = pino({
  level: config.logging?.level || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  }
});

export default logger; 