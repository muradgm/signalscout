import type { Outreach } from '../types';
import { OutreachStatusBadge } from './OutreachStatusBadge';

type OutreachPreviewProps = {
  outreach: Outreach;
  isStale?: boolean;
};

const formatDate = (value: string | null): string => {
  if (!value) {
    return 'Not available';
  }

  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
};

export function OutreachPreview({
  outreach,
  isStale = false,
}: OutreachPreviewProps) {
  const latestDeliveryEvent = outreach.delivery.summary.latestEventType
    ? `${outreach.delivery.summary.latestEventType.replace(/_/g, ' ')} | ${formatDate(outreach.delivery.summary.latestEventAt)}`
    : 'No provider event recorded yet';

  const deliveryNarrative =
    outreach.delivery.summary.deliveredCount > 0
      ? 'This outreach is past provider acceptance and has a confirmed delivery event.'
      : outreach.delivery.summary.latestEventType === 'provider_accepted'
        ? 'The provider accepted this outreach, but no downstream delivery event has landed yet.'
        : 'No delivery lifecycle event has landed yet.';

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
        <div className="stack-block">
          <span className="metric-label">Operator state</span>
          <p>{outreach.reviewStatus.replace(/_/g, ' ')}</p>
        </div>
      </div>

      <div className="stack-block">
        <span className="metric-label">Fit reason</span>
        <p>{outreach.fitReason}</p>
      </div>

      <div className="detail-grid">
        <div className="stack-block">
          <span className="metric-label">Reviewed</span>
          <p>{formatDate(outreach.reviewedAt)}</p>
        </div>
        <div className="stack-block">
          <span className="metric-label">Sent</span>
          <p>{formatDate(outreach.sentAt)}</p>
        </div>
      </div>

      <div className="detail-grid">
        <div className="stack-block">
          <span className="metric-label">Send attempts</span>
          <p>{outreach.sendAttemptCount}</p>
        </div>
        <div className="stack-block">
          <span className="metric-label">Last attempt</span>
          <p>{formatDate(outreach.lastSendAttemptAt)}</p>
        </div>
      </div>

      <div className="stack-block">
        <span className="metric-label">Recipient</span>
        <p>{outreach.execution.recipientEmail ?? 'No recipient email resolved yet'}</p>
      </div>

      <div className="detail-grid">
        <div className="stack-block">
          <span className="metric-label">Sender</span>
          <p>{outreach.execution.senderIdentity ?? 'Sender not configured yet'}</p>
        </div>
        <div className="stack-block">
          <span className="metric-label">Sender readiness</span>
          <p>{outreach.execution.senderReadiness.replace(/_/g, ' ')}</p>
        </div>
      </div>

      <div className="detail-grid">
        <div className="stack-block">
          <span className="metric-label">Sender domain</span>
          <p>{outreach.execution.senderDomain ?? 'No sender domain resolved'}</p>
        </div>
        <div className="stack-block">
          <span className="metric-label">Telemetry mode</span>
          <p>{outreach.execution.telemetryMode.replace(/_/g, ' ')}</p>
        </div>
      </div>

      <div className="detail-grid">
        <div className="stack-block">
          <span className="metric-label">Webhook host</span>
          <p>{outreach.execution.webhookHosting.replace(/_/g, ' ')}</p>
        </div>
        <div className="stack-block">
          <span className="metric-label">Webhook endpoint</span>
          <p>{outreach.execution.webhookEndpointUrl ?? 'No public webhook URL configured'}</p>
        </div>
      </div>

      {outreach.execution.blockingReason ? (
        <p className="status-note">{outreach.execution.blockingReason}</p>
      ) : null}

      {!outreach.execution.productionReady &&
      outreach.execution.senderReadiness !== 'missing' ? (
        <p className="status-note">
          This sender is not marked production-ready. Add its domain to
          `OUTREACH_ALLOWED_SENDER_DOMAINS` before relying on it in production.
        </p>
      ) : null}

      {outreach.execution.webhookHostingWarning ? (
        <p className="status-note">{outreach.execution.webhookHostingWarning}</p>
      ) : null}

      {outreach.lastSendError ? (
        <p className="status-error">
          Last send failure: {outreach.lastSendErrorCode ?? 'unknown'} | {outreach.lastSendError}
        </p>
      ) : null}

      {outreach.status === 'approved' ? (
        <p className="status-note">This draft is approved and send-ready.</p>
      ) : null}

      {outreach.status === 'sent' ? (
        <p className="status-note">
          This outreach was sent successfully and is now in execution state.
        </p>
      ) : null}

      {outreach.status === 'approved' && outreach.lastSendError ? (
        <p className="status-note">
          {outreach.lastSendRetryable
            ? 'A previous send attempt failed in a retryable way. Review the error, confirm the sender and recipient, then retry when ready.'
            : 'A previous send attempt failed in a way that needs intervention before you retry.'}
        </p>
      ) : null}

      <div className="detail-grid">
        <div className="stack-block">
          <span className="metric-label">Latest delivery event</span>
          <p>{latestDeliveryEvent}</p>
        </div>
        <div className="stack-block">
          <span className="metric-label">Provider message</span>
          <p>{outreach.delivery.providerMessageId ?? 'Not available yet'}</p>
        </div>
      </div>

      <div className="stack-block">
        <span className="metric-label">Delivery reading</span>
        <p>{deliveryNarrative}</p>
      </div>

      {outreach.delivery.recentEvents.length > 0 ? (
        <div className="stack-block">
          <span className="metric-label">Recent provider events</span>
          {outreach.delivery.recentEvents.map((event) => (
            <p key={event.id}>
              {event.eventType.replace(/_/g, ' ')} | {formatDate(event.occurredAt)}
              {event.summary ? ` | ${event.summary}` : ''}
            </p>
          ))}
        </div>
      ) : null}
    </section>
  );
}
