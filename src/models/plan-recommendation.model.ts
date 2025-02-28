export interface PlanRecommendation {
  recommendation_id: number;
  user_id: number;
  recommended_plan_id: number;
  reason?: string;
  created_at: Date;
} 