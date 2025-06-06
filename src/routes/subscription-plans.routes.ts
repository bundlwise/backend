import { Hono } from 'hono';
import { SubscriptionPlansController } from '../controllers/subscription-plans.controller.js';
import { validateRequest } from '../middleware/validate-request.js';
import { subscriptionPlanSchema } from '../models/schemas/subscription-plan.schema.js';

const router = new Hono();
const controller = new SubscriptionPlansController();

router.get('/', controller.getAllPlans);
router.get('/:id', controller.getPlanById);
router.post('/', validateRequest({ body: subscriptionPlanSchema }), controller.createPlan);
router.put('/:id', validateRequest({ body: subscriptionPlanSchema }), controller.updatePlan);
router.delete('/:id', controller.deletePlan);

export { router as subscriptionPlansRouter }; 