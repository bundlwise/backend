import { Hono } from 'hono';
import { PaymentsController } from '../controllers/payments.controller';
import { validateRequest } from '../middleware/validate-request';
import { paymentSchema } from '../models/schemas/payment.schema';

const router = new Hono();
const controller = new PaymentsController();

router.post('/', validateRequest({ body: paymentSchema }), controller.createPayment);
router.get('/user/:userId', controller.getPaymentsByUser);
router.get('/subscription/:subscriptionId', controller.getPaymentsBySubscription);
router.get('/:id', controller.getPaymentDetails);

export { router as paymentsRouter }; 