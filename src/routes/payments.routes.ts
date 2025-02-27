import { Hono } from 'hono';
import { PaymentsController } from '../controllers/payments.controller.js';
import { validateRequest } from '../middleware/validate-request.js';
import { paymentSchema } from '../models/schemas/payment.schema.js';

const router = new Hono();
const controller = new PaymentsController();

router.post('/', validateRequest({ body: paymentSchema }), controller.createPayment);
router.get('/user/:userId', controller.getPaymentsByUser);
router.get('/subscription/:subscriptionId', controller.getPaymentsBySubscription);
router.get('/:id', controller.getPaymentDetails);

export { router as paymentsRouter }; 