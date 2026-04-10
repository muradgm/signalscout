import type {
  OutreachChannel,
  OutreachMessage,
  OutreachRecommendationType,
  OutreachReviewStatus,
  OutreachStatus,
  DeliveryProvider,
} from '../entities/OutreachMessage.js';

export interface SaveOutreachInput {
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
}

export interface OutreachLearningLabeledCount {
  label: string;
  count: number;
}

export interface OutreachLearningReviewSegment {
  total: number;
  acceptedRate: number;
  editedRate: number;
  skippedRate: number;
}

export interface OutreachLearningSummary {
  windowSize: number;
  totalReviewed: number;
  acceptedRate: number;
  editedRate: number;
  skippedRate: number;
  subjectEditedRate: number;
  bodyEditedRate: number;
  multilingualShare: number;
  specialtyShare: number;
  topAngles: OutreachLearningLabeledCount[];
  topEditedAngles: OutreachLearningLabeledCount[];
  topNiches: OutreachLearningLabeledCount[];
  topEditedNiches: OutreachLearningLabeledCount[];
  reviewSegments: {
    nonBerlin: OutreachLearningReviewSegment;
    weakSurface: OutreachLearningReviewSegment;
    specialty: OutreachLearningReviewSegment;
    multilingual: OutreachLearningReviewSegment;
  };
}

export interface OutreachRepository {
  save(input: SaveOutreachInput): Promise<OutreachMessage>;
  findLatestByLeadId(leadId: string): Promise<OutreachMessage | null>;
  countByLeadIdAndAuditId(leadId: string, auditId: string): Promise<number>;
  findById(outreachId: string): Promise<OutreachMessage | null>;
  findByProviderMessageId(providerMessageId: string): Promise<OutreachMessage | null>;
  getLearningSummary(limit: number): Promise<OutreachLearningSummary>;
  updateReview(
    outreachId: string,
    input: {
      reviewStatus: OutreachReviewStatus;
      status: OutreachStatus;
      subject: string | null;
      body: string | null;
      reviewedAt: Date;
    },
  ): Promise<OutreachMessage | null>;
  markSent(
    outreachId: string,
    input: {
      sentAt: Date;
      attemptedAt: Date;
      deliveryProvider: DeliveryProvider;
      providerMessageId: string | null;
    },
  ): Promise<OutreachMessage | null>;
  recordSendFailure(
    outreachId: string,
    input: {
      attemptedAt: Date;
      errorCode: string;
      errorMessage: string;
      retryable: boolean;
    },
  ): Promise<OutreachMessage | null>;
  markReplied(
    outreachId: string,
    input: {
      repliedAt: Date;
    },
  ): Promise<OutreachMessage | null>;
}
