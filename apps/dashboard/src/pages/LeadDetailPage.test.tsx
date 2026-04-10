import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LeadDetailPage } from './LeadDetailPage';
import type { Audit } from '../features/audits/types';
import type { Lead, LeadSignalsResult, Snapshot } from '../features/leads/types';
import type { Outreach } from '../features/outreach/types';
import type { Reply } from '../features/replies/types';

vi.mock('../features/leads/api', () => ({
  fetchLeads: vi.fn(),
  fetchLeadSignals: vi.fn(),
  refreshLeadSnapshot: vi.fn(),
}));

vi.mock('../features/audits/api', () => ({
  fetchLatestAudit: vi.fn(),
  generateAudit: vi.fn(),
}));

vi.mock('../features/outreach/api', () => ({
  fetchLatestOutreach: vi.fn(),
  generateOutreach: vi.fn(),
  reviewOutreach: vi.fn(),
  sendOutreach: vi.fn(),
}));

vi.mock('../features/replies/api', () => ({
  fetchRepliesByLead: vi.fn(),
  createReply: vi.fn(),
}));

import { fetchLeads, fetchLeadSignals, refreshLeadSnapshot } from '../features/leads/api';
import { fetchLatestAudit, generateAudit } from '../features/audits/api';
import {
  fetchLatestOutreach,
  generateOutreach,
  reviewOutreach,
  sendOutreach,
} from '../features/outreach/api';
import { createReply, fetchRepliesByLead } from '../features/replies/api';

const mockedFetchLeads = vi.mocked(fetchLeads);
const mockedFetchLeadSignals = vi.mocked(fetchLeadSignals);
const mockedRefreshLeadSnapshot = vi.mocked(refreshLeadSnapshot);
const mockedFetchLatestAudit = vi.mocked(fetchLatestAudit);
const mockedGenerateAudit = vi.mocked(generateAudit);
const mockedFetchLatestOutreach = vi.mocked(fetchLatestOutreach);
const mockedGenerateOutreach = vi.mocked(generateOutreach);
const mockedReviewOutreach = vi.mocked(reviewOutreach);
const mockedSendOutreach = vi.mocked(sendOutreach);
const mockedFetchRepliesByLead = vi.mocked(fetchRepliesByLead);
const mockedCreateReply = vi.mocked(createReply);

const leadFixture: Lead = {
  id: 'lead-1',
  companyName: 'Praxis am Park',
  website: 'https://praxis-am-park.example',
  niche: 'dentist',
  location: 'Berlin',
  status: 'new',
  completeness: 'legacy_incomplete',
  createdAt: '2026-04-01T10:00:00.000Z',
  updatedAt: '2026-04-01T12:00:00.000Z',
};

const signalsFixture: LeadSignalsResult = {
  lead: leadFixture,
  snapshotId: 'snapshot-1',
  signals: {
    bookingPresence: 'direct',
    contactClarity: 'high',
    trustSignalStrength: 'high',
    businessScale: 'single_location',
    localRelevance: 'high_match',
    outreachFit: 'good',
    fitReason: 'The site looks like a strong local-service fit.',
    confidence: 'high',
    leadCompleteness: leadFixture.completeness,
    issuesDetected: [],
    evidence: ['booking path is clear'],
  },
};

const snapshotFixture: Snapshot = {
  id: 'snapshot-2',
  leadId: leadFixture.id,
  url: leadFixture.website,
  pageTitle: 'Praxis am Park',
  metaDescription: 'Strong local dentist',
  visibleText: 'Visible text',
  contactInfo: {
    emails: ['kontakt@praxis-am-park.example'],
    phones: ['030 123 45 67'],
    addresses: ['Parkallee 8 10115 Berlin'],
  },
  contactEnrichment: { emails: [], phones: [], addresses: [] },
  bookingLinks: ['https://booking.example'],
  trustSignals: ['mentions patient comfort'],
  isPlaceholderContent: false,
  extractedAt: '2026-04-02T09:00:00.000Z',
};

const auditFixture: Audit = {
  id: 'audit-1',
  leadId: leadFixture.id,
  snapshotId: signalsFixture.snapshotId,
  summary: 'Trust is strong, but booking momentum is softer than it should be.',
  strengths: ['Strong local relevance'],
  opportunities: ['Push visitors more clearly into booking'],
  opportunityDetails: ['Booking CTA could be stronger'],
  risks: [],
  recommendedAngle: 'Trust-to-booking conversion',
  confidenceNote: 'Grounded review',
  evidence: ['booking path is clear'],
  createdAt: '2026-04-02T09:05:00.000Z',
};

const outreachFixture: Outreach = {
  id: 'outreach-1',
  leadId: leadFixture.id,
  auditId: auditFixture.id,
  channel: 'email',
  recommendation: 'send',
  status: 'drafted',
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
  sendAttemptCount: 0,
  lastSendAttemptAt: null,
  lastSendErrorCode: null,
  lastSendError: null,
  lastSendRetryable: false,
  deliveryProvider: null,
  providerMessageId: null,
  createdAt: '2026-04-02T09:08:00.000Z',
  execution: {
    recipientEmail: 'kontakt@praxis-am-park.example',
    senderIdentity: 'SignalScout <onboarding@resend.dev>',
    senderMode: 'development',
    senderProvider: 'resend',
    senderDomain: 'resend.dev',
    senderReadiness: 'development_only',
    productionReady: false,
    telemetryMode: 'workspace_only',
    webhookEndpointUrl: null,
    webhookHosting: 'not_configured',
    webhookHostingReady: false,
    webhookHostingWarning:
      'PUBLIC_API_BASE_URL is not configured, so the webhook host is not explicitly tracked.',
    canSend: false,
    blockingReason: 'Approve the draft before sending.',
  },
  delivery: {
    provider: null,
    providerMessageId: null,
    summary: {
      totalEvents: 0,
      latestEventType: null,
      latestEventAt: null,
      deliveredCount: 0,
      openedCount: 0,
      clickedCount: 0,
      bouncedCount: 0,
      complainedCount: 0,
      failedCount: 0,
    },
    recentEvents: [],
  },
};

const replyFixture: Reply = {
  id: 'reply-1',
  leadId: leadFixture.id,
  outreachId: outreachFixture.id,
  channel: 'email',
  source: 'manual',
  providerMessageId: null,
  inReplyToProviderMessageId: null,
  fromEmail: 'patient@example.com',
  subject: 'Interested',
  body: 'Can we talk next week?',
  receivedAt: '2026-04-02T10:10:00.000Z',
  createdAt: '2026-04-02T10:10:00.000Z',
};

describe('LeadDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedFetchLeads.mockResolvedValue([leadFixture]);
    mockedFetchLeadSignals.mockResolvedValue(signalsFixture);
    mockedFetchLatestAudit.mockResolvedValue(null);
    mockedFetchLatestOutreach.mockResolvedValue(null);
    mockedRefreshLeadSnapshot.mockResolvedValue(snapshotFixture);
    mockedGenerateAudit.mockResolvedValue(auditFixture);
    mockedGenerateOutreach.mockResolvedValue(outreachFixture);
    mockedFetchRepliesByLead.mockResolvedValue([]);
    mockedCreateReply.mockResolvedValue(replyFixture);
    mockedReviewOutreach.mockImplementation(async (_outreachId, input) => ({
      ...outreachFixture,
      subject: input.subject ?? outreachFixture.subject,
      body: input.body ?? outreachFixture.body,
      reviewStatus:
        input.action === 'accepted'
          ? 'accepted'
          : input.action === 'edited'
            ? 'edited'
            : 'skipped',
      status: input.action === 'skipped' ? 'closed' : 'approved',
      reviewedAt: '2026-04-02T10:00:00.000Z',
      sendAttemptCount: outreachFixture.sendAttemptCount,
      lastSendAttemptAt: outreachFixture.lastSendAttemptAt,
      lastSendErrorCode: outreachFixture.lastSendErrorCode,
      lastSendError: outreachFixture.lastSendError,
      lastSendRetryable: outreachFixture.lastSendRetryable,
      execution: {
        ...outreachFixture.execution,
        canSend: input.action === 'skipped' ? false : true,
        blockingReason:
          input.action === 'skipped'
            ? 'Approve the draft before sending.'
            : null,
      },
    }));
    mockedSendOutreach.mockResolvedValue({
      ...outreachFixture,
      status: 'sent',
      reviewStatus: 'accepted',
      reviewedAt: '2026-04-02T10:00:00.000Z',
      sentAt: '2026-04-02T10:05:00.000Z',
      sendAttemptCount: 1,
      lastSendAttemptAt: '2026-04-02T10:05:00.000Z',
      lastSendErrorCode: null,
      lastSendError: null,
      lastSendRetryable: false,
      execution: {
        ...outreachFixture.execution,
        canSend: false,
        blockingReason: 'This outreach has already been sent.',
      },
    });
  });

  it('treats missing audit/outreach as normal empty states', async () => {
    render(<LeadDetailPage leadId={leadFixture.id} onNavigate={vi.fn()} />);

    expect(
      await screen.findByText(
        'Generate an audit to turn the current signals into a commercial read.',
      ),
    ).toBeInTheDocument();
    expect(
      await screen.findByText('Generate outreach once the current audit feels credible.'),
    ).toBeInTheDocument();
  });

  it('marks outreach stale after audit regeneration and repopulates the editor after outreach generation', async () => {
    render(<LeadDetailPage leadId={leadFixture.id} onNavigate={vi.fn()} />);

    await screen.findByRole('button', { name: 'Generate audit' });

    fireEvent.click(screen.getByRole('button', { name: 'Generate audit' }));

    expect(
      await screen.findByText('Audit regenerated. Refresh the outreach draft before you send anything.'),
    ).toBeInTheDocument();
    expect(
      await screen.findByText('The previous draft is stale. Regenerate it from the current audit.'),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Generate outreach' }));

    await waitFor(() => {
      expect(
        screen.getByDisplayValue('Quick thought on booking at Praxis am Park'),
      ).toBeInTheDocument();
    });

    expect(screen.getByRole('textbox', { name: 'Body' })).toHaveValue(
      'Hi,\n\nA few booking improvements stand out.\n\nBest,\n[Your Name]',
    );
  });

  it('persists accepted, edited, and skipped outreach review actions', async () => {
    mockedFetchLatestAudit.mockResolvedValue(auditFixture);
    mockedFetchLatestOutreach.mockResolvedValue(outreachFixture);

    render(<LeadDetailPage leadId={leadFixture.id} onNavigate={vi.fn()} />);

    await screen.findByDisplayValue('Quick thought on booking at Praxis am Park');

    fireEvent.click(screen.getByRole('button', { name: 'Accept draft' }));

    expect(await screen.findByText('Draft accepted and saved.')).toBeInTheDocument();
    expect(await screen.findByText('This draft is approved and send-ready.')).toBeInTheDocument();
    expect(await screen.findByText('SignalScout <onboarding@resend.dev>')).toBeInTheDocument();
    expect(await screen.findByText('kontakt@praxis-am-park.example')).toBeInTheDocument();
    expect(await screen.findByText('development only')).toBeInTheDocument();
    expect(await screen.findByText('Operator marked as accepted')).toBeInTheDocument();
    expect(mockedReviewOutreach).toHaveBeenCalledWith('outreach-1', {
      action: 'accepted',
      subject: 'Quick thought on booking at Praxis am Park',
      body: 'Hi,\n\nA few booking improvements stand out.\n\nBest,\n[Your Name]',
    });

    fireEvent.change(screen.getByRole('textbox', { name: 'Subject' }), {
      target: { value: 'Sharper subject' },
    });
    fireEvent.change(screen.getByRole('textbox', { name: 'Body' }), {
      target: { value: 'Edited body copy' },
    });

    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: 'Subject' })).toHaveValue('Sharper subject');
      expect(screen.getByRole('textbox', { name: 'Body' })).toHaveValue('Edited body copy');
    });

    fireEvent.click(screen.getByRole('button', { name: 'Save edits' }));

    expect(await screen.findByText('Edited draft saved.')).toBeInTheDocument();
    expect(mockedReviewOutreach).toHaveBeenCalledWith('outreach-1', {
      action: 'edited',
      subject: 'Sharper subject',
      body: 'Edited body copy',
    });

    fireEvent.click(screen.getByRole('button', { name: 'Skip' }));

    expect(await screen.findByText('Lead skipped and saved.')).toBeInTheDocument();
    expect(mockedReviewOutreach).toHaveBeenCalledWith('outreach-1', {
      action: 'skipped',
      subject: 'Sharper subject',
      body: 'Edited body copy',
    });
  });

  it('sends an approved outreach draft through the real send hook', async () => {
    mockedFetchLatestAudit.mockResolvedValue(auditFixture);
    mockedFetchLatestOutreach.mockResolvedValue({
      ...outreachFixture,
      status: 'approved',
      reviewStatus: 'accepted',
      reviewedAt: '2026-04-02T10:00:00.000Z',
      execution: {
        ...outreachFixture.execution,
        canSend: true,
        blockingReason: null,
      },
    });

    render(<LeadDetailPage leadId={leadFixture.id} onNavigate={vi.fn()} />);

    await screen.findByText('This draft is approved and send-ready.');

    fireEvent.click(screen.getByRole('button', { name: 'Send now' }));

    expect(await screen.findByText('Outreach sent and logged.')).toBeInTheDocument();
    expect(await screen.findByText('This outreach was sent successfully and is now in execution state.')).toBeInTheDocument();
    expect(await screen.findAllByText('This outreach has already been sent.')).toHaveLength(2);
    expect(mockedSendOutreach).toHaveBeenCalledWith('outreach-1');
  });

  it('surfaces persisted retry details after a failed send attempt', async () => {
    mockedFetchLatestAudit.mockResolvedValue(auditFixture);
    mockedFetchLatestOutreach
      .mockResolvedValueOnce({
        ...outreachFixture,
        status: 'approved',
        reviewStatus: 'accepted',
        reviewedAt: '2026-04-02T10:00:00.000Z',
        execution: {
          ...outreachFixture.execution,
          canSend: true,
          blockingReason: null,
        },
      })
      .mockResolvedValueOnce({
        ...outreachFixture,
        status: 'approved',
        reviewStatus: 'accepted',
        reviewedAt: '2026-04-02T10:00:00.000Z',
        sendAttemptCount: 1,
        lastSendAttemptAt: '2026-04-02T10:06:00.000Z',
        lastSendErrorCode: 'provider_failed',
        lastSendError: 'Resend send failed with status 503',
        lastSendRetryable: true,
        execution: {
          ...outreachFixture.execution,
          canSend: true,
          blockingReason: null,
        },
      });
    mockedSendOutreach.mockRejectedValueOnce(new Error('Resend send failed with status 503'));

    render(<LeadDetailPage leadId={leadFixture.id} onNavigate={vi.fn()} />);

    await screen.findByText('This draft is approved and send-ready.');

    fireEvent.click(screen.getByRole('button', { name: 'Send now' }));

    expect(await screen.findAllByText('Resend send failed with status 503')).toHaveLength(2);
    expect(await screen.findByText(/provider_failed/)).toBeInTheDocument();
    expect(
      await screen.findByText(
        'A previous send attempt failed. Confirm the sender and recipient details, then retry when the route looks safe.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Retry send' })).toBeInTheDocument();
  });

  it('shows verified sender readiness when production-safe sender config is present', async () => {
    mockedFetchLatestAudit.mockResolvedValue(auditFixture);
    mockedFetchLatestOutreach.mockResolvedValue({
      ...outreachFixture,
      status: 'approved',
      reviewStatus: 'accepted',
      reviewedAt: '2026-04-02T10:00:00.000Z',
      execution: {
        recipientEmail: 'kontakt@praxis-am-park.example',
        senderIdentity: 'SignalScout <ops@signalscout.example>',
        senderMode: 'configured',
        senderProvider: 'resend',
        senderDomain: 'signalscout.example',
        senderReadiness: 'production_ready',
        productionReady: true,
        telemetryMode: 'webhook_backed',
        webhookEndpointUrl:
          'https://api.signalscout.example/api/webhooks/resend/outreach-events',
        webhookHosting: 'stable_public',
        webhookHostingReady: true,
        webhookHostingWarning: null,
        canSend: true,
        blockingReason: null,
      },
    });

    render(<LeadDetailPage leadId={leadFixture.id} onNavigate={vi.fn()} />);

    expect(await screen.findByText('production ready')).toBeInTheDocument();
    expect(screen.getByText('SignalScout <ops@signalscout.example>')).toBeInTheDocument();
  });

  it('records and displays a tracked reply for the lead', async () => {
    mockedFetchLatestAudit.mockResolvedValue(auditFixture);
    mockedFetchLatestOutreach
      .mockResolvedValueOnce({
        ...outreachFixture,
        status: 'sent',
        reviewStatus: 'accepted',
        sentAt: '2026-04-02T10:05:00.000Z',
      })
      .mockResolvedValueOnce({
        ...outreachFixture,
        status: 'replied',
        reviewStatus: 'accepted',
        sentAt: '2026-04-02T10:05:00.000Z',
      });
    mockedFetchRepliesByLead
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([replyFixture]);

    render(<LeadDetailPage leadId={leadFixture.id} onNavigate={vi.fn()} />);

    await screen.findByText('No reply has been tracked for this lead yet.');

    fireEvent.click(screen.getByRole('button', { name: 'Record reply' }));

    expect(await screen.findByText('Reply recorded and linked to this outreach.')).toBeInTheDocument();
    expect(await screen.findByText('patient@example.com')).toBeInTheDocument();
    expect(await screen.findByText('Interested')).toBeInTheDocument();
    expect(await screen.findByText('Can we talk next week?')).toBeInTheDocument();
    expect(mockedCreateReply).toHaveBeenCalledWith('outreach-1', {
      fromEmail: 'kontakt@praxis-am-park.example',
      subject: 'Quick thought on booking at Praxis am Park',
      body: 'Manual reply tracked by operator.',
      source: 'manual',
    });
  });
});
