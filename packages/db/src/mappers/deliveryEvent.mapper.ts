import type { DeliveryEvent } from '@signalscout/core';
import type { HydratedDocument } from 'mongoose';
import type { DeliveryEventDocument } from '../models/DeliveryEventModel.js';

export const mapDeliveryEventDocumentToEntity = (
  document: HydratedDocument<DeliveryEventDocument>,
): DeliveryEvent => {
  return {
    id: document._id.toString(),
    outreachId: document.outreachId.toString(),
    leadId: document.leadId.toString(),
    provider: document.provider,
    providerMessageId: document.providerMessageId,
    eventType: document.eventType,
    occurredAt: document.occurredAt,
    recordedAt: document.createdAt,
    summary: document.summary,
    errorCode: document.errorCode,
    retryable: document.retryable,
  };
};
