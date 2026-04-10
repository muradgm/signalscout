import { z } from 'zod';

const leadIdParamSchema = z.object({
  id: z.string().trim().min(1, 'Lead id is required'),
});

const createLeadBodySchema = z.object({
  companyName: z.string().trim().min(1, 'Company name is required').max(200),
  website: z.string().trim().min(1, 'Website is required').max(500),
  niche: z.literal('dentist'),
  location: z.string().trim().min(1, 'Location is required').max(200),
  country: z.string().trim().min(1, 'Country is required').max(200),
  source: z.enum(['manual', 'import']),
});

export const leadResponseSchema = z.object({
  id: z.string().min(1),
  companyName: z.string().min(1),
  website: z.string().min(1),
  niche: z.string().min(1),
  location: z.string().min(1),
  country: z.string().min(1),
  source: z.enum(['manual', 'import']),
  status: z.string().min(1),
  completeness: z.string().min(1),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const contactEnrichmentItemSchema = z.object({
  value: z.string().min(1),
  sourceKind: z.enum(['main_page', 'official_site', 'external_public']),
  sourceUrl: z.string().min(1),
  confidence: z.enum(['high', 'medium', 'low']),
});

export const leadSnapshotResponseSchema = z.object({
  id: z.string().min(1),
  leadId: z.string().min(1),
  url: z.string().min(1),
  pageTitle: z.string().nullable(),
  metaDescription: z.string().nullable(),
  visibleText: z.string(),
  contactInfo: z.object({
    emails: z.array(z.string()),
    phones: z.array(z.string()),
    addresses: z.array(z.string()),
  }),
  contactEnrichment: z.object({
    emails: z.array(contactEnrichmentItemSchema),
    phones: z.array(contactEnrichmentItemSchema),
    addresses: z.array(contactEnrichmentItemSchema),
  }),
  bookingLinks: z.array(z.string()),
  trustSignals: z.array(z.string()),
  isPlaceholderContent: z.boolean(),
  extractedAt: z.string().datetime(),
});

export const signalSetResponseSchema = z.object({
  bookingPresence: z.string().min(1),
  contactClarity: z.string().min(1),
  trustSignalStrength: z.string().min(1),
  businessScale: z.string().min(1),
  localRelevance: z.string().min(1),
  outreachFit: z.string().min(1),
  fitReason: z.string().min(1),
  confidence: z.string().min(1),
  leadCompleteness: z.string().min(1),
  issuesDetected: z.array(z.string()),
  evidence: z.array(z.string()),
});

export const leadSignalsResponseSchema = z.object({
  lead: leadResponseSchema,
  snapshotId: z.string().min(1),
  signals: signalSetResponseSchema,
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
