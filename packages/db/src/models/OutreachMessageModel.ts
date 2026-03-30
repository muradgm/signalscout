import mongoose, { Schema, Types, model, type Model } from 'mongoose';

export interface OutreachMessageDocument {
  leadId: Types.ObjectId;
  auditId: Types.ObjectId;

  channel: 'email';

  recommendation: 'send' | 'review' | 'do_not_send';

  fitReason: string;
  bestAngle: string;

  subject: string | null;
  body: string | null;

  reasoning: string;
  evidence: string[];

  status: 'withheld' | 'review_required' | 'drafted' | 'sent' | 'replied' | 'closed';

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
      enum: ['withheld', 'review_required', 'drafted', 'sent', 'replied', 'closed'],
      default: 'drafted',
    },
  },
  {
    timestamps: true,
  },
);

outreachMessageSchema.index({ leadId: 1, createdAt: -1 });
outreachMessageSchema.index({ auditId: 1, createdAt: -1 });

export const OutreachMessageModel: Model<OutreachMessageDocument> =
  (mongoose.models.OutreachMessage as Model<OutreachMessageDocument> | undefined) ||
  model<OutreachMessageDocument>('OutreachMessage', outreachMessageSchema);