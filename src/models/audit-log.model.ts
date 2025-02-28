export interface AuditLog {
  log_id: number;
  user_id: number;
  action: string;
  action_details?: Record<string, any>;
  ip_address?: string;
  created_at: Date;
} 