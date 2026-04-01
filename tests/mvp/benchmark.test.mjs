import assert from 'node:assert/strict';
import test from 'node:test';
import {
  MockAuditGenerator,
  createDefaultOutreachGenerator,
} from '../../packages/ai/dist/index.js';
import { DetectSignals } from '../../packages/core/dist/index.js';
import { RuleBasedSignalDetector, buildLeadSnapshot } from '../../packages/scraper/dist/index.js';
import { benchmarkFixtures } from './benchmark-fixtures.mjs';

test('benchmark fixtures produce expected extraction and workflow outcomes', async () => {
  const detector = new DetectSignals(new RuleBasedSignalDetector());
  const auditGenerator = new MockAuditGenerator();
  const outreachGenerator = createDefaultOutreachGenerator();

  for (const fixture of benchmarkFixtures) {
    const extracted = buildLeadSnapshot(fixture.html, fixture.lead.website);
    const snapshot = {
      id: `snapshot-${fixture.id}`,
      leadId: fixture.lead.id,
      ...extracted,
    };

    const signals = await detector.execute(fixture.lead, snapshot);
    const auditDraft = await auditGenerator.generate({
      lead: fixture.lead,
      snapshot,
      signals,
    });
    const outreachDraft = await outreachGenerator.generate({
      lead: fixture.lead,
      snapshot,
      signals,
      audit: {
        id: `audit-${fixture.id}`,
        leadId: fixture.lead.id,
        snapshotId: snapshot.id,
        summary: auditDraft.summary,
        strengths: auditDraft.strengths,
        opportunities: auditDraft.opportunities,
        opportunityDetails: auditDraft.opportunityDetails,
        risks: auditDraft.risks,
        recommendedAngle: auditDraft.recommendedAngle,
        confidenceNote: auditDraft.confidenceNote,
        evidence: auditDraft.evidence,
        createdAt: new Date('2026-04-01T00:00:00.000Z'),
      },
    });

    assert.equal(
      snapshot.isPlaceholderContent,
      fixture.expectation.placeholder,
      `${fixture.id}: placeholder mismatch`,
    );
    assert.equal(
      signals.outreachFit,
      fixture.expectation.outreachFit,
      `${fixture.id}: outreach fit mismatch`,
    );
    assert.equal(
      signals.trustSignalStrength,
      fixture.expectation.trustSignalStrength,
      `${fixture.id}: trust strength mismatch`,
    );
    assert.equal(
      signals.confidence,
      fixture.expectation.confidence,
      `${fixture.id}: confidence mismatch`,
    );
    assert.equal(
      outreachDraft.recommendation,
      fixture.expectation.recommendation,
      `${fixture.id}: recommendation mismatch`,
    );

    if (fixture.expectation.requiresEmail) {
      assert.ok(
        snapshot.contactInfo.emails.length > 0,
        `${fixture.id}: expected at least one email`,
      );
    }

    if (fixture.expectation.requiresPhone) {
      assert.ok(
        snapshot.contactInfo.phones.length > 0,
        `${fixture.id}: expected at least one phone`,
      );
    }

    if (fixture.expectation.requiresAddress) {
      assert.ok(
        snapshot.contactInfo.addresses.length > 0,
        `${fixture.id}: expected at least one address`,
      );
    }

    for (const signalLabel of fixture.expectation.requiresSignalLabels ?? []) {
      assert.ok(
        snapshot.trustSignals.includes(signalLabel),
        `${fixture.id}: missing trust signal ${signalLabel}`,
      );
    }

    for (const signalLabel of fixture.expectation.rejectedTrustSignalLabels ?? []) {
      assert.ok(
        !snapshot.trustSignals.includes(signalLabel),
        `${fixture.id}: unexpected trust signal ${signalLabel}`,
      );
    }

    for (const rejectedPhone of fixture.expectation.rejectedPhones ?? []) {
      assert.ok(
        !snapshot.contactInfo.phones.includes(rejectedPhone),
        `${fixture.id}: noisy phone survived extraction: ${rejectedPhone}`,
      );
    }

    if (fixture.expectation.recommendation === 'send') {
      assert.ok(
        outreachDraft.subject && outreachDraft.body,
        `${fixture.id}: send recommendation should have subject and body`,
      );
    }

    if (fixture.expectation.recommendation === 'do_not_send') {
      assert.equal(
        outreachDraft.subject,
        null,
        `${fixture.id}: do_not_send should not produce a subject`,
      );
    }
  }
});
