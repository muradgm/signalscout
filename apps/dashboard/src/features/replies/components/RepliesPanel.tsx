import type { Reply } from '../types';

const formatDate = (value: string): string =>
  new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));

export function RepliesPanel({ replies }: { replies: Reply[] }) {
  return (
    <section className="content-card">
      <div className="content-card__header">
        <div>
          <p className="eyebrow">Replies</p>
          <h3>Inbound responses</h3>
        </div>
      </div>

      {replies.length === 0 ? (
        <p className="panel-copy">No reply has been tracked for this lead yet.</p>
      ) : (
        <div className="timeline-list">
          {replies.map((reply) => (
            <div key={reply.id} className="timeline-item">
              <div>
                <span className="metric-label">{reply.fromEmail}</span>
                <strong>{formatDate(reply.receivedAt)}</strong>
              </div>
              <p>{reply.subject ?? 'No subject provided'}</p>
              <p>{reply.body}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
