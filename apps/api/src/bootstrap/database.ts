import { connectDb } from '@signalscout/db';
import { logger } from './logger.js';
import { env } from './env.js';

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const connectDatabase = async (): Promise<void> => {
  logger.info('Connecting to MongoDB', {
    host: (() => {
      try {
        return new URL(env.mongoUri).host;
      } catch {
        return 'unparseable-mongo-uri';
      }
    })(),
  });

  let attempt = 0;

  while (attempt < env.mongoConnectMaxAttempts) {
    attempt += 1;

    try {
      await connectDb(env.mongoUri);
      logger.info('MongoDB connected', { attempt });
      return;
    } catch (error) {
      if (attempt >= env.mongoConnectMaxAttempts) {
        throw error;
      }

      const retryDelayMs =
        env.mongoConnectBaseDelayMs * 2 ** (attempt - 1);

      logger.warn('MongoDB connection attempt failed; retrying', {
        attempt,
        retryDelayMs,
        error: error instanceof Error ? error.message : 'unknown-error',
      });

      await delay(retryDelayMs);
    }
  }
};
