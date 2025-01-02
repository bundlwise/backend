import { Prisma } from '@prisma/client';
import { BaseRepository } from './base.repository';
import { ApiError } from '../utils/api-error';
import { SubscriptionPlanInput } from '../models/schemas/subscription-plan.schema';

export class SubscriptionPlansRepository extends BaseRepository {
  async findAll() {
    try {
      return await this.prisma.subscription_plans.findMany({
        orderBy: {
          price: 'asc',
        },
      });
    } catch (error) {
      throw new ApiError('Database error while fetching plans', 500);
    }
  }

  async findById(id: number) {
    try {
      return await this.prisma.subscription_plans.findUnique({
        where: { plan_id: id },
      });
    } catch (error) {
      throw new ApiError('Database error while fetching plan', 500);
    }
  }

  async create(data: SubscriptionPlanInput) {
    try {
      return await this.prisma.subscription_plans.create({
        data,
      });
    } catch (error) {
      throw new ApiError('Failed to create subscription plan', 500);
    }
  }

  async update(id: number, data: Partial<SubscriptionPlanInput>) {
    try {
      return await this.prisma.subscription_plans.update({
        where: { plan_id: id },
        data,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new ApiError('Plan not found', 404);
        }
      }
      throw new ApiError('Failed to update subscription plan', 500);
    }
  }

  async delete(id: number) {
    try {
      await this.prisma.subscription_plans.delete({
        where: { plan_id: id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new ApiError('Plan not found', 404);
        }
      }
      throw new ApiError('Failed to delete subscription plan', 500);
    }
  }
} 