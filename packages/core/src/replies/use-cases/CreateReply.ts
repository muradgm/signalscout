import type { LeadRepository } from '../../leads/ports/LeadRepository.js';
import type { OutreachRepository } from '../../outreach/ports/OutreachRepository.js';
import type { Reply } from '../entities/Reply.js';
import type { ReplyRepository } from '../ports/ReplyRepository.js';

export interface CreateReplyInput {
  outreachId: string;
  fromEmail: string;
  subject: string | null;
  body: string;
  source: 'manual' | 'provider_webhook';
  providerMessageId?: string | null;
  inReplyToProviderMessageId?: string | null;
  receivedAt?: Date;
}

const assertNonEmpty = (value: string, label: string): string => {
  const normalized = value.trim();

  if (!normalized) {
    throw new Error(`${label} is required`);
  }

  return normalized;
};

const normalizeNullable = (value: string | null | undefined): string | null => {
  if (value == null) {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
};

export class CreateReply {
  constructor(
    private readonly replyRepository: ReplyRepository,
    private readonly outreachRepository: OutreachRepository,
    private readonly leadRepository: LeadRepository,
  ) {}

  async execute(input: CreateReplyInput): Promise<Reply | null> {
    const outreachId = assertNonEmpty(input.outreachId, 'Outreach id');
    const fromEmail = assertNonEmpty(input.fromEmail, 'Reply sender email');
    const body = assertNonEmpty(input.body, 'Reply body');

    if (input.providerMessageId) {
      const existing = await this.replyRepository.findByProviderMessageId(
        input.providerMessageId,
      );

      if (existing) {
        return existing;
      }
    }

    const outreach = await this.outreachRepository.findById(outreachId);

    if (!outreach) {
      return null;
    }

    const reply = await this.replyRepository.save({
      leadId: outreach.leadId,
      outreachId,
      channel: 'email',
      source: input.source,
      providerMessageId: normalizeNullable(input.providerMessageId) ?? null,
      inReplyToProviderMessageId:
        normalizeNullable(input.inReplyToProviderMessageId) ?? null,
      fromEmail,
      subject: normalizeNullable(input.subject),
      body,
      receivedAt: input.receivedAt ?? new Date(),
    });

    await this.outreachRepository.markReplied(outreachId, {
      repliedAt: reply.receivedAt,
    });
    await this.leadRepository.updateStatus(outreach.leadId, 'replied');

    return reply;
  }
}
