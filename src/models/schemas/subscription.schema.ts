import { z } from 'zod';

export const subscriptionSchema = z.object({
  user_id: z.number().int().positive(),
  plan_id: z.number().int().positive(),
  start_date: z.date(),
  end_date: z.date(),
  is_active: z.boolean().default(true),
  is_trial: z.boolean().default(false),
  renewal_date: z.date().optional(),
});

export type SubscriptionInput = z.infer<typeof subscriptionSchema>; 