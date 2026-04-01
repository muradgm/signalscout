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
      origin: env.dashboardOrigin,
      credentials: true,
    }),
  );
  app.use(express.json());

  app.use(env.apiBasePath, router);

  app.use(errorHandler);

  return app;
};