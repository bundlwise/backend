import { z } from 'zod';

export const userPreferenceSchema = z.object({
  user_id: z.number().int().positive(),
  genre_preferences: z.record(z.any()).optional(),
  language_preferences: z.record(z.any()).optional(),
  watch_time_preferences: z.record(z.any()).optional(),
});

export type UserPreferenceInput = z.infer<typeof userPreferenceSchema>; 