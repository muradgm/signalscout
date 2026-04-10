import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

dotenv.config({ path: path.join(repoRoot, '.env') });

const required = (value, name) => {
  const normalized = value?.trim() ?? '';
  if (!normalized) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return normalized;
};

const toBase64Url = (value) =>
  Buffer.from(value)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');

const fromBase64Url = (value) => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padding = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4));
  return Buffer.from(`${normalized}${padding}`, 'base64').toString('utf8');
};

const stripHtml = (value) =>
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

const normalizeWhitespace = (value) =>
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

const cleanInboundBody = (value) => {
  const normalized = normalizeWhitespace(/<[^>]+>/.test(value) ? stripHtml(value) : value);

  if (!normalized) {
    return null;
  }

  const cleanedLines = [];

  for (const line of normalized.split('\n')) {
    const trimmed = line.trim();

    if (trimmed.startsWith('>')) {
      break;
    }

    if (quoteBoundaryPatterns.some((pattern) => pattern.test(trimmed))) {
      break;
    }

    if (signatureBoundaryPatterns.some((pattern) => pattern.test(trimmed))) {
      break;
    }

    cleanedLines.push(line);
  }

  const cleaned = normalizeWhitespace(cleanedLines.join('\n'));
  return cleaned || null;
};

const getHeader = (headers, name) =>
  headers.find((header) => header.name?.toLowerCase() === name.toLowerCase())?.value ?? null;

const extractMessageIds = (value) => {
  if (!value || typeof value !== 'string') {
    return [];
  }

  return value
    .split(/\s+/)
    .map((part) => part.trim().replace(/^<|>$/g, ''))
    .filter(Boolean);
};

const extractBody = (payload) => {
  if (!payload) {
    return null;
  }

  if (payload.mimeType === 'text/plain' && payload.body?.data) {
    return cleanInboundBody(fromBase64Url(payload.body.data));
  }

  if (payload.mimeType === 'text/html' && payload.body?.data) {
    return cleanInboundBody(fromBase64Url(payload.body.data));
  }

  for (const part of payload.parts ?? []) {
    const candidate = extractBody(part);
    if (candidate) {
      return candidate;
    }
  }

  return null;
};

const getAccessToken = async (clientId, clientSecret, refreshToken) => {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok || !payload?.access_token) {
    throw new Error(
      `Failed to refresh Gmail OAuth token: ${response.status} ${JSON.stringify(payload)}`,
    );
  }

  return payload.access_token;
};

const gmailFetch = async (accessToken, url) => {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(`Gmail API request failed: ${response.status} ${JSON.stringify(payload)}`);
  }

  return payload;
};

const loadState = async (stateFile) => {
  try {
    const raw = await fs.readFile(stateFile, 'utf8');
    const parsed = JSON.parse(raw);
    return {
      processedMessageIds: Array.isArray(parsed.processedMessageIds)
        ? parsed.processedMessageIds.filter((value) => typeof value === 'string')
        : [],
      lastRunAt: typeof parsed.lastRunAt === 'string' ? parsed.lastRunAt : null,
    };
  } catch {
    return {
      processedMessageIds: [],
      lastRunAt: null,
    };
  }
};

const saveState = async (stateFile, state) => {
  await fs.mkdir(path.dirname(stateFile), { recursive: true });
  await fs.writeFile(
    stateFile,
    JSON.stringify(
      {
        processedMessageIds: state.processedMessageIds.slice(-500),
        lastRunAt: new Date().toISOString(),
      },
      null,
      2,
    ),
  );
};

const createSignedWebhookRequest = ({ webhookSecret, payload }) => {
  const key = Buffer.from(
    webhookSecret.startsWith('whsec_') ? webhookSecret.slice(6) : webhookSecret,
    'base64',
  );
  const msgId = `msg_${Date.now()}`;
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signedContent = `${msgId}.${timestamp}.${payload}`;
  const digest = crypto.createHmac('sha256', key).update(signedContent).digest('base64');

  return {
    payload,
    headers: {
      'content-type': 'application/json',
      'svix-id': msgId,
      'svix-timestamp': timestamp,
      'svix-signature': `v1,${digest}`,
    },
  };
};

const parseArgs = () => {
  const args = process.argv.slice(2);
  return {
    watch: args.includes('--watch'),
  };
};

const config = {
  apiBaseUrl: (process.env.PUBLIC_API_BASE_URL || 'http://127.0.0.1:4000').replace(/\/+$/, ''),
  webhookSecret: required(
    process.env.RESEND_INBOUND_WEBHOOK_SECRET,
    'RESEND_INBOUND_WEBHOOK_SECRET',
  ),
  replyToEmail: required(process.env.RESEND_REPLY_TO_EMAIL, 'RESEND_REPLY_TO_EMAIL'),
  gmailClientId: required(
    process.env.GMAIL_REPLY_BRIDGE_CLIENT_ID,
    'GMAIL_REPLY_BRIDGE_CLIENT_ID',
  ),
  gmailClientSecret: required(
    process.env.GMAIL_REPLY_BRIDGE_CLIENT_SECRET,
    'GMAIL_REPLY_BRIDGE_CLIENT_SECRET',
  ),
  gmailRefreshToken: required(
    process.env.GMAIL_REPLY_BRIDGE_REFRESH_TOKEN,
    'GMAIL_REPLY_BRIDGE_REFRESH_TOKEN',
  ),
  gmailQuery:
    process.env.GMAIL_REPLY_BRIDGE_QUERY?.trim() ||
    `in:anywhere to:${process.env.RESEND_REPLY_TO_EMAIL ?? ''}`,
  pollIntervalMs: Number(process.env.GMAIL_REPLY_BRIDGE_POLL_INTERVAL_MS ?? '60000'),
  stateFile:
    process.env.GMAIL_REPLY_BRIDGE_STATE_FILE?.trim() ||
    path.join(repoRoot, 'scripts', 'tmp', 'gmailReplyBridgeState.json'),
};

const endpointUrl = config.apiBaseUrl.includes('/api')
  ? `${config.apiBaseUrl}/webhooks/resend/inbound-replies`
  : `${config.apiBaseUrl}/api/webhooks/resend/inbound-replies`;

const listCandidateMessages = async (accessToken) => {
  const query = `${config.gmailQuery} newer_than:7d`;
  const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(query)}&maxResults=25`;
  const payload = await gmailFetch(accessToken, url);
  return Array.isArray(payload.messages) ? payload.messages : [];
};

const fetchMessage = async (accessToken, messageId) => {
  const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}?format=full`;
  return gmailFetch(accessToken, url);
};

const buildWebhookPayloadFromGmailMessage = (message) => {
  const headers = message.payload?.headers ?? [];
  const subject = getHeader(headers, 'Subject');
  const from = getHeader(headers, 'From');
  const messageId = getHeader(headers, 'Message-Id') || `<gmail-${message.id}>`;
  const inReplyTo = getHeader(headers, 'In-Reply-To');
  const references = getHeader(headers, 'References');
  const body = extractBody(message.payload);

  if (!from || !subject || !body) {
    return null;
  }

  const referenceIds = [
    ...extractMessageIds(inReplyTo),
    ...extractMessageIds(references),
  ];

  if (referenceIds.length === 0) {
    return null;
  }

  return {
    type: 'email.received',
    created_at: new Date(Number(message.internalDate || Date.now())).toISOString(),
    data: {
      from,
      subject,
      text: body,
      message_id: messageId,
      in_reply_to: inReplyTo,
      references,
      headers: {
        'in-reply-to': inReplyTo,
        references,
      },
    },
  };
};

const ingestMessages = async () => {
  const state = await loadState(config.stateFile);
  const accessToken = await getAccessToken(
    config.gmailClientId,
    config.gmailClientSecret,
    config.gmailRefreshToken,
  );
  const candidates = await listCandidateMessages(accessToken);
  let ingestedCount = 0;
  let skippedUncorrelatedCount = 0;

  for (const candidate of candidates) {
    if (!candidate.id || state.processedMessageIds.includes(candidate.id)) {
      continue;
    }

    const message = await fetchMessage(accessToken, candidate.id);
    const webhookPayload = buildWebhookPayloadFromGmailMessage(message);

    state.processedMessageIds.push(candidate.id);

    if (!webhookPayload) {
      continue;
    }

    const request = createSignedWebhookRequest({
      webhookSecret: config.webhookSecret,
      payload: JSON.stringify(webhookPayload),
    });

    const response = await fetch(endpointUrl, {
      method: 'POST',
      headers: request.headers,
      body: request.payload,
    });

    const responseText = await response.text();

    if (!response.ok) {
      if (
        response.status === 404 &&
        responseText.includes('Unable to correlate inbound reply to an outreach')
      ) {
        skippedUncorrelatedCount += 1;
        console.warn(
          `Skipped uncorrelated Gmail message ${candidate.id}; no matching outreach was found.`,
        );
        continue;
      }

      throw new Error(
        `Inbound reply bridge failed for Gmail message ${candidate.id}: ${response.status} ${responseText}`,
      );
    }

    ingestedCount += 1;
  }

  await saveState(config.stateFile, state);
  console.log(
    JSON.stringify(
      {
        scanned: candidates.length,
        ingested: ingestedCount,
        skippedUncorrelated: skippedUncorrelatedCount,
      },
      null,
      2,
    ),
  );
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const main = async () => {
  const { watch } = parseArgs();

  if (!watch) {
    await ingestMessages();
    return;
  }

  while (true) {
    try {
      await ingestMessages();
    } catch (error) {
      console.error(
        error instanceof Error ? error.message : 'Unknown Gmail reply bridge error',
      );
    }

    await sleep(config.pollIntervalMs);
  }
};

await main();
