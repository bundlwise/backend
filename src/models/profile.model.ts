export interface Profile {
  profile_id: number;
  user_id: number;
  name: string;
  avatar_url?: string;
  is_kids_profile: boolean;
  language_preference?: string;
  created_at: Date;
  updated_at: Date;
} 