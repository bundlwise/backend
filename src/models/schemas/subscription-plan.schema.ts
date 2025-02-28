import { z } from 'zod';

export const subscriptionPlanSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  price: z.number().positive().multipleOf(0.01),
  duration_days: z.number().int().positive(),
  is_trial_available: z.boolean().default(false),
  max_profiles: z.number().int().positive().default(1),
  region_availability: z.string().max(255).optional(),
});

export type SubscriptionPlanInput = z.infer<typeof subscriptionPlanSchema>; 