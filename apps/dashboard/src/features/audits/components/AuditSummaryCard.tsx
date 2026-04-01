import type { Audit } from '../types';

type AuditSummaryCardProps = {
  audit: Audit;
};

export function AuditSummaryCard({ audit }: AuditSummaryCardProps) {
  return (
    <section className="content-card">
      <div className="content-card__header">
        <div>
          <p className="eyebrow">Audit</p>
          <h3>Commercial read</h3>
        </div>
      </div>

      <p className="panel-copy">{audit.summary}</p>

      <div className="detail-grid">
        <div className="stack-block">
          <span className="metric-label">Top strengths</span>
          <ul className="bullet-list">
            {audit.strengths.slice(0, 3).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="stack-block">
          <span className="metric-label">Main opportunities</span>
          <ul className="bullet-list">
            {audit.opportunities.slice(0, 3).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="stack-block">
        <span className="metric-label">Recommended angle</span>
        <p>{audit.recommendedAngle}</p>
      </div>

      <div className="stack-block">
        <span className="metric-label">Confidence note</span>
        <p>{audit.confidenceNote}</p>
      </div>
    </section>
  );
}
