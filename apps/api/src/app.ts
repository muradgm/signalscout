import express, { type Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './bootstrap/env.js';
import { router } from './routes/index.js';
import { errorHandler } from './common/middleware/index.js';

export const createApp = (): Express => {
  const app: Express = express();

  app.use(helmet());
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
      verify: (req, _res, buffer) => {
        (req as express.Request & { rawBody?: string }).rawBody = buffer.toString('utf8');
      },
    }),
  );

  app.use(env.apiBasePath, router);

  app.use(errorHandler);

  return app;
};
