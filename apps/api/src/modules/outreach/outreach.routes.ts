import { Router, type Router as ExpressRouter } from 'express';
import { validateRequest } from '../../common/middleware/index.js';
import { asyncHandler } from '../../common/utils/index.js';
import {
  generateOutreach,
  getOutreachByLead,
} from './outreach.controller.js';
import {
  generateOutreachRequestSchema,
  getOutreachByLeadRequestSchema,
} from './outreach.schema.js';

const outreachRouter: ExpressRouter = Router();

outreachRouter.post(
  '/leads/:id/outreach',
  validateRequest(generateOutreachRequestSchema),
  asyncHandler(generateOutreach),
);

outreachRouter.get(
  '/outreach/lead',
  validateRequest(getOutreachByLeadRequestSchema),
  asyncHandler(getOutreachByLead),
);

export { outreachRouter };