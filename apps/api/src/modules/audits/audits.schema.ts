import { z } from 'zod';

const leadIdParamSchema = z.object({
  id: z.string().trim().min(1, 'Lead id is required'),
});

const leadIdQueryParamSchema = z.object({
  leadId: z.string().trim().min(1, 'Lead id is required'),
});

export const auditResponseSchema = z.object({
  id: z.string().min(1),
  leadId: z.string().min(1),
  snapshotId: z.string().min(1),
  summary: z.string().min(1),
  strengths: z.array(z.string()),
  opportunities: z.array(z.string()),
  opportunityDetails: z.array(z.string()),
  risks: z.array(z.string()),
  recommendedAngle: z.string().min(1),
  confidenceNote: z.string().min(1),
  evidence: z.array(z.string()),
  createdAt: z.string().datetime(),
});

export const generateAuditRequestSchema = z.object({
  body: z.object({}).default({}),
  params: leadIdParamSchema,
  query: z.object({}).default({}),
});

export const getAuditByLeadRequestSchema = z.object({
  body: z.object({}).default({}),
  params: z.object({}).default({}),
  query: leadIdQueryParamSchema,
});
