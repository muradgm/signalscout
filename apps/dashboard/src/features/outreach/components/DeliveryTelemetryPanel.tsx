import type { Outreach } from '../types';

type DeliveryTelemetryPanelProps = {
  outreachItems: Outreach[];
};

const asPercent = (value: number): string => `${Math.round(value * 100)}%`;

export function DeliveryTelemetryPanel({
  outreachItems,
}: DeliveryTelemetryPanelProps) {
  const sentItems = outreachItems.filter((outreach) => outreach.status === 'sent');
  const sentCount = sentItems.length;

  if (sentCount === 0) {
    return null;
  }

  const deliveredCount = sentItems.filter(
    (outreach) => outreach.delivery.summary.deliveredCount > 0,
  ).length;
  const openedCount = sentItems.filter(
    (outreach) => outreach.delivery.summary.openedCount > 0,
  ).length;
  const clickedCount = sentItems.filter(
    (outreach) => outreach.delivery.summary.clickedCount > 0,
  ).length;
  const issueCount = sentItems.filter(
    (outreach) =>
      outreach.delivery.summary.bouncedCount > 0 ||
      outreach.delivery.summary.complainedCount > 0 ||
      outreach.delivery.summary.failedCount > 0,
  ).length;
  const awaitingProviderCount = sentItems.filter(
    (outreach) =>
      outreach.delivery.summary.totalEvents > 0 &&
      outreach.delivery.summary.latestEventType === 'provider_accepted',
  ).length;
  const webhookBackedCount = sentItems.filter(
    (outreach) => outreach.execution.telemetryMode === 'webhook_backed',
  ).length;
  const providerAcceptedCount = sentItems.filter(
    (outreach) =>
      outreach.delivery.summary.totalEvents > 0 &&
      outreach.delivery.summary.latestEventType === 'provider_accepted',
  ).length;
  const hasConfirmedLifecycle =
    deliveredCount > 0 || openedCount > 0 || clickedCount > 0;

  return (
    <section className="queue-trend-report" aria-label="Delivery telemetry">
      <div className="queue-report__header">
        <div>
          <p className="eyebrow">Delivery telemetry</p>
          <h3>Live send visibility</h3>
          <p className="panel-copy">
            This shows whether sent outreach has only been accepted by the
            provider or has moved into real delivery and engagement states.
          </p>
        </div>
      </div>

      <div className="queue-report__grid">
        <article className="queue-report__card">
          <span className="metric-label">Sent</span>
          <strong>{sentCount}</strong>
          <p className="panel-copy">Sent outreach currently in the visible queue.</p>
        </article>
        <article className="queue-report__card">
          <span className="metric-label">Webhook-backed</span>
          <strong>{asPercent(sentCount > 0 ? webhookBackedCount / sentCount : 0)}</strong>
          <p className="panel-copy">
            Sent outreach with provider events flowing back into the workspace.
          </p>
        </article>
        <article className="queue-report__card">
          <span className="metric-label">Accepted by provider</span>
          <strong>{asPercent(sentCount > 0 ? providerAcceptedCount / sentCount : 0)}</strong>
          <p className="panel-copy">
            Sent outreach that has only reached provider acceptance so far.
          </p>
        </article>
        <article className="queue-report__card">
          <span className="metric-label">Delivered</span>
          <strong>{asPercent(sentCount > 0 ? deliveredCount / sentCount : 0)}</strong>
          <p className="panel-copy">
            Sent outreach with a confirmed delivered event from the provider.
          </p>
        </article>
        <article className="queue-report__card">
          <span className="metric-label">Opened</span>
          <strong>{asPercent(sentCount > 0 ? openedCount / sentCount : 0)}</strong>
          <p className="panel-copy">
            Delivered outreach that has recorded at least one open event.
          </p>
        </article>
        <article className="queue-report__card">
          <span className="metric-label">Clicked</span>
          <strong>{asPercent(sentCount > 0 ? clickedCount / sentCount : 0)}</strong>
          <p className="panel-copy">
            Outreach that has progressed from open into click activity.
          </p>
        </article>
        <article className="queue-report__card">
          <span className="metric-label">Delivery issues</span>
          <strong>{asPercent(sentCount > 0 ? issueCount / sentCount : 0)}</strong>
          <p className="panel-copy">
            Sent outreach showing bounce, complaint, or failed delivery signals.
          </p>
        </article>
      </div>

      <div className="timeline-list">
        <div className="timeline-item">
          <div>
            <span className="metric-label">Awaiting provider lifecycle events</span>
            <strong>{awaitingProviderCount}</strong>
          </div>
          <p>
            Sent outreach currently stopped at provider acceptance, with no later
            delivery or engagement event recorded yet.
          </p>
        </div>
        <div className="timeline-item">
          <div>
            <span className="metric-label">Operator reading</span>
            <strong>{hasConfirmedLifecycle ? 'Provider lifecycle is flowing' : 'Still early'}</strong>
          </div>
          <p>
            {hasConfirmedLifecycle
              ? 'The queue is now showing real downstream delivery or engagement events, not just send confirmations.'
              : 'The send path is active, but the queue is still waiting on more downstream provider events before this panel becomes more decision-useful.'}
          </p>
        </div>
      </div>
    </section>
  );
}
