import { z } from 'zod';

export const outreachOutputSchema = z.object({
  channel: z.literal('email'),
  subject: z.string().min(1),
  body: z.string().min(1),
  reasoning: z.string().min(1),
  evidence: z.array(z.string().min(1)).default([]),
  status: z.enum(['drafted', 'approved', 'sent', 'replied', 'closed']),
});

export type OutreachOutputSchema = z.infer<typeof outreachOutputSchema>;