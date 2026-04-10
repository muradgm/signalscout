import type { Lead, SignalSet } from '../types';
import { LeadStatusBadge } from './LeadStatusBadge';

type LeadRowInsight = {
  recommendation: string;
  confidence: string;
  reason: string;
};

type LeadTableProps = {
  leads: Lead[];
  insightsByLeadId: Record<string, LeadRowInsight | undefined>;
  selectedLeadId?: string | null;
  onOpenLead: (leadId: string) => void;
};

const formatCompleteness = (value: string): string => value.replace(/_/g, ' ');

export const getLeadInsightFromSignals = (signals: SignalSet): LeadRowInsight => ({
  recommendation:
    signals.outreachFit === 'good'
      ? 'Send'
      : signals.outreachFit === 'uncertain'
        ? 'Review'
        : 'Do not send',
  confidence: signals.confidence,
  reason: signals.fitReason,
});

export function LeadTable({
  leads,
  insightsByLeadId,
  selectedLeadId,
  onOpenLead,
}: LeadTableProps) {
  if (leads.length === 0) {
    return (
      <div className="empty-card">
        <h3>No leads found</h3>
        <p>Try a broader search or refresh the lead source.</p>
      </div>
    );
  }

  return (
    <div className="lead-table">
      {leads.map((lead) => {
        const insight = insightsByLeadId[lead.id];
        const isActive = selectedLeadId === lead.id;

        return (
          <button
            key={lead.id}
            type="button"
            className={`lead-row${isActive ? ' is-active' : ''}`}
            onClick={() => onOpenLead(lead.id)}
          >
            <div className="lead-row__top">
              <div>
                <strong className="lead-row__title">{lead.companyName}</strong>
                <p className="lead-row__meta">
                  {lead.location ?? 'Unknown location'} | {lead.niche}
                </p>
              </div>
              <LeadStatusBadge
                label={insight?.recommendation ?? formatCompleteness(lead.status)}
                compact
              />
            </div>

            <div className="lead-row__details">
              <div>
                <span className="metric-label">Confidence</span>
                <strong>{insight?.confidence?.replace(/_/g, ' ') ?? 'Pending'}</strong>
              </div>
              <div>
                <span className="metric-label">Status</span>
                <strong>{formatCompleteness(lead.completeness)}</strong>
              </div>
            </div>

            <p className="lead-row__reason">
              {insight?.reason ??
                'Open this lead to fetch signals and turn the current record into a decision.'}
            </p>
          </button>
        );
      })}
    </div>
  );
}
