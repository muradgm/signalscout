import { createApp } from './app.js';
import { connectDatabase, env, logger } from './bootstrap/index.js';

const start = async (): Promise<void> => {
  await connectDatabase();

  const app = createApp();

  app.listen(env.port, () => {
    logger.info('API server started', {
      port: env.port,
      basePath: env.apiBasePath,
      env: env.nodeEnv,
    });
  });
};

start().catch((error) => {
  logger.error('Failed to start API server', {
    error: error instanceof Error ? error.message : 'Unknown error',
  });
  process.exit(1);
});