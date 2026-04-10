import { Router, type Router as ExpressRouter } from 'express';
import { validateRequest } from '../../common/middleware/index.js';
import { asyncHandler } from '../../common/utils/index.js';
import {
  createReply,
  getRecentReplies,
  getRepliesByLead,
  ingestResendInboundReply,
} from './replies.controller.js';
import {
  createReplyRequestSchema,
  getRecentRepliesRequestSchema,
  getRepliesByLeadRequestSchema,
  resendInboundReplyRequestSchema,
} from './replies.schema.js';

const repliesRouter: ExpressRouter = Router();

repliesRouter.post(
  '/outreach/:id/replies',
  validateRequest(createReplyRequestSchema),
  asyncHandler(createReply),
);

repliesRouter.get(
  '/replies/lead',
  validateRequest(getRepliesByLeadRequestSchema),
  asyncHandler(getRepliesByLead),
);

repliesRouter.get(
  '/replies/recent',
  validateRequest(getRecentRepliesRequestSchema),
  asyncHandler(getRecentReplies),
);

repliesRouter.post(
  '/webhooks/resend/inbound-replies',
  validateRequest(resendInboundReplyRequestSchema),
  asyncHandler(ingestResendInboundReply),
);

export { repliesRouter };
