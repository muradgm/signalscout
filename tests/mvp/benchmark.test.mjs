import assert from 'node:assert/strict';
import test from 'node:test';
import {
  MockAuditGenerator,
  createDefaultOutreachGenerator,
} from '../../packages/ai/dist/index.js';
import { DetectSignals } from '../../packages/core/dist/index.js';
import { RuleBasedSignalDetector, buildLeadSnapshot } from '../../packages/scraper/dist/index.js';
import { benchmarkFixtures } from './benchmark-fixtures.mjs';

const normalizeOutreachPhrase = (phrase) =>
  phrase.replace(/strong trust-building material/gi, 'strong trust material');

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
    if (fixture.expectation.localRelevance) {
      assert.equal(
        signals.localRelevance,
        fixture.expectation.localRelevance,
        `${fixture.id}: local relevance mismatch`,
      );
    }
    assert.equal(
      outreachDraft.recommendation,
      fixture.expectation.recommendation,
      `${fixture.id}: recommendation mismatch`,
    );
    assert.ok(
      auditDraft.strengths.length >= (fixture.expectation.minAuditStrengths ?? 0),
      `${fixture.id}: audit strengths too thin`,
    );
    assert.ok(
      auditDraft.evidence.length >= (fixture.expectation.minAuditEvidence ?? 0),
      `${fixture.id}: audit evidence too thin`,
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

    for (const phrase of fixture.expectation.requiresAuditStrengthPhrases ?? []) {
      assert.ok(
        auditDraft.strengths.some((strength) =>
          strength.toLowerCase().includes(phrase.toLowerCase()),
        ),
        `${fixture.id}: expected audit strength phrase missing: ${phrase}`,
      );
    }

    for (const phrase of fixture.expectation.requiresAuditSummaryPhrases ?? []) {
      assert.match(
        auditDraft.summary,
        new RegExp(phrase, 'i'),
        `${fixture.id}: expected audit summary phrase missing: ${phrase}`,
      );
    }

    for (const phrase of fixture.expectation.rejectsAuditSummaryPhrases ?? []) {
      assert.doesNotMatch(
        auditDraft.summary,
        new RegExp(phrase, 'i'),
        `${fixture.id}: unexpected audit summary phrase present: ${phrase}`,
      );
    }

    for (const phrase of fixture.expectation.requiresAuditEvidencePhrases ?? []) {
      assert.ok(
        auditDraft.evidence.some((item) =>
          item.toLowerCase().includes(phrase.toLowerCase()),
        ),
        `${fixture.id}: expected audit evidence phrase missing: ${phrase}`,
      );
    }

    for (const phrase of fixture.expectation.requiresOutreachBodyPhrases ?? []) {
      assert.match(
        outreachDraft.body ?? '',
        new RegExp(phrase, 'i'),
        `${fixture.id}: expected outreach body phrase missing: ${phrase}`,
      );
    }

    if (fixture.expectation.requiresOutreachBodyPhrasesAny?.length) {
      assert.ok(
        fixture.expectation.requiresOutreachBodyPhrasesAny.some((phrase) =>
          new RegExp(phrase, 'i').test(outreachDraft.body ?? ''),
        ),
        `${fixture.id}: none of the expected outreach body variants were present`,
      );
    }

    for (const phrase of fixture.expectation.rejectsOutreachBodyPhrases ?? []) {
      assert.doesNotMatch(
        outreachDraft.body ?? '',
        new RegExp(phrase, 'i'),
        `${fixture.id}: unexpected outreach body phrase present: ${phrase}`,
      );
    }

    for (const phrase of fixture.expectation.requiresOutreachSubjectPhrases ?? []) {
      assert.match(
        outreachDraft.subject ?? '',
        new RegExp(phrase, 'i'),
        `${fixture.id}: expected outreach subject phrase missing: ${phrase}`,
      );
    }

    for (const phrase of fixture.expectation.rejectsOutreachSubjectPhrases ?? []) {
      assert.doesNotMatch(
        outreachDraft.subject ?? '',
        new RegExp(phrase, 'i'),
        `${fixture.id}: unexpected outreach subject phrase present: ${phrase}`,
      );
    }

    for (const phrase of fixture.expectation.requiresOutreachFitReasonPhrases ?? []) {
      assert.match(
        outreachDraft.fitReason ?? '',
        new RegExp(phrase, 'i'),
        `${fixture.id}: expected outreach fitReason phrase missing: ${phrase}`,
      );
    }

    for (const phrase of fixture.expectation.requiresOutreachAnglePhrases ?? []) {
      assert.match(
        outreachDraft.bestAngle ?? '',
        new RegExp(phrase, 'i'),
        `${fixture.id}: expected outreach angle phrase missing: ${phrase}`,
      );
    }

    for (const phrase of fixture.expectation.requiresOutreachReasoningPhrases ?? []) {
      assert.match(
        outreachDraft.reasoning ?? '',
        new RegExp(normalizeOutreachPhrase(phrase), 'i'),
        `${fixture.id}: expected outreach reasoning phrase missing: ${phrase}`,
      );
    }

    for (const phrase of fixture.expectation.requiresOutreachEvidencePhrases ?? []) {
      assert.ok(
        outreachDraft.evidence.some((item) =>
          item.toLowerCase().includes(phrase.toLowerCase()),
        ),
        `${fixture.id}: expected outreach evidence phrase missing: ${phrase}`,
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
