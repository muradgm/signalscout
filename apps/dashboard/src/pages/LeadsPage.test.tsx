import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LeadsPage } from './LeadsPage';
import type { Lead, LeadSignalsResult } from '../features/leads/types';

vi.mock('../features/leads/api', () => ({
  fetchLeads: vi.fn(),
  fetchLeadSignals: vi.fn(),
  refreshLeadSnapshot: vi.fn(),
}));

import { fetchLeads, fetchLeadSignals } from '../features/leads/api';

const mockedFetchLeads = vi.mocked(fetchLeads);
const mockedFetchLeadSignals = vi.mocked(fetchLeadSignals);

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
    location: 'Berlin',
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

describe('LeadsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

    expect(await screen.findByText('Praxis am Park')).toBeInTheDocument();
    expect(await screen.findByText('Mitte Dental')).toBeInTheDocument();
    expect(await screen.findByText('Send')).toBeInTheDocument();
    expect(await screen.findByText('Review')).toBeInTheDocument();
    expect(
      await screen.findByText('Strong local fit with a clear booking path.'),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Praxis am Park/i }));

    expect(onNavigate).toHaveBeenCalledWith('/leads/lead-good');
  });

  it('filters the queue by search term', async () => {
    mockedFetchLeads.mockResolvedValue(leadFixtures);
    mockedFetchLeadSignals
      .mockResolvedValueOnce(signalResult(leadFixtures[0], {}))
      .mockResolvedValueOnce(signalResult(leadFixtures[1], { outreachFit: 'uncertain' }));

    render(<LeadsPage onNavigate={vi.fn()} />);

    await screen.findByText('Praxis am Park');

    fireEvent.change(screen.getByPlaceholderText('Company, site, location'), {
      target: { value: 'mitte' },
    });

    await waitFor(() => {
      expect(screen.queryByText('Praxis am Park')).not.toBeInTheDocument();
      expect(screen.getByText('Mitte Dental')).toBeInTheDocument();
    });
  });
});
