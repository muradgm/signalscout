import { GetOutreachLearningSummary } from '@signalscout/core';
import type { Request, Response } from 'express';
import { ok } from '../../common/responses/index.js';
export const createGetOutreachLearningSummaryHandler =
  (getOutreachLearningSummary: GetOutreachLearningSummary) =>
  async (req: Request, res: Response): Promise<void> => {
    const limit =
      typeof req.query.limit === 'number' && Number.isFinite(req.query.limit)
        ? req.query.limit
        : 60;

    const summary = await getOutreachLearningSummary.execute({ limit });

    ok(res, summary);
  };
