import { Context } from 'hono';
import { SubscriptionsService } from '../services/subscriptions.service';
import { ApiError } from '../utils/api-error';
import { SubscriptionInput } from '../models/schemas/subscription.schema';

export class SubscriptionsController {
  private service: SubscriptionsService;

  constructor() {
    this.service = new SubscriptionsService();
  }

  createSubscription = async (c: Context) => {
    try {
      const data = await c.req.json() as SubscriptionInput;
      const subscription = await this.service.createSubscription(data);
      return c.json({ success: true, data: subscription }, 201);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to create subscription', 500);
    }
  };

  getUserSubscriptions = async (c: Context) => {
    try {
      const userId = Number(c.param('userId'));
      const subscriptions = await this.service.getUserSubscriptions(userId);
      return c.json({ success: true, data: subscriptions });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to fetch subscriptions', 500);
    }
  };

  cancelSubscription = async (c: Context) => {
    try {
      const subscriptionId = Number(c.param('id'));
      const userId = Number(c.param('userId'));
      await this.service.cancelSubscription(subscriptionId, userId);
      return c.json({ success: true, message: 'Subscription cancelled successfully' });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to cancel subscription', 500);
    }
  };

  renewSubscription = async (c: Context) => {
    try {
      const subscriptionId = Number(c.param('id'));
      const subscription = await this.service.renewSubscription(subscriptionId);
      return c.json({ success: true, data: subscription });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to renew subscription', 500);
    }
  };
} 