import type { LeadSnapshotRepository } from '../../leads/ports/LeadSnapshotRepository.js';
import type { OutreachMessage } from '../entities/OutreachMessage.js';
import type { DeliveryEventRepository } from '../ports/DeliveryEventRepository.js';
import type { OutreachRepository } from '../ports/OutreachRepository.js';
import { OutreachSendError, type OutreachSender } from '../ports/OutreachSender.js';

const assertNonEmpty = (value: string, fieldName: string): string => {
  const normalized = value.trim();

  if (!normalized) {
    throw new Error(`${fieldName} is required`);
  }

  return normalized;
};

export class SendOutreach {
  constructor(
    private readonly outreachRepository: OutreachRepository,
    private readonly leadSnapshotRepository: LeadSnapshotRepository,
    private readonly outreachSender: OutreachSender,
    private readonly deliveryEventRepository: DeliveryEventRepository,
  ) {}

  async execute(outreachId: string): Promise<OutreachMessage | null> {
    const normalizedOutreachId = assertNonEmpty(outreachId, 'Outreach id');
    const outreach = await this.outreachRepository.findById(normalizedOutreachId);

    if (!outreach) {
      return null;
    }

    if (outreach.status !== 'approved') {
      throw new OutreachSendError(
        'not_ready',
        'Only approved outreach can be sent',
      );
    }

    let subject: string;
    let body: string;

    try {
      subject = assertNonEmpty(outreach.subject ?? '', 'Outreach subject');
      body = assertNonEmpty(outreach.body ?? '', 'Outreach body');
    } catch {
      throw new OutreachSendError(
        'missing_content',
        'The approved draft is missing a subject or body',
      );
    }

    const snapshot = await this.leadSnapshotRepository.findLatestByLeadId(outreach.leadId);

    if (!snapshot) {
      throw new OutreachSendError(
        'missing_recipient',
        'Lead snapshot not found for recipient resolution',
      );
    }

    const recipient = snapshot.contactInfo.emails[0]?.trim();

    if (!recipient) {
      throw new OutreachSendError(
        'missing_recipient',
        'No recipient email is available for this lead',
      );
    }

    const attemptedAt = new Date();

    try {
      const result = await this.outreachSender.send({
        to: recipient,
        subject,
        body,
      });

      await this.deliveryEventRepository.save({
        outreachId: outreach.id,
        leadId: outreach.leadId,
        provider: result.provider,
        providerMessageId: result.providerMessageId,
        eventType: 'provider_accepted',
        occurredAt: attemptedAt,
        summary: `Provider accepted outbound email for ${recipient}`,
        errorCode: null,
        retryable: false,
      });

      return this.outreachRepository.markSent(normalizedOutreachId, {
        sentAt: attemptedAt,
        attemptedAt,
        deliveryProvider: result.provider,
        providerMessageId: result.providerMessageId,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Send failed unexpectedly';
      const errorCode =
        error instanceof OutreachSendError ? error.code : 'provider_failed';
      const retryable =
        error instanceof OutreachSendError
          ? error.code === 'provider_failed' || error.code === 'configuration'
          : true;

      await this.outreachRepository.recordSendFailure(normalizedOutreachId, {
        attemptedAt,
        errorCode,
        errorMessage: message,
        retryable,
      });

      await this.deliveryEventRepository.save({
        outreachId: outreach.id,
        leadId: outreach.leadId,
        provider: outreach.deliveryProvider ?? 'resend',
        providerMessageId: outreach.providerMessageId,
        eventType: 'failed',
        occurredAt: attemptedAt,
        summary: message,
        errorCode,
        retryable,
      });

      throw error;
    }
  }
}
