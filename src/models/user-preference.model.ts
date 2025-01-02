export interface UserPreference {
  preference_id: number;
  user_id: number;
  genre_preferences?: Record<string, any>;
  language_preferences?: Record<string, any>;
  watch_time_preferences?: Record<string, any>;
  last_updated: Date;
} 