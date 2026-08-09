import { LeadStatusBadge } from './LeadStatusBadge';

export type ReviewQueueItem = {
  leadId: string;
  companyName: string;
  location: string;
  confidence: string;
  recommendation: string;
  reason: string;
  focusTags: string[];
};

type LeadReviewQueuePanelProps = {
  items: ReviewQueueItem[];
  onOpenLead: (leadId: string) => void;
};

export function LeadReviewQueuePanel({
  items,
  onOpenLead,
}: LeadReviewQueuePanelProps) {
  return (
    <section className="queue-review-panel" aria-labelledby="needs-attention-lane-title">
      <div className="queue-report__header">
        <div>
          <h3 id="needs-attention-lane-title">Needs attention</h3>
          <p>
            These leads rank by review risk and unresolved evidence, not by commercial
            opportunity. Resolve uncertainty before deciding whether to act.
          </p>
        </div>
        <div className="queue-report__summary">
          <strong>{items.length}</strong>
          <span>Next up</span>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="queue-review-panel__empty">
          <p>No focused review items are waiting right now.</p>
        </div>
      ) : (
        <div className="queue-review-panel__list">
          {items.map((item) => (
            <button
              key={item.leadId}
              type="button"
              className="queue-review-panel__item"
              onClick={() => onOpenLead(item.leadId)}
              aria-label={`Open lead needing attention ${item.companyName}`}
            >
              <div className="queue-review-panel__top">
                <div>
                  <strong>{item.companyName}</strong>
                  <p>{item.location}</p>
                </div>
                <LeadStatusBadge label={item.recommendation} compact />
              </div>

              <div className="queue-review-panel__tags">
                {item.focusTags.map((tag) => (
                  <span key={tag} className="scope-filter-chip is-static">
                    {tag}
                  </span>
                ))}
              </div>

              <p className="queue-review-panel__reason">{item.reason}</p>
              <span className="queue-review-panel__confidence">
                Confidence: {item.confidence.replace(/_/g, ' ')}
              </span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
