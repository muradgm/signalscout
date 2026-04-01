import type { Outreach } from '../types';
import { OutreachStatusBadge } from './OutreachStatusBadge';

type OutreachPreviewProps = {
  outreach: Outreach;
  isStale?: boolean;
};

export function OutreachPreview({
  outreach,
  isStale = false,
}: OutreachPreviewProps) {
  return (
    <section className="content-card">
      <div className="content-card__header">
        <div>
          <p className="eyebrow">Outreach</p>
          <h3>Current recommendation</h3>
        </div>
        <OutreachStatusBadge recommendation={outreach.recommendation} />
      </div>

      {isStale ? (
        <p className="status-note">
          This draft is stale. Refresh it after confirming the latest audit.
        </p>
      ) : null}

      <div className="detail-grid">
        <div className="stack-block">
          <span className="metric-label">Best angle</span>
          <p>{outreach.bestAngle}</p>
        </div>
        <div className="stack-block">
          <span className="metric-label">Status</span>
          <p>{outreach.status.replace(/_/g, ' ')}</p>
        </div>
      </div>

      <div className="stack-block">
        <span className="metric-label">Fit reason</span>
        <p>{outreach.fitReason}</p>
      </div>
    </section>
  );
}
