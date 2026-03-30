import type { Response } from 'express';

export const ok = <T>(res: Response, data: T, statusCode = 200): void => {
  res.status(statusCode).json({
    success: true,
    data,
  });
};