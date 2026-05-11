import express, { type Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './bootstrap/env.js';
import { router } from './routes/index.js';
import { errorHandler } from './common/middleware/index.js';

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

const rateLimitBuckets = new Map<string, RateLimitBucket>();

const resolveClientKey = (req: express.Request): string => {
  const forwardedFor = req.headers['x-forwarded-for'];
  if (typeof forwardedFor === 'string') {
    return forwardedFor.split(',')[0]?.trim() || req.ip || 'unknown';
  }

  return req.ip || 'unknown';
};

const createRateLimitMiddleware =
  (windowMs: number, maxRequests: number) =>
  (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ): void => {
    const now = Date.now();
    const key = resolveClientKey(req);
    const current = rateLimitBuckets.get(key);

    if (!current || now >= current.resetAt) {
      rateLimitBuckets.set(key, {
        count: 1,
        resetAt: now + windowMs,
      });
      next();
      return;
    }

    if (current.count >= maxRequests) {
      res.setHeader(
        'Retry-After',
        String(Math.ceil((current.resetAt - now) / 1000)),
      );
      res.status(429).json({
        success: false,
        error: 'Too many requests',
      });
      return;
    }

    current.count += 1;
    next();
  };

export const createApp = (): Express => {
  const app: Express = express();

  app.use(helmet());
  app.use(
    createRateLimitMiddleware(
      env.apiRateLimitWindowMs,
      env.apiRateLimitMaxRequests,
    ),
  );
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || env.dashboardOrigins.includes(origin)) {
          callback(null, true);
          return;
        }

        callback(new Error(`Origin ${origin} is not allowed by CORS`));
      },
      credentials: true,
    }),
  );
  app.use(
    express.json({
      limit: env.apiJsonLimit,
      verify: (req, _res, buffer) => {
        (req as express.Request & { rawBody?: string }).rawBody = buffer.toString('utf8');
      },
    }),
  );

  app.use(env.apiBasePath, router);

  app.use(errorHandler);

  return app;
};
