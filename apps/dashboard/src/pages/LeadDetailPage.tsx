import {
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { PageShell } from '../app/layout/PageShell';
import { fetchLatestAudit, generateAudit } from '../features/audits/api';
import { AuditEvidenceList } from '../features/audits/components/AuditEvidenceList';
import { AuditScoreCard } from '../features/audits/components/AuditScoreCard';
import { AuditSummaryCard } from '../features/audits/components/AuditSummaryCard';
import type { Audit } from '../features/audits/types';
import { fetchLeads, fetchLeadSignals, refreshLeadSnapshot } from '../features/leads/api';
import { LeadStatusBadge } from '../features/leads/components/LeadStatusBadge';
import type { Lead, LeadSignalsResult, Snapshot } from '../features/leads/types';
import {
  fetchLatestOutreach,
  generateOutreach,
  reviewOutreach,
  sendOutreach,
} from '../features/outreach/api';
import { OutreachComposer } from '../features/outreach/components/OutreachComposer';
import { OutreachPreview } from '../features/outreach/components/OutreachPreview';
import type { Outreach } from '../features/outreach/types';
import { createReply, fetchRepliesByLead } from '../features/replies/api';
import { RepliesPanel } from '../features/replies/components/RepliesPanel';
import type { Reply } from '../features/replies/types';
import { ApiRequestError } from '../lib/apiClient';

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

const formatLabel = (value: string | null | undefined): string => {
  if (!value) {
    return 'Not available';
  }

  return value.replace(/_/g, ' ');
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
    setState((current) => ({
      data: current.data,
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown request failure',
    }));
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
    setState((current) => ({
      data: current.data,
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown request failure',
    }));
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

  const [snapshotPanel, setSnapshotPanel] = useState<PanelState<Snapshot>>(
    createPanelState,
  );
  const [signalsPanel, setSignalsPanel] = useState<PanelState<LeadSignalsResult | null>>(
    createPanelState,
  );
  const [auditPanel, setAuditPanel] = useState<PanelState<Audit | null>>(
    createPanelState,
  );
  const [outreachPanel, setOutreachPanel] = useState<PanelState<Outreach | null>>(
    createPanelState,
  );
  const [repliesPanel, setRepliesPanel] = useState<PanelState<Reply[]>>(createPanelState);

  const [isAuditStale, setIsAuditStale] = useState(false);
  const [isOutreachStale, setIsOutreachStale] = useState(false);
  const [composerSubject, setComposerSubject] = useState('');
  const [composerBody, setComposerBody] = useState('');
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

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
        setLeadError(
          error instanceof Error ? error.message : 'Failed to load lead',
        );
      }
    };

    void loadLead();
    void loadOptionalPanel(
      async () => {
        try {
          return await fetchLeadSignals(leadId);
        } catch (error) {
          if (error instanceof ApiRequestError && error.status === 404) {
            return null;
          }

          throw error;
        }
      },
      setSignalsPanel,
    );
    void loadOptionalPanel(() => fetchLatestAudit(leadId), setAuditPanel);
    void loadOptionalPanel(() => fetchLatestOutreach(leadId), setOutreachPanel);
    void loadPanel(() => fetchRepliesByLead(leadId), setRepliesPanel);
    setSnapshotPanel(createPanelState());
    setIsAuditStale(false);
    setIsOutreachStale(false);
    setActionMessage(null);
    setIsSending(false);
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
      fitReason:
        signals?.fitReason ??
        'Load signals to see the current lead rationale.',
      strongestOpportunity:
        audit?.opportunities[0] ??
        'Generate an audit to surface the strongest commercial opportunity.',
    };
  }, [auditPanel.data, outreachPanel.data, signalsPanel.data]);

  const workflowTimeline = useMemo(() => {
    return [
      {
        label: 'Lead updated',
        value: formatDate(lead?.updatedAt),
        detail: formatLabel(lead?.status),
      },
      {
        label: 'Latest snapshot',
        value:
          snapshotPanel.data?.extractedAt != null
            ? formatDate(snapshotPanel.data.extractedAt)
            : formatDate(signalsPanel.data?.snapshotId ? lead?.updatedAt : null),
        detail: snapshotPanel.data
          ? 'Current source pull loaded in this session'
          : 'No fresh snapshot in this view',
      },
      {
        label: 'Latest audit',
        value: formatDate(auditPanel.data?.createdAt),
        detail: auditPanel.data ? 'Audit available' : 'No audit generated yet',
      },
      {
        label: 'Latest outreach',
        value: formatDate(outreachPanel.data?.createdAt),
        detail: outreachPanel.data
          ? `${formatLabel(outreachPanel.data.status)} | ${formatLabel(outreachPanel.data.reviewStatus)}`
          : 'No outreach generated yet',
      },
      {
        label: 'Last review',
        value: formatDate(outreachPanel.data?.reviewedAt),
        detail:
          outreachPanel.data?.reviewStatus &&
          outreachPanel.data.reviewStatus !== 'not_reviewed'
            ? `Operator marked as ${formatLabel(outreachPanel.data.reviewStatus)}`
            : 'Not reviewed yet',
      },
      {
        label: 'Last send',
        value: formatDate(outreachPanel.data?.sentAt),
        detail: outreachPanel.data?.sentAt
          ? 'Delivery handed off to the sending provider'
          : 'Not sent yet',
      },
      {
        label: 'Latest reply',
        value: formatDate(repliesPanel.data?.[0]?.receivedAt),
        detail: repliesPanel.data?.[0]
          ? `Inbound reply from ${repliesPanel.data[0].fromEmail}`
          : 'No reply tracked yet',
      },
      {
        label: 'Send attempts',
        value:
          outreachPanel.data != null
            ? String(outreachPanel.data.sendAttemptCount)
            : '0',
        detail: outreachPanel.data?.lastSendError
          ? `Last failure: ${outreachPanel.data.lastSendError}`
          : outreachPanel.data?.lastSendAttemptAt
            ? 'Most recent attempt completed without a recorded provider error'
            : 'No send attempt recorded yet',
      },
    ];
  }, [
    auditPanel.data,
    lead?.status,
    lead?.updatedAt,
    outreachPanel.data,
    repliesPanel.data,
    signalsPanel.data?.snapshotId,
    snapshotPanel.data,
  ]);

  const handleRefreshSnapshot = async (): Promise<void> => {
    setActionMessage(null);
    const snapshot = await loadPanel(
      () => refreshLeadSnapshot(leadId),
      setSnapshotPanel,
    );

    if (!snapshot) {
      return;
    }

    await loadOptionalPanel(
      async () => {
        try {
          return await fetchLeadSignals(leadId);
        } catch (error) {
          if (error instanceof ApiRequestError && error.status === 404) {
            return null;
          }

          throw error;
        }
      },
      setSignalsPanel,
    );
    setAuditPanel(createPanelState());
    setOutreachPanel(createPanelState());
    setIsAuditStale(true);
    setIsOutreachStale(true);
    setComposerSubject('');
    setComposerBody('');
    setActionMessage(
      'Snapshot refreshed. Regenerate the audit and outreach before acting.',
    );
  };

  const handleGenerateAudit = async (): Promise<void> => {
    setActionMessage(null);

    if (!signalsPanel.data) {
      setActionMessage(
        'Refresh the snapshot first so the audit has current source material to work from.',
      );
      return;
    }

    const audit = await loadOptionalPanel(() => generateAudit(leadId), setAuditPanel);

    if (!audit) {
      return;
    }

    setOutreachPanel(createPanelState());
    setIsAuditStale(false);
    setIsOutreachStale(true);
    setComposerSubject('');
    setComposerBody('');
    setActionMessage(
      'Audit regenerated. Refresh the outreach draft before you send anything.',
    );
  };

  const handleGenerateOutreach = async (): Promise<void> => {
    setActionMessage(null);

    if (!auditPanel.data) {
      setActionMessage(
        'Generate or load an audit first so outreach can build from a current review.',
      );
      return;
    }

    const outreach = await loadOptionalPanel(
      () => generateOutreach(leadId, auditPanel.data?.id),
      setOutreachPanel,
    );

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

  const handleAccept = async (): Promise<void> => {
    if (!outreachPanel.data) {
      setActionMessage('Generate outreach first so there is a draft to accept.');
      return;
    }

    const outreachId = outreachPanel.data.id;
    const outreach = await loadOptionalPanel(
      () =>
        reviewOutreach(outreachId, {
          action: 'accepted',
          subject: composerSubject.trim() || null,
          body: composerBody.trim() || null,
        }),
      setOutreachPanel,
    );

    if (!outreach) {
      return;
    }

    setActionMessage('Draft accepted and saved.');
  };

  const handleSaveEdits = async (): Promise<void> => {
    if (!outreachPanel.data) {
      setActionMessage('Generate outreach first so there is a draft to edit.');
      return;
    }

    if (!composerSubject.trim() || !composerBody.trim()) {
      setActionMessage(
        'Edited drafts need both a subject and body before saving.',
      );
      return;
    }

    const outreachId = outreachPanel.data.id;
    const outreach = await loadOptionalPanel(
      () =>
        reviewOutreach(outreachId, {
          action: 'edited',
          subject: composerSubject.trim(),
          body: composerBody.trim(),
        }),
      setOutreachPanel,
    );

    if (!outreach) {
      return;
    }

    setActionMessage('Edited draft saved.');
  };

  const handleSkip = async (): Promise<void> => {
    if (!outreachPanel.data) {
      setActionMessage('Generate outreach first so there is a draft to skip.');
      return;
    }

    const outreachId = outreachPanel.data.id;
    const outreach = await loadOptionalPanel(
      () =>
        reviewOutreach(outreachId, {
          action: 'skipped',
          subject: composerSubject.trim() || null,
          body: composerBody.trim() || null,
        }),
      setOutreachPanel,
    );

    if (!outreach) {
      return;
    }

    setActionMessage('Lead skipped and saved.');
  };

  const handleSend = async (): Promise<void> => {
    if (!outreachPanel.data) {
      setActionMessage('Generate outreach first so there is a draft to send.');
      return;
    }

    setActionMessage(null);
    setIsSending(true);
    setOutreachPanel((current) => ({
      ...current,
      status: 'loading',
      error: null,
    }));

    try {
      const outreach = await sendOutreach(outreachPanel.data.id);
      setOutreachPanel({
        data: outreach,
        status: 'success',
        error: null,
      });
      setActionMessage('Outreach sent and logged.');
    } catch (error) {
      const message =
        error instanceof ApiRequestError || error instanceof Error
          ? error.message
          : 'Send failed unexpectedly';
      const refreshedOutreach = await fetchLatestOutreach(leadId);

      setOutreachPanel((current) => ({
        data: refreshedOutreach ?? current.data,
        status: 'error',
        error: message,
      }));
      setActionMessage(message);
    } finally {
      setIsSending(false);
    }
  };

  const handleRecordReply = async (): Promise<void> => {
    if (!outreachPanel.data) {
      setActionMessage('Generate or load outreach before recording a reply.');
      return;
    }

    const reply = await createReply(outreachPanel.data.id, {
      fromEmail: outreachPanel.data.execution.recipientEmail ?? '',
      subject: outreachPanel.data.subject,
      body: 'Manual reply tracked by operator.',
      source: 'manual',
    }).catch((error) => {
      setActionMessage(
        error instanceof Error ? error.message : 'Reply tracking failed unexpectedly',
      );
      return null;
    });

    if (!reply) {
      return;
    }

    await loadPanel(() => fetchRepliesByLead(leadId), setRepliesPanel);
    const refreshedOutreach = await fetchLatestOutreach(leadId).catch(() => null);
    if (refreshedOutreach) {
      setOutreachPanel({
        data: refreshedOutreach,
        status: 'success',
        error: null,
      });
    }
    setActionMessage('Reply recorded and linked to this outreach.');
  };

  const isComposerDirty =
    (outreachPanel.data?.subject ?? '') !== composerSubject ||
    (outreachPanel.data?.body ?? '') !== composerBody;
  const canSend = Boolean(outreachPanel.data?.execution.canSend) && !isOutreachStale;
  const hasSendFailure = Boolean(outreachPanel.data?.lastSendError);
  const sendHelpText = isOutreachStale
    ? 'Regenerate outreach from the latest audit before sending.'
    : outreachPanel.data?.execution.blockingReason ??
      (outreachPanel.data?.lastSendError
        ? outreachPanel.data.lastSendRetryable
          ? 'A previous send attempt failed in a retryable way. Review the error, confirm the sender and recipient, then retry when ready.'
          : 'A previous send attempt failed in a non-retryable way. Resolve the sender or delivery issue before trying again.'
        : null) ??
      (outreachPanel.data != null &&
      !outreachPanel.data.execution.productionReady &&
      outreachPanel.data.execution.senderReadiness !== 'missing'
        ? 'This sender is not marked production-ready. Add its domain to OUTREACH_ALLOWED_SENDER_DOMAINS before relying on it in production.'
        : null);
  const isComposerWorking = outreachPanel.status === 'loading';

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
          <button
            type="button"
            className="button-secondary"
            onClick={() => onNavigate('/leads')}
          >
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
        <button
          type="button"
          className="button-secondary"
          onClick={() => onNavigate('/leads')}
        >
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
                  .join(' | ')}
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
                {outreachPanel.data?.status === 'approved'
                  ? hasSendFailure
                    ? 'A previous send attempt failed. Confirm the sender and recipient details, then retry when the route looks safe.'
                    : 'This draft is send-ready. Confirm the recipient and sender details, then move it into execution.'
                  : 'Refresh the source data only when needed. Once the evidence looks current, regenerate the audit, then refresh outreach last.'}
              </p>
            </div>

            <div className="action-row">
              <button
                type="button"
                className="button-secondary"
                onClick={() => void handleRefreshSnapshot()}
              >
                Refresh snapshot
              </button>
              <button
                type="button"
                className="button-secondary"
                onClick={() => void handleGenerateAudit()}
              >
                Generate audit
              </button>
              <button
                type="button"
                className="button-primary"
                onClick={() => void handleGenerateOutreach()}
              >
                Generate outreach
              </button>
            </div>
          </div>

          {actionMessage ? <p className="status-note">{actionMessage}</p> : null}

          <section className="content-card">
            <div className="content-card__header">
              <div>
                <p className="eyebrow">Timeline</p>
                <h3>Workflow state</h3>
              </div>
            </div>

            <div className="timeline-list">
              {workflowTimeline.map((item) => (
                <div key={item.label} className="timeline-item">
                  <div>
                    <span className="metric-label">{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                  <p>{item.detail}</p>
                </div>
              ))}
            </div>
          </section>
        </article>

        <div className="decision-evidence-column">
          {signalsPanel.data ? (
            <AuditScoreCard signals={signalsPanel.data.signals} />
          ) : (
            <PanelFallback
              title="No current signals"
              status={signalsPanel.status}
              error={signalsPanel.error}
              idleMessage="Refresh the snapshot to pull the current website state and generate signals."
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
                  <p>
                    {snapshotPanel.data.contactInfo.addresses[0] ??
                      'No address extracted'}
                  </p>
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

          {outreachPanel.data && outreachPanel.status === 'error' && outreachPanel.error ? (
            <p className="status-error">{outreachPanel.error}</p>
          ) : null}

          <button
            type="button"
            className="button-secondary"
            onClick={() => void handleRecordReply()}
            disabled={!outreachPanel.data}
          >
            Record reply
          </button>

          {repliesPanel.data ? <RepliesPanel replies={repliesPanel.data} /> : null}

          <OutreachComposer
            subject={composerSubject}
            body={composerBody}
            isDisabled={!outreachPanel.data}
            isStale={isOutreachStale}
            isDirty={isComposerDirty}
            isWorking={isComposerWorking}
            isSending={isSending}
            sendHelpText={sendHelpText}
            hasSendFailure={hasSendFailure}
            onSubjectChange={setComposerSubject}
            onBodyChange={setComposerBody}
            onRegenerate={() => void handleGenerateOutreach()}
            onCopy={() => void handleCopy()}
            onAccept={() => void handleAccept()}
            onSaveEdits={() => void handleSaveEdits()}
            onSkip={() => void handleSkip()}
            onSend={() => void handleSend()}
            canSend={canSend}
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
