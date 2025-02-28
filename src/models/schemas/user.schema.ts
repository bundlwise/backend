import { z } from 'zod';

export const userSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(100), // For input validation
  first_name: z.string().max(100).optional(),
  last_name: z.string().max(100).optional(),
  phone_number: z.string().max(15).optional(),
  country: z.string().max(50).optional(),
  language_preference: z.string().max(50).optional(),
});

export type UserInput = z.infer<typeof userSchema>; 