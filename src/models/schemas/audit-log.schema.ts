import { z } from 'zod';

export const auditLogSchema = z.object({
  user_id: z.number().int().positive(),
  action: z.string().max(255),
  action_details: z.record(z.any()).optional(),
  ip_address: z.string().ip().optional(),
});

export type AuditLogInput = z.infer<typeof auditLogSchema>; 