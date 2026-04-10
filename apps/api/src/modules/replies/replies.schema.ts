import { z } from 'zod';

const outreachIdParamSchema = z.object({
  id: z.string().trim().min(1, 'Outreach id is required'),
});

const leadIdQueryParamSchema = z.object({
  leadId: z.string().trim().min(1, 'Lead id is required'),
});

const recentRepliesQueryParamSchema = z.object({
  limit: z.coerce.number().int().min(1).max(25).optional(),
});

export const replyResponseSchema = z.object({
  id: z.string().min(1),
  leadId: z.string().min(1),
  outreachId: z.string().min(1),
  channel: z.literal('email'),
  source: z.enum(['manual', 'provider_webhook']),
  providerMessageId: z.string().nullable(),
  inReplyToProviderMessageId: z.string().nullable(),
  fromEmail: z.string().email(),
  subject: z.string().nullable(),
  body: z.string().min(1),
  receivedAt: z.string().datetime(),
  createdAt: z.string().datetime(),
});

export const createReplyRequestSchema = z.object({
  body: z.object({
    fromEmail: z.string().email(),
    subject: z.string().trim().nullable().optional(),
    body: z.string().trim().min(1, 'Reply body is required'),
    source: z.enum(['manual', 'provider_webhook']).default('manual'),
    providerMessageId: z.string().trim().min(1).nullable().optional(),
    inReplyToProviderMessageId: z.string().trim().min(1).nullable().optional(),
    receivedAt: z.string().datetime().optional(),
  }),
  params: outreachIdParamSchema,
  query: z.object({}).default({}),
});

export const getRepliesByLeadRequestSchema = z.object({
  body: z.object({}).default({}),
  params: z.object({}).default({}),
  query: leadIdQueryParamSchema,
});

export const getRecentRepliesRequestSchema = z.object({
  body: z.object({}).default({}),
  params: z.object({}).default({}),
  query: recentRepliesQueryParamSchema,
});

export const resendInboundReplyRequestSchema = z.object({
  body: z.object({
    type: z.string().trim().min(1).optional(),
    created_at: z.string().datetime().optional(),
    data: z.object({}).passthrough(),
  }).passthrough(),
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});
