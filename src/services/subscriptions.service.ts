import { PrismaClient, Prisma } from '@prisma/client';
import { ApiError } from '../utils/api-error';
import { SubscriptionInput } from '../models/schemas/subscription.schema';
import { subscriptionSchema } from '../models/schemas/subscription.schema';

export class SubscriptionsService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createSubscription(data: SubscriptionInput) {
    try {
      const validatedData = subscriptionSchema.parse(data);

      // Check if user has any active subscriptions
      const activeSubscription = await this.prisma.subscriptions.findFirst({
        where: {
          user_id: validatedData.user_id,
          is_active: true,
        },
      });

      if (activeSubscription) {
        throw new ApiError('User already has an active subscription', 400);
      }

      // Get plan details
      const plan = await this.prisma.subscription_plans.findUnique({
        where: { plan_id: validatedData.plan_id },
      });

      if (!plan) {
        throw new ApiError('Invalid subscription plan', 400);
      }

      // Calculate dates
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + plan.duration_days);

      const subscription = await this.prisma.subscriptions.create({
        data: {
          ...validatedData,
          start_date: startDate,
          end_date: endDate,
          renewal_date: endDate,
        },
        include: {
          plan: true,
        },
      });

      return subscription;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to create subscription', 500);
    }
  }

  async getUserSubscriptions(userId: number) {
    try {
      return await this.prisma.subscriptions.findMany({
        where: { user_id: userId },
        include: {
          plan: true,
          payments: {
            orderBy: {
              created_at: 'desc',
            },
            take: 1,
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      });
    } catch (error) {
      throw new ApiError('Failed to fetch user subscriptions', 500);
    }
  }

  async cancelSubscription(subscriptionId: number, userId: number) {
    try {
      const subscription = await this.prisma.subscriptions.findFirst({
        where: {
          subscription_id: subscriptionId,
          user_id: userId,
          is_active: true,
        },
      });

      if (!subscription) {
        throw new ApiError('Active subscription not found', 404);
      }

      await this.prisma.subscriptions.update({
        where: { subscription_id: subscriptionId },
        data: {
          is_active: false,
          renewal_date: null,
        },
      });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to cancel subscription', 500);
    }
  }

  async renewSubscription(subscriptionId: number) {
    try {
      const subscription = await this.prisma.subscriptions.findUnique({
        where: { subscription_id: subscriptionId },
        include: { plan: true },
      });

      if (!subscription) {
        throw new ApiError('Subscription not found', 404);
      }

      const newEndDate = new Date();
      newEndDate.setDate(newEndDate.getDate() + subscription.plan.duration_days);

      return await this.prisma.subscriptions.update({
        where: { subscription_id: subscriptionId },
        data: {
          end_date: newEndDate,
          renewal_date: newEndDate,
          is_active: true,
        },
        include: { plan: true },
      });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to renew subscription', 500);
    }
  }
} 