import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from 'react';
import { PageShell } from '../app/layout/PageShell';
import { fetchLatestAudit, generateAudit } from '../features/audits/api';
import { AuditEvidenceList } from '../features/audits/components/AuditEvidenceList';
import { AuditScoreCard } from '../features/audits/components/AuditScoreCard';
import { AuditSummaryCard } from '../features/audits/components/AuditSummaryCard';
import type { Audit } from '../features/audits/types';
import { fetchLeads, fetchLeadSignals, refreshLeadSnapshot } from '../features/leads/api';
import { LeadStatusBadge } from '../features/leads/components/LeadStatusBadge';
import type { Lead, LeadSignalsResult, Snapshot } from '../features/leads/types';
import { fetchLatestOutreach, generateOutreach } from '../features/outreach/api';
import { OutreachComposer } from '../features/outreach/components/OutreachComposer';
import { OutreachPreview } from '../features/outreach/components/OutreachPreview';
import type { Outreach } from '../features/outreach/types';

type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

type PanelState<T> = {
  data: T | null;
  status: AsyncStatus;
  error: string | null;
};

const createPanelState = <T,>(): PanelState<T> => ({
  data: null,
  status: 'idle',
  error: null,
});

const formatDate = (value: string | null | undefined): string => {
  if (!value) {
    return 'Not available';
  }

  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
};

const loadPanel = async <T,>(
  loader: () => Promise<T>,
  setState: Dispatch<SetStateAction<PanelState<T>>>,
): Promise<T | null> => {
  setState((current) => ({
    ...current,
    status: 'loading',
    error: null,
  }));

  try {
    const data = await loader();
    setState({
      data,
      status: 'success',
      error: null,
    });
    return data;
  } catch (error) {
    setState({
      data: null,
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown request failure',
    });
    return null;
  }
};

const loadOptionalPanel = async <T,>(
  loader: () => Promise<T | null>,
  setState: Dispatch<SetStateAction<PanelState<T | null>>>,
): Promise<T | null> => {
  setState((current) => ({
    ...current,
    status: 'loading',
    error: null,
  }));

  try {
    const data = await loader();
    setState({
      data,
      status: 'success',
      error: null,
    });
    return data;
  } catch (error) {
    setState({
      data: null,
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown request failure',
    });
    return null;
  }
};

type LeadDetailPageProps = {
  leadId: string;
  onNavigate: (path: string) => void;
};

export function LeadDetailPage({ leadId, onNavigate }: LeadDetailPageProps) {
  const [lead, setLead] = useState<Lead | null>(null);
  const [leadStatus, setLeadStatus] = useState<AsyncStatus>('loading');
  const [leadError, setLeadError] = useState<string | null>(null);

  const [snapshotPanel, setSnapshotPanel] = useState<PanelState<Snapshot>>(createPanelState);
  const [signalsPanel, setSignalsPanel] = useState<PanelState<LeadSignalsResult>>(createPanelState);
  const [auditPanel, setAuditPanel] = useState<PanelState<Audit | null>>(createPanelState);
  const [outreachPanel, setOutreachPanel] = useState<PanelState<Outreach | null>>(createPanelState);

  const [isAuditStale, setIsAuditStale] = useState(false);
  const [isOutreachStale, setIsOutreachStale] = useState(false);
  const [composerSubject, setComposerSubject] = useState('');
  const [composerBody, setComposerBody] = useState('');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadLead = async (): Promise<void> => {
      setLeadStatus('loading');
      setLeadError(null);

      try {
        const leads = await fetchLeads();
        const currentLead = leads.find((item) => item.id === leadId) ?? null;

        if (!currentLead) {
          throw new Error('Lead not found');
        }

        setLead(currentLead);
        setLeadStatus('success');
      } catch (error) {
        setLead(null);
        setLeadStatus('error');
        setLeadError(error instanceof Error ? error.message : 'Failed to load lead');
      }
    };

    void loadLead();
    void loadPanel(() => fetchLeadSignals(leadId), setSignalsPanel);
    void loadOptionalPanel(() => fetchLatestAudit(leadId), setAuditPanel);
    void loadOptionalPanel(() => fetchLatestOutreach(leadId), setOutreachPanel);
    setSnapshotPanel(createPanelState());
    setIsAuditStale(false);
    setIsOutreachStale(false);
    setActionMessage(null);
  }, [leadId]);

  useEffect(() => {
    if (!outreachPanel.data) {
      setComposerSubject('');
      setComposerBody('');
      return;
    }

    setComposerSubject(outreachPanel.data.subject ?? '');
    setComposerBody(outreachPanel.data.body ?? '');
  }, [outreachPanel.data]);

  const decisionSummary = useMemo(() => {
    const signals = signalsPanel.data?.signals;
    const audit = auditPanel.data;
    const outreach = outreachPanel.data;

    return {
      recommendation:
        outreach?.recommendation ??
        (signals?.outreachFit === 'good'
          ? 'send'
          : signals?.outreachFit === 'uncertain'
            ? 'review'
            : signals?.outreachFit ?? 'pending'),
      confidence: signals?.confidence ?? 'pending',
      fitReason: signals?.fitReason ?? 'Load signals to see the current lead rationale.',
      strongestOpportunity:
        audit?.opportunities[0] ??
        'Generate an audit to surface the strongest commercial opportunity.',
    };
  }, [auditPanel.data, outreachPanel.data, signalsPanel.data]);

  const handleRefreshSnapshot = async (): Promise<void> => {
    setActionMessage(null);
    const snapshot = await loadPanel(() => refreshLeadSnapshot(leadId), setSnapshotPanel);

    if (!snapshot) {
      return;
    }

    await loadPanel(() => fetchLeadSignals(leadId), setSignalsPanel);
    setAuditPanel(createPanelState());
    setOutreachPanel(createPanelState());
    setIsAuditStale(true);
    setIsOutreachStale(true);
    setComposerSubject('');
    setComposerBody('');
    setActionMessage('Snapshot refreshed. Regenerate the audit and outreach before acting.');
  };

  const handleGenerateAudit = async (): Promise<void> => {
    setActionMessage(null);
    const audit = await loadOptionalPanel(() => generateAudit(leadId), setAuditPanel);

    if (!audit) {
      return;
    }

    setOutreachPanel(createPanelState());
    setIsAuditStale(false);
    setIsOutreachStale(true);
    setComposerSubject('');
    setComposerBody('');
    setActionMessage('Audit regenerated. Refresh the outreach draft before you send anything.');
  };

  const handleGenerateOutreach = async (): Promise<void> => {
    setActionMessage(null);
    const outreach = await loadOptionalPanel(() => generateOutreach(leadId), setOutreachPanel);

    if (!outreach) {
      return;
    }

    setIsOutreachStale(false);
    setActionMessage('Outreach draft refreshed from the current audit.');
  };

  const handleCopy = async (): Promise<void> => {
    const payload = [composerSubject ? `Subject: ${composerSubject}` : '', composerBody]
      .filter(Boolean)
      .join('\n\n');

    if (!payload) {
      setActionMessage('There is no outreach draft to copy yet.');
      return;
    }

    try {
      await navigator.clipboard.writeText(payload);
      setActionMessage('Draft copied to clipboard.');
    } catch {
      setActionMessage('Clipboard copy failed in this browser context.');
    }
  };

  const handleSkip = (): void => {
    setActionMessage('Lead skipped for now. No backend status change was sent.');
  };

  const handleSendLater = (): void => {
    setActionMessage('Draft held for later follow-up. Send is still mocked.');
  };

  if (leadStatus === 'loading') {
    return (
      <PageShell
        title="Lead detail"
        description="Loading the selected lead and the latest decision context."
      >
        <div className="empty-card">
          <h3>Loading lead</h3>
          <p>Pulling the current record, signals, audit, and outreach draft.</p>
        </div>
      </PageShell>
    );
  }

  if (leadStatus === 'error' || !lead) {
    return (
      <PageShell
        title="Lead detail"
        description="The requested lead could not be loaded."
      >
        <div className="empty-card is-error">
          <h3>Lead unavailable</h3>
          <p>{leadError ?? 'Lead not found.'}</p>
          <button type="button" onClick={() => onNavigate('/leads')}>
            Back to lead queue
          </button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      title={lead.companyName}
      description="Review the recommendation, verify the evidence, and decide whether this lead is worth action."
      meta={decisionSummary.confidence.replace(/_/g, ' ')}
      actions={
        <button type="button" className="button-secondary" onClick={() => onNavigate('/leads')}>
          Back to queue
        </button>
      }
    >
      <section className="decision-layout">
        <article className="decision-summary-card">
          <div className="decision-summary-card__top">
            <div>
              <p className="eyebrow">Recommended next move</p>
              <h3>{lead.companyName}</h3>
              <p className="panel-copy">
                {[lead.location ?? 'Unknown location', lead.niche, lead.website]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
            </div>
            <LeadStatusBadge label={decisionSummary.recommendation} />
          </div>

          <div className="detail-grid">
            <div className="stack-block">
              <span className="metric-label">Confidence</span>
              <strong>{decisionSummary.confidence.replace(/_/g, ' ')}</strong>
            </div>
            <div className="stack-block">
              <span className="metric-label">Updated</span>
              <strong>{formatDate(lead.updatedAt)}</strong>
            </div>
          </div>

          <div className="stack-block">
            <span className="metric-label">Why this call makes sense</span>
            <p>{decisionSummary.fitReason}</p>
          </div>

          <div className="stack-block">
            <span className="metric-label">Best opening angle</span>
            <p>{decisionSummary.strongestOpportunity}</p>
          </div>

          <div className="action-block">
            <div className="stack-block">
              <span className="metric-label">Next operator step</span>
              <p>
                Refresh the source data only when needed. Once the evidence looks current,
                regenerate the audit, then refresh outreach last.
              </p>
            </div>

            <div className="action-row">
              <button type="button" onClick={() => void handleRefreshSnapshot()}>
                Refresh snapshot
              </button>
              <button type="button" onClick={() => void handleGenerateAudit()}>
                Generate audit
              </button>
              <button type="button" onClick={() => void handleGenerateOutreach()}>
                Generate outreach
              </button>
            </div>
          </div>

          {actionMessage ? <p className="status-note">{actionMessage}</p> : null}
        </article>

        <div className="decision-evidence-column">
          {signalsPanel.data ? (
            <AuditScoreCard signals={signalsPanel.data.signals} />
          ) : (
            <PanelFallback
              title="Signals unavailable"
              status={signalsPanel.status}
              error={signalsPanel.error}
              idleMessage="Signals load automatically when the lead page opens."
            />
          )}

          {auditPanel.data ? (
            <>
              <AuditSummaryCard audit={auditPanel.data} />
              <AuditEvidenceList evidence={auditPanel.data.evidence} />
            </>
          ) : (
            <PanelFallback
              title="No current audit"
              status={auditPanel.status}
              error={auditPanel.error}
              idleMessage={
                isAuditStale
                  ? 'The previous audit is stale. Regenerate it from the current snapshot.'
                  : 'Generate an audit to turn the current signals into a commercial read.'
              }
            />
          )}

          {snapshotPanel.data ? (
            <section className="content-card">
              <div className="content-card__header">
                <div>
                  <p className="eyebrow">Snapshot refresh</p>
                  <h3>Latest source pull</h3>
                </div>
              </div>

              <p className="panel-copy">
                {snapshotPanel.data.pageTitle ?? 'No page title extracted'}
              </p>

              <div className="detail-grid">
                <div className="stack-block">
                  <span className="metric-label">Address</span>
                  <p>{snapshotPanel.data.contactInfo.addresses[0] ?? 'No address extracted'}</p>
                </div>
                <div className="stack-block">
                  <span className="metric-label">Booking links</span>
                  <p>{snapshotPanel.data.bookingLinks.length}</p>
                </div>
              </div>
            </section>
          ) : null}
        </div>

        <div className="decision-action-column">
          {outreachPanel.data ? (
            <OutreachPreview outreach={outreachPanel.data} isStale={isOutreachStale} />
          ) : (
            <PanelFallback
              title="No current outreach"
              status={outreachPanel.status}
              error={outreachPanel.error}
              idleMessage={
                isOutreachStale
                  ? 'The previous draft is stale. Regenerate it from the current audit.'
                  : 'Generate outreach once the current audit feels credible.'
              }
            />
          )}

          <OutreachComposer
            subject={composerSubject}
            body={composerBody}
            isDisabled={!outreachPanel.data}
            isStale={isOutreachStale}
            onSubjectChange={setComposerSubject}
            onBodyChange={setComposerBody}
            onRegenerate={() => void handleGenerateOutreach()}
            onCopy={() => void handleCopy()}
            onSkip={handleSkip}
            onSendLater={handleSendLater}
          />
        </div>
      </section>
    </PageShell>
  );
}

function PanelFallback({
  title,
  status,
  error,
  idleMessage,
}: {
  title: string;
  status: AsyncStatus;
  error: string | null;
  idleMessage: string;
}) {
  return (
    <section className="content-card">
      <div className="content-card__header">
        <div>
          <p className="eyebrow">Pending</p>
          <h3>{title}</h3>
        </div>
      </div>

      {status === 'loading' ? <p className="panel-copy">Loading...</p> : null}
      {status === 'error' ? <p className="status-error">{error}</p> : null}
      {status === 'idle' || status === 'success' ? (
        <p className="panel-copy">{idleMessage}</p>
      ) : null}
    </section>
  );
}
