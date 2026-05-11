import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve to repo root from: apps/api/src/bootstrap/env.ts
const repoRoot = path.resolve(__dirname, '../../../../');
const envPath = path.join(repoRoot, '.env');

dotenv.config({ path: envPath });

const required = (value: string | undefined, name: string): string => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

const numberFromEnv = (
  value: string | undefined,
  fallback: number,
  name: string,
): number => {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`Invalid numeric environment variable: ${name}`);
  }

  return parsed;
};

const senderDomainFromEmail = (value: string): string | null => {
  const normalized = value.trim().toLowerCase();

  if (!normalized.includes('@')) {
    return null;
  }

  return normalized.split('@')[1] ?? null;
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  isProduction: (process.env.NODE_ENV ?? 'development') === 'production',
  port: Number(process.env.PORT ?? 4000),
  apiBasePath: process.env.API_BASE_PATH ?? '/api',
  apiJsonLimit: process.env.API_JSON_LIMIT ?? '256kb',
  apiRateLimitWindowMs: numberFromEnv(
    process.env.API_RATE_LIMIT_WINDOW_MS,
    60_000,
    'API_RATE_LIMIT_WINDOW_MS',
  ),
  apiRateLimitMaxRequests: numberFromEnv(
    process.env.API_RATE_LIMIT_MAX_REQUESTS,
    120,
    'API_RATE_LIMIT_MAX_REQUESTS',
  ),
  mongoUri: required(process.env.MONGODB_URI, 'MONGODB_URI'),
  mongoConnectMaxAttempts: numberFromEnv(
    process.env.MONGO_CONNECT_MAX_ATTEMPTS,
    5,
    'MONGO_CONNECT_MAX_ATTEMPTS',
  ),
  mongoConnectBaseDelayMs: numberFromEnv(
    process.env.MONGO_CONNECT_BASE_DELAY_MS,
    500,
    'MONGO_CONNECT_BASE_DELAY_MS',
  ),
  dashboardOrigins: Array.from(
    new Set(
      [
        process.env.DASHBOARD_ORIGIN ?? 'http://localhost:5173',
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://[::1]:5173',
      ]
        .flatMap((value) => value.split(','))
        .map((value) => value.trim())
        .filter(Boolean),
    ),
  ),
  logLevel: process.env.LOG_LEVEL ?? 'info',
  openAiApiKey: process.env.OPENAI_API_KEY ?? '',
  resendApiKey: process.env.RESEND_API_KEY ?? '',
  resendFromEmail: process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev',
  resendFromName: process.env.RESEND_FROM_NAME ?? 'SignalScout',
  resendReplyToEmail: process.env.RESEND_REPLY_TO_EMAIL ?? '',
  outreachAllowedSenderDomains: (process.env.OUTREACH_ALLOWED_SENDER_DOMAINS ?? '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean),
  publicApiBaseUrl: process.env.PUBLIC_API_BASE_URL ?? '',
  resendWebhookSecret: process.env.RESEND_WEBHOOK_SECRET ?? '',
  resendInboundWebhookSecret: process.env.RESEND_INBOUND_WEBHOOK_SECRET ?? '',
  allowDevelopmentSender: process.env.ALLOW_DEVELOPMENT_SENDER === 'true',
  useMockAi: process.env.USE_MOCK_AI === 'true',
};

const resendFromEmail = env.resendFromEmail.trim().toLowerCase();
const resendSenderDomain = senderDomainFromEmail(resendFromEmail);

if (env.isProduction && env.allowDevelopmentSender) {
  throw new Error(
    'ALLOW_DEVELOPMENT_SENDER must not be enabled when NODE_ENV=production',
  );
}

if (env.isProduction && env.resendApiKey.trim()) {
  if (!resendFromEmail || resendFromEmail === 'onboarding@resend.dev') {
    throw new Error(
      'Production sending requires RESEND_FROM_EMAIL to use a verified sender instead of onboarding@resend.dev',
    );
  }

  if (
    resendSenderDomain === null ||
    !env.outreachAllowedSenderDomains.includes(resendSenderDomain)
  ) {
    throw new Error(
      'Production sending requires the RESEND_FROM_EMAIL domain to be listed in OUTREACH_ALLOWED_SENDER_DOMAINS',
    );
  }
}
