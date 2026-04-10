import type { Request, Response } from 'express';
import { Resend } from 'resend';
import { env } from '../../bootstrap/env.js';
import { AppError, NotFoundError } from '../../common/errors/index.js';
import { ok } from '../../common/responses/index.js';
import {
  createReplyUseCase,
  getRecentRepliesUseCase,
  getRepliesByLeadUseCase,
} from '../../wiring/replies.wiring.js';
import {
  leadSnapshotRepository,
  outreachRepository,
} from '../../wiring/replies.wiring.js';
import { mapReplyToResponse } from './replies.mapper.js';

const resend = new Resend(env.resendApiKey || 're_placeholder');

const validateIdParam = (id: string | string[] | undefined, label: string): string => {
  if (typeof id !== 'string' || !id.trim()) {
    throw new NotFoundError(`Invalid ${label}`);
  }

  return id;
};

export const createReply = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const reply = await createReplyUseCase.execute({
    outreachId: validateIdParam(req.params.id, 'outreach ID'),
    fromEmail: req.body.fromEmail,
    subject: req.body.subject ?? null,
    body: req.body.body,
    source: req.body.source,
    providerMessageId: req.body.providerMessageId ?? null,
    inReplyToProviderMessageId: req.body.inReplyToProviderMessageId ?? null,
    receivedAt: req.body.receivedAt ? new Date(req.body.receivedAt) : undefined,
  });

  if (!reply) {
    throw new NotFoundError('Outreach not found');
  }

  ok(res, mapReplyToResponse(reply), 201);
};

export const getRepliesByLead = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const replies = await getRepliesByLeadUseCase.execute(
    validateIdParam(
      typeof req.query.leadId === 'string' ? req.query.leadId : undefined,
      'lead ID',
    ),
  );

  ok(res, replies.map(mapReplyToResponse));
};

export const getRecentReplies = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const replies = await getRecentRepliesUseCase.execute(
    typeof req.query.limit === 'number' ? req.query.limit : 8,
  );

  ok(res, replies.map(mapReplyToResponse));
};

const stripMessageId = (value: string): string => value.trim().replace(/^<|>$/g, '');

const stripHtmlTags = (value: string): string =>
  value
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|tr|h[1-6])>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#39;/gi, "'")
    .replace(/&quot;/gi, '"');

const normalizeWhitespace = (value: string): string =>
  value
    .replace(/\r\n/g, '\n')
    .replace(/\t/g, ' ')
    .replace(/[ \u00A0]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ ]{2,}/g, ' ')
    .trim();

const quoteBoundaryPatterns = [
  /^on .+wrote:$/i,
  /^from:\s.+$/i,
  /^sent:\s.+$/i,
  /^subject:\s.+$/i,
  /^to:\s.+$/i,
  /^cc:\s.+$/i,
  /^-{2,}\s*original message\s*-{2,}$/i,
  /^_{2,}$/i,
];

const signatureBoundaryPatterns = [
  /^--\s?$/,
  /^sent from my .+$/i,
  /^get outlook for .+$/i,
  /^gesendet von meinem .+$/i,
  /^mit freundlichen gr(?:uessen|ussen|u?ss?en)[,]?$/i,
  /^best regards[,]?$/i,
  /^kind regards[,]?$/i,
];

const extractEmail = (value: unknown): string | null => {
  if (typeof value === 'string') {
    const match = value.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
    return match ? match[0].toLowerCase() : null;
  }

  if (value && typeof value === 'object') {
    const emailValue = (value as { email?: unknown }).email;
    return typeof emailValue === 'string' ? emailValue.trim().toLowerCase() : null;
  }

  return null;
};

const extractMessageIds = (value: unknown): string[] => {
  if (typeof value === 'string') {
    return value
      .split(/\s+/)
      .map((part) => stripMessageId(part))
      .filter((part) => part.length > 0);
  }

  if (Array.isArray(value)) {
    return value
      .flatMap((item) => extractMessageIds(item))
      .filter((part) => part.length > 0);
  }

  return [];
};

const cleanInboundBody = (value: string): string | null => {
  const normalized = normalizeWhitespace(
    /<[^>]+>/.test(value) ? stripHtmlTags(value) : value,
  );

  if (!normalized) {
    return null;
  }

  const cleanedLines: string[] = [];

  for (const line of normalized.split('\n')) {
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith('>')) {
      break;
    }

    if (quoteBoundaryPatterns.some((pattern) => pattern.test(trimmedLine))) {
      break;
    }

    if (signatureBoundaryPatterns.some((pattern) => pattern.test(trimmedLine))) {
      break;
    }

    cleanedLines.push(line);
  }

  const cleaned = normalizeWhitespace(cleanedLines.join('\n'));
  return cleaned || null;
};

const extractInboundBody = (data: Record<string, unknown>): string | null => {
  const candidates = [
    data.text,
    data.textBody,
    data.text_body,
    typeof data.content === 'object' && data.content !== null
      ? (data.content as { text?: unknown }).text
      : null,
    data.html,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim().length > 0) {
      const cleanedCandidate = cleanInboundBody(candidate);

      if (cleanedCandidate) {
        return cleanedCandidate;
      }
    }
  }

  return null;
};

const resolveReferencedProviderMessageIds = (
  data: Record<string, unknown>,
): string[] => {
  const headers =
    typeof data.headers === 'object' && data.headers !== null
      ? (data.headers as Record<string, unknown>)
      : {};

  return [
    ...extractMessageIds(data.in_reply_to),
    ...extractMessageIds(data.inReplyTo),
    ...extractMessageIds(headers['in-reply-to']),
    ...extractMessageIds(data.references),
    ...extractMessageIds(headers.references),
  ];
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

const resolveFallbackOutreach = async (
  fromEmail: string,
): Promise<Awaited<ReturnType<typeof outreachRepository.findById>> | null> => {
  const leadIds = await leadSnapshotRepository.findLeadIdsByEmail(fromEmail, 8);
  const candidates = await Promise.all(
    leadIds.map(async (leadId) => outreachRepository.findLatestByLeadId(leadId)),
  );

  return candidates
    .filter(
      (candidate): candidate is NonNullable<typeof candidate> =>
        candidate !== null &&
        candidate.deliveryProvider === 'resend' &&
        (candidate.status === 'sent' || candidate.status === 'replied') &&
        Boolean(candidate.providerMessageId),
    )
    .sort((left, right) => {
      const leftTime =
        left.sentAt?.getTime() ?? left.lastSendAttemptAt?.getTime() ?? left.createdAt.getTime();
      const rightTime =
        right.sentAt?.getTime() ?? right.lastSendAttemptAt?.getTime() ?? right.createdAt.getTime();

      return rightTime - leftTime;
    })[0] ?? null;
};

export const ingestResendInboundReply = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (!env.resendInboundWebhookSecret.trim()) {
    throw new AppError('RESEND_INBOUND_WEBHOOK_SECRET is not configured', 503);
  }

  verifyResendWebhook(req, env.resendInboundWebhookSecret.trim());

  const data =
    req.body && typeof req.body.data === 'object' && req.body.data !== null
      ? (req.body.data as Record<string, unknown>)
      : {};

  const fromEmail = extractEmail(data.from);
  const body = extractInboundBody(data);
  const providerMessageId = extractMessageIds(data.message_id ?? data.messageId)[0] ?? null;
  const referenceIds = resolveReferencedProviderMessageIds(data);

  if (!fromEmail) {
    throw new AppError('Inbound reply sender email is required', 400);
  }

  if (!body) {
    throw new AppError('Inbound reply body is required', 400);
  }

  let outreach = null;

  for (const referenceId of referenceIds) {
    outreach = await outreachRepository.findByProviderMessageId(referenceId);
    if (outreach) {
      break;
    }
  }

  if (!outreach) {
    outreach = await resolveFallbackOutreach(fromEmail);
  }

  if (!outreach) {
    throw new NotFoundError('Unable to correlate inbound reply to an outreach');
  }

  const reply = await createReplyUseCase.execute({
    outreachId: outreach.id,
    fromEmail,
    subject: typeof data.subject === 'string' ? data.subject : null,
    body,
    source: 'provider_webhook',
    providerMessageId,
    inReplyToProviderMessageId: referenceIds[0] ?? null,
    receivedAt: req.body.created_at ? new Date(req.body.created_at) : new Date(),
  });

  if (!reply) {
    throw new NotFoundError('Outreach not found');
  }

  ok(res, mapReplyToResponse(reply), 201);
};
