import { Router } from 'express';
import { validateRequest } from '../../common/middleware/index.js';
import { asyncHandler } from '../../common/utils/index.js';
import { generateAudit, getAuditByLead } from './audits.controller.js';
import {
  generateAuditRequestSchema,
  getAuditByLeadRequestSchema,
} from './audits.schema.js';

const auditsRouter = Router();

auditsRouter.post(
  '/leads/:id/audit',
  validateRequest(generateAuditRequestSchema),
  asyncHandler(generateAudit),
);

auditsRouter.get(
  '/audits/lead',
  validateRequest(getAuditByLeadRequestSchema),
  asyncHandler(getAuditByLead),
);

export { auditsRouter };