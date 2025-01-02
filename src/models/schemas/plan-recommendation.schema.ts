import { z } from 'zod';

export const planRecommendationSchema = z.object({
  user_id: z.number().int().positive(),
  recommended_plan_id: z.number().int().positive(),
  reason: z.string().optional(),
});

export type PlanRecommendationInput = z.infer<typeof planRecommendationSchema>; 