import { Context } from 'hono';
import { SubscriptionPlansService } from '../services/subscription-plans.js';
import { ApiError } from '../utils/api-error.js';

export class SubscriptionPlansController {
  private service: SubscriptionPlansService;

  constructor() {
    this.service = new SubscriptionPlansService();
  }

  getAllPlans = async (c: Context) => {
    const plans = await this.service.getAllPlans();
    return c.json({ data: plans });
  };

  getPlanById = async (c: Context) => {
    const id = Number(c.param('id'));
    const plan = await this.service.getPlanById(id);
    
    if (!plan) {
      throw new ApiError('Plan not found', 404);
    }
    
    return c.json({ data: plan });
  };

  createPlan = async (c: Context) => {
    const data = await c.req.json();
    const plan = await this.service.createPlan(data);
    return c.json({ data: plan }, 201);
  };

  updatePlan = async (c: Context) => {
    const id = Number(c.param('id'));
    const data = await c.req.json();
    const plan = await this.service.updatePlan(id, data);
    
    if (!plan) {
      throw new ApiError('Plan not found', 404);
    }
    
    return c.json({ data: plan });
  };

  deletePlan = async (c: Context) => {
    const id = Number(c.param('id'));
    await this.service.deletePlan(id);
    return c.json({ message: 'Plan deleted successfully' });
  };
} 