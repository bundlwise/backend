import { PrismaClient, Prisma } from '@prisma/client';
import { SubscriptionPlanInput } from '../models/schemas/subscription-plan.schema.js';
import { ApiError } from '../utils/api-error.js';

export class SubscriptionPlansService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getAllPlans() {
    return this.prisma.subscription_plans.findMany({
      orderBy: {
        price: 'asc',
      },
    });
  }

  async getPlanById(id: number) {
    return this.prisma.subscription_plans.findUnique({
      where: { plan_id: id },
    });
  }

  async createPlan(data: SubscriptionPlanInput) {
    return this.prisma.subscription_plans.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        duration_days: data.duration_days,
        is_trial_available: data.is_trial_available,
        max_profiles: data.max_profiles,
        region_availability: data.region_availability,
      },
    });
  }

  async updatePlan(id: number, data: Partial<SubscriptionPlanInput>) {
    try {
      return await this.prisma.subscription_plans.update({
        where: { plan_id: id },
        data,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new ApiError('Plan not found', 404);
      }
      throw error;
    }
  }

  async deletePlan(id: number) {
    try {
      await this.prisma.subscription_plans.delete({
        where: { plan_id: id },
      });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new ApiError('Plan not found', 404);
      }
      throw error;
    }
  }
} 