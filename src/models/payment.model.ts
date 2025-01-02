export interface Payment {
  payment_id: number;
  user_id: number;
  subscription_id: number;
  amount: number;
  payment_method: string;
  payment_status: string;
  transaction_id: string;
  region?: string;
  created_at: Date;
} 