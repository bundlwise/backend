export interface User {
  user_id: number;
  email: string;
  password_hash: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  country?: string;
  language_preference?: string;
  is_verified: boolean;
  trial_end_date?: Date;
  created_at: Date;
  updated_at: Date;
} 