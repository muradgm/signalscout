import type { Reply } from '@signalscout/core';
import type { HydratedDocument } from 'mongoose';
import type { ReplyDocument } from '../models/ReplyModel.js';

export const mapReplyDocumentToEntity = (
  document: HydratedDocument<ReplyDocument>,
): Reply => {
  return {
    id: document._id.toString(),
    leadId: document.leadId.toString(),
    outreachId: document.outreachId.toString(),
    channel: document.channel,
    source: document.source,
    providerMessageId: document.providerMessageId,
    inReplyToProviderMessageId: document.inReplyToProviderMessageId,
    fromEmail: document.fromEmail,
    subject: document.subject,
    body: document.body,
    receivedAt: document.receivedAt,
    createdAt: document.createdAt,
  };
};
