import crypto from 'node:crypto';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

dotenv.config({ path: path.join(repoRoot, '.env') });

const usage = () => {
  console.error(
    [
      'Usage:',
      '  node scripts/sendSignedInboundReplyWebhook.mjs <providerMessageId> <subject> <body> [fromEmail]',
      '',
      'Example:',
      '  node scripts/sendSignedInboundReplyWebhook.mjs e89c0c7e-f177-44f0-96b1-864b8c4695a6 "Re: Test" "Webhook reply body"',
    ].join('\n'),
  );
};

const [
  providerMessageId,
  subject,
  body,
  fromEmail = process.env.RESEND_REPLY_TO_EMAIL || 'muradgm@gmail.com',
] = process.argv.slice(2);

if (!providerMessageId || !subject || !body) {
  usage();
  process.exit(1);
}

const webhookSecret = process.env.RESEND_INBOUND_WEBHOOK_SECRET?.trim() || '';

if (!webhookSecret) {
  throw new Error('RESEND_INBOUND_WEBHOOK_SECRET is required');
}

const apiBaseUrl = (process.env.PUBLIC_API_BASE_URL || 'http://127.0.0.1:4000').replace(
  /\/+$/,
  '',
);
const endpointUrl = apiBaseUrl.includes('/api')
  ? `${apiBaseUrl}/webhooks/resend/inbound-replies`
  : `${apiBaseUrl}/api/webhooks/resend/inbound-replies`;

const key = Buffer.from(
  webhookSecret.startsWith('whsec_') ? webhookSecret.slice(6) : webhookSecret,
  'base64',
);

const payload = JSON.stringify({
  type: 'email.received',
  created_at: new Date().toISOString(),
  data: {
    from: fromEmail,
    subject,
    text: body,
    message_id: `<reply-${Date.now()}@signalscout.local>`,
    in_reply_to: `<${providerMessageId}>`,
    references: `<${providerMessageId}>`,
    headers: {
      'in-reply-to': `<${providerMessageId}>`,
      references: `<${providerMessageId}>`,
    },
  },
});

const msgId = `msg_${Date.now()}`;
const timestamp = Math.floor(Date.now() / 1000).toString();
const signedContent = `${msgId}.${timestamp}.${payload}`;
const digest = crypto.createHmac('sha256', key).update(signedContent).digest('base64');
const signature = `v1,${digest}`;

const response = await fetch(endpointUrl, {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
    'svix-id': msgId,
    'svix-timestamp': timestamp,
    'svix-signature': signature,
  },
  body: payload,
});

const text = await response.text();

if (!response.ok) {
  throw new Error(`Webhook request failed with ${response.status}: ${text}`);
}

console.log(text);
