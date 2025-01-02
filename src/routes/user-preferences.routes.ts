import { Hono } from 'hono';
import { UserPreferencesController } from '../controllers/user-preferences.controller';
import { validateRequest } from '../middleware/validate-request';
import { userPreferenceSchema } from '../models/schemas/user-preference.schema';

const router = new Hono();
const controller = new UserPreferencesController();

router.get('/:userId', controller.getUserPreferences);
router.put('/:userId', validateRequest({ body: userPreferenceSchema }), controller.updatePreferences);
router.put('/:userId/genres', controller.updateGenrePreferences);
router.put('/:userId/languages', controller.updateLanguagePreferences);
router.put('/:userId/watch-time', controller.updateWatchTimePreferences);

export { router as userPreferencesRouter }; 