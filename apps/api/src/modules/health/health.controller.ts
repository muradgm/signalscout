import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import { ok } from '../../common/responses/index.js';

export const getHealth = (_req: Request, res: Response): void => {
  ok(res, {
    status: 'ok',
    service: 'api',
    uptime: process.uptime(),
    database:
      mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
};