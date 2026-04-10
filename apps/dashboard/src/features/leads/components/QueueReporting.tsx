type QueueReport = {
  total: number;
  sendReady: number;
  sent: number;
  skipped: number;
  retryableFailures: number;
  unreviewedDrafts: number;
};

type QueueReportingProps = {
  report: QueueReport;
};

const REPORT_CARDS: Array<{
  key: keyof QueueReport;
  label: string;
  detail: string;
}> = [
  {
    key: 'sendReady',
    label: 'Send-ready',
    detail: 'Approved drafts that can move straight into execution.',
  },
  {
    key: 'sent',
    label: 'Sent',
    detail: 'Outreach already executed and logged.',
  },
  {
    key: 'retryableFailures',
    label: 'Retryable',
    detail: 'Delivery attempts that failed but still look safe to retry.',
  },
  {
    key: 'unreviewedDrafts',
    label: 'Unreviewed',
    detail: 'Generated drafts that still need an operator decision.',
  },
  {
    key: 'skipped',
    label: 'Skipped',
    detail: 'Leads explicitly closed out by the operator.',
  },
];

export function QueueReporting({ report }: QueueReportingProps) {
  return (
    <section className="queue-report" aria-label="Queue reporting">
      <div className="queue-report__header">
        <div>
          <p className="eyebrow">Workspace reporting</p>
          <h3>Current queue state</h3>
          <p className="panel-copy">
            This is the broader operator view: what is ready, what is sent,
            and what still needs attention across the queue.
          </p>
        </div>
        <div className="queue-report__summary">
          <span className="metric-label">Leads in view</span>
          <strong>{report.total}</strong>
        </div>
      </div>

      <div className="queue-report__grid">
        {REPORT_CARDS.map((card) => (
          <article key={card.key} className="queue-report__card">
            <span className="metric-label">{card.label}</span>
            <strong>{report[card.key]}</strong>
            <p className="panel-copy">{card.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
