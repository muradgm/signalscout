import { Router, type Router as ExpressRouter } from 'express';
import { healthCheck } from './health.controller.js';

const healthRouter: ExpressRouter = Router();

healthRouter.get('/health', healthCheck);

export { healthRouter };