import assert from 'node:assert/strict';
import test from 'node:test';
import { DetectSignals } from '../../packages/core/dist/index.js';
import { RuleBasedSignalDetector } from '../../packages/scraper/dist/index.js';
import { buildSnapshotFixture, leadFixture } from './fixtures.mjs';

test('good local lead yields strong signals and explicit trust evidence', async () => {
  const snapshot = await buildSnapshotFixture();
  const useCase = new DetectSignals(new RuleBasedSignalDetector());

  const result = await useCase.execute(leadFixture, snapshot);

  assert.equal(result.bookingPresence, 'direct');
  assert.equal(result.contactClarity, 'high');
  assert.equal(result.trustSignalStrength, 'high');
  assert.equal(result.localRelevance, 'high_match');
  assert.equal(result.outreachFit, 'good');
  assert.equal(result.confidence, 'high');
  assert.ok(result.evidence.includes('trust indicator detected: mentions long tradition'));
  assert.ok(result.evidence.includes('trust indicator detected: mentions family-led practice'));
  assert.ok(result.evidence.includes('trust indicator detected: mentions anxiety-patient reassurance'));
});
