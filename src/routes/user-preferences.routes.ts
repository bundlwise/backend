import { Hono } from 'hono';
import { UserPreferencesController } from '../controllers/user-preferences.controller.js';
import { validateRequest } from '../middleware/validate-request.js';
import { userPreferenceSchema } from '../models/schemas/user-preference.schema.js';

const router = new Hono();
const controller = new UserPreferencesController();

router.get('/:userId', controller.getUserPreferences);
router.put('/:userId', validateRequest({ body: userPreferenceSchema }), controller.updatePreferences);
router.put('/:userId/genres', controller.updateGenrePreferences);
router.put('/:userId/languages', controller.updateLanguagePreferences);
router.put('/:userId/watch-time', controller.updateWatchTimePreferences);

export { router as userPreferencesRouter }; 