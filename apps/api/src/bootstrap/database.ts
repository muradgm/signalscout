import { connectDb } from '@signalscout/db';
import { logger } from './logger.js';
import { env } from './env.js';

export const connectDatabase = async (): Promise<void> => {
  await connectDb(env.mongoUri);
  logger.info('MongoDB connected');
};