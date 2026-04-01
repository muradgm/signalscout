import assert from 'node:assert/strict';
import test from 'node:test';
import {
  DetectSignals,
  GenerateAudit,
  GenerateOutreach,
} from '../../packages/core/dist/index.js';
import { MockAuditGenerator, MockOutreachGenerator } from '../../packages/ai/dist/index.js';
import { RuleBasedSignalDetector } from '../../packages/scraper/dist/index.js';
import { buildSnapshotFixture, leadFixture } from './fixtures.mjs';

class InMemoryAuditRepository {
  saved = null;

  async save(input) {
    this.saved = input;
    return {
      id: 'audit-generated-1',
      ...input,
      createdAt: new Date('2026-04-01T18:00:00.000Z'),
    };
  }
}

class InMemoryOutreachRepository {
  saved = null;

  async save(input) {
    this.saved = input;
    return {
      id: 'outreach-generated-1',
      ...input,
      createdAt: new Date('2026-04-01T18:05:00.000Z'),
    };
  }
}

test('generate audit and outreach persist coherent lineage for the MVP path', async () => {
  const snapshot = await buildSnapshotFixture();
  const signals = await new DetectSignals(new RuleBasedSignalDetector()).execute(
    leadFixture,
    snapshot,
  );

  const auditRepository = new InMemoryAuditRepository();
  const outreachRepository = new InMemoryOutreachRepository();

  const audit = await new GenerateAudit(
    new MockAuditGenerator(),
    auditRepository,
  ).execute({
    lead: leadFixture,
    snapshot,
    signals,
  });

  assert.equal(auditRepository.saved.leadId, leadFixture.id);
  assert.equal(auditRepository.saved.snapshotId, snapshot.id);
  assert.match(audit.summary, /credible local presence/i);

  const outreach = await new GenerateOutreach(
    new MockOutreachGenerator(),
    outreachRepository,
  ).execute({
    lead: leadFixture,
    snapshot,
    signals,
    audit,
  });

  assert.equal(outreachRepository.saved.leadId, leadFixture.id);
  assert.equal(outreachRepository.saved.auditId, audit.id);
  assert.equal(outreach.status, 'drafted');
  assert.equal(outreach.recommendation, 'send');
  assert.match(outreach.subject ?? '', /trust and booking/i);
});
