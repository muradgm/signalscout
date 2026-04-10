import mongoose, { Schema, Types, model, type Model } from 'mongoose';

export interface AuditDocument {
  leadId: Types.ObjectId;
  snapshotId: Types.ObjectId;

  summary: string;

  strengths: string[];
  opportunities: string[];
  opportunityDetails: string[];
  risks: string[];

  recommendedAngle: string;
  confidenceNote: string;

  evidence: string[];

  createdAt: Date;
  updatedAt: Date;
}

const auditSchema = new Schema<AuditDocument>(
  {
    leadId: {
      type: Schema.Types.ObjectId,
      ref: 'Lead',
      required: true,
      index: true,
    },
    snapshotId: {
      type: Schema.Types.ObjectId,
      ref: 'LeadSnapshot',
      required: true,
      index: true,
    },
    summary: {
      type: String,
      required: true,
      trim: true,
    },
    strengths: {
      type: [String],
      required: true,
      default: [],
    },
    opportunities: {
      type: [String],
      required: true,
      default: [],
    },
    opportunityDetails: {
      type: [String],
      required: true,
      default: [],
    },
    risks: {
      type: [String],
      required: true,
      default: [],
    },
    recommendedAngle: {
      type: String,
      required: true,
      trim: true,
    },
    confidenceNote: {
      type: String,
      required: true,
      trim: true,
    },
    evidence: {
      type: [String],
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

// Supports latest-audit lookups by lead with the same tiebreak sort used in the repository.
auditSchema.index({ leadId: 1, createdAt: -1, _id: -1 });
// Supports latest-audit lookups for a specific lead/snapshot pair.
auditSchema.index({ leadId: 1, snapshotId: 1, createdAt: -1, _id: -1 });
auditSchema.index({ snapshotId: 1, createdAt: -1, _id: -1 });

export const AuditModel: Model<AuditDocument> =
  (mongoose.models.Audit as Model<AuditDocument> | undefined) ||
  model<AuditDocument>('Audit', auditSchema);
