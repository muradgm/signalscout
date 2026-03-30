import { z } from 'zod';

const leadIdParamSchema = z.object({
  id: z.string().min(1, 'Lead id is required'),
});

const createLeadBodySchema = z.object({
  companyName: z.string().min(1, 'Company name is required').max(200),
  website: z.string().min(1, 'Website is required').max(500),
  niche: z.literal('dentist'),
  location: z.string().min(1, 'Location is required').max(200),
  country: z.string().min(1, 'Country is required').max(200),
  source: z.enum(['manual', 'import']),
});

export const createLeadRequestSchema = z.object({
  body: createLeadBodySchema,
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});

export const getLeadByIdRequestSchema = z.object({
  body: z.object({}).default({}),
  params: leadIdParamSchema,
  query: z.object({}).default({}),
});

export const getLeadSignalsRequestSchema = z.object({
  body: z.object({}).default({}),
  params: leadIdParamSchema,
  query: z.object({}).default({}),
});

export const refreshLeadSnapshotRequestSchema = z.object({
  body: z.object({}).default({}),
  params: leadIdParamSchema,
  query: z.object({}).default({}),
});

export const listLeadsRequestSchema = z.object({
  body: z.object({}).default({}),
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});