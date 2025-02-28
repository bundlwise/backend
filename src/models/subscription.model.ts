export interface Subscription {
  subscription_id: number;
  user_id: number;
  plan_id: number;
  start_date: Date;
  end_date: Date;
  is_active: boolean;
  is_trial: boolean;
  renewal_date?: Date;
  created_at: Date;
  updated_at: Date;
} 