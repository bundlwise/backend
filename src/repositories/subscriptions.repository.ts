import { Prisma } from '@prisma/client';
import { BaseRepository } from './base.repository.js';
import { ApiError } from '../utils/api-error.js';
import { SubscriptionInput } from '../models/schemas/subscription.schema.js';

export class SubscriptionsRepository extends BaseRepository {
  async findActiveByUserId(userId: number) {
    try {
      return await this.prisma.subscriptions.findFirst({
        where: {
          user_id: userId,
          is_active: true,
        },
        include: {
          plan: true,
        },
      });
    } catch (error) {
      throw new ApiError('Database error while fetching subscription', 500);
    }
  }

  async findById(id: number) {
    try {
      return await this.prisma.subscriptions.findUnique({
        where: { subscription_id: id },
        include: {
          plan: true,
          payments: {
            orderBy: {
              created_at: 'desc',
            },
            take: 1,
          },
        },
      });
    } catch (error) {
      throw new ApiError('Database error while fetching subscription', 500);
    }
  }

  async findAllByUserId(userId: number) {
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
      throw new ApiError('Database error while fetching subscriptions', 500);
    }
  }

  async create(data: SubscriptionInput) {
    try {
      return await this.prisma.subscriptions.create({
        data,
        include: {
          plan: true,
        },
      });
    } catch (error) {
      throw new ApiError('Failed to create subscription', 500);
    }
  }

  async update(id: number, data: Partial<SubscriptionInput>) {
    try {
      return await this.prisma.subscriptions.update({
        where: { subscription_id: id },
        data,
        include: {
          plan: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new ApiError('Subscription not found', 404);
        }
      }
      throw new ApiError('Failed to update subscription', 500);
    }
  }

  async cancel(id: number) {
    try {
      return await this.prisma.subscriptions.update({
        where: { subscription_id: id },
        data: {
          is_active: false,
          renewal_date: null,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new ApiError('Subscription not found', 404);
        }
      }
      throw new ApiError('Failed to cancel subscription', 500);
    }
  }
} 