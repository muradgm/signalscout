import mongoose, { Schema, Types, model, type Model } from 'mongoose';

export interface LeadSnapshotDocument {
  leadId: Types.ObjectId;
  url: string;
  pageTitle: string | null;
  metaDescription: string | null;
  visibleText: string;
  contactInfo: {
    emails: string[];
    phones: string[];
    addresses: string[];
  };
  contactEnrichment: {
    emails: {
      type: string;
      value: string;
      sourceKind: string;
      sourceUrl: string;
      confidence: string;
    }[];
    phones: {
      type: string;
      value: string;
      sourceKind: string;
      sourceUrl: string;
      confidence: string;
    }[];
    addresses: {
      type: string;
      value: string;
      sourceKind: string;
      sourceUrl: string;
      confidence: string;
    }[];
  };
  bookingLinks: string[];
  trustSignals: string[];
  isPlaceholderContent: boolean;
  extractedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const leadSnapshotSchema = new Schema<LeadSnapshotDocument>(
  {
    leadId: {
      type: Schema.Types.ObjectId,
      ref: 'Lead',
      required: true,
      index: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    pageTitle: {
      type: String,
      default: null,
    },
    metaDescription: {
      type: String,
      default: null,
    },
    visibleText: {
      type: String,
      required: true,
    },
    contactInfo: {
      emails: {
        type: [String],
        required: true,
        default: [],
      },
      phones: {
        type: [String],
        required: true,
        default: [],
      },
      addresses: {
        type: [String],
        required: true,
        default: [],
      },
    },
    contactEnrichment: {
      emails: {
        type: [
          {
            type: { type: String, required: true },
            value: { type: String, required: true },
            sourceKind: { type: String, required: true },
            sourceUrl: { type: String, required: true },
            confidence: { type: String, required: true },
            _id: false,
          },
        ],
        required: true,
        default: [],
      },
      phones: {
        type: [
          {
            type: { type: String, required: true },
            value: { type: String, required: true },
            sourceKind: { type: String, required: true },
            sourceUrl: { type: String, required: true },
            confidence: { type: String, required: true },
            _id: false,
          },
        ],
        required: true,
        default: [],
      },
      addresses: {
        type: [
          {
            type: { type: String, required: true },
            value: { type: String, required: true },
            sourceKind: { type: String, required: true },
            sourceUrl: { type: String, required: true },
            confidence: { type: String, required: true },
            _id: false,
          },
        ],
        required: true,
        default: [],
      },
    },
    bookingLinks: {
      type: [String],
      required: true,
      default: [],
    },
    trustSignals: {
      type: [String],
      required: true,
      default: [],
    },
    isPlaceholderContent: {
      type: Boolean,
      default: false,
    },
    extractedAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Supports latest-snapshot lookups by lead with the same tiebreak sort used in the repository.
leadSnapshotSchema.index({ leadId: 1, extractedAt: -1, _id: -1 });
leadSnapshotSchema.index({ 'contactInfo.emails': 1, extractedAt: -1, _id: -1 });
leadSnapshotSchema.index({ 'contactEnrichment.emails.value': 1, extractedAt: -1, _id: -1 });

export const LeadSnapshotModel: Model<LeadSnapshotDocument> =
  (mongoose.models.LeadSnapshot as Model<LeadSnapshotDocument> | undefined) ||
  model<LeadSnapshotDocument>('LeadSnapshot', leadSnapshotSchema);
