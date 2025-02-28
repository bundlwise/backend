import { Hono } from 'hono';
import { subscriptionPlansRouter } from './subscription-plans.routes.js';
import { usersRouter } from './users.routes.js';
import { subscriptionsRouter } from './subscriptions.routes.js';
import { paymentsRouter } from './payments.routes.js';
import { userPreferencesRouter } from './user-preferences.routes.js';
import { contentMetadataRouter } from './content-metadata.routes.js';
import { watchHistoryRouter } from './watch-history.routes.js';
import { healthRouter } from './health.routes.js';

const router = new Hono();

// Health Routes
router.route('/health', healthRouter);

// API Routes
router.route('/api/v1/subscription-plans', subscriptionPlansRouter);
router.route('/api/v1/users', usersRouter);
router.route('/api/v1/subscriptions', subscriptionsRouter);
router.route('/api/v1/payments', paymentsRouter);
router.route('/api/v1/user-preferences', userPreferencesRouter);
router.route('/api/v1/content', contentMetadataRouter);
router.route('/api/v1/watch-history', watchHistoryRouter);

export { router }; 