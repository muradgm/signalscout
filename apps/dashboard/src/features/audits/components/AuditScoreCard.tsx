import type { SignalSet } from '../../leads/types';

type AuditScoreCardProps = {
  signals: SignalSet;
};

const items = [
  ['Booking', 'bookingPresence'],
  ['Contact', 'contactClarity'],
  ['Trust', 'trustSignalStrength'],
  ['Local', 'localRelevance'],
  ['Fit', 'outreachFit'],
  ['Confidence', 'confidence'],
] as const;

export function AuditScoreCard({ signals }: AuditScoreCardProps) {
  return (
    <section className="content-card">
      <div className="content-card__header">
        <div>
          <p className="eyebrow">Signals</p>
          <h3>Decision summary</h3>
        </div>
      </div>

      <div className="signal-matrix">
        {items.map(([label, key]) => (
          <div key={key} className="signal-metric">
            <span className="metric-label">{label}</span>
            <strong>{signals[key].replace(/_/g, ' ')}</strong>
          </div>
        ))}
      </div>

      <div className="stack-block">
        <span className="metric-label">Fit reason</span>
        <p>{signals.fitReason}</p>
      </div>
    </section>
  );
}
