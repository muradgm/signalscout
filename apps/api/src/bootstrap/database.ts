import mongoose from 'mongoose';
import { logger } from './logger.js';
import { env } from './env.js';

export const connectDatabase = async (): Promise<void> => {
  await mongoose.connect(env.mongoUri);
  logger.info('MongoDB connected');
};