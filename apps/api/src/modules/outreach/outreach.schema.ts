import { z } from 'zod';

const leadIdParamSchema = z.object({
  id: z.string().trim().min(1, 'Lead id is required'),
});

const outreachIdParamSchema = z.object({
  id: z.string().trim().min(1, 'Outreach id is required'),
});

const leadIdQueryParamSchema = z.object({
  leadId: z.string().trim().min(1, 'Lead id is required'),
});

export const outreachResponseSchema = z.object({
  id: z.string().min(1),
  leadId: z.string().min(1),
  auditId: z.string().min(1),
  channel: z.string().min(1),
  recommendation: z.string().min(1),
  status: z.string().min(1),
  reviewStatus: z.string().min(1),
  fitReason: z.string().min(1),
  bestAngle: z.string().min(1),
  generatedSubject: z.string().nullable(),
  generatedBody: z.string().nullable(),
  subject: z.string().nullable(),
  body: z.string().nullable(),
  reasoning: z.string().min(1),
  evidence: z.array(z.string()),
  reviewedAt: z.string().datetime().nullable(),
  sentAt: z.string().datetime().nullable(),
  sendAttemptCount: z.number().int().min(0),
  lastSendAttemptAt: z.string().datetime().nullable(),
  lastSendErrorCode: z.string().nullable(),
  lastSendError: z.string().nullable(),
  lastSendRetryable: z.boolean(),
  deliveryProvider: z.enum(['resend']).nullable(),
  providerMessageId: z.string().nullable(),
  createdAt: z.string().datetime(),
  execution: z.object({
    recipientEmail: z.string().email().nullable(),
    senderIdentity: z.string().min(1).nullable(),
    senderMode: z.enum(['configured', 'development', 'missing']),
    senderProvider: z.literal('resend'),
    senderDomain: z.string().min(1).nullable(),
    senderReadiness: z.enum([
      'production_ready',
      'development_only',
      'unverified',
      'missing',
    ]),
    productionReady: z.boolean(),
    telemetryMode: z.enum(['workspace_only', 'webhook_backed']),
    webhookEndpointUrl: z.string().url().nullable(),
    webhookHosting: z.enum(['stable_public', 'temporary_tunnel', 'not_configured']),
    webhookHostingReady: z.boolean(),
    webhookHostingWarning: z.string().min(1).nullable(),
    canSend: z.boolean(),
    blockingReason: z.string().min(1).nullable(),
  }),
  delivery: z.object({
    provider: z.enum(['resend']).nullable(),
    providerMessageId: z.string().nullable(),
    summary: z.object({
      totalEvents: z.number().int().min(0),
      latestEventType: z.string().min(1).nullable(),
      latestEventAt: z.string().datetime().nullable(),
      deliveredCount: z.number().int().min(0),
      openedCount: z.number().int().min(0),
      clickedCount: z.number().int().min(0),
      bouncedCount: z.number().int().min(0),
      complainedCount: z.number().int().min(0),
      failedCount: z.number().int().min(0),
    }),
    recentEvents: z.array(
      z.object({
        id: z.string().min(1),
        eventType: z.string().min(1),
        occurredAt: z.string().datetime(),
        recordedAt: z.string().datetime(),
        summary: z.string().nullable(),
        errorCode: z.string().nullable(),
        retryable: z.boolean(),
        providerMessageId: z.string().nullable(),
      }),
    ),
  }),
});

export const generateOutreachRequestSchema = z.object({
  body: z.object({
    auditId: z.string().trim().min(1, 'Audit id is required').optional(),
  }).default({}),
  params: leadIdParamSchema,
  query: z.object({}).default({}),
});

export const getOutreachByLeadRequestSchema = z.object({
  body: z.object({}).default({}),
  params: z.object({}).default({}),
  query: leadIdQueryParamSchema,
});

const editedReviewBodySchema = z.object({
  action: z.literal('edited'),
  subject: z.string().trim().min(1, 'Edited subject is required'),
  body: z.string().trim().min(1, 'Edited body is required'),
});

const acceptedReviewBodySchema = z.object({
  action: z.literal('accepted'),
  subject: z.string().trim().min(1).nullable().optional(),
  body: z.string().trim().min(1).nullable().optional(),
});

const skippedReviewBodySchema = z.object({
  action: z.literal('skipped'),
  subject: z.string().trim().min(1).nullable().optional(),
  body: z.string().trim().min(1).nullable().optional(),
});

export const reviewOutreachRequestSchema = z.object({
  body: z.discriminatedUnion('action', [
    editedReviewBodySchema,
    acceptedReviewBodySchema,
    skippedReviewBodySchema,
  ]),
  params: outreachIdParamSchema,
  query: z.object({}).default({}),
});

export const sendOutreachRequestSchema = z.object({
  body: z.object({}).default({}),
  params: outreachIdParamSchema,
  query: z.object({}).default({}),
});

export const resendDeliveryEventRequestSchema = z.object({
  body: z.object({
    type: z.string().trim().min(1),
    created_at: z.string().datetime().optional(),
    data: z.object({}).passthrough(),
  }).passthrough(),
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});
