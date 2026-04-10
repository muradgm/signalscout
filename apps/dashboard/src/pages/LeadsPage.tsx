import { startTransition, useDeferredValue, useEffect, useMemo, useState } from 'react';
import { PageShell } from '../app/layout/PageShell';
import { fetchLeads, fetchLeadSignals } from '../features/leads/api';
import { LeadFilters, type LeadQueueScope } from '../features/leads/components/LeadFilters';
import { QueueReporting } from '../features/leads/components/QueueReporting';
import { QueueTrendReporting } from '../features/leads/components/QueueTrendReporting';
import { LeadTable, getLeadInsightFromSignals } from '../features/leads/components/LeadTable';
import { LeadReviewQueuePanel, type ReviewQueueItem } from '../features/leads/components/LeadReviewQueuePanel';
import type { Lead, SignalSet } from '../features/leads/types';
import { fetchLatestOutreach } from '../features/outreach/api';
import { DeliveryTelemetryPanel } from '../features/outreach/components/DeliveryTelemetryPanel';
import type { Outreach } from '../features/outreach/types';
import { fetchRecentReplies } from '../features/replies/api';
import { RecentRepliesPanel } from '../features/replies/components/RecentRepliesPanel';
import type { Reply } from '../features/replies/types';
import { fetchOutreachLearningSummary } from '../features/feedback/api';
import { OutreachLearningPanel } from '../features/feedback/components/OutreachLearningPanel';
import type { OutreachLearningSummary } from '../features/feedback/types';

type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

type LeadsPageProps = {
  onNavigate: (path: string) => void;
};

const isNonBerlinLead = (lead: Lead): boolean =>
  !String(lead.location ?? '')
    .toLowerCase()
    .includes('berlin');

const hasWeakContactSignals = (signals: SignalSet | undefined): boolean =>
  Boolean(
    signals &&
      (signals.contactClarity !== 'high' ||
        signals.bookingPresence !== 'direct' ||
        signals.trustSignalStrength === 'low'),
  );

const hasNicheCue = (lead: Lead): boolean =>
  /implant|align|endo|oral|chirurg|surgery|kinder|pediatric|parodont/i.test(
    `${lead.companyName} ${lead.website} ${lead.niche}`,
  );

const needsOperatorReview = (outreach: Outreach | null | undefined): boolean =>
  !outreach ||
  (outreach.reviewStatus === 'not_reviewed' &&
    (outreach.status === 'drafted' || outreach.status === 'review_required'));

const matchesScope = (
  scope: LeadQueueScope,
  lead: Lead,
  signals: SignalSet | undefined,
  outreach: Outreach | null | undefined,
): boolean => {
  if (scope === 'all') {
    return true;
  }

  if (scope === 'priority_review') {
    return (
      needsOperatorReview(outreach) &&
      (isNonBerlinLead(lead) || hasWeakContactSignals(signals) || hasNicheCue(lead))
    );
  }

  if (scope === 'non_berlin') {
    return isNonBerlinLead(lead);
  }

  if (scope === 'weak_contact') {
    return hasWeakContactSignals(signals);
  }

  return hasNicheCue(lead);
};

export function LeadsPage({ onNavigate }: LeadsPageProps) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [status, setStatus] = useState<AsyncStatus>('loading');
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [scope, setScope] = useState<LeadQueueScope>('all');
  const [signalsByLeadId, setSignalsByLeadId] = useState<Record<string, SignalSet>>({});
  const [outreachByLeadId, setOutreachByLeadId] = useState<Record<string, Outreach | null>>({});
  const [recentReplies, setRecentReplies] = useState<Reply[]>([]);
  const [learningSummary, setLearningSummary] = useState<OutreachLearningSummary | null>(null);

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
        const nextOutreachByLeadId: Record<string, Outreach | null> = {};

        for (const item of settled) {
          if (item.status === 'fulfilled') {
            nextSignalsByLeadId[item.value.leadId] = item.value.signals;
          }
        }

        const outreachSettled = await Promise.allSettled(
          data.map(async (lead) => ({
            leadId: lead.id,
            outreach: await fetchLatestOutreach(lead.id),
          })),
        );
        const latestReplies = await fetchRecentReplies();
        const latestLearningSummary = await fetchOutreachLearningSummary();

        for (const item of outreachSettled) {
          if (item.status === 'fulfilled') {
            nextOutreachByLeadId[item.value.leadId] = item.value.outreach;
          }
        }

        setSignalsByLeadId(nextSignalsByLeadId);
        setOutreachByLeadId(nextOutreachByLeadId);
        setRecentReplies(latestReplies);
        setLearningSummary(latestLearningSummary);
      } catch (loadError) {
        setStatus('error');
        setError(loadError instanceof Error ? loadError.message : 'Failed to load leads');
      }
    };

    void loadLeads();
  }, []);

  const deferredSearchTerm = useDeferredValue(searchTerm);

  const searchFilteredLeads = useMemo(() => {
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

  const scopeCounts = useMemo(
    () => ({
      all: searchFilteredLeads.length,
      priority_review: searchFilteredLeads.filter((lead) =>
        matchesScope(
          'priority_review',
          lead,
          signalsByLeadId[lead.id],
          outreachByLeadId[lead.id],
        ),
      ).length,
      non_berlin: searchFilteredLeads.filter((lead) =>
        matchesScope('non_berlin', lead, signalsByLeadId[lead.id], outreachByLeadId[lead.id]),
      ).length,
      weak_contact: searchFilteredLeads.filter((lead) =>
        matchesScope('weak_contact', lead, signalsByLeadId[lead.id], outreachByLeadId[lead.id]),
      ).length,
      niche_valid: searchFilteredLeads.filter((lead) =>
        matchesScope('niche_valid', lead, signalsByLeadId[lead.id], outreachByLeadId[lead.id]),
      ).length,
    }),
    [outreachByLeadId, searchFilteredLeads, signalsByLeadId],
  );

  const filteredLeads = useMemo(
    () =>
      searchFilteredLeads.filter((lead) =>
        matchesScope(scope, lead, signalsByLeadId[lead.id], outreachByLeadId[lead.id]),
      ),
    [outreachByLeadId, scope, searchFilteredLeads, signalsByLeadId],
  );

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

  const leadsById = useMemo(
    () => Object.fromEntries(leads.map((lead) => [lead.id, lead])),
    [leads],
  );

  const reviewQueueItems = useMemo<ReviewQueueItem[]>(() => {
    const scoreLead = (lead: Lead): number => {
      const signals = signalsByLeadId[lead.id];
      const outreach = outreachByLeadId[lead.id];
      let score = 0;

      if (needsOperatorReview(outreach)) score += 4;
      if (isNonBerlinLead(lead)) score += 3;
      if (hasWeakContactSignals(signals)) score += 3;
      if (hasNicheCue(lead)) score += 2;
      if (signals?.outreachFit === 'uncertain') score += 2;
      if (signals?.confidence === 'medium' || signals?.confidence === 'low') score += 1;

      return score;
    };

    return searchFilteredLeads
      .filter((lead) =>
        matchesScope(
          'priority_review',
          lead,
          signalsByLeadId[lead.id],
          outreachByLeadId[lead.id],
        ),
      )
      .map((lead) => {
        const signals = signalsByLeadId[lead.id];
        const focusTags = [
          isNonBerlinLead(lead) ? 'Non-Berlin' : null,
          hasWeakContactSignals(signals) ? 'Weak-contact' : null,
          hasNicheCue(lead) ? 'Niche-valid' : null,
          needsOperatorReview(outreachByLeadId[lead.id]) ? 'Unreviewed' : null,
        ].filter((tag): tag is string => Boolean(tag));

        return {
          leadId: lead.id,
          companyName: lead.companyName,
          location: lead.location ?? 'Unknown location',
          confidence: signals?.confidence ?? 'pending',
          recommendation: getLeadInsightFromSignals(
            signals ?? {
              bookingPresence: 'not_detected',
              contactClarity: 'low',
              trustSignalStrength: 'low',
              businessScale: 'single_location',
              localRelevance: 'low_match',
              outreachFit: 'uncertain',
              fitReason: 'Signals have not loaded yet.',
              confidence: 'low',
              leadCompleteness: lead.completeness,
              issuesDetected: [],
              evidence: [],
            },
          ).recommendation,
          reason:
            signals?.fitReason ??
            'Open this lead to fetch signals and make an operator decision.',
          focusTags,
          _score: scoreLead(lead),
        };
      })
      .sort((left, right) => right._score - left._score)
      .slice(0, 6)
      .map(({ _score: _unusedScore, ...item }) => item);
  }, [outreachByLeadId, searchFilteredLeads, signalsByLeadId]);

  const queueReport = useMemo(() => {
    const scopedLeadIds = new Set(filteredLeads.map((lead) => lead.id));
    const outreachItems = Object.entries(outreachByLeadId)
      .filter(([leadId]) => scopedLeadIds.has(leadId))
      .map(([, outreach]) => outreach)
      .filter((outreach): outreach is Outreach => outreach !== null);

    return {
      total: filteredLeads.length,
      sendReady: outreachItems.filter((outreach) => outreach.status === 'approved').length,
      sent: outreachItems.filter((outreach) => outreach.status === 'sent').length,
      skipped: outreachItems.filter((outreach) => outreach.reviewStatus === 'skipped').length,
      retryableFailures: outreachItems.filter(
        (outreach) => Boolean(outreach.lastSendError) && outreach.lastSendRetryable,
      ).length,
      unreviewedDrafts: outreachItems.filter(
        (outreach) => outreach.reviewStatus === 'not_reviewed' && outreach.status === 'drafted',
      ).length,
    };
  }, [filteredLeads, outreachByLeadId]);

  const queueTrendReport = useMemo(() => {
    const scopedLeadIds = new Set(filteredLeads.map((lead) => lead.id));
    const outreachItems = Object.entries(outreachByLeadId)
      .filter(([leadId]) => scopedLeadIds.has(leadId))
      .map(([, outreach]) => outreach)
      .filter((outreach): outreach is Outreach => outreach !== null);
    const reviewedItems = outreachItems.filter(
      (outreach) => outreach.reviewStatus !== 'not_reviewed',
    );
    const attemptedItems = outreachItems.filter(
      (outreach) => outreach.sendAttemptCount > 0,
    );

    return {
      reviewedRate:
        outreachItems.length > 0 ? reviewedItems.length / outreachItems.length : 0,
      acceptedRate:
        reviewedItems.length > 0
          ? reviewedItems.filter((outreach) => outreach.reviewStatus === 'accepted').length /
            reviewedItems.length
          : 0,
      editedRate:
        reviewedItems.length > 0
          ? reviewedItems.filter((outreach) => outreach.reviewStatus === 'edited').length /
            reviewedItems.length
          : 0,
      sentRate:
        reviewedItems.length > 0
          ? reviewedItems.filter((outreach) => outreach.status === 'sent').length /
            reviewedItems.length
          : 0,
      deliveryIssueRate:
        attemptedItems.length > 0
          ? attemptedItems.filter((outreach) => Boolean(outreach.lastSendError)).length /
            attemptedItems.length
          : 0,
    };
  }, [filteredLeads, outreachByLeadId]);

  return (
    <PageShell
      title="Lead queue"
      description="Work through the queue, spot the strongest opportunities quickly, and open the next lead worth acting on."
      meta={`${filteredLeads.length} lead${filteredLeads.length === 1 ? '' : 's'} in view`}
    >
      <LeadFilters
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        scope={scope}
        onScopeChange={(value) => {
          startTransition(() => {
            setScope(value);
          });
        }}
        counts={scopeCounts}
      />

      {status === 'success' ? (
        <>
          <LeadReviewQueuePanel
            items={reviewQueueItems}
            onOpenLead={(leadId) => onNavigate(`/leads/${leadId}`)}
          />
          <QueueReporting report={queueReport} />
          <QueueTrendReporting report={queueTrendReport} />
          <DeliveryTelemetryPanel
            outreachItems={Object.values(outreachByLeadId).filter(
              (outreach): outreach is Outreach => outreach !== null,
            )}
          />
          {learningSummary ? <OutreachLearningPanel summary={learningSummary} /> : null}
          <RecentRepliesPanel
            replies={recentReplies}
            leadsById={leadsById}
            onOpenLead={(leadId) => onNavigate(`/leads/${leadId}`)}
          />
        </>
      ) : null}

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
