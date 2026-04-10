import type { OutreachMessage } from '@signalscout/core';
import type { HydratedDocument } from 'mongoose';
import type { OutreachMessageDocument } from '../models/OutreachMessageModel.js';

export const mapOutreachMessageDocumentToEntity = (
  document: HydratedDocument<OutreachMessageDocument>,
): OutreachMessage => {
  return {
    id: document._id.toString(),
    leadId: document.leadId.toString(),
    auditId: document.auditId.toString(),
    channel: document.channel,
    recommendation: document.recommendation,
    fitReason: document.fitReason,
    bestAngle: document.bestAngle,
    generatedSubject: document.generatedSubject,
    generatedBody: document.generatedBody,
    subject: document.subject,
    body: document.body,
    reasoning: document.reasoning,
    evidence: document.evidence,
    status: document.status as OutreachMessage['status'],
    reviewStatus: document.reviewStatus as OutreachMessage['reviewStatus'],
    reviewedAt: document.reviewedAt,
    sentAt: document.sentAt,
    sendAttemptCount: document.sendAttemptCount,
    lastSendAttemptAt: document.lastSendAttemptAt,
    lastSendErrorCode: document.lastSendErrorCode,
    lastSendError: document.lastSendError,
    lastSendRetryable: document.lastSendRetryable,
    deliveryProvider: document.deliveryProvider,
    providerMessageId: document.providerMessageId,
    createdAt: document.createdAt,
  };
};
