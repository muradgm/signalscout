import assert from 'node:assert/strict';
import test from 'node:test';
import {
  MockAuditGenerator,
  createDefaultOutreachGenerator,
} from '../../packages/ai/dist/index.js';
import { DetectSignals } from '../../packages/core/dist/index.js';
import { RuleBasedSignalDetector } from '../../packages/scraper/dist/index.js';
import { buildSnapshotFixture, leadFixture } from './fixtures.mjs';

test('mock generators produce grounded audit and outreach drafts for a strong local lead', async () => {
  const snapshot = await buildSnapshotFixture();
  const signals = await new DetectSignals(new RuleBasedSignalDetector()).execute(
    leadFixture,
    snapshot,
  );

  const auditDraft = await new MockAuditGenerator().generate({
    lead: leadFixture,
    snapshot,
    signals,
  });

  assert.match(auditDraft.summary, /credible local presence/i);
  assert.equal(auditDraft.opportunities.length, 1);
  assert.match(auditDraft.opportunities[0], /trust well/i);

  const outreachDraft = await createDefaultOutreachGenerator().generate({
    lead: leadFixture,
    snapshot,
    signals,
    audit: {
      id: 'audit-1',
      leadId: leadFixture.id,
      snapshotId: snapshot.id,
      summary: auditDraft.summary,
      strengths: auditDraft.strengths,
      opportunities: auditDraft.opportunities,
      opportunityDetails: auditDraft.opportunityDetails,
      risks: auditDraft.risks,
      recommendedAngle: auditDraft.recommendedAngle,
      confidenceNote: auditDraft.confidenceNote,
      evidence: auditDraft.evidence,
      createdAt: new Date('2026-04-01T18:00:00.000Z'),
    },
  });

  assert.equal(outreachDraft.recommendation, 'send');
  assert.match(outreachDraft.subject ?? '', /quick thought on booking/i);
  assert.match(
    outreachDraft.body ?? '',
    /long-standing local presence and family feel/i,
  );
  assert.match(
    outreachDraft.body ?? '',
    /2 or 3 specific changes i'd test first/i,
  );
  assert.ok(
    outreachDraft.evidence.includes(
      'The practice is presented in family-led terms, which is a meaningful trust asset.',
    ),
  );
});
