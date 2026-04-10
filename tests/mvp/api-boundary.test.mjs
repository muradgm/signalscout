import assert from 'node:assert/strict';
import test from 'node:test';
import { createApp } from '../../apps/api/dist/app.js';
import {
  leadResponseSchema,
  leadSnapshotResponseSchema,
  leadSignalsResponseSchema,
} from '../../apps/api/dist/modules/leads/leads.schema.js';
import { auditResponseSchema } from '../../apps/api/dist/modules/audits/audits.schema.js';
import { outreachResponseSchema } from '../../apps/api/dist/modules/outreach/outreach.schema.js';
import { replyResponseSchema } from '../../apps/api/dist/modules/replies/replies.schema.js';
import {
  mapLeadSnapshotToResponse,
  mapLeadToResponse,
  mapSignalSetToResponse,
} from '../../apps/api/dist/modules/leads/leads.mapper.js';
import { mapAuditToResponse } from '../../apps/api/dist/modules/audits/audits.mapper.js';
import { mapOutreachToResponse } from '../../apps/api/dist/modules/outreach/outreach.mapper.js';

const startServer = async () => {
  const app = createApp();
  const server = await new Promise((resolve) => {
    const instance = app.listen(0, '127.0.0.1', () => resolve(instance));
  });

  const address = server.address();
  assert.ok(address && typeof address === 'object');

  return {
    baseUrl: `http://127.0.0.1:${address.port}/api`,
    server,
  };
};

const stopServer = async (server) => {
  await new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
};

test('live API routes reject invalid request payloads consistently at the boundary', async () => {
  const { baseUrl, server } = await startServer();

  try {
    const cases = [
      {
        method: 'POST',
        path: '/leads',
        init: {
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            companyName: '   ',
            website: '',
            niche: 'dentist',
            location: '',
            country: '',
            source: 'manual',
          }),
        },
      },
      {
        method: 'GET',
        path: '/audits/lead?leadId=%20%20',
      },
      {
        method: 'GET',
        path: '/outreach/lead?leadId=%20%20',
      },
      {
        method: 'POST',
        path: '/leads/%20/snapshot',
      },
      {
        method: 'POST',
        path: '/leads/%20/audit',
      },
      {
        method: 'POST',
        path: '/leads/%20/outreach',
      },
      {
        method: 'PATCH',
        path: '/outreach/%20/review',
        init: {
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ action: 'edited', subject: '   ', body: '' }),
        },
      },
      {
        method: 'POST',
        path: '/outreach/%20/send',
      },
      {
        method: 'GET',
        path: '/leads/%20/signals',
      },
      {
        method: 'GET',
        path: '/leads/%20',
      },
    ];

    for (const item of cases) {
      const response = await fetch(`${baseUrl}${item.path}`, {
        method: item.method,
        ...item.init,
      });
      const payload = await response.json();

      assert.equal(response.status, 400, `${item.method} ${item.path} should return 400`);
      assert.equal(payload.success, false);
      assert.equal(payload.error, 'Validation failed');
      assert.ok(Array.isArray(payload.details));
      assert.ok(payload.details.length > 0);
    }
  } finally {
    await stopServer(server);
  }
});

test('response mappers conform to the declared response schemas', () => {
  const lead = {
    id: 'lead-1',
    companyName: 'Praxis am Park',
    website: 'https://praxis-am-park.example',
    niche: 'dentist',
    location: 'Berlin',
    country: 'Germany',
    source: 'manual',
    status: 'new',
    completeness: 'complete',
    createdAt: new Date('2026-04-02T10:00:00.000Z'),
    updatedAt: new Date('2026-04-02T10:05:00.000Z'),
  };

  const snapshot = {
    id: 'snapshot-1',
    leadId: lead.id,
    url: lead.website,
    pageTitle: 'Praxis am Park',
    metaDescription: 'Local dentist in Berlin',
    visibleText: 'Visible text',
    contactInfo: {
      emails: ['kontakt@praxis-am-park.example'],
      phones: ['030 123 45 67'],
      addresses: ['Parkallee 8 10115 Berlin'],
    },
    contactEnrichment: {
      emails: [
        {
          value: 'kontakt@praxis-am-park.example',
          sourceKind: 'official_site',
          sourceUrl: 'https://praxis-am-park.example/impressum',
          confidence: 'high',
        },
      ],
      phones: [],
      addresses: [],
    },
    bookingLinks: ['https://booking.example'],
    trustSignals: ['mentions patient comfort'],
    isPlaceholderContent: false,
    extractedAt: new Date('2026-04-02T10:06:00.000Z'),
  };

  const signals = {
    bookingPresence: 'direct',
    contactClarity: 'high',
    trustSignalStrength: 'high',
    businessScale: 'single_location',
    localRelevance: 'high_match',
    outreachFit: 'good',
    fitReason: 'The site looks like a strong local-service fit.',
    confidence: 'high',
    leadCompleteness: 'complete',
    issuesDetected: [],
    evidence: ['booking path is clear'],
  };

  const audit = {
    id: 'audit-1',
    leadId: lead.id,
    snapshotId: snapshot.id,
    summary: 'Trust is strong, but booking momentum is softer than it should be.',
    strengths: ['Strong local relevance'],
    opportunities: ['Push visitors more clearly into booking'],
    opportunityDetails: ['Booking CTA could be stronger'],
    risks: [],
    recommendedAngle: 'Trust-to-booking conversion',
    confidenceNote: 'Grounded review',
    evidence: ['booking path is clear'],
    createdAt: new Date('2026-04-02T10:07:00.000Z'),
  };
  const outreach = {
    id: 'outreach-1',
    leadId: lead.id,
    auditId: audit.id,
    channel: 'email',
    recommendation: 'send',
    status: 'approved',
    reviewStatus: 'not_reviewed',
    fitReason: 'Strong local lead',
    bestAngle: 'Trust is present but booking friction remains',
    generatedSubject: 'Quick thought on booking at Praxis am Park',
    generatedBody: 'Hi,\n\nA few booking improvements stand out.\n\nBest,\n[Your Name]',
    subject: 'Quick thought on booking at Praxis am Park',
    body: 'Hi,\n\nA few booking improvements stand out.\n\nBest,\n[Your Name]',
    reasoning: 'Use trust-to-booking angle',
    evidence: ['trust already present'],
    reviewedAt: null,
    sentAt: null,
    sendAttemptCount: 1,
    lastSendAttemptAt: new Date('2026-04-02T10:09:00.000Z'),
    lastSendErrorCode: 'provider_failed',
    lastSendError: 'Resend temporarily unavailable',
    lastSendRetryable: true,
    deliveryProvider: 'resend',
    providerMessageId: 'resend-msg-1',
    createdAt: new Date('2026-04-02T10:08:00.000Z'),
  };
  const reply = {
    id: 'reply-1',
    leadId: lead.id,
    outreachId: outreach.id,
    channel: 'email',
    source: 'manual',
    providerMessageId: null,
    inReplyToProviderMessageId: null,
    fromEmail: 'patient@example.com',
    subject: 'Interested',
    body: 'Can we talk next week?',
    receivedAt: new Date('2026-04-02T10:10:00.000Z'),
    createdAt: new Date('2026-04-02T10:10:00.000Z'),
  };

  leadResponseSchema.parse(mapLeadToResponse(lead));
  leadSnapshotResponseSchema.parse(mapLeadSnapshotToResponse(snapshot));
  leadSignalsResponseSchema.parse({
    lead: mapLeadToResponse(lead),
    snapshotId: snapshot.id,
    signals: mapSignalSetToResponse(signals),
  });
  auditResponseSchema.parse(mapAuditToResponse(audit));
  outreachResponseSchema.parse(
    mapOutreachToResponse(outreach, {
      recipientEmail: 'kontakt@praxis-am-park.example',
      senderIdentity: 'SignalScout <onboarding@resend.dev>',
      senderMode: 'development',
      senderProvider: 'resend',
      senderDomain: 'resend.dev',
      senderReadiness: 'development_only',
      productionReady: false,
      telemetryMode: 'workspace_only',
      webhookEndpointUrl: 'https://example.ngrok-free.app/api/webhooks/resend/outreach-events',
      webhookHosting: 'temporary_tunnel',
      webhookHostingReady: false,
      webhookHostingWarning:
        'Webhook delivery currently depends on a temporary tunnel URL. Replace it with stable public hosting before relying on it in production.',
      canSend: true,
      blockingReason: null,
    }, {
      provider: 'resend',
      providerMessageId: 'resend-msg-1',
      summary: {
        totalEvents: 1,
        latestEventType: 'provider_accepted',
        latestEventAt: '2026-04-02T10:09:00.000Z',
        deliveredCount: 0,
        openedCount: 0,
        clickedCount: 0,
        bouncedCount: 0,
        complainedCount: 0,
        failedCount: 0,
      },
      recentEvents: [
        {
          id: 'delivery-event-1',
          eventType: 'provider_accepted',
          occurredAt: '2026-04-02T10:09:00.000Z',
          recordedAt: '2026-04-02T10:09:00.000Z',
          summary: 'Provider accepted outbound email',
          errorCode: null,
          retryable: false,
          providerMessageId: 'resend-msg-1',
        },
      ],
    }),
  );
  replyResponseSchema.parse({
    id: reply.id,
    leadId: reply.leadId,
    outreachId: reply.outreachId,
    channel: reply.channel,
    source: reply.source,
    providerMessageId: reply.providerMessageId,
    inReplyToProviderMessageId: reply.inReplyToProviderMessageId,
    fromEmail: reply.fromEmail,
    subject: reply.subject,
    body: reply.body,
    receivedAt: reply.receivedAt.toISOString(),
    createdAt: reply.createdAt.toISOString(),
  });
});
