import mongoose, { Schema, Types, model, type Model } from 'mongoose';

export interface DeliveryEventDocument {
  outreachId: Types.ObjectId;
  leadId: Types.ObjectId;
  provider: 'resend';
  providerMessageId: string | null;
  eventType:
    | 'provider_accepted'
    | 'delivered'
    | 'delivery_delayed'
    | 'bounced'
    | 'complained'
    | 'opened'
    | 'clicked'
    | 'failed';
  occurredAt: Date;
  summary: string | null;
  errorCode: string | null;
  retryable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const deliveryEventSchema = new Schema<DeliveryEventDocument>(
  {
    outreachId: {
      type: Schema.Types.ObjectId,
      ref: 'OutreachMessage',
      required: true,
      index: true,
    },
    leadId: {
      type: Schema.Types.ObjectId,
      ref: 'Lead',
      required: true,
      index: true,
    },
    provider: {
      type: String,
      required: true,
      enum: ['resend'],
    },
    providerMessageId: {
      type: String,
      default: null,
      trim: true,
    },
    eventType: {
      type: String,
      required: true,
      enum: [
        'provider_accepted',
        'delivered',
        'delivery_delayed',
        'bounced',
        'complained',
        'opened',
        'clicked',
        'failed',
      ],
    },
    occurredAt: {
      type: Date,
      required: true,
    },
    summary: {
      type: String,
      default: null,
      trim: true,
    },
    errorCode: {
      type: String,
      default: null,
      trim: true,
    },
    retryable: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

deliveryEventSchema.index({ outreachId: 1, occurredAt: -1, _id: -1 });
deliveryEventSchema.index({ leadId: 1, occurredAt: -1, _id: -1 });
deliveryEventSchema.index({ provider: 1, providerMessageId: 1, occurredAt: -1, _id: -1 });

export const DeliveryEventModel: Model<DeliveryEventDocument> =
  (mongoose.models.DeliveryEvent as Model<DeliveryEventDocument> | undefined) ||
  model<DeliveryEventDocument>('DeliveryEvent', deliveryEventSchema);
