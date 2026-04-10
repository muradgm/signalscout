import type {
  DeliveryEventType,
  DeliveryProvider,
  OutreachMessage,
} from '@signalscout/core';
import type { Request, Response } from 'express';
import { Resend } from 'resend';
import { env } from '../../bootstrap/env.js';
import { AppError, ConflictError, NotFoundError } from '../../common/errors/index.js';
import { ok } from '../../common/responses/index.js';
import {
  deliveryEventRepository,
  detectSignalsForOutreachUseCase,
  getAuditByIdForOutreachUseCase,
  getDeliveryTelemetryByOutreachUseCase,
  generateOutreachUseCase,
  getAuditByLeadAndSnapshotForOutreachUseCase,
  getLatestLeadSnapshotForOutreachUseCase,
  getLeadByIdForOutreachUseCase,
  getLeadSnapshotByIdForOutreachUseCase,
  getOutreachByLeadUseCase,
  outreachRepository,
  reviewOutreachUseCase,
  sendOutreachUseCase,
} from '../../wiring/outreach.wiring.js';
import { mapOutreachToResponse } from './outreach.mapper.js';

const resend = new Resend(env.resendApiKey || 're_placeholder');

const validateIdParam = (id: string | string[] | undefined): string => {
  if (typeof id !== 'string' || !id.trim()) {
    throw new NotFoundError('Invalid lead ID');
  }

  return id;
};

const buildWebhookHeaders = (req: Request) => {
  const id = req.header('svix-id')?.trim() ?? '';
  const timestamp = req.header('svix-timestamp')?.trim() ?? '';
  const signature = req.header('svix-signature')?.trim() ?? '';

  if (!id || !timestamp || !signature) {
    throw new AppError('Missing resend webhook signature headers', 401);
  }

  return { id, timestamp, signature };
};

const verifyResendWebhook = (
  req: Request,
  webhookSecret: string,
): void => {
  const rawBody = (req as Request & { rawBody?: string }).rawBody;

  if (!rawBody) {
    throw new AppError('Missing raw webhook payload for verification', 400);
  }

  try {
    resend.webhooks.verify({
      payload: rawBody,
      headers: buildWebhookHeaders(req),
      webhookSecret,
    });
  } catch {
    throw new AppError('Invalid resend webhook signature', 401);
  }
};

const isOutreachSendError = (
  error: unknown,
): error is Error & { code: string } => {
  return (
    error instanceof Error &&
    error.name === 'OutreachSendError' &&
    typeof (error as { code?: unknown }).code === 'string'
  );
};

const getSenderDomain = (senderEmail: string): string | null => {
  const normalizedEmail = senderEmail.trim().toLowerCase();

  if (!normalizedEmail.includes('@')) {
    return null;
  }

  return normalizedEmail.split('@')[1] ?? null;
};

const resolveSenderReadiness = (senderEmail: string) => {
  const normalizedEmail = senderEmail.trim().toLowerCase();
  const senderDomain = getSenderDomain(normalizedEmail);

  if (!normalizedEmail) {
    return {
      senderMode: 'missing' as const,
      senderReadiness: 'missing' as const,
      productionReady: false,
      senderDomain,
    };
  }

  if (normalizedEmail === 'onboarding@resend.dev') {
    return {
      senderMode: 'development' as const,
      senderReadiness: 'development_only' as const,
      productionReady: false,
      senderDomain,
    };
  }

  const allowedDomainMatch =
    senderDomain !== null &&
    env.outreachAllowedSenderDomains.includes(senderDomain);

  return {
    senderMode: 'configured' as const,
    senderReadiness: allowedDomainMatch ? 'production_ready' as const : 'unverified' as const,
    productionReady: allowedDomainMatch,
    senderDomain,
  };
};

const trimTrailingSlash = (value: string): string => value.replace(/\/+$/, '');

const resolveWebhookHosting = (publicApiBaseUrl: string) => {
  const normalizedBaseUrl = trimTrailingSlash(publicApiBaseUrl.trim());

  if (!normalizedBaseUrl) {
    return {
      webhookEndpointUrl: null,
      webhookHosting: 'not_configured' as const,
      webhookHostingReady: false,
      webhookHostingWarning:
        'PUBLIC_API_BASE_URL is not configured, so the webhook host is not explicitly tracked.',
    };
  }

  try {
    const url = new URL(normalizedBaseUrl);
    const hostname = url.hostname.toLowerCase();
    const isReservedNgrokDomain = hostname.endsWith('.ngrok-free.dev');
    const isTemporaryTunnel =
      (!isReservedNgrokDomain && hostname.includes('ngrok')) ||
      hostname.includes('trycloudflare') ||
      hostname.includes('loca.lt') ||
      hostname.includes('localtunnel');

    return {
      webhookEndpointUrl: `${normalizedBaseUrl}/api/webhooks/resend/outreach-events`,
      webhookHosting: isTemporaryTunnel ? ('temporary_tunnel' as const) : ('stable_public' as const),
      webhookHostingReady: !isTemporaryTunnel,
      webhookHostingWarning: isTemporaryTunnel
        ? 'Webhook delivery currently depends on a temporary tunnel URL. Replace it with stable public hosting before relying on it in production.'
        : null,
    };
  } catch {
    return {
      webhookEndpointUrl: null,
      webhookHosting: 'not_configured' as const,
      webhookHostingReady: false,
      webhookHostingWarning:
        'PUBLIC_API_BASE_URL is invalid, so the public webhook endpoint cannot be derived safely.',
    };
  }
};

const buildExecutionContext = async (outreach: OutreachMessage) => {
  const snapshot = await getLatestLeadSnapshotForOutreachUseCase.execute(
    outreach.leadId,
  );
  const recipientEmail = snapshot?.contactInfo.emails[0]?.trim() ?? null;
  const senderEmail = env.resendFromEmail.trim();
  const senderName = env.resendFromName.trim();
  const senderIdentity = senderEmail
    ? `${senderName || 'SignalScout'} <${senderEmail}>`
    : null;
  const senderConfig = resolveSenderReadiness(senderEmail);
  const telemetryMode = env.resendWebhookSecret.trim()
    ? 'webhook_backed'
    : 'workspace_only';
  const webhookConfig = resolveWebhookHosting(env.publicApiBaseUrl);

  let blockingReason: string | null = null;

  if (outreach.status === 'sent') {
    blockingReason = 'This outreach has already been sent.';
  } else if (outreach.status !== 'approved') {
    blockingReason = 'Approve the draft before sending.';
  } else if (!(outreach.subject ?? '').trim() || !(outreach.body ?? '').trim()) {
    blockingReason = 'Add both a subject and body before sending.';
  } else if (!recipientEmail) {
    blockingReason = 'No recipient email is available on the latest lead snapshot.';
  } else if (!env.resendApiKey.trim()) {
    blockingReason = 'Configure RESEND_API_KEY before sending.';
  } else if (senderConfig.senderMode === 'missing') {
    blockingReason = 'Configure RESEND_FROM_EMAIL before sending.';
  } else if (env.isProduction && !senderConfig.productionReady) {
    blockingReason =
      'Production mode requires a sender domain listed in OUTREACH_ALLOWED_SENDER_DOMAINS.';
  } else if (senderConfig.senderMode === 'development' && !env.allowDevelopmentSender) {
    blockingReason =
      'Development sender usage is blocked until ALLOW_DEVELOPMENT_SENDER=true is set explicitly.';
  }

  return {
    recipientEmail,
    senderIdentity,
    senderMode: senderConfig.senderMode,
    senderProvider: 'resend' as const,
    senderDomain: senderConfig.senderDomain,
    senderReadiness: senderConfig.senderReadiness,
    productionReady: senderConfig.productionReady,
    telemetryMode,
    webhookEndpointUrl: webhookConfig.webhookEndpointUrl,
    webhookHosting: webhookConfig.webhookHosting,
    webhookHostingReady: webhookConfig.webhookHostingReady,
    webhookHostingWarning: webhookConfig.webhookHostingWarning,
    canSend: blockingReason === null,
    blockingReason,
  } as const;
};

const buildDeliveryContext = async (outreach: OutreachMessage) => {
  const telemetry = await getDeliveryTelemetryByOutreachUseCase.execute(outreach.id);

  return {
    provider: outreach.deliveryProvider,
    providerMessageId: outreach.providerMessageId,
    summary: {
      totalEvents: telemetry.summary.totalEvents,
      latestEventType: telemetry.summary.latestEventType,
      latestEventAt: telemetry.summary.latestEventAt?.toISOString() ?? null,
      deliveredCount: telemetry.summary.deliveredCount,
      openedCount: telemetry.summary.openedCount,
      clickedCount: telemetry.summary.clickedCount,
      bouncedCount: telemetry.summary.bouncedCount,
      complainedCount: telemetry.summary.complainedCount,
      failedCount: telemetry.summary.failedCount,
    },
    recentEvents: telemetry.recentEvents.map((event) => ({
      id: event.id,
      eventType: event.eventType,
      occurredAt: event.occurredAt.toISOString(),
      recordedAt: event.recordedAt.toISOString(),
      summary: event.summary,
      errorCode: event.errorCode,
      retryable: event.retryable,
      providerMessageId: event.providerMessageId,
    })),
  };
};

const okOutreach = async (
  res: Response,
  outreach: OutreachMessage,
  statusCode = 200,
): Promise<void> => {
  ok(
    res,
    mapOutreachToResponse(
      outreach,
      await buildExecutionContext(outreach),
      await buildDeliveryContext(outreach),
    ),
    statusCode,
  );
};

export const generateOutreach = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const leadId = validateIdParam(req.params.id);
  const lead = await getLeadByIdForOutreachUseCase.execute(leadId);

  if (!lead) {
    throw new NotFoundError('Lead not found');
  }

  let snapshot = await getLatestLeadSnapshotForOutreachUseCase.execute(leadId);
  let audit = null;

  if (req.body.auditId) {
    audit = await getAuditByIdForOutreachUseCase.execute(req.body.auditId);

    if (!audit || audit.leadId !== leadId) {
      throw new NotFoundError('Audit not found for lead');
    }

    snapshot = await getLeadSnapshotByIdForOutreachUseCase.execute(
      audit.snapshotId,
    );
  } else {
    if (!snapshot) {
      throw new NotFoundError('Lead snapshot not found');
    }

    audit = await getAuditByLeadAndSnapshotForOutreachUseCase.execute(
      leadId,
      snapshot.id,
    );
  }

  if (!audit) {
    throw new NotFoundError('Audit not found for latest lead snapshot');
  }

  if (!snapshot || snapshot.id !== audit.snapshotId) {
    throw new NotFoundError('Snapshot not found for selected audit');
  }

  const signals = await detectSignalsForOutreachUseCase.execute(lead, snapshot);

  const outreach = await generateOutreachUseCase.execute({
    lead,
    snapshot,
    signals,
    audit,
  });

  await okOutreach(res, outreach, 201);
};

export const getOutreachByLead = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const outreach = await getOutreachByLeadUseCase.execute(
    req.query.leadId as string,
  );

  if (!outreach) {
    throw new NotFoundError('Outreach not found');
  }

  await okOutreach(res, outreach);
};

export const reviewOutreach = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const outreach = await reviewOutreachUseCase.execute({
    outreachId: validateIdParam(req.params.id),
    action: req.body.action,
    subject: req.body.subject,
    body: req.body.body,
  });

  if (!outreach) {
    throw new NotFoundError('Outreach not found');
  }

  await okOutreach(res, outreach);
};

export const sendOutreach = async (
  req: Request,
  res: Response,
): Promise<void> => {
  let outreach;

  try {
    outreach = await sendOutreachUseCase.execute(validateIdParam(req.params.id));
  } catch (error) {
    if (isOutreachSendError(error)) {
      if (
        error.code === 'not_ready' ||
        error.code === 'missing_recipient' ||
        error.code === 'missing_content'
      ) {
        throw new ConflictError(error.message);
      }

      if (error.code === 'configuration' || error.code === 'provider_failed') {
        throw new AppError(error.message, 503);
      }
    }

    throw error;
  }

  if (!outreach) {
    throw new NotFoundError('Outreach not found');
  }

  await okOutreach(res, outreach);
};

const mapResendEventType = (value: string): DeliveryEventType => {
  const normalized = value.trim().toLowerCase();

  if (normalized === 'email.sent' || normalized === 'sent') return 'provider_accepted';
  if (normalized === 'email.delivered' || normalized === 'delivered') return 'delivered';
  if (normalized === 'email.delivery_delayed' || normalized === 'delivery_delayed') {
    return 'delivery_delayed';
  }
  if (normalized === 'email.bounced' || normalized === 'bounced') return 'bounced';
  if (normalized === 'email.complained' || normalized === 'complained') return 'complained';
  if (normalized === 'email.opened' || normalized === 'opened') return 'opened';
  if (normalized === 'email.clicked' || normalized === 'clicked') return 'clicked';

  return 'failed';
};

const isRetryableWebhookEvent = (eventType: DeliveryEventType): boolean => {
  return eventType === 'delivery_delayed' || eventType === 'failed';
};

const extractProviderMessageId = (data: Record<string, unknown>): string | null => {
  const candidates = [
    data.email_id,
    data.emailId,
    typeof data.email === 'object' && data.email !== null ? (data.email as { id?: unknown }).id : null,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim().length > 0) {
      return candidate.trim();
    }
  }

  return null;
};

export const ingestResendDeliveryEvent = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (!env.resendWebhookSecret.trim()) {
    throw new AppError('RESEND_WEBHOOK_SECRET is not configured', 503);
  }
  verifyResendWebhook(req, env.resendWebhookSecret.trim());

  const data = req.body.data as Record<string, unknown>;
  const providerMessageId = extractProviderMessageId(data);

  if (!providerMessageId) {
    throw new AppError('Provider message id is required for delivery event ingestion', 400);
  }

  const outreachId = await deliveryEventRepository.findOutreachIdByProviderMessageId(
    'resend' as DeliveryProvider,
    providerMessageId,
  );

  if (!outreachId) {
    throw new NotFoundError('Outreach not found for provider message id');
  }

  const latestOutreach = await outreachRepository.findById(outreachId);

  if (!latestOutreach) {
    throw new NotFoundError('Outreach not found');
  }

  const eventType = mapResendEventType(req.body.type);

  await deliveryEventRepository.save({
    outreachId: latestOutreach.id,
    leadId: latestOutreach.leadId,
    provider: 'resend',
    providerMessageId,
    eventType,
    occurredAt: req.body.created_at ? new Date(req.body.created_at) : new Date(),
    summary:
      typeof data.reason === 'string'
        ? data.reason
        : typeof data.response === 'string'
          ? data.response
          : typeof req.body.type === 'string'
            ? `Resend event received: ${req.body.type}`
            : 'Resend event received',
    errorCode: typeof data.error_code === 'string' ? data.error_code : null,
    retryable: isRetryableWebhookEvent(eventType),
  });

  ok(res, { accepted: true });
};
