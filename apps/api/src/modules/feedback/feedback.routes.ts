import { Router, type Router as ExpressRouter } from 'express';
import { validateRequest } from '../../common/middleware/index.js';
import { asyncHandler } from '../../common/utils/index.js';
import { createGetOutreachLearningSummaryHandler } from './feedback.controller.js';
import { getOutreachLearningSummaryRequestSchema } from './feedback.schema.js';
import { createGetOutreachLearningSummary } from '../../wiring/feedback.factory.js';

const feedbackRouter: ExpressRouter = Router();
const getOutreachLearningSummary = createGetOutreachLearningSummaryHandler(
  createGetOutreachLearningSummary(),
);

feedbackRouter.get(
  '/feedback/outreach-learning',
  validateRequest(getOutreachLearningSummaryRequestSchema),
  asyncHandler(getOutreachLearningSummary),
);

export { feedbackRouter };
