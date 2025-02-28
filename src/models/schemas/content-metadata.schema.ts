import { z } from 'zod';

export const contentMetadataSchema = z.object({
  content_id: z.string(),
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  genre: z.string().max(100).optional(),
  duration: z.number().int().positive(),
  release_date: z.date().optional(),
  language: z.string().max(50).optional(),
  is_premium: z.boolean().default(false),
  region_availability: z.string().max(255).optional(),
});

export type ContentMetadataInput = z.infer<typeof contentMetadataSchema>; 