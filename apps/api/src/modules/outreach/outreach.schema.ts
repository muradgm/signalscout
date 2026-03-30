import { z } from 'zod';

const leadIdParamSchema = z.object({
  id: z.string().min(1, 'Lead id is required'),
});

const leadIdQueryParamSchema = z.object({
  leadId: z.string().min(1, 'Lead id is required'),
});

export const generateOutreachRequestSchema = z.object({
  body: z.object({}).default({}),
  params: leadIdParamSchema,
  query: z.object({}).default({}),
});

export const getOutreachByLeadRequestSchema = z.object({
  body: z.object({}).default({}),
  params: z.object({}).default({}),
  query: leadIdQueryParamSchema,
});