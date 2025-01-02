import { Hono } from 'hono';
import { WatchHistoryController } from '../controllers/watch-history.controller';
import { validateRequest } from '../middleware/validate-request';
import { watchHistorySchema } from '../models/schemas/watch-history.schema';

const router = new Hono();
const controller = new WatchHistoryController();

router.post('/', validateRequest({ body: watchHistorySchema }), controller.createWatchRecord);
router.get('/profile/:profileId', controller.getProfileWatchHistory);
router.get('/content/:contentId/stats', controller.getContentWatchStats);
router.get('/profile/:profileId/continue', controller.getContinueWatching);
router.put('/:id/progress', controller.updateWatchProgress);

export { router as watchHistoryRouter }; 