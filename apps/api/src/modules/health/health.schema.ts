import { z } from 'zod';

export const healthCheckRequestSchema = z.object({
  body: z.object({}).default({}),
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});

export const healthResponseSchema = z.object({
  status: z.literal('ok'),
  service: z.literal('api'),
  uptime: z.number(),
  database: z.enum(['disconnected', 'connected', 'connecting', 'disconnecting']),
  timestamp: z.string().datetime(),
});
