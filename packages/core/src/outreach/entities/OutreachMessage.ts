export type OutreachChannel = 'email';
export type DeliveryProvider = 'resend';
export type DeliveryEventType =
  | 'provider_accepted'
  | 'delivered'
  | 'delivery_delayed'
  | 'bounced'
  | 'complained'
  | 'opened'
  | 'clicked'
  | 'failed';

export type OutreachRecommendationType =
  | 'send'
  | 'review'
  | 'do_not_send';

export type OutreachStatus =
  | 'withheld'
  | 'review_required'
  | 'drafted'
  | 'approved'
  | 'sent'
  | 'replied'
  | 'closed';

export type OutreachReviewStatus =
  | 'not_reviewed'
  | 'accepted'
  | 'edited'
  | 'skipped'
  | 'held';

export interface OutreachMessage {
  id: string;
  leadId: string;
  auditId: string;

  channel: OutreachChannel;

  recommendation: OutreachRecommendationType;

  fitReason: string;
  bestAngle: string;

  generatedSubject: string | null;
  generatedBody: string | null;
  subject: string | null;
  body: string | null;

  reasoning: string;
  evidence: string[];

  status: OutreachStatus;
  reviewStatus: OutreachReviewStatus;
  reviewedAt: Date | null;
  sentAt: Date | null;
  sendAttemptCount: number;
  lastSendAttemptAt: Date | null;
  lastSendErrorCode: string | null;
  lastSendError: string | null;
  lastSendRetryable: boolean;
  deliveryProvider: DeliveryProvider | null;
  providerMessageId: string | null;

  createdAt: Date;
}

export interface DeliveryEvent {
  id: string;
  outreachId: string;
  leadId: string;
  provider: DeliveryProvider;
  providerMessageId: string | null;
  eventType: DeliveryEventType;
  occurredAt: Date;
  recordedAt: Date;
  summary: string | null;
  errorCode: string | null;
  retryable: boolean;
}

export interface DeliveryEventSummary {
  totalEvents: number;
  latestEventType: DeliveryEventType | null;
  latestEventAt: Date | null;
  deliveredCount: number;
  openedCount: number;
  clickedCount: number;
  bouncedCount: number;
  complainedCount: number;
  failedCount: number;
}
