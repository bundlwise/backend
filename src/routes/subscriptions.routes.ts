import { Hono } from 'hono';
import { SubscriptionsController } from '../controllers/subscriptions.controller.js';
import { validateRequest } from '../middleware/validate-request.js';
import { subscriptionSchema } from '../models/schemas/subscription.schema.js';

const router = new Hono();
const controller = new SubscriptionsController();

router.post('/', validateRequest({ body: subscriptionSchema }), controller.createSubscription);
router.get('/user/:userId', controller.getUserSubscriptions);
router.put('/:id/cancel', controller.cancelSubscription);
router.put('/:id/renew', controller.renewSubscription);

export { router as subscriptionsRouter }; 