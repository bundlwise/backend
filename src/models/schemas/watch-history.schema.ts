import { z } from 'zod';

export const watchHistorySchema = z.object({
  profile_id: z.number().int().positive(),
  content_id: z.string(),
  watch_time: z.number().int().min(0),
  completed: z.boolean().default(false),
});

export type WatchHistoryInput = z.infer<typeof watchHistorySchema>; 