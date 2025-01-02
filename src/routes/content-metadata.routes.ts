import { Hono } from 'hono';
import { ContentMetadataController } from '../controllers/content-metadata.controller';
import { validateRequest } from '../middleware/validate-request';
import { contentMetadataSchema } from '../models/schemas/content-metadata.schema';

const router = new Hono();
const controller = new ContentMetadataController();

router.get('/', controller.getAllContent);
router.get('/search', controller.searchContent);
router.get('/:id', controller.getContentById);
router.post('/', validateRequest({ body: contentMetadataSchema }), controller.createContent);
router.put('/:id', validateRequest({ body: contentMetadataSchema.partial() }), controller.updateContent);
router.delete('/:id', controller.deleteContent);

export { router as contentMetadataRouter }; 