import { Router } from 'express';
import { validateRequest } from '../../common/middleware/index.js';
import { asyncHandler } from '../../common/utils/index.js';
import {
  createLead,
  getLeadById,
  getLeadSignals,
  listLeads,
  refreshLeadSnapshot,
} from './leads.controller.js';
import {
  createLeadRequestSchema,
  getLeadByIdRequestSchema,
  getLeadSignalsRequestSchema,
  listLeadsRequestSchema,
  refreshLeadSnapshotRequestSchema,
} from './leads.schema.js';

const leadsRouter = Router();

leadsRouter.post(
  '/leads',
  validateRequest(createLeadRequestSchema),
  asyncHandler(createLead),
);

leadsRouter.get(
  '/leads',
  validateRequest(listLeadsRequestSchema),
  asyncHandler(listLeads),
);

leadsRouter.get(
  '/leads/:id/signals',
  validateRequest(getLeadSignalsRequestSchema),
  asyncHandler(getLeadSignals),
);

leadsRouter.get(
  '/leads/:id',
  validateRequest(getLeadByIdRequestSchema),
  asyncHandler(getLeadById),
);

leadsRouter.post(
  '/leads/:id/snapshot',
  validateRequest(refreshLeadSnapshotRequestSchema),
  asyncHandler(refreshLeadSnapshot),
);

export { leadsRouter };