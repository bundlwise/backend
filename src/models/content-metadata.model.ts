export interface ContentMetadata {
  content_id: string;
  title: string;
  description?: string;
  genre?: string;
  duration: number;
  release_date?: Date;
  language?: string;
  is_premium: boolean;
  region_availability?: string;
  created_at: Date;
  updated_at: Date;
} 