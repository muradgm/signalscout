import mongoose, { Schema, Types, model, type Model } from 'mongoose';

export interface OutreachMessageDocument {
  leadId: Types.ObjectId;
  auditId: Types.ObjectId;

  channel: 'email';

  recommendation: 'send' | 'review' | 'do_not_send';

  fitReason: string;
  bestAngle: string;

  generatedSubject: string | null;
  generatedBody: string | null;
  subject: string | null;
  body: string | null;

  reasoning: string;
  evidence: string[];

  status: 'withheld' | 'review_required' | 'drafted' | 'approved' | 'sent' | 'replied' | 'closed';
  reviewStatus: 'not_reviewed' | 'accepted' | 'edited' | 'skipped' | 'held';
  reviewedAt: Date | null;
  sentAt: Date | null;
  sendAttemptCount: number;
  lastSendAttemptAt: Date | null;
  lastSendErrorCode: string | null;
  lastSendError: string | null;
  lastSendRetryable: boolean;
  deliveryProvider: 'resend' | null;
  providerMessageId: string | null;

  createdAt: Date;
  updatedAt: Date;
}

const outreachMessageSchema = new Schema<OutreachMessageDocument>(
  {
    leadId: {
      type: Schema.Types.ObjectId,
      ref: 'Lead',
      required: true,
      index: true,
    },
    auditId: {
      type: Schema.Types.ObjectId,
      ref: 'Audit',
      required: true,
      index: true,
    },
    channel: {
      type: String,
      required: true,
      enum: ['email'],
      default: 'email',
    },
    recommendation: {
      type: String,
      required: true,
      enum: ['send', 'review', 'do_not_send'],
    },
    fitReason: {
      type: String,
      required: true,
      trim: true,
    },
    bestAngle: {
      type: String,
      required: true,
      trim: true,
    },
    generatedSubject: {
      type: String,
      default: null,
      trim: true,
    },
    generatedBody: {
      type: String,
      default: null,
      trim: true,
    },
    subject: {
      type: String,
      default: null,
      trim: true,
    },
    body: {
      type: String,
      default: null,
      trim: true,
    },
    reasoning: {
      type: String,
      required: true,
      trim: true,
    },
    evidence: {
      type: [String],
      required: true,
      default: [],
    },
    status: {
      type: String,
      required: true,
      enum: ['withheld', 'review_required', 'drafted', 'approved', 'sent', 'replied', 'closed'],
      default: 'drafted',
    },
    reviewStatus: {
      type: String,
      required: true,
      enum: ['not_reviewed', 'accepted', 'edited', 'skipped', 'held'],
      default: 'not_reviewed',
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
    sentAt: {
      type: Date,
      default: null,
    },
    sendAttemptCount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    lastSendAttemptAt: {
      type: Date,
      default: null,
    },
    lastSendErrorCode: {
      type: String,
      default: null,
      trim: true,
    },
    lastSendError: {
      type: String,
      default: null,
      trim: true,
    },
    lastSendRetryable: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveryProvider: {
      type: String,
      enum: ['resend'],
      default: null,
    },
    providerMessageId: {
      type: String,
      default: null,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

// Supports latest-outreach lookups by lead with the same tiebreak sort used in the repository.
outreachMessageSchema.index({ leadId: 1, createdAt: -1, _id: -1 });
outreachMessageSchema.index({ auditId: 1, createdAt: -1, _id: -1 });
outreachMessageSchema.index({ deliveryProvider: 1, providerMessageId: 1 });

export const OutreachMessageModel: Model<OutreachMessageDocument> =
  (mongoose.models.OutreachMessage as Model<OutreachMessageDocument> | undefined) ||
  model<OutreachMessageDocument>('OutreachMessage', outreachMessageSchema);
