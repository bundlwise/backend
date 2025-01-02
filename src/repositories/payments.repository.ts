import { Prisma } from '@prisma/client';
import { BaseRepository } from './base.repository';
import { ApiError } from '../utils/api-error';
import { PaymentInput } from '../models/schemas/payment.schema';

export class PaymentsRepository extends BaseRepository {
  async findById(id: number) {
    try {
      return await this.prisma.payments.findUnique({
        where: { payment_id: id },
        include: {
          subscription: {
            include: {
              plan: true,
            },
          },
        },
      });
    } catch (error) {
      throw new ApiError('Database error while fetching payment', 500);
    }
  }

  async findByUserId(userId: number) {
    try {
      return await this.prisma.payments.findMany({
        where: { user_id: userId },
        include: {
          subscription: {
            include: {
              plan: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      });
    } catch (error) {
      throw new ApiError('Database error while fetching payments', 500);
    }
  }

  async findBySubscriptionId(subscriptionId: number) {
    try {
      return await this.prisma.payments.findMany({
        where: { subscription_id: subscriptionId },
        include: {
          subscription: {
            include: {
              plan: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      });
    } catch (error) {
      throw new ApiError('Database error while fetching subscription payments', 500);
    }
  }

  async create(data: PaymentInput) {
    try {
      return await this.prisma.payments.create({
        data,
        include: {
          subscription: {
            include: {
              plan: true,
            },
          },
        },
      });
    } catch (error) {
      throw new ApiError('Failed to create payment', 500);
    }
  }

  async updateStatus(id: number, status: string) {
    try {
      return await this.prisma.payments.update({
        where: { payment_id: id },
        data: { payment_status: status },
        include: {
          subscription: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new ApiError('Payment not found', 404);
        }
      }
      throw new ApiError('Failed to update payment status', 500);
    }
  }
} 