import mongoose, { Schema, Types, model, type Model } from 'mongoose';

export interface ReplyDocument {
  leadId: Types.ObjectId;
  outreachId: Types.ObjectId;
  channel: 'email';
  source: 'manual' | 'provider_webhook';
  providerMessageId: string | null;
  inReplyToProviderMessageId: string | null;
  fromEmail: string;
  subject: string | null;
  body: string;
  receivedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const replySchema = new Schema<ReplyDocument>(
  {
    leadId: {
      type: Schema.Types.ObjectId,
      ref: 'Lead',
      required: true,
      index: true,
    },
    outreachId: {
      type: Schema.Types.ObjectId,
      ref: 'OutreachMessage',
      required: true,
      index: true,
    },
    channel: {
      type: String,
      required: true,
      enum: ['email'],
      default: 'email',
    },
    source: {
      type: String,
      required: true,
      enum: ['manual', 'provider_webhook'],
    },
    providerMessageId: {
      type: String,
      default: null,
      trim: true,
    },
    inReplyToProviderMessageId: {
      type: String,
      default: null,
      trim: true,
    },
    fromEmail: {
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
      required: true,
      trim: true,
    },
    receivedAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

replySchema.index({ leadId: 1, receivedAt: -1, _id: -1 });
replySchema.index({ outreachId: 1, receivedAt: -1, _id: -1 });
replySchema.index({ providerMessageId: 1 });

export const ReplyModel: Model<ReplyDocument> =
  (mongoose.models.Reply as Model<ReplyDocument> | undefined) ||
  model<ReplyDocument>('Reply', replySchema);
