export interface SubscriptionPlan {
  plan_id: number;
  name: string;
  description?: string;
  price: number;
  duration_days: number;
  is_trial_available: boolean;
  max_profiles: number;
  region_availability?: string;
  created_at: Date;
  updated_at: Date;
} 