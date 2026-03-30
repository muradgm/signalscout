export type OutreachChannel = 'email';

export type OutreachRecommendationType =
  | 'send'
  | 'review'
  | 'do_not_send';

export type OutreachStatus =
  | 'withheld'
  | 'review_required'
  | 'drafted'
  | 'sent'
  | 'replied'
  | 'closed';

export interface OutreachMessage {
  id: string;
  leadId: string;
  auditId: string;

  channel: OutreachChannel;

  recommendation: OutreachRecommendationType;

  fitReason: string;
  bestAngle: string;

  subject: string | null;
  body: string | null;

  reasoning: string;
  evidence: string[];

  status: OutreachStatus;

  createdAt: Date;
}