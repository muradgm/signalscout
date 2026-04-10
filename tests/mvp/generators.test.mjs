import assert from 'node:assert/strict';
import test from 'node:test';
import {
  MockAuditGenerator,
  createDefaultOutreachGenerator,
} from '../../packages/ai/dist/index.js';
import { DetectSignals } from '../../packages/core/dist/index.js';
import { RuleBasedSignalDetector, buildLeadSnapshot } from '../../packages/scraper/dist/index.js';
import { benchmarkFixtures } from './benchmark-fixtures.mjs';
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
  assert.match(
    outreachDraft.subject ?? '',
    /quick thought on/i,
  );
  assert.match(
    outreachDraft.body ?? '',
    /family feel/i,
  );
  assert.match(
    outreachDraft.body ?? '',
    /2 or 3 specific changes i'd test first/i,
  );
  assert.ok(
    outreachDraft.evidence.some((item) => /family feel|trust/i.test(item)),
  );

  const regeneratedDraft = await createDefaultOutreachGenerator().generate({
    lead: leadFixture,
    snapshot,
    signals,
    regenerationIndex: 1,
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

  assert.notEqual(outreachDraft.subject, regeneratedDraft.subject);
  assert.notEqual(outreachDraft.body, regeneratedDraft.body);
});

test('mock generators keep multi-specialty real-case leads specific instead of generic', async () => {
  const fixture = benchmarkFixtures.find((entry) => entry.id === 'realcase-torhaus');
  assert.ok(fixture, 'realcase-torhaus fixture not found');

  const extracted = buildLeadSnapshot(fixture.html, fixture.lead.website);
  const snapshot = {
    id: `snapshot-${fixture.id}`,
    leadId: fixture.lead.id,
    ...extracted,
  };

  const detector = new DetectSignals(new RuleBasedSignalDetector());
  const signals = await detector.execute(fixture.lead, snapshot);
  const auditDraft = await new MockAuditGenerator().generate({
    lead: fixture.lead,
    snapshot,
    signals,
  });
  const outreachDraft = await createDefaultOutreachGenerator().generate({
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
      createdAt: new Date('2026-04-02T19:30:00.000Z'),
    },
  });

  assert.match(auditDraft.summary, /multi-specialty practice/i);
  assert.ok(
    auditDraft.evidence.some((item) => /multi-specialty practice/i.test(item)),
  );
  assert.equal(outreachDraft.recommendation, 'send');
  assert.match(outreachDraft.subject ?? '', /multi-specialty practice/i);
  assert.match(outreachDraft.body ?? '', /multi-specialty practice/i);
  assert.match(outreachDraft.body ?? '', /2 or 3 specific changes/i);
  assert.match(outreachDraft.fitReason ?? '', /multi-specialty practice/i);
  assert.match(outreachDraft.bestAngle ?? '', /multi-specialty practice/i);
  assert.match(outreachDraft.reasoning ?? '', /multi-specialty practice/i);
  assert.match(outreachDraft.evidence.join(' '), /multi-specialty practice/i);
});

test('mock generators keep live KU64-style real-case review leads specific instead of generic', async () => {
  const fixture = benchmarkFixtures.find((entry) => entry.id === 'realcase-ku64');
  assert.ok(fixture, 'realcase-ku64 fixture not found');

  const extracted = buildLeadSnapshot(fixture.html, fixture.lead.website);
  const snapshot = {
    id: `snapshot-${fixture.id}`,
    leadId: fixture.lead.id,
    ...extracted,
  };

  const detector = new DetectSignals(new RuleBasedSignalDetector());
  const signals = await detector.execute(fixture.lead, snapshot);
  const auditDraft = await new MockAuditGenerator().generate({
    lead: fixture.lead,
    snapshot,
    signals,
  });
  const outreachDraft = await createDefaultOutreachGenerator().generate({
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
      createdAt: new Date('2026-04-02T19:45:00.000Z'),
    },
  });

  assert.match(auditDraft.summary, /multi-specialty practice/i);
  assert.ok(
    auditDraft.evidence.some((item) => /multi-specialty practice/i.test(item)),
  );
  assert.match(auditDraft.summary, /brand-heavy multi-specialty practice/i);
  assert.match(auditDraft.summary, /visible booking path/i);
  assert.ok(
    auditDraft.strengths.some((item) =>
      /multiple specialty cues with a visible booking path/i.test(item),
    ),
  );
  assert.ok(
    auditDraft.evidence.some((item) => /visible booking access/i.test(item)),
  );
  assert.equal(outreachDraft.recommendation, 'review');
  assert.match(outreachDraft.subject ?? '', /multi-specialty booking/i);
  assert.match(outreachDraft.body ?? '', /brand-heavy multi-specialty practice/i);
  assert.match(outreachDraft.body ?? '', /worth reviewing/i);
  assert.match(
    outreachDraft.fitReason ?? '',
    /brand-heavy multi-specialty presentation/i,
  );
  assert.match(outreachDraft.bestAngle ?? '', /multi-specialty practice/i);
  assert.match(
    outreachDraft.reasoning ?? '',
    /brand-heavy multi-specialty presentation/i,
  );
  assert.match(outreachDraft.evidence.join(' '), /brand-heavy multi-specialty practice/i);
});

test('mock outreach generator keeps Friedrichstrasse KU64 slice tied to the brand-heavy review branch', async () => {
  const fixture = benchmarkFixtures.find((entry) => entry.id === 'realcase-ku64-friedrichstrasse');
  assert.ok(fixture, 'realcase-ku64-friedrichstrasse fixture not found');

  const extracted = buildLeadSnapshot(fixture.html, fixture.lead.website);
  const snapshot = {
    id: `snapshot-${fixture.id}`,
    leadId: fixture.lead.id,
    ...extracted,
  };

  const detector = new DetectSignals(new RuleBasedSignalDetector());
  const signals = await detector.execute(fixture.lead, snapshot);
  const auditDraft = await new MockAuditGenerator().generate({
    lead: fixture.lead,
    snapshot,
    signals,
  });
  const outreachDraft = await createDefaultOutreachGenerator().generate({
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
      createdAt: new Date('2026-04-04T10:00:00.000Z'),
    },
  });

  assert.equal(outreachDraft.recommendation, 'review');
  assert.match(outreachDraft.subject ?? '', /multi-specialty booking/i);
  assert.match(outreachDraft.body ?? '', /Friedrichstrasse/i);
  assert.match(outreachDraft.body ?? '', /brand-heavy multi-specialty practice/i);
  assert.match(outreachDraft.bestAngle ?? '', /multi-specialty practice/i);
  assert.match(outreachDraft.reasoning ?? '', /brand-heavy multi-specialty presentation/i);
  assert.match(outreachDraft.evidence.join(' '), /direct booking access/i);
});

test('mock audit generator produces fuller output for a valid but thinner lead', async () => {
  const lead = {
    ...leadFixture,
    id: 'lead-medium-valid',
    companyName: 'Praxis Altona',
    website: 'https://praxis-altona.example',
    location: 'Hamburg',
    country: 'Germany',
  };

  const snapshot = {
    id: 'snapshot-medium-valid',
    leadId: lead.id,
    url: lead.website,
    pageTitle: 'Praxis Altona Hamburg',
    metaDescription: 'Zahnarztpraxis in Hamburg Altona',
    visibleText:
      'Unsere Praxis in Altona bietet Online-Termine, ein erfahrenes Team und moderne Behandlung. Kontaktieren Sie uns in Hamburg, Germany.',
    contactInfo: {
      emails: ['kontakt@praxis-altona.example'],
      phones: ['040 123 45 67'],
      addresses: ['Max-Brauer-Allee 22 22765 Hamburg Altona'],
    },
    contactEnrichment: { emails: [], phones: [], addresses: [] },
    bookingLinks: [],
    trustSignals: ['mentions team', 'mentions patient comfort', 'mentions advanced technology'],
    isPlaceholderContent: false,
    extractedAt: new Date('2026-04-02T10:00:00.000Z'),
  };

  const signals = await new DetectSignals(new RuleBasedSignalDetector()).execute(lead, snapshot);
  const auditDraft = await new MockAuditGenerator().generate({
    lead,
    snapshot,
    signals,
  });

  assert.ok(auditDraft.strengths.length >= 2);
  assert.ok(
    auditDraft.strengths.some((strength) =>
      /contact|local/i.test(strength),
    ),
  );
  assert.ok(auditDraft.evidence.length >= 2);
  assert.ok(
    auditDraft.evidence.some((item) => /contact|local|trust/i.test(item)),
  );
  assert.match(auditDraft.summary, /credible local presence|commercially valid|locally relevant/i);
});

test('mock outreach generator uses a narrower voice for a valid but thinner send lead', async () => {
  const lead = {
    ...leadFixture,
    id: 'lead-medium-outreach',
    companyName: 'Praxis Ehrenfeld',
    website: 'https://praxis-ehrenfeld.example',
    location: 'Cologne',
    country: 'Germany',
  };

  const snapshot = {
    id: 'snapshot-medium-outreach',
    leadId: lead.id,
    url: lead.website,
    pageTitle: 'Praxis Ehrenfeld Cologne',
    metaDescription: 'Friendly local dental clinic in Cologne Ehrenfeld',
    visibleText:
      'Friendly team, patient-focused care, request an appointment online and visit us in Cologne Ehrenfeld.',
    contactInfo: {
      emails: ['hello@praxis-ehrenfeld.example'],
      phones: ['0221 765 43 21'],
      addresses: ['Venloer Strasse 120 50823 Cologne Ehrenfeld'],
    },
    contactEnrichment: { emails: [], phones: [], addresses: [] },
    bookingLinks: [],
    trustSignals: ['mentions team', 'mentions patient comfort'],
    isPlaceholderContent: false,
    extractedAt: new Date('2026-04-02T10:30:00.000Z'),
  };

  const signals = await new DetectSignals(new RuleBasedSignalDetector()).execute(lead, snapshot);
  const auditDraft = await new MockAuditGenerator().generate({
    lead,
    snapshot,
    signals,
  });

  const outreachDraft = await createDefaultOutreachGenerator().generate({
    lead,
    snapshot,
    signals,
    audit: {
      id: 'audit-medium-outreach',
      leadId: lead.id,
      snapshotId: snapshot.id,
      summary: auditDraft.summary,
      strengths: auditDraft.strengths,
      opportunities: auditDraft.opportunities,
      opportunityDetails: auditDraft.opportunityDetails,
      risks: auditDraft.risks,
      recommendedAngle: auditDraft.recommendedAngle,
      confidenceNote: auditDraft.confidenceNote,
      evidence: auditDraft.evidence,
      createdAt: new Date('2026-04-02T10:35:00.000Z'),
    },
  });

  assert.equal(outreachDraft.recommendation, 'send');
  assert.match(outreachDraft.subject ?? '', /making booking easier/i);
  assert.match(outreachDraft.body ?? '', /credible first impression/i);
  assert.match(outreachDraft.body ?? '', /work a little harder than they should/i);
  assert.doesNotMatch(outreachDraft.body ?? '', /long-standing local presence and family feel/i);
});

test('mock outreach generator differentiates benchmark classes instead of collapsing to generic outreach copy', async () => {
  const detector = new DetectSignals(new RuleBasedSignalDetector());
  const auditGenerator = new MockAuditGenerator();
  const outreachGenerator = createDefaultOutreachGenerator();
  const selectedIds = [
    'multilingual-good-munich',
    'english-local-cologne',
    'specialty-good-implant-berlin',
    'multilingual-specialty-stuttgart',
    'weaker-contact-endodontics-dresden',
    'multilingual-aligners-bonn',
    'weaker-contact-pediatric-hamburg',
    'network-brand',
    'uncertain-review',
  ];
  const drafts = new Map();

  for (const id of selectedIds) {
    const fixture = benchmarkFixtures.find((entry) => entry.id === id);
    assert.ok(fixture, `${id}: fixture not found`);

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

    drafts.set(
      id,
      await outreachGenerator.generate({
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
          createdAt: new Date('2026-04-02T12:00:00.000Z'),
        },
      }),
    );
  }

  assert.match(
    drafts.get('multilingual-good-munich').subject ?? '',
    /Quick thought on|clear booking/i,
  );
  assert.match(
    drafts.get('multilingual-good-munich').body ?? '',
    /The bilingual presentation is a strength/i,
  );
  assert.match(
    drafts.get('multilingual-good-munich').fitReason ?? '',
    /bilingual presentation/i,
  );
  assert.match(
    drafts.get('multilingual-good-munich').evidence.join(' '),
    /The site uses both German and English/i,
  );

  assert.match(drafts.get('english-local-cologne').subject ?? '', /clear booking/i);
  assert.match(
    drafts.get('english-local-cologne').body ?? '',
    /English-led presentation is (helpful|a strength)/i,
  );
  assert.match(
    drafts.get('english-local-cologne').fitReason ?? '',
    /English-led presentation|easy to read in English/i,
  );
  assert.match(
    drafts.get('english-local-cologne').evidence.join(' '),
    /English-led while still naming the local market/i,
  );
  assert.doesNotMatch(
    drafts.get('english-local-cologne').body ?? '',
    /long-standing local presence and family feel/i,
  );

  assert.match(
    drafts.get('specialty-good-implant-berlin').subject ?? '',
    /implant-focused care/i,
  );
  assert.match(
    drafts.get('specialty-good-implant-berlin').body ?? '',
    /implant-focused care practice/i,
  );
  assert.match(
    drafts.get('specialty-good-implant-berlin').fitReason ?? '',
    /implant-focused care focus/i,
  );
  assert.match(
    drafts.get('specialty-good-implant-berlin').evidence.join(' '),
    /implant-focused care/i,
  );

  assert.match(
    drafts.get('multilingual-specialty-stuttgart').subject ?? '',
    /oral-surgery care/i,
  );
  assert.match(
    drafts.get('multilingual-specialty-stuttgart').body ?? '',
    /oral-surgery care practice/i,
  );
  assert.match(
    drafts.get('multilingual-specialty-stuttgart').evidence.join(' '),
    /German and English/i,
  );

  assert.match(
    drafts.get('weaker-contact-endodontics-dresden').subject ?? '',
    /endodontic care/i,
  );
  assert.match(
    drafts.get('weaker-contact-endodontics-dresden').body ?? '',
    /email-only, so the next step should stay very simple/i,
  );
  assert.match(
    drafts.get('weaker-contact-endodontics-dresden').fitReason ?? '',
    /Only an email path stands out/i,
  );
  assert.match(
    drafts.get('weaker-contact-endodontics-dresden').evidence.join(' '),
    /An email path stands out/i,
  );

  assert.match(
    drafts.get('multilingual-aligners-bonn').subject ?? '',
    /aligner-focused treatment/i,
  );
  assert.match(
    drafts.get('multilingual-aligners-bonn').body ?? '',
    /The bilingual presentation is a strength/i,
  );
  assert.match(
    drafts.get('multilingual-aligners-bonn').fitReason ?? '',
    /aligner-focused treatment focus/i,
  );
  assert.match(
    drafts.get('multilingual-aligners-bonn').evidence.join(' '),
    /German and English/i,
  );

  assert.match(
    drafts.get('weaker-contact-pediatric-hamburg').subject ?? '',
    /family and pediatric care/i,
  );
  assert.match(
    drafts.get('weaker-contact-pediatric-hamburg').body ?? '',
    /phone-only/i,
  );
  assert.match(
    drafts.get('weaker-contact-pediatric-hamburg').fitReason ?? '',
    /Only a phone path stands out/i,
  );
  assert.match(
    drafts.get('weaker-contact-pediatric-hamburg').evidence.join(' '),
    /A phone path stands out/i,
  );

  assert.equal(drafts.get('network-brand').recommendation, 'do_not_send');
  assert.equal(drafts.get('network-brand').subject, null);
  assert.match(
    drafts.get('network-brand').fitReason ?? '',
    /scaled multi-location network/i,
  );
  assert.match(
    drafts.get('network-brand').reasoning ?? '',
    /current local-practice campaign focus/i,
  );
  assert.match(
    drafts.get('network-brand').evidence.join(' '),
    /large multi-location provider/i,
  );

  assert.match(
    drafts.get('uncertain-review').subject ?? '',
    /geographic fit/i,
  );
  assert.match(
    drafts.get('uncertain-review').body ?? '',
    /review territory/i,
  );
  assert.match(
    drafts.get('uncertain-review').bestAngle ?? '',
    /qualification gap/i,
  );
  assert.match(
    drafts.get('uncertain-review').reasoning ?? '',
    /geographic match/i,
  );
  assert.match(
    drafts.get('uncertain-review').evidence.join(' '),
    /qualification gap/i,
  );
});

test('mock audit generator carries specialty-specific shape for multilingual niche leads', async () => {
  const lead = {
    ...leadFixture,
    id: 'lead-specialty-multilingual',
    companyName: 'Oral Surgery Atelier Stuttgart',
    website: 'https://oral-surgery-atelier.example',
    location: 'Stuttgart',
    country: 'Germany',
  };

  const snapshot = {
    id: 'snapshot-specialty-multilingual',
    leadId: lead.id,
    url: lead.website,
    pageTitle: 'Oral Surgery Atelier Stuttgart',
    metaDescription:
      'Oral surgery and wisdom tooth care in Stuttgart West. Calm care, request your consultation online.',
    visibleText:
      'Oralchirurgie in Stuttgart West. Wisdom tooth removal, oral surgery and calm patient care. Our team combines modern treatment rooms with clear patient guidance. Request your consultation online.',
    contactInfo: {
      emails: ['team@oral-surgery-atelier.example'],
      phones: ['0711 234 56 70'],
      addresses: ['Rotebuhlstrasse 88 70178 Stuttgart West'],
    },
    contactEnrichment: { emails: [], phones: [], addresses: [] },
    bookingLinks: [],
    trustSignals: ['mentions team', 'mentions patient comfort', 'mentions advanced technology'],
    isPlaceholderContent: false,
    extractedAt: new Date('2026-04-02T11:00:00.000Z'),
  };

  const signals = await new DetectSignals(new RuleBasedSignalDetector()).execute(lead, snapshot);
  const auditDraft = await new MockAuditGenerator().generate({
    lead,
    snapshot,
    signals,
  });

  assert.match(auditDraft.summary, /oral-surgery care/i);
  assert.ok(
    auditDraft.strengths.some((strength) => /oral-surgery care/i.test(strength)),
  );
  assert.ok(
    auditDraft.evidence.some((item) => /oral-surgery care/i.test(item)),
  );
});

test('mock audit generator differentiates benchmark classes instead of collapsing to generic audit copy', async () => {
  const detector = new DetectSignals(new RuleBasedSignalDetector());
  const generator = new MockAuditGenerator();
  const selectedIds = [
    'multilingual-good-munich',
    'english-local-cologne',
    'bad-fit-chain',
    'network-brand',
    'weaker-contact-endodontics-dresden',
    'weaker-contact-pediatric-hamburg',
    'placeholder',
  ];
  const drafts = new Map();

  for (const id of selectedIds) {
    const fixture = benchmarkFixtures.find((entry) => entry.id === id);
    assert.ok(fixture, `${id}: fixture not found`);

    const extracted = buildLeadSnapshot(fixture.html, fixture.lead.website);
    const snapshot = {
      id: `snapshot-${fixture.id}`,
      leadId: fixture.lead.id,
      ...extracted,
    };

    const signals = await detector.execute(fixture.lead, snapshot);
    drafts.set(
      id,
      await generator.generate({
        lead: fixture.lead,
        snapshot,
        signals,
      }),
    );
  }

  assert.match(drafts.get('multilingual-good-munich').summary, /bilingual/i);
  assert.match(
    drafts.get('multilingual-good-munich').evidence.join(' '),
    /German and English messaging/i,
  );
  assert.match(drafts.get('english-local-cologne').summary, /English-led/i);
  assert.match(
    drafts.get('english-local-cologne').evidence.join(' '),
    /English while still naming the local market/i,
  );
  assert.match(
    drafts.get('bad-fit-chain').summary,
    /large, multi-location dental network/i,
  );
  assert.doesNotMatch(
    drafts.get('bad-fit-chain').summary,
    /family-led|long-standing local presence/i,
  );
  assert.match(
    drafts.get('network-brand').summary,
    /brand-led multi-site practice/i,
  );
  assert.match(
    drafts.get('network-brand').evidence.join(' '),
    /network-style branding/i,
  );
  assert.match(
    drafts.get('weaker-contact-endodontics-dresden').summary,
    /endodontic care/i,
  );
  assert.match(
    drafts.get('weaker-contact-pediatric-hamburg').summary,
    /family and pediatric care/i,
  );
  assert.match(drafts.get('placeholder').summary, /placeholder|inactive/i);
  assert.doesNotMatch(
    drafts.get('placeholder').summary,
    /credible local presence|commercially valid/i,
  );
  assert.match(
    drafts.get('placeholder').evidence.join(' '),
    /under construction/i,
  );
});

test('mock audit generator surfaces local mismatch and weak-contact audit evidence for thinner leads', async () => {
  const detector = new DetectSignals(new RuleBasedSignalDetector());
  const generator = new MockAuditGenerator();
  const selectedIds = [
    'uncertain-review',
    'weaker-contact-endodontics-dresden',
    'weaker-contact-pediatric-hamburg',
  ];
  const drafts = new Map();

  for (const id of selectedIds) {
    const fixture = benchmarkFixtures.find((entry) => entry.id === id);
    assert.ok(fixture, `${id}: fixture not found`);

    const extracted = buildLeadSnapshot(fixture.html, fixture.lead.website);
    const snapshot = {
      id: `snapshot-${fixture.id}`,
      leadId: fixture.lead.id,
      ...extracted,
    };

    const signals = await detector.execute(fixture.lead, snapshot);
    drafts.set(
      id,
      await generator.generate({
        lead: fixture.lead,
        snapshot,
        signals,
      }),
    );
  }

  assert.match(
    drafts.get('uncertain-review').summary,
    /does not line up cleanly with the recorded lead geography/i,
  );
  assert.match(
    drafts.get('uncertain-review').recommendedAngle,
    /qualification gap/i,
  );
  assert.match(
    drafts.get('uncertain-review').evidence.join(' '),
    /does not line up cleanly with the recorded lead location/i,
  );
  assert.match(
    drafts.get('weaker-contact-endodontics-dresden').evidence.join(' '),
    /no phone path stands out/i,
  );
  assert.match(
    drafts.get('weaker-contact-pediatric-hamburg').evidence.join(' '),
    /no email path stands out/i,
  );
});

test('mock outreach generator differentiates english-led, qualification-gap, specialty, and weak-contact leads', async () => {
  const detector = new DetectSignals(new RuleBasedSignalDetector());
  const outreachGenerator = createDefaultOutreachGenerator();
  const auditGenerator = new MockAuditGenerator();
  const selectedIds = [
    'english-local-cologne',
    'multilingual-specialty-stuttgart',
    'uncertain-review',
    'weaker-contact-endodontics-dresden',
    'weaker-contact-pediatric-hamburg',
  ];
  const drafts = new Map();

  for (const id of selectedIds) {
    const fixture = benchmarkFixtures.find((entry) => entry.id === id);
    assert.ok(fixture, `${id}: fixture not found`);

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

    drafts.set(
      id,
      await outreachGenerator.generate({
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
      }),
    );
  }

  assert.match(
    drafts.get('english-local-cologne').subject ?? '',
    /English-led booking|clear booking/i,
  );
  assert.match(
    drafts.get('multilingual-specialty-stuttgart').body ?? '',
    /an oral-surgery care practice/i,
  );
  assert.match(
    drafts.get('uncertain-review').fitReason ?? '',
    /recorded lead geography/i,
  );
  assert.match(
    drafts.get('uncertain-review').bestAngle ?? '',
    /qualification gap/i,
  );
  assert.match(
    drafts.get('uncertain-review').evidence.join(' '),
    /qualification gap|recorded lead location/i,
  );
  assert.match(
    drafts.get('weaker-contact-endodontics-dresden').fitReason ?? '',
    /only an email path stands out/i,
  );
  assert.match(
    drafts.get('weaker-contact-endodontics-dresden').evidence.join(' '),
    /no phone path stands out/i,
  );
  assert.match(
    drafts.get('weaker-contact-pediatric-hamburg').fitReason ?? '',
    /only a phone path stands out/i,
  );
  assert.match(
    drafts.get('weaker-contact-pediatric-hamburg').evidence.join(' '),
    /no email path stands out/i,
  );
});

test('mock generators stay grounded on the stored-data validation pack slices', async () => {
  const detector = new DetectSignals(new RuleBasedSignalDetector());
  const auditGenerator = new MockAuditGenerator();
  const outreachGenerator = createDefaultOutreachGenerator();
  const selectedIds = [
    'stored-validation-isarbogen',
    'stored-validation-decent-quality',
    'stored-validation-ladewig',
    'stored-validation-low-quality',
  ];
  const auditDrafts = new Map();
  const drafts = new Map();

  for (const id of selectedIds) {
    const fixture = benchmarkFixtures.find((entry) => entry.id === id);
    assert.ok(fixture, `${id}: fixture not found`);

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

    auditDrafts.set(id, auditDraft);

    drafts.set(
      id,
      await outreachGenerator.generate({
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
          createdAt: new Date('2026-04-02T00:00:00.000Z'),
        },
      }),
    );
  }

  assert.match(
    auditDrafts.get('stored-validation-isarbogen').summary,
    /brand-led multi-site practice/i,
  );
  assert.equal(
    drafts.get('stored-validation-isarbogen').recommendation,
    'review',
  );
  assert.match(
    drafts.get('stored-validation-isarbogen').subject ?? '',
    /new-patient booking clearer/i,
  );
  assert.match(
    drafts.get('stored-validation-isarbogen').body ?? '',
    /review case instead of an automatic send/i,
  );
  assert.match(
    drafts.get('stored-validation-isarbogen').fitReason ?? '',
    /scaled dental brand and a locally credible clinic/i,
  );
  assert.match(
    drafts.get('stored-validation-isarbogen').bestAngle ?? '',
    /trust already visible on the site/i,
  );
  assert.match(
    drafts.get('stored-validation-isarbogen').reasoning ?? '',
    /reviewed trust-to-booking case/i,
  );
  assert.match(
    drafts.get('stored-validation-isarbogen').evidence.join(' '),
    /network-style branding and multiple location references/i,
  );

  assert.match(
    auditDrafts.get('stored-validation-decent-quality').summary,
    /direct booking path/i,
  );
  assert.match(
    drafts.get('stored-validation-decent-quality').subject ?? '',
    /direct booking/i,
  );
  assert.match(
    drafts.get('stored-validation-decent-quality').body ?? '',
    /direct way to book/i,
  );
  assert.match(
    drafts.get('stored-validation-decent-quality').fitReason ?? '',
    /direct booking path/i,
  );
  assert.match(
    drafts.get('stored-validation-decent-quality').reasoning ?? '',
    /direct booking path/i,
  );
  assert.match(
    drafts.get('stored-validation-decent-quality').evidence.join(' '),
    /A direct booking path is already present/i,
  );

  assert.match(
    auditDrafts.get('stored-validation-ladewig').summary,
    /family-led, long-standing positioning/i,
  );
  assert.match(
    drafts.get('stored-validation-ladewig').subject ?? '',
    /turning trust into bookings/i,
  );
  assert.match(
    drafts.get('stored-validation-ladewig').body ?? '',
    /long-standing local presence/i,
  );
  assert.match(
    drafts.get('stored-validation-ladewig').body ?? '',
    /family feel/i,
  );
  assert.match(
    drafts.get('stored-validation-ladewig').reasoning ?? '',
    /strong trust material/i,
  );
  assert.match(
    drafts.get('stored-validation-ladewig').evidence.join(' '),
    /family-led, long-standing positioning/i,
  );
  assert.doesNotMatch(
    drafts.get('stored-validation-ladewig').subject ?? '',
    /making booking easier/i,
  );

  assert.match(
    auditDrafts.get('stored-validation-low-quality').summary,
    /placeholder|inactive/i,
  );
  assert.equal(
    drafts.get('stored-validation-low-quality').recommendation,
    'do_not_send',
  );
  assert.equal(drafts.get('stored-validation-low-quality').subject, null);
});
