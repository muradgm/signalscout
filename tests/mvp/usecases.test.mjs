import assert from 'node:assert/strict';
import test from 'node:test';
import {
  CreateReply,
  DetectSignals,
  GenerateAudit,
  GenerateOutreach,
  ReviewOutreach,
  SendOutreach,
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
  history = [];
  stored = {
    id: 'outreach-generated-1',
    leadId: leadFixture.id,
    auditId: 'audit-generated-1',
    channel: 'email',
    recommendation: 'send',
    fitReason: 'Strong local lead',
    bestAngle: 'Trust-to-booking conversion',
    generatedSubject: 'Quick thought on booking at Zahnarzt Michael Prenzlauer Berg',
    generatedBody: 'Generated body',
    subject: 'Quick thought on booking at Zahnarzt Michael Prenzlauer Berg',
    body: 'Generated body',
    reasoning: 'Use trust-to-booking angle',
    evidence: ['trust already present'],
    status: 'drafted',
    reviewStatus: 'not_reviewed',
    reviewedAt: null,
    sentAt: null,
    sendAttemptCount: 0,
    lastSendAttemptAt: null,
    lastSendErrorCode: null,
    lastSendError: null,
    lastSendRetryable: false,
    deliveryProvider: null,
    providerMessageId: null,
    createdAt: new Date('2026-04-01T18:05:00.000Z'),
  };

  async save(input) {
    this.saved = input;
    this.stored = {
      id: 'outreach-generated-1',
      ...input,
      createdAt: new Date('2026-04-01T18:05:00.000Z'),
    };
    this.history.push(this.stored);
    return this.stored;
  }

  async countByLeadIdAndAuditId(leadId, auditId) {
    return this.history.filter(
      (item) => item.leadId === leadId && item.auditId === auditId,
    ).length;
  }

  async updateReview(_outreachId, input) {
    this.stored = {
      ...this.stored,
      reviewStatus: input.reviewStatus,
      status: input.status,
      subject: input.subject,
      body: input.body,
      reviewedAt: input.reviewedAt,
    };

    return this.stored;
  }

  async findById(outreachId) {
    return outreachId === this.stored.id ? this.stored : null;
  }

  async markSent(_outreachId, input) {
    this.stored = {
      ...this.stored,
      status: 'sent',
      sentAt: input.sentAt,
      sendAttemptCount: this.stored.sendAttemptCount + 1,
      lastSendAttemptAt: input.attemptedAt,
      lastSendErrorCode: null,
      lastSendError: null,
      lastSendRetryable: false,
      deliveryProvider: input.deliveryProvider,
      providerMessageId: input.providerMessageId,
    };

    return this.stored;
  }

  async recordSendFailure(_outreachId, input) {
    this.stored = {
      ...this.stored,
      sendAttemptCount: this.stored.sendAttemptCount + 1,
      lastSendAttemptAt: input.attemptedAt,
      lastSendErrorCode: input.errorCode,
      lastSendError: input.errorMessage,
      lastSendRetryable: input.retryable,
    };

    return this.stored;
  }

  async markReplied() {
    this.stored = {
      ...this.stored,
      status: 'replied',
    };

    return this.stored;
  }
}

class InMemoryLeadRepository {
  lead = {
    ...leadFixture,
    status: 'new',
  };

  async create() {
    return this.lead;
  }

  async findById(id) {
    return id === this.lead.id ? this.lead : null;
  }

  async findMany() {
    return [this.lead];
  }

  async updateStatus(id, status) {
    if (id !== this.lead.id) {
      return null;
    }

    this.lead = {
      ...this.lead,
      status,
    };

    return this.lead;
  }
}

class InMemoryLeadSnapshotRepository {
  async findLatestByLeadId() {
    return {
      id: 'snapshot-generated-1',
      leadId: leadFixture.id,
      url: leadFixture.website,
      pageTitle: 'Zahnarzt Michael Prenzlauer Berg',
      metaDescription: null,
      visibleText: '',
      contactInfo: {
        emails: ['info@zahnarztmichael.de'],
        phones: [],
        addresses: [],
      },
      contactEnrichment: { emails: [], phones: [], addresses: [] },
      bookingLinks: [],
      trustSignals: [],
      isPlaceholderContent: false,
      extractedAt: new Date('2026-04-01T18:00:00.000Z'),
    };
  }

  async findLeadIdsByEmail(email) {
    return email === 'info@zahnarztmichael.de' ? [leadFixture.id] : [];
  }
}

class InMemoryOutreachSender {
  sent = null;

  async send(input) {
    this.sent = input;
    return {
      provider: 'resend',
      providerMessageId: 'resend-msg-1',
    };
  }
}

class InMemoryDeliveryEventRepository {
  events = [];

  async save(input) {
    const event = {
      id: `delivery-event-${this.events.length + 1}`,
      ...input,
      recordedAt: new Date('2026-04-01T18:10:00.000Z'),
    };
    this.events.push(event);
    return event;
  }

  async findLatestByOutreachId(outreachId, limit = 5) {
    return this.events
      .filter((event) => event.outreachId === outreachId)
      .slice(-limit)
      .reverse();
  }

  async summarizeByOutreachId(outreachId) {
    const events = this.events.filter((event) => event.outreachId === outreachId);
    return {
      totalEvents: events.length,
      latestEventType: events.at(-1)?.eventType ?? null,
      latestEventAt: events.at(-1)?.occurredAt ?? null,
      deliveredCount: events.filter((event) => event.eventType === 'delivered').length,
      openedCount: events.filter((event) => event.eventType === 'opened').length,
      clickedCount: events.filter((event) => event.eventType === 'clicked').length,
      bouncedCount: events.filter((event) => event.eventType === 'bounced').length,
      complainedCount: events.filter((event) => event.eventType === 'complained').length,
      failedCount: events.filter((event) => event.eventType === 'failed').length,
    };
  }

  async findOutreachIdByProviderMessageId(_provider, providerMessageId) {
    return this.events.find((event) => event.providerMessageId === providerMessageId)?.outreachId ?? null;
  }
}

class InMemoryReplyRepository {
  replies = [];

  async save(input) {
    const reply = {
      id: `reply-${this.replies.length + 1}`,
      ...input,
      createdAt: new Date('2026-04-01T18:15:00.000Z'),
    };
    this.replies.push(reply);
    return reply;
  }

  async findByProviderMessageId(providerMessageId) {
    return (
      this.replies.find((reply) => reply.providerMessageId === providerMessageId) ?? null
    );
  }

  async findLatestByLeadId(leadId) {
    return this.replies.find((reply) => reply.leadId === leadId) ?? null;
  }

  async findManyByLeadId(leadId) {
    return this.replies.filter((reply) => reply.leadId === leadId);
  }

  async findRecent(limit = 10) {
    return this.replies.slice(-limit).reverse();
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
  assert.equal(outreach.reviewStatus, 'not_reviewed');
  assert.equal(outreach.generatedSubject, outreach.subject);
  assert.equal(outreach.generatedBody, outreach.body);
  assert.equal(outreach.recommendation, 'send');
  assert.match(outreach.subject ?? '', /quick thought on booking/i);
});

test('regenerating outreach on the same audit rotates to a different draft variant', async () => {
  const snapshot = await buildSnapshotFixture();
  const signals = await new DetectSignals(new RuleBasedSignalDetector()).execute(
    leadFixture,
    snapshot,
  );

  const outreachRepository = new InMemoryOutreachRepository();
  const generateOutreach = new GenerateOutreach(
    new MockOutreachGenerator(),
    outreachRepository,
  );

  const audit = {
    id: 'audit-generated-1',
    leadId: leadFixture.id,
    snapshotId: snapshot.id,
    summary: 'Trust is strong, but booking momentum is softer than it should be.',
    strengths: ['Strong local relevance'],
    opportunities: ['Push visitors more clearly into booking'],
    opportunityDetails: ['Booking CTA could be stronger'],
    risks: [],
    recommendedAngle: 'Trust-to-booking conversion',
    confidenceNote: 'Grounded review',
    evidence: ['booking path is clear'],
    createdAt: new Date('2026-04-01T18:00:00.000Z'),
  };

  const first = await generateOutreach.execute({
    lead: leadFixture,
    snapshot,
    signals,
    audit,
  });

  const second = await generateOutreach.execute({
    lead: leadFixture,
    snapshot,
    signals,
    audit,
  });

  assert.notEqual(first.subject, second.subject);
  assert.notEqual(first.body, second.body);
});

test('review outreach persists accepted, edited, and skipped states', async () => {
  const outreachRepository = new InMemoryOutreachRepository();
  const reviewOutreach = new ReviewOutreach(outreachRepository);

  const accepted = await reviewOutreach.execute({
    outreachId: 'outreach-generated-1',
    action: 'accepted',
    subject: outreachRepository.stored.subject,
    body: outreachRepository.stored.body,
  });

  assert.equal(accepted.reviewStatus, 'accepted');
  assert.equal(accepted.status, 'approved');

  const edited = await reviewOutreach.execute({
    outreachId: 'outreach-generated-1',
    action: 'edited',
    subject: 'Sharper subject',
    body: 'Edited body',
  });

  assert.equal(edited.reviewStatus, 'edited');
  assert.equal(edited.status, 'approved');
  assert.equal(edited.subject, 'Sharper subject');
  assert.equal(edited.body, 'Edited body');

  const skipped = await reviewOutreach.execute({
    outreachId: 'outreach-generated-1',
    action: 'skipped',
    subject: edited.subject,
    body: edited.body,
  });

  assert.equal(skipped.reviewStatus, 'skipped');
  assert.equal(skipped.status, 'closed');
});

test('send outreach dispatches an approved draft and marks it sent', async () => {
  const outreachRepository = new InMemoryOutreachRepository();
  const leadSnapshotRepository = new InMemoryLeadSnapshotRepository();
  const outreachSender = new InMemoryOutreachSender();
  const deliveryEventRepository = new InMemoryDeliveryEventRepository();

  outreachRepository.stored = {
    ...outreachRepository.stored,
    status: 'approved',
    reviewStatus: 'accepted',
    subject: 'Ready subject',
    body: 'Ready body',
  };

  const sendOutreach = new SendOutreach(
    outreachRepository,
    leadSnapshotRepository,
    outreachSender,
    deliveryEventRepository,
  );

  const sent = await sendOutreach.execute('outreach-generated-1');

  assert.equal(outreachSender.sent.to, 'info@zahnarztmichael.de');
  assert.equal(outreachSender.sent.subject, 'Ready subject');
  assert.equal(sent.status, 'sent');
  assert.ok(sent.sentAt instanceof Date);
  assert.equal(sent.sendAttemptCount, 1);
  assert.equal(sent.lastSendError, null);
  assert.equal(sent.deliveryProvider, 'resend');
  assert.equal(sent.providerMessageId, 'resend-msg-1');
  assert.equal(deliveryEventRepository.events.length, 1);
  assert.equal(deliveryEventRepository.events[0].eventType, 'provider_accepted');
});

test('send outreach records retryable provider failures for later review', async () => {
  const outreachRepository = new InMemoryOutreachRepository();
  const leadSnapshotRepository = new InMemoryLeadSnapshotRepository();
  const deliveryEventRepository = new InMemoryDeliveryEventRepository();
  const outreachSender = {
    async send() {
      const error = new Error('Provider temporarily unavailable');
      error.name = 'OutreachSendError';
      error.code = 'provider_failed';
      throw error;
    },
  };

  outreachRepository.stored = {
    ...outreachRepository.stored,
    status: 'approved',
    reviewStatus: 'accepted',
    subject: 'Ready subject',
    body: 'Ready body',
  };

  const sendOutreach = new SendOutreach(
    outreachRepository,
    leadSnapshotRepository,
    outreachSender,
    deliveryEventRepository,
  );

  await assert.rejects(() => sendOutreach.execute('outreach-generated-1'), {
    name: 'OutreachSendError',
  });

  assert.equal(outreachRepository.stored.status, 'approved');
  assert.equal(outreachRepository.stored.sendAttemptCount, 1);
  assert.equal(outreachRepository.stored.lastSendErrorCode, 'provider_failed');
  assert.equal(
    outreachRepository.stored.lastSendError,
    'Provider temporarily unavailable',
  );
  assert.equal(outreachRepository.stored.lastSendRetryable, true);
  assert.equal(deliveryEventRepository.events.at(-1)?.eventType, 'failed');
});

test('create reply persists inbound reply and marks lead/outreach as replied', async () => {
  const replyRepository = new InMemoryReplyRepository();
  const outreachRepository = new InMemoryOutreachRepository();
  const leadRepository = new InMemoryLeadRepository();

  outreachRepository.stored = {
    ...outreachRepository.stored,
    status: 'sent',
    reviewStatus: 'accepted',
  };

  const createReply = new CreateReply(
    replyRepository,
    outreachRepository,
    leadRepository,
  );

  const reply = await createReply.execute({
    outreachId: 'outreach-generated-1',
    fromEmail: 'patient@example.com',
    subject: 'Interested',
    body: 'Can we talk next week?',
    source: 'manual',
  });

  assert.equal(reply?.leadId, leadFixture.id);
  assert.equal(reply?.outreachId, 'outreach-generated-1');
  assert.equal(reply?.fromEmail, 'patient@example.com');
  assert.equal(reply?.providerMessageId ?? null, null);
  assert.equal(outreachRepository.stored.status, 'replied');
  assert.equal(leadRepository.lead.status, 'replied');
});

test('create reply is idempotent for provider-backed inbound messages', async () => {
  const replyRepository = new InMemoryReplyRepository();
  const outreachRepository = new InMemoryOutreachRepository();
  const leadRepository = new InMemoryLeadRepository();
  const createReply = new CreateReply(
    replyRepository,
    outreachRepository,
    leadRepository,
  );

  const first = await createReply.execute({
    outreachId: 'outreach-generated-1',
    fromEmail: 'patient@example.com',
    subject: 'Interested',
    body: 'Can we talk next week?',
    source: 'provider_webhook',
    providerMessageId: 'incoming-msg-1',
    inReplyToProviderMessageId: 'resend-msg-1',
  });

  const second = await createReply.execute({
    outreachId: 'outreach-generated-1',
    fromEmail: 'patient@example.com',
    subject: 'Interested',
    body: 'Can we talk next week?',
    source: 'provider_webhook',
    providerMessageId: 'incoming-msg-1',
    inReplyToProviderMessageId: 'resend-msg-1',
  });

  assert.equal(first?.id, second?.id);
  assert.equal(replyRepository.replies.length, 1);
});
