import { Router, type Router as ExpressRouter } from 'express';
import { validateRequest } from '../../common/middleware/index.js';
import { asyncHandler } from '../../common/utils/index.js';
import {
  generateOutreach,
  getOutreachByLead,
  ingestResendDeliveryEvent,
  reviewOutreach,
  sendOutreach,
} from './outreach.controller.js';
import {
  generateOutreachRequestSchema,
  getOutreachByLeadRequestSchema,
  resendDeliveryEventRequestSchema,
  reviewOutreachRequestSchema,
  sendOutreachRequestSchema,
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

outreachRouter.patch(
  '/outreach/:id/review',
  validateRequest(reviewOutreachRequestSchema),
  asyncHandler(reviewOutreach),
);

outreachRouter.post(
  '/outreach/:id/send',
  validateRequest(sendOutreachRequestSchema),
  asyncHandler(sendOutreach),
);

outreachRouter.post(
  '/webhooks/resend/outreach-events',
  validateRequest(resendDeliveryEventRequestSchema),
  asyncHandler(ingestResendDeliveryEvent),
);

export { outreachRouter };
