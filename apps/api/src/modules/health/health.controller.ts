import type { Request, Response } from 'express';
import { getDbStatus } from '@signalscout/db';
import { ok } from '../../common/responses/index.js';

export const healthCheck = (_req: Request, res: Response): void => {
  ok(res, {
    status: 'ok',
    service: 'api',
    uptime: process.uptime(),
    database: getDbStatus(),
    timestamp: new Date().toISOString(),
  });
};