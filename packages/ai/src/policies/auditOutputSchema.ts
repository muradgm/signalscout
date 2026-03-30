import { z } from 'zod';

export const auditOutputSchema = z.object({
  summary: z.string().min(1),
  strengths: z.array(z.string().min(1)).default([]),
  opportunities: z.array(z.string().min(1)).default([]),
  opportunityDetails: z.array(z.string().min(1)).default([]),
  risks: z.array(z.string().min(1)).default([]),
  recommendedAngle: z.string().min(1),
  confidenceNote: z.string().min(1),
  evidence: z.array(z.string().min(1)).default([]),
});

export type AuditOutputSchema = z.infer<typeof auditOutputSchema>;