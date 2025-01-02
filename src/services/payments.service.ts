import { PrismaClient, Prisma } from '@prisma/client';
import { ApiError } from '../utils/api-error';
import { PaymentInput } from '../models/schemas/payment.schema';
import { paymentSchema } from '../models/schemas/payment.schema';

export class PaymentsService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createPayment(data: PaymentInput) {
    try {
      const validatedData = paymentSchema.parse(data);

      // Verify subscription exists and belongs to user
      const subscription = await this.prisma.subscriptions.findFirst({
        where: {
          subscription_id: validatedData.subscription_id,
          user_id: validatedData.user_id,
        },
      });

      if (!subscription) {
        throw new ApiError('Invalid subscription', 400);
      }

      // Create payment record
      const payment = await this.prisma.payments.create({
        data: validatedData,
        include: {
          subscription: {
            include: {
              plan: true,
            },
          },
        },
      });

      // If payment is successful, update subscription status
      if (payment.payment_status === 'COMPLETED') {
        await this.prisma.subscriptions.update({
          where: { subscription_id: subscription.subscription_id },
          data: { is_active: true },
        });
      }

      return payment;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to process payment', 500);
    }
  }

  async getPaymentsByUser(userId: number) {
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
      throw new ApiError('Failed to fetch user payments', 500);
    }
  }

  async getPaymentsBySubscription(subscriptionId: number) {
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
      throw new ApiError('Failed to fetch subscription payments', 500);
    }
  }

  async getPaymentById(paymentId: number) {
    try {
      const payment = await this.prisma.payments.findUnique({
        where: { payment_id: paymentId },
        include: {
          subscription: {
            include: {
              plan: true,
            },
          },
        },
      });

      if (!payment) {
        throw new ApiError('Payment not found', 404);
      }

      return payment;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to fetch payment details', 500);
    }
  }

  async updatePaymentStatus(paymentId: number, status: string) {
    try {
      const payment = await this.prisma.payments.update({
        where: { payment_id: paymentId },
        data: { payment_status: status },
        include: {
          subscription: true,
        },
      });

      // Update subscription status based on payment status
      if (status === 'COMPLETED') {
        await this.prisma.subscriptions.update({
          where: { subscription_id: payment.subscription_id },
          data: { is_active: true },
        });
      } else if (status === 'FAILED' || status === 'REFUNDED') {
        await this.prisma.subscriptions.update({
          where: { subscription_id: payment.subscription_id },
          data: { is_active: false },
        });
      }

      return payment;
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