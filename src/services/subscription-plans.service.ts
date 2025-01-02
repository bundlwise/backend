import { ApiError } from '../utils/api-error';
import { SubscriptionPlanInput } from '../models/schemas/subscription-plan.schema';
import { subscriptionPlanSchema } from '../models/schemas/subscription-plan.schema';
import { SubscriptionPlansRepository } from '../repositories/subscription-plans.repository';

export class SubscriptionPlansService {
  private repository: SubscriptionPlansRepository;

  constructor() {
    this.repository = new SubscriptionPlansRepository();
  }

  async getAllPlans() {
    return this.repository.findAll();
  }

  async getPlanById(id: number) {
    const plan = await this.repository.findById(id);
    if (!plan) {
      throw new ApiError('Plan not found', 404);
    }
    return plan;
  }

  async createPlan(data: SubscriptionPlanInput) {
    const validatedData = subscriptionPlanSchema.parse(data);
    return this.repository.create(validatedData);
  }

  async updatePlan(id: number, data: Partial<SubscriptionPlanInput>) {
    const validatedData = subscriptionPlanSchema.partial().parse(data);
    return this.repository.update(id, validatedData);
  }

  async deletePlan(id: number) {
    await this.repository.delete(id);
  }
} 