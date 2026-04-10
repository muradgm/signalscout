import type { Lead } from '../../leads/types';
import type { Reply } from '../types';

const formatDate = (value: string): string =>
  new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));

type RecentRepliesPanelProps = {
  replies: Reply[];
  leadsById: Record<string, Lead>;
  onOpenLead: (leadId: string) => void;
};

export function RecentRepliesPanel({
  replies,
  leadsById,
  onOpenLead,
}: RecentRepliesPanelProps) {
  if (replies.length === 0) {
    return null;
  }

  return (
    <section className="content-card">
      <div className="content-card__header">
        <div>
          <p className="eyebrow">Reply queue</p>
          <h3>Recent inbound responses</h3>
        </div>
      </div>

      <div className="timeline-list">
        {replies.map((reply) => {
          const lead = leadsById[reply.leadId];

          return (
            <button
              key={reply.id}
              type="button"
              className="timeline-item timeline-item--button"
              aria-label={`Open replied lead ${lead?.companyName ?? reply.fromEmail}`}
              onClick={() => onOpenLead(reply.leadId)}
            >
              <div>
                <span className="metric-label">{lead?.companyName ?? reply.fromEmail}</span>
                <strong>{formatDate(reply.receivedAt)}</strong>
              </div>
              <p>{reply.subject ?? 'No subject provided'}</p>
              <p>{reply.body}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
