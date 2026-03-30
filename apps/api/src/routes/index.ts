import { Router } from 'express';
import { auditsRouter } from '../modules/audits/audits.routes.js';
import { leadsRouter } from '../modules/leads/leads.routes.js';
import { outreachRouter } from '../modules/outreach/outreach.routes.js';
import { healthRouter } from './health.routes.js';

const router = Router();

router.use(healthRouter);
router.use(leadsRouter);
router.use(auditsRouter);
router.use(outreachRouter);

export { router };