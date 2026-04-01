import { connectDb } from '@signalscout/db';
import { logger } from './logger.js';
import { env } from './env.js';

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

  await connectDb(env.mongoUri);
  logger.info('MongoDB connected');
};
