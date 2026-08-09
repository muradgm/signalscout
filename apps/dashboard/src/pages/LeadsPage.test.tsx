import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LeadsPage } from './LeadsPage';
import type { Lead, LeadSignalsResult } from '../features/leads/types';
import type { Outreach } from '../features/outreach/types';

vi.mock('../features/leads/api', () => ({
  fetchLeads: vi.fn(),
  fetchLeadSignals: vi.fn(),
  refreshLeadSnapshot: vi.fn(),
}));

vi.mock('../features/outreach/api', () => ({
  fetchLatestOutreach: vi.fn(),
}));

vi.mock('../features/replies/api', () => ({
  fetchRecentReplies: vi.fn(),
}));

vi.mock('../features/feedback/api', () => ({
  fetchOutreachLearningSummary: vi.fn(),
}));

import { fetchLeads, fetchLeadSignals } from '../features/leads/api';
import { fetchLatestOutreach } from '../features/outreach/api';
import { fetchRecentReplies } from '../features/replies/api';
import { fetchOutreachLearningSummary } from '../features/feedback/api';

const mockedFetchLeads = vi.mocked(fetchLeads);
const mockedFetchLeadSignals = vi.mocked(fetchLeadSignals);
const mockedFetchLatestOutreach = vi.mocked(fetchLatestOutreach);
const mockedFetchRecentReplies = vi.mocked(fetchRecentReplies);
const mockedFetchOutreachLearningSummary = vi.mocked(fetchOutreachLearningSummary);

const leadFixtures: Lead[] = [
  {
    id: 'lead-good',
    companyName: 'Praxis am Park',
    website: 'https://praxis-am-park.example',
    niche: 'dentist',
    location: 'Berlin',
    status: 'new',
    completeness: 'legacy_incomplete',
    createdAt: '2026-04-01T10:00:00.000Z',
    updatedAt: '2026-04-01T12:00:00.000Z',
  },
  {
    id: 'lead-review',
    companyName: 'Mitte Dental',
    website: 'https://mitte-dental.example',
    niche: 'dentist',
    location: 'Hamburg',
    status: 'new',
    completeness: 'legacy_incomplete',
    createdAt: '2026-04-01T10:00:00.000Z',
    updatedAt: '2026-04-01T12:00:00.000Z',
  },
];

const signalResult = (lead: Lead, overrides: Partial<LeadSignalsResult['signals']>): LeadSignalsResult => ({
  lead,
  snapshotId: `snapshot-${lead.id}`,
  signals: {
    bookingPresence: 'direct',
    contactClarity: 'high',
    trustSignalStrength: 'high',
    businessScale: 'single_location',
    localRelevance: 'high_match',
    outreachFit: 'good',
    fitReason: 'Strong local fit with a clear booking path.',
    confidence: 'high',
    leadCompleteness: lead.completeness,
    issuesDetected: [],
    evidence: [],
    ...overrides,
  },
});

const outreachResult = (
  leadId: string,
  overrides: Partial<Outreach>,
): Outreach => ({
  id: `outreach-${leadId}`,
  leadId,
  auditId: `audit-${leadId}`,
  channel: 'email',
  recommendation: 'send',
  status: 'drafted',
  reviewStatus: 'not_reviewed',
  fitReason: 'Strong local lead',
  bestAngle: 'Trust-to-booking',
  generatedSubject: 'Quick thought',
  generatedBody: 'Body',
  subject: 'Quick thought',
  body: 'Body',
  reasoning: 'Reasoning',
  evidence: [],
  reviewedAt: null,
  sentAt: null,
  sendAttemptCount: 0,
  lastSendAttemptAt: null,
  lastSendErrorCode: null,
  lastSendError: null,
  lastSendRetryable: false,
  deliveryProvider: null,
  providerMessageId: null,
  createdAt: '2026-04-02T10:00:00.000Z',
  execution: {
    recipientEmail: 'kontakt@example.com',
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
  ...overrides,
});

describe('LeadsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedFetchLatestOutreach.mockResolvedValue(null);
    mockedFetchRecentReplies.mockResolvedValue([]);
    mockedFetchOutreachLearningSummary.mockResolvedValue({
      windowSize: 60,
      totalReviewed: 0,
      acceptedRate: 0,
      editedRate: 0,
      skippedRate: 0,
      subjectEditedRate: 0,
      bodyEditedRate: 0,
      multilingualShare: 0,
      specialtyShare: 0,
      topAngles: [],
      topEditedAngles: [],
      topNiches: [],
      topEditedNiches: [],
      reviewSegments: {
        nonBerlin: { total: 0, acceptedRate: 0, editedRate: 0, skippedRate: 0 },
        weakSurface: { total: 0, acceptedRate: 0, editedRate: 0, skippedRate: 0 },
        specialty: { total: 0, acceptedRate: 0, editedRate: 0, skippedRate: 0 },
        multilingual: { total: 0, acceptedRate: 0, editedRate: 0, skippedRate: 0 },
      },
    });
  });

  it('renders queue recommendations and opens a lead', async () => {
    mockedFetchLeads.mockResolvedValue(leadFixtures);
    mockedFetchLeadSignals
      .mockResolvedValueOnce(signalResult(leadFixtures[0], {}))
      .mockResolvedValueOnce(
        signalResult(leadFixtures[1], {
          outreachFit: 'uncertain',
          confidence: 'medium',
          fitReason: 'Useful lead, but the current fit is less decisive.',
        }),
      );

    const onNavigate = vi.fn();

    render(<LeadsPage onNavigate={onNavigate} />);

    expect((await screen.findAllByText('Praxis am Park')).length).toBeGreaterThan(0);
    expect((await screen.findAllByText('Mitte Dental')).length).toBeGreaterThan(0);
    expect(await screen.findByText('Send')).toBeInTheDocument();
    expect((await screen.findAllByText('Review')).length).toBeGreaterThan(0);
    expect(
      await screen.findByText('Strong local fit with a clear booking path.'),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Praxis am Park/i }));

    expect(onNavigate).toHaveBeenCalledWith('/leads/lead-good');
  });

  it('shows a needs-attention lane for non-Berlin and weaker-contact leads', async () => {
    mockedFetchLeads.mockResolvedValue(leadFixtures);
    mockedFetchLeadSignals
      .mockResolvedValueOnce(signalResult(leadFixtures[0], {}))
      .mockResolvedValueOnce(
        signalResult(leadFixtures[1], {
          bookingPresence: 'indirect',
          contactClarity: 'medium',
          trustSignalStrength: 'medium',
          outreachFit: 'uncertain',
          confidence: 'medium',
          fitReason: 'Useful non-Berlin lead, but the contact and booking surface are still soft.',
        }),
      );
    mockedFetchLatestOutreach
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(
        outreachResult('lead-review', {
          status: 'drafted',
          reviewStatus: 'not_reviewed',
        }),
      );

    render(<LeadsPage onNavigate={vi.fn()} />);

    expect(await screen.findByRole('heading', { name: 'Needs attention' })).toBeInTheDocument();
    expect(screen.getAllByText('Non-Berlin').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Weak-contact').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Unreviewed').length).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/Useful non-Berlin lead, but the contact and booking surface are still soft./i)
        .length,
    ).toBeGreaterThan(0);
  });

  it('shows broader queue reporting beyond the current lead detail workspace', async () => {
    mockedFetchLeads.mockResolvedValue(leadFixtures);
    mockedFetchLeadSignals
      .mockResolvedValueOnce(signalResult(leadFixtures[0], {}))
      .mockResolvedValueOnce(signalResult(leadFixtures[1], { outreachFit: 'uncertain' }));
    mockedFetchLatestOutreach
      .mockResolvedValueOnce(
        outreachResult('lead-good', {
          status: 'sent',
          reviewStatus: 'accepted',
          sentAt: '2026-04-02T10:10:00.000Z',
          sendAttemptCount: 1,
          lastSendAttemptAt: '2026-04-02T10:10:00.000Z',
          execution: {
            recipientEmail: 'kontakt@example.com',
            senderIdentity: 'SignalScout <ops@dev.signalscout.de>',
            senderMode: 'configured',
            senderProvider: 'resend',
            senderDomain: 'dev.signalscout.de',
            senderReadiness: 'production_ready',
            productionReady: true,
            telemetryMode: 'webhook_backed',
            webhookEndpointUrl:
              'https://api.signalscout.example/api/webhooks/resend/outreach-events',
            webhookHosting: 'stable_public',
            webhookHostingReady: true,
            webhookHostingWarning: null,
            canSend: false,
            blockingReason: 'This outreach has already been sent.',
          },
          delivery: {
            provider: 'resend',
            providerMessageId: 'msg-1',
            summary: {
              totalEvents: 2,
              latestEventType: 'delivered',
              latestEventAt: '2026-04-02T10:11:00.000Z',
              deliveredCount: 1,
              openedCount: 0,
              clickedCount: 0,
              bouncedCount: 0,
              complainedCount: 0,
              failedCount: 0,
            },
            recentEvents: [],
          },
        }),
      )
      .mockResolvedValueOnce(
        outreachResult('lead-review', {
          status: 'approved',
          reviewStatus: 'accepted',
          sendAttemptCount: 1,
          lastSendAttemptAt: '2026-04-02T10:12:00.000Z',
          lastSendErrorCode: 'provider_failed',
          lastSendError: 'Resend temporarily unavailable',
          lastSendRetryable: true,
          execution: {
            recipientEmail: 'kontakt@example.com',
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
            canSend: true,
            blockingReason: null,
          },
        }),
      );

    render(<LeadsPage onNavigate={vi.fn()} />);

    expect(await screen.findByRole('heading', { name: 'Current queue state' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Operator and delivery patterns' })).toBeInTheDocument();
    expect(screen.getByText('Leads in view')).toBeInTheDocument();
    expect(screen.getByText('Retryable')).toBeInTheDocument();
    expect(screen.getAllByText('Sent').length).toBeGreaterThan(0);
    expect(screen.getByText('Send-ready')).toBeInTheDocument();
    expect(screen.getByText('Unreviewed')).toBeInTheDocument();
    expect(screen.getByText('Reviewed rate')).toBeInTheDocument();
    expect(screen.getByText('Accepted rate')).toBeInTheDocument();
    expect(screen.getByText('Edited rate')).toBeInTheDocument();
    expect(screen.getByText('Delivery issue rate')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Live send visibility' })).toBeInTheDocument();
    expect(screen.getByText('Webhook-backed')).toBeInTheDocument();
    expect(screen.getByText('Delivered')).toBeInTheDocument();
  });

  it('shows accepted-vs-edited learning patterns beyond raw metadata', async () => {
    mockedFetchLeads.mockResolvedValue(leadFixtures);
    mockedFetchLeadSignals
      .mockResolvedValueOnce(signalResult(leadFixtures[0], {}))
      .mockResolvedValueOnce(signalResult(leadFixtures[1], { outreachFit: 'uncertain' }));
    mockedFetchOutreachLearningSummary.mockResolvedValue({
      windowSize: 40,
      totalReviewed: 12,
      acceptedRate: 0.5,
      editedRate: 0.33,
      skippedRate: 0.17,
      subjectEditedRate: 0.25,
      bodyEditedRate: 0.42,
      multilingualShare: 0.33,
      specialtyShare: 0.25,
      topAngles: [{ label: 'Trust-to-booking', count: 5 }],
      topEditedAngles: [{ label: 'Specialty credibility', count: 3 }],
      topNiches: [{ label: 'dentist', count: 12 }],
      topEditedNiches: [{ label: 'dentist', count: 4 }],
      reviewSegments: {
        nonBerlin: { total: 5, acceptedRate: 0.4, editedRate: 0.4, skippedRate: 0.2 },
        weakSurface: { total: 4, acceptedRate: 0.25, editedRate: 0.5, skippedRate: 0.25 },
        specialty: { total: 3, acceptedRate: 0.67, editedRate: 0.33, skippedRate: 0 },
        multilingual: { total: 4, acceptedRate: 0.5, editedRate: 0.25, skippedRate: 0.25 },
      },
    });

    render(<LeadsPage onNavigate={vi.fn()} />);

    expect(await screen.findByRole('heading', { name: 'Accepted vs edited patterns' })).toBeInTheDocument();
    expect(screen.getByText('Accepted')).toBeInTheDocument();
    expect(screen.getByText('Edited')).toBeInTheDocument();
    expect(screen.getByText('Multilingual')).toBeInTheDocument();
    expect(screen.getByText('Specialty')).toBeInTheDocument();
    expect(screen.getByText(/Trust-to-booking \(5\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Specialty credibility \(3\)/i)).toBeInTheDocument();
    expect(screen.getByText('Non-Berlin reviewed')).toBeInTheDocument();
    expect(screen.getByText('Weak-surface reviewed')).toBeInTheDocument();
  });

  it('shows a recent reply queue beyond the lead detail page', async () => {
    mockedFetchLeads.mockResolvedValue(leadFixtures);
    mockedFetchLeadSignals
      .mockResolvedValueOnce(signalResult(leadFixtures[0], {}))
      .mockResolvedValueOnce(signalResult(leadFixtures[1], { outreachFit: 'uncertain' }));
    mockedFetchRecentReplies.mockResolvedValue([
      {
        id: 'reply-1',
        leadId: 'lead-review',
        outreachId: 'outreach-lead-review',
        channel: 'email',
        source: 'provider_webhook',
        providerMessageId: 'incoming-msg-1',
        inReplyToProviderMessageId: 'resend-msg-1',
        fromEmail: 'kontakt@mitte-dental.example',
        subject: 'Interested',
        body: 'We can talk next week.',
        receivedAt: '2026-04-02T10:20:00.000Z',
        createdAt: '2026-04-02T10:20:00.000Z',
      },
    ]);

    const onNavigate = vi.fn();
    render(<LeadsPage onNavigate={onNavigate} />);

    expect(await screen.findByRole('heading', { name: 'Recent inbound responses' })).toBeInTheDocument();
    expect(screen.getByText('Interested')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Open replied lead Mitte Dental/i }));

    expect(onNavigate).toHaveBeenCalledWith('/leads/lead-review');
  });

  it('filters the queue by search term', async () => {
    mockedFetchLeads.mockResolvedValue(leadFixtures);
    mockedFetchLeadSignals
      .mockResolvedValueOnce(signalResult(leadFixtures[0], {}))
      .mockResolvedValueOnce(signalResult(leadFixtures[1], { outreachFit: 'uncertain' }));

    render(<LeadsPage onNavigate={vi.fn()} />);

    await screen.findAllByText('Praxis am Park');

    fireEvent.change(screen.getByPlaceholderText('Company, site, location'), {
      target: { value: 'mitte' },
    });

    await waitFor(() => {
      expect(screen.queryByText('Praxis am Park')).not.toBeInTheDocument();
      expect(screen.getAllByText('Mitte Dental').length).toBeGreaterThan(0);
    });
  });

  it('filters the queue by review scope', async () => {
    mockedFetchLeads.mockResolvedValue(leadFixtures);
    mockedFetchLeadSignals
      .mockResolvedValueOnce(signalResult(leadFixtures[0], {}))
      .mockResolvedValueOnce(
        signalResult(leadFixtures[1], {
          bookingPresence: 'indirect',
          contactClarity: 'medium',
          trustSignalStrength: 'medium',
          outreachFit: 'uncertain',
          confidence: 'medium',
        }),
      );

    render(<LeadsPage onNavigate={vi.fn()} />);

    await screen.findAllByText('Praxis am Park');

    fireEvent.click(screen.getByRole('button', { name: /Weak-contact/i }));

    await waitFor(() => {
      expect(screen.queryByText('Praxis am Park')).not.toBeInTheDocument();
      expect(screen.getAllByText('Mitte Dental').length).toBeGreaterThan(0);
    });
  });

  it('keeps the primary queue usable when auxiliary reporting fails', async () => {
    mockedFetchLeads.mockResolvedValue(leadFixtures);
    mockedFetchLeadSignals
      .mockResolvedValueOnce(signalResult(leadFixtures[0], {}))
      .mockResolvedValueOnce(signalResult(leadFixtures[1], { outreachFit: 'uncertain' }));
    mockedFetchRecentReplies.mockRejectedValue(new Error('Replies unavailable'));
    mockedFetchOutreachLearningSummary.mockRejectedValue(new Error('Learning unavailable'));

    render(<LeadsPage onNavigate={vi.fn()} />);

    expect((await screen.findAllByText('Praxis am Park')).length).toBeGreaterThan(0);
    expect(screen.queryByText('Queue failed to load')).not.toBeInTheDocument();
  });
});
