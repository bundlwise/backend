interface Config {
  isDev: boolean;
  port: number;
  nodeEnv: 'development' | 'production' | 'test';
  version: string;
  database: {
    url: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  logging: {
    level: string;
  };
  rateLimit: {
    windowMs: number;
    max: number;
  };
  cors: {
    origins: string[];
  };
}

export const config: Config = {
  isDev: process.env.NODE_ENV !== 'production',
  port: Number(process.env.PORT) || 3000,
  nodeEnv: (process.env.NODE_ENV as Config['nodeEnv']) || 'development',
  version: process.env.npm_package_version || '1.0.0',
  database: {
    url: process.env.DATABASE_URL || '',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
  rateLimit: {
    windowMs: Number(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000, // 15 minutes
    max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  },
  cors: {
    origins: process.env.CORS_ORIGINS?.split(',') || ['*'],
  },
}; 