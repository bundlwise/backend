import { Hono } from 'hono';
import { UsersController } from '../controllers/users.controller.js';
import { validateRequest } from '../middleware/validate-request.js';
import { userSchema } from '../models/schemas/user.schema.js';

const router = new Hono();
const controller = new UsersController();

router.post('/register', validateRequest({ body: userSchema }), controller.register);
router.get('/profile/:id', controller.getProfile);
router.put('/profile/:id', validateRequest({ body: userSchema.partial() }), controller.updateProfile);
router.delete('/:id', controller.deleteAccount);

export { router as usersRouter }; 