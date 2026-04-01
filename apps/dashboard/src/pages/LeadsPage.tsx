import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { PageShell } from '../app/layout/PageShell';
import { fetchLeads, fetchLeadSignals } from '../features/leads/api';
import { LeadFilters } from '../features/leads/components/LeadFilters';
import { LeadTable, getLeadInsightFromSignals } from '../features/leads/components/LeadTable';
import type { Lead, SignalSet } from '../features/leads/types';

type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

type LeadsPageProps = {
  onNavigate: (path: string) => void;
};

export function LeadsPage({ onNavigate }: LeadsPageProps) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [status, setStatus] = useState<AsyncStatus>('loading');
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [signalsByLeadId, setSignalsByLeadId] = useState<Record<string, SignalSet>>({});

  useEffect(() => {
    const loadLeads = async (): Promise<void> => {
      setStatus('loading');
      setError(null);

      try {
        const data = await fetchLeads();
        setLeads(data);
        setStatus('success');

        const settled = await Promise.allSettled(
          data.map(async (lead) => ({
            leadId: lead.id,
            signals: (await fetchLeadSignals(lead.id)).signals,
          })),
        );

        const nextSignalsByLeadId: Record<string, SignalSet> = {};

        for (const item of settled) {
          if (item.status === 'fulfilled') {
            nextSignalsByLeadId[item.value.leadId] = item.value.signals;
          }
        }

        setSignalsByLeadId(nextSignalsByLeadId);
      } catch (loadError) {
        setStatus('error');
        setError(loadError instanceof Error ? loadError.message : 'Failed to load leads');
      }
    };

    void loadLeads();
  }, []);

  const deferredSearchTerm = useDeferredValue(searchTerm);

  const filteredLeads = useMemo(() => {
    const query = deferredSearchTerm.trim().toLowerCase();

    if (!query) {
      return leads;
    }

    return leads.filter((lead) =>
      [lead.companyName, lead.website, lead.location, lead.niche]
        .filter((value): value is string => Boolean(value))
        .some((value) => value.toLowerCase().includes(query)),
    );
  }, [deferredSearchTerm, leads]);

  const insightsByLeadId = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(signalsByLeadId).map(([leadId, signals]) => [
          leadId,
          getLeadInsightFromSignals(signals),
        ]),
      ),
    [signalsByLeadId],
  );

  return (
    <PageShell
      title="Lead queue"
      description="Work through the queue, spot the strongest opportunities quickly, and open the next lead worth acting on."
      meta={`${filteredLeads.length} lead${filteredLeads.length === 1 ? '' : 's'} in view`}
    >
      <LeadFilters searchTerm={searchTerm} onSearchTermChange={setSearchTerm} />

      {status === 'loading' ? (
        <div className="empty-card">
          <h3>Loading queue</h3>
          <p>Pulling the current leads and their latest fit reads.</p>
        </div>
      ) : null}

      {status === 'error' ? (
        <div className="empty-card is-error">
          <h3>Queue failed to load</h3>
          <p>{error}</p>
        </div>
      ) : null}

      {status === 'success' ? (
        <LeadTable
          leads={filteredLeads}
          insightsByLeadId={insightsByLeadId}
          onOpenLead={(leadId) => onNavigate(`/leads/${leadId}`)}
        />
      ) : null}
    </PageShell>
  );
}
