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

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 4000),
  apiBasePath: process.env.API_BASE_PATH ?? '/api',
  mongoUri: required(process.env.MONGODB_URI, 'MONGODB_URI'),
  dashboardOrigin: process.env.DASHBOARD_ORIGIN ?? 'http://localhost:5173',
  logLevel: process.env.LOG_LEVEL ?? 'info',
  openAiApiKey: process.env.OPENAI_API_KEY ?? '',
  useMockAi: process.env.USE_MOCK_AI === 'true',
};