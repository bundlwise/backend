import { z } from 'zod';

export const profileSchema = z.object({
  user_id: z.number().int().positive(),
  name: z.string().min(1).max(100),
  avatar_url: z.string().url().max(255).optional(),
  is_kids_profile: z.boolean().default(false),
  language_preference: z.string().max(50).optional(),
});

export type ProfileInput = z.infer<typeof profileSchema>; 