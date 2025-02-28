import { z } from 'zod';

export const notificationTypeEnum = z.enum(['SYSTEM', 'PAYMENT', 'CONTENT', 'SUBSCRIPTION']);

export const userNotificationSchema = z.object({
  user_id: z.number().int().positive(),
  title: z.string().min(1).max(255),
  message: z.string(),
  notification_type: notificationTypeEnum.optional(),
});

export type UserNotificationInput = z.infer<typeof userNotificationSchema>; 