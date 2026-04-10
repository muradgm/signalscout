import { z } from 'zod';

export const getOutreachLearningSummaryRequestSchema = z.object({
  body: z.object({}).default({}),
  params: z.object({}).default({}),
  query: z.object({
    limit: z.coerce.number().int().min(1).max(200).optional(),
  }),
});

const namedCountSchema = z.object({
  label: z.string().min(1),
  count: z.number().int().nonnegative(),
});

const reviewSegmentSchema = z.object({
  total: z.number().int().nonnegative(),
  acceptedRate: z.number().min(0).max(1),
  editedRate: z.number().min(0).max(1),
  skippedRate: z.number().min(0).max(1),
});

export const outreachLearningSummaryResponseSchema = z.object({
  windowSize: z.number().int().nonnegative(),
  totalReviewed: z.number().int().nonnegative(),
  acceptedRate: z.number().min(0).max(1),
  editedRate: z.number().min(0).max(1),
  skippedRate: z.number().min(0).max(1),
  subjectEditedRate: z.number().min(0).max(1),
  bodyEditedRate: z.number().min(0).max(1),
  multilingualShare: z.number().min(0).max(1),
  specialtyShare: z.number().min(0).max(1),
  topAngles: z.array(namedCountSchema),
  topEditedAngles: z.array(namedCountSchema),
  topNiches: z.array(namedCountSchema),
  topEditedNiches: z.array(namedCountSchema),
  reviewSegments: z.object({
    nonBerlin: reviewSegmentSchema,
    weakSurface: reviewSegmentSchema,
    specialty: reviewSegmentSchema,
    multilingual: reviewSegmentSchema,
  }),
});
