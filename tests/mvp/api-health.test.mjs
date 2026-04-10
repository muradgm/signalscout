import assert from 'node:assert/strict';
import test from 'node:test';
import { createApp } from '../../apps/api/dist/app.js';
import { healthResponseSchema } from '../../apps/api/dist/modules/health/health.schema.js';

test('api health endpoint responds with ok payload', async () => {
  const app = createApp();

  const server = await new Promise((resolve) => {
    const instance = app.listen(0, '127.0.0.1', () => resolve(instance));
  });

  try {
    const address = server.address();

    assert.ok(address && typeof address === 'object');

    const response = await fetch(`http://127.0.0.1:${address.port}/api/health`);
    const payload = await response.json();

    assert.equal(response.status, 200);
    assert.equal(payload.success, true);
    const parsed = healthResponseSchema.parse(payload.data);
    assert.equal(parsed.service, 'api');
    assert.equal(parsed.status, 'ok');
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  }
});
