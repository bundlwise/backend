import { Context as HonoBaseContext } from 'hono';
import { StatusCode } from 'hono/utils/http-status';

declare module 'hono' {
  interface ContextVariables {
    user?: any;
  }

  interface Context extends HonoBaseContext {
    param: (name: string) => string;
  }
}

export type { Context } from 'hono'; 