import { Context } from 'hono';
import { PaymentsService } from '../services/payments.service.js';
import { ApiError } from '../utils/api-error.js';
import { PaymentInput } from '../models/schemas/payment.schema.js';

export class PaymentsController {
  private service: PaymentsService;

  constructor() {
    this.service = new PaymentsService();
  }

  createPayment = async (c: Context) => {
    try {
      const data = await c.req.json() as PaymentInput;
      const payment = await this.service.createPayment(data);
      return c.json({ success: true, data: payment }, 201);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to process payment', 500);
    }
  };

  getPaymentsByUser = async (c: Context) => {
    try {
      const userId = Number(c.param('userId'));
      const payments = await this.service.getPaymentsByUser(userId);
      return c.json({ success: true, data: payments });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to fetch payments', 500);
    }
  };

  getPaymentsBySubscription = async (c: Context) => {
    try {
      const subscriptionId = Number(c.param('subscriptionId'));
      const payments = await this.service.getPaymentsBySubscription(subscriptionId);
      return c.json({ success: true, data: payments });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to fetch subscription payments', 500);
    }
  };

  getPaymentDetails = async (c: Context) => {
    try {
      const paymentId = Number(c.param('id'));
      const payment = await this.service.getPaymentById(paymentId);
      
      if (!payment) {
        throw new ApiError('Payment not found', 404);
      }
      
      return c.json({ success: true, data: payment });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to fetch payment details', 500);
    }
  };
} 