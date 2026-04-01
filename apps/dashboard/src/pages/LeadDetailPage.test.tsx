import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LeadDetailPage } from './LeadDetailPage';
import type { Audit } from '../features/audits/types';
import type { Lead, LeadSignalsResult, Snapshot } from '../features/leads/types';
import type { Outreach } from '../features/outreach/types';

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
}));

import { fetchLeads, fetchLeadSignals, refreshLeadSnapshot } from '../features/leads/api';
import { fetchLatestAudit, generateAudit } from '../features/audits/api';
import { fetchLatestOutreach, generateOutreach } from '../features/outreach/api';

const mockedFetchLeads = vi.mocked(fetchLeads);
const mockedFetchLeadSignals = vi.mocked(fetchLeadSignals);
const mockedRefreshLeadSnapshot = vi.mocked(refreshLeadSnapshot);
const mockedFetchLatestAudit = vi.mocked(fetchLatestAudit);
const mockedGenerateAudit = vi.mocked(generateAudit);
const mockedFetchLatestOutreach = vi.mocked(fetchLatestOutreach);
const mockedGenerateOutreach = vi.mocked(generateOutreach);

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
  status: 'draft',
  fitReason: 'Strong local lead',
  bestAngle: 'Trust is present but booking friction remains',
  subject: 'Quick thought on booking at Praxis am Park',
  body: 'Hi,\n\nA few booking improvements stand out.\n\nBest,\n[Your Name]',
  reasoning: 'Use trust-to-booking angle',
  evidence: ['trust already present'],
  createdAt: '2026-04-02T09:08:00.000Z',
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
});
