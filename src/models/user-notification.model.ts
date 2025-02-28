export interface UserNotification {
  notification_id: number;
  user_id: number;
  title: string;
  message: string;
  is_read: boolean;
  notification_type?: string;
  created_at: Date;
} 