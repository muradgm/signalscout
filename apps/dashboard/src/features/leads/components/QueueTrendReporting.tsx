type QueueTrendReport = {
  reviewedRate: number;
  acceptedRate: number;
  editedRate: number;
  sentRate: number;
  deliveryIssueRate: number;
};

type QueueTrendReportingProps = {
  report: QueueTrendReport;
};

const TREND_CARDS: Array<{
  key: keyof QueueTrendReport;
  label: string;
  detail: string;
}> = [
  {
    key: 'reviewedRate',
    label: 'Reviewed rate',
    detail: 'How much of the visible queue has received an operator decision.',
  },
  {
    key: 'acceptedRate',
    label: 'Accepted rate',
    detail: 'How often operators are accepting the generated draft without edits.',
  },
  {
    key: 'editedRate',
    label: 'Edited rate',
    detail: 'How often operators are changing the generated draft before moving on.',
  },
  {
    key: 'sentRate',
    label: 'Sent rate',
    detail: 'How much of the visible reviewed queue has already moved into execution.',
  },
  {
    key: 'deliveryIssueRate',
    label: 'Delivery issue rate',
    detail: 'How often send attempts in view are currently showing an unresolved delivery issue.',
  },
];

const asPercent = (value: number): string => {
  return `${Math.round(value * 100)}%`;
};

export function QueueTrendReporting({ report }: QueueTrendReportingProps) {
  return (
    <section className="queue-trend-report" aria-label="Queue trends">
      <div className="queue-report__header">
        <div>
          <p className="eyebrow">Workflow trends</p>
          <h3>Operator and delivery patterns</h3>
          <p className="panel-copy">
            These rates help you spot whether the queue is moving cleanly or
            getting stuck in review and delivery friction.
          </p>
        </div>
      </div>

      <div className="queue-report__grid">
        {TREND_CARDS.map((card) => (
          <article key={card.key} className="queue-report__card">
            <span className="metric-label">{card.label}</span>
            <strong>{asPercent(report[card.key])}</strong>
            <p className="panel-copy">{card.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
