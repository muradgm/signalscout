import { Router, type Router as ExpressRouter } from 'express';
import { validateRequest } from '../../common/middleware/index.js';
import { healthCheck } from './health.controller.js';
import { healthCheckRequestSchema } from './health.schema.js';

const healthRouter: ExpressRouter = Router();

healthRouter.get('/health', validateRequest(healthCheckRequestSchema), healthCheck);

export { healthRouter };
