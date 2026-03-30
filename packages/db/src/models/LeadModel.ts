import mongoose, { Schema, model, type Model } from 'mongoose';

export interface LeadDocument {
  companyName: string;
  website: string;
  niche: 'dentist';
  location: string;
  country: string;
  source: 'manual' | 'import';
  status:
    | 'new'
    | 'snapshot_pending'
    | 'snapshot_ready'
    | 'audit_ready'
    | 'contacted'
    | 'replied'
    | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = new Schema<LeadDocument>(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    website: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    niche: {
      type: String,
      required: true,
      enum: ['dentist'],
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    source: {
      type: String,
      required: true,
      enum: ['manual', 'import'],
    },
    status: {
      type: String,
      required: true,
      enum: [
        'new',
        'snapshot_pending',
        'snapshot_ready',
        'audit_ready',
        'contacted',
        'replied',
        'closed',
      ],
      default: 'new',
    },
  },
  {
    timestamps: true,
  },
);

export const LeadModel: Model<LeadDocument> =
  ((mongoose.models.Lead as Model<LeadDocument> | undefined) ||
    model<LeadDocument>('Lead', leadSchema));