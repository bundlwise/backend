import { Context } from 'hono';
import { SubscriptionPlansService } from '../services/subscription-plans.service.js';
import { ApiError } from '../utils/api-error.js';
import { SubscriptionPlanInput } from '../models/schemas/subscription-plan.schema.js';

export class SubscriptionPlansController {
  private service: SubscriptionPlansService;

  constructor() {
    this.service = new SubscriptionPlansService();
  }

  getAllPlans = async (c: Context) => {
    try {
      const plans = await this.service.getAllPlans();
      return c.json({ success: true, data: plans });
    } catch (error) {
      throw new ApiError('Failed to fetch subscription plans', 500);
    }
  };

  getPlanById = async (c: Context) => {
    try {
      const id = Number(c.param('id'));
      const plan = await this.service.getPlanById(id);
      
      if (!plan) {
        throw new ApiError('Subscription plan not found', 404);
      }
      
      return c.json({ success: true, data: plan });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to fetch subscription plan', 500);
    }
  };

  createPlan = async (c: Context) => {
    try {
      const data = await c.req.json() as SubscriptionPlanInput;
      const plan = await this.service.createPlan(data);
      return c.json({ success: true, data: plan }, 201);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to create subscription plan', 500);
    }
  };

  updatePlan = async (c: Context) => {
    try {
      const id = Number(c.param('id'));
      const data = await c.req.json() as Partial<SubscriptionPlanInput>;
      const plan = await this.service.updatePlan(id, data);
      return c.json({ success: true, data: plan });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to update subscription plan', 500);
    }
  };

  deletePlan = async (c: Context) => {
    try {
      const id = Number(c.param('id'));
      await this.service.deletePlan(id);
      return c.json({ success: true, message: 'Plan deleted successfully' });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to delete subscription plan', 500);
    }
  };
} 