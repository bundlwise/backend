import { z } from 'zod';

export const userInterestSchema = z.object({
  user_id: z.number().int().positive(),
  content_id: z.string(),
  interest_level: z.number().int().min(0).max(10),
});

export type UserInterestInput = z.infer<typeof userInterestSchema>; 