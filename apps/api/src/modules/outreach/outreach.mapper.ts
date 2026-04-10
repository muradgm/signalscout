import type { OutreachMessage } from '@signalscout/core';

export type OutreachExecutionResponse = {
  recipientEmail: string | null;
  senderIdentity: string | null;
  senderMode: 'configured' | 'development' | 'missing';
  senderProvider: 'resend';
  senderDomain: string | null;
  senderReadiness: 'production_ready' | 'development_only' | 'unverified' | 'missing';
  productionReady: boolean;
  telemetryMode: 'workspace_only' | 'webhook_backed';
  webhookEndpointUrl: string | null;
  webhookHosting: 'stable_public' | 'temporary_tunnel' | 'not_configured';
  webhookHostingReady: boolean;
  webhookHostingWarning: string | null;
  canSend: boolean;
  blockingReason: string | null;
};

export const mapOutreachToResponse = (
  outreach: OutreachMessage,
  execution: OutreachExecutionResponse,
  delivery: {
    provider: OutreachMessage['deliveryProvider'];
    providerMessageId: string | null;
    summary: {
      totalEvents: number;
      latestEventType: string | null;
      latestEventAt: string | null;
      deliveredCount: number;
      openedCount: number;
      clickedCount: number;
      bouncedCount: number;
      complainedCount: number;
      failedCount: number;
    };
    recentEvents: Array<{
      id: string;
      eventType: string;
      occurredAt: string;
      recordedAt: string;
      summary: string | null;
      errorCode: string | null;
      retryable: boolean;
      providerMessageId: string | null;
    }>;
  },
) => {
  return {
    id: outreach.id,
    leadId: outreach.leadId,
    auditId: outreach.auditId,
    channel: outreach.channel,
    recommendation: outreach.recommendation,
    status: outreach.status,
    reviewStatus: outreach.reviewStatus,
    fitReason: outreach.fitReason,
    bestAngle: outreach.bestAngle,
    generatedSubject: outreach.generatedSubject,
    generatedBody: outreach.generatedBody,
    subject: outreach.subject,
    body: outreach.body,
    reasoning: outreach.reasoning,
    evidence: outreach.evidence,
    reviewedAt: outreach.reviewedAt?.toISOString() ?? null,
    sentAt: outreach.sentAt?.toISOString() ?? null,
    sendAttemptCount: outreach.sendAttemptCount,
    lastSendAttemptAt: outreach.lastSendAttemptAt?.toISOString() ?? null,
    lastSendErrorCode: outreach.lastSendErrorCode,
    lastSendError: outreach.lastSendError,
    lastSendRetryable: outreach.lastSendRetryable,
    deliveryProvider: outreach.deliveryProvider,
    providerMessageId: outreach.providerMessageId,
    createdAt: outreach.createdAt.toISOString(),
    execution,
    delivery,
  };
};
