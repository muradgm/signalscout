import { Router, type Router as ExpressRouter } from 'express';
import { auditsRouter } from '../modules/audits/audits.routes.js';
import { healthRouter } from '../modules/health/health.routes.js';
import { leadsRouter } from '../modules/leads/leads.routes.js';
import { outreachRouter } from '../modules/outreach/outreach.routes.js';

const router: ExpressRouter = Router();

router.use(healthRouter);
router.use(leadsRouter);
router.use(auditsRouter);
router.use(outreachRouter);

export { router };