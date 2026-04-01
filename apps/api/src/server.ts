import { createApp } from './app.js';
import { connectDatabase, env, logger } from './bootstrap/index.js';

const start = async (): Promise<void> => {
  logger.info('Starting API server', {
    port: env.port,
    basePath: env.apiBasePath,
    env: env.nodeEnv,
  });

  await connectDatabase();

  const app = createApp();
  const server = app.listen(env.port, () => {
    logger.info('API server started', {
      port: env.port,
      basePath: env.apiBasePath,
      env: env.nodeEnv,
    });
  });

  server.on('error', (error: NodeJS.ErrnoException) => {
    if (error.code === 'EADDRINUSE') {
      logger.error('Failed to start API server', {
        error: `Port ${env.port} is already in use`,
      });
      process.exit(1);
    }

    logger.error('Failed to start API server', {
      error: error.message,
    });
    process.exit(1);
  });
};

start().catch((error) => {
  logger.error('Failed to start API server', {
    error: error instanceof Error ? error.message : 'Unknown error',
  });
  process.exit(1);
});
