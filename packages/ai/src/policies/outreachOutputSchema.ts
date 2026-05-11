import { z } from 'zod';

export const outreachOutputSchema = z.object({
  recommendation: z.enum(['send', 'review', 'do_not_send']),
  fitReason: z.string().min(1),
  bestAngle: z.string().min(1),
  subject: z.string().trim().min(1).nullable(),
  body: z.string().trim().min(1).nullable(),
  reasoning: z.string().min(1),
  evidence: z.array(z.string().min(1)).default([]),
});

export type OutreachOutputSchema = z.infer<typeof outreachOutputSchema>;
