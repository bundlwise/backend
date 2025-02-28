interface RateLimiterOptions {
  windowMs: number;
  max: number;
}

interface RateLimiterResponse {
  success: boolean;
  remaining: number;
  reset: number;
}

export class RateLimiter {
  private store: Map<string, { count: number; reset: number }>;
  private windowMs: number;
  private max: number;

  constructor(options: RateLimiterOptions) {
    this.windowMs = options.windowMs;
    this.max = options.max;
    this.store = new Map();
  }

  async try(key: string): Promise<RateLimiterResponse> {
    const now = Date.now();
    const record = this.store.get(key);

    if (!record || record.reset <= now) {
      // Reset or create new record
      this.store.set(key, {
        count: 1,
        reset: now + this.windowMs,
      });
      return {
        success: true,
        remaining: this.max - 1,
        reset: now + this.windowMs,
      };
    }

    if (record.count >= this.max) {
      return {
        success: false,
        remaining: 0,
        reset: record.reset,
      };
    }

    record.count += 1;
    return {
      success: true,
      remaining: this.max - record.count,
      reset: record.reset,
    };
  }

  async cleanup(): Promise<void> {
    const now = Date.now();
    for (const [key, record] of this.store.entries()) {
      if (record.reset <= now) {
        this.store.delete(key);
      }
    }
  }
} 