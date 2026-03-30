import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './bootstrap/env.js';
import { errorHandler, notFoundHandler } from './common/middleware/index.js';
import { router } from './routes/index.js';

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.dashboardOrigin,
      credentials: true,
    }),
  );
  app.use(express.json());

  app.use(env.apiBasePath, router);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};